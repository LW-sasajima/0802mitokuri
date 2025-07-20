// pages/api/claude.js
// レート制限のための簡易的なメモリストア
const requestTimestamps = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1分
const MAX_REQUESTS_PER_WINDOW = 10; // 1分あたり10リクエストまで

// リトライ用の待機時間
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// IPアドレスまたはセッションIDを取得
function getClientId(req) {
  return req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
}

// レート制限チェック
function checkRateLimit(clientId) {
  const now = Date.now();
  const timestamps = requestTimestamps.get(clientId) || [];
  
  // 古いタイムスタンプを削除
  const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW);
  
  if (recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  
  recentTimestamps.push(now);
  requestTimestamps.set(clientId, recentTimestamps);
  return true;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientId = getClientId(req);
  
  // レート制限チェック
  if (!checkRateLimit(clientId)) {
    return res.status(429).json({ 
      error: 'Rate limit exceeded', 
      message: 'リクエストが多すぎます。1分後に再試行してください。' 
    });
  }

  // リトライ設定
  const maxRetries = 3;
  const baseDelay = 1000; // 1秒
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(req.body)
      });

      const responseText = await response.text();
      
      // 529エラー（過負荷）の場合はリトライ
      if (response.status === 529 && attempt < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, attempt); // 指数バックオフ
        console.log(`Overloaded, retrying after ${delay}ms... (attempt ${attempt + 1}/${maxRetries})`);
        await wait(delay);
        continue;
      }

      if (!response.ok) {
        return res.status(response.status).json({ 
          error: 'Anthropic API error', 
          status: response.status,
          details: responseText 
        });
      }

      const data = JSON.parse(responseText);
      return res.status(200).json(data);
      
    } catch (error) {
      console.error('Server error:', error);
      
      // 最後の試行でエラーの場合
      if (attempt === maxRetries - 1) {
        return res.status(500).json({ 
          error: error.message,
          stack: error.stack 
        });
      }
      
      // リトライ
      const delay = baseDelay * Math.pow(2, attempt);
      await wait(delay);
    }
  }
}