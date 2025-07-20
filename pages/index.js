// pages/index.js
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, Wand2 } from 'lucide-react';
import { useRouter } from 'next/router';

const starterTemplates = [
  {
    id: 1,
    name: "流れる粒子",
    code: `function setup() {
  createCanvas(400, 400);
  background(0);
}

function draw() {
  fill(255, 10);
  noStroke();
  let x = random(width);
  let y = random(height);
  let size = random(2, 20);
  ellipse(x, y, size, size);
}`
  },
  {
    id: 2,
    name: "回転する幾何学",
    code: `let angle = 0;

function setup() {
  createCanvas(400, 400);
  rectMode(CENTER);
}

function draw() {
  background(0, 20);
  translate(width/2, height/2);
  rotate(angle);
  stroke(255);
  noFill();
  rect(0, 0, 100, 100);
  angle += 0.02;
}`
  },
  {
    id: 3,
    name: "ノイズの波",
    code: `let t = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0, 10);
  stroke(255);
  noFill();
  beginShape();
  for (let x = 0; x < width; x += 5) {
    let y = height/2 + noise(x * 0.01, t) * 200 - 100;
    vertex(x, y);
  }
  endShape();
  t += 0.01;
}`
  },
  {
    id: 4,
    name: "カラフルな円",
    code: `function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  let x = random(width);
  let y = random(height);
  let r = random(255);
  let g = random(255);
  let b = random(255);
  fill(r, g, b, 50);
  ellipse(x, y, random(10, 100));
}`
  }
];

export default function Home() {
  const router = useRouter();
  const { template } = router.query;
  
  // URLパラメータからテンプレートインデックスを取得
  const initialTemplateIndex = template ? parseInt(template) : 0;
  
  const [code, setCode] = useState(starterTemplates[0].code);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  
  // URLパラメータが変更されたときにテンプレートを更新
  useEffect(() => {
    if (template && !isNaN(parseInt(template))) {
      const index = parseInt(template);
      if (index >= 0 && index < starterTemplates.length) {
        setSelectedTemplate(index);
        setCode(starterTemplates[index].code);
      }
    }
  }, [template]);

  const p5Template = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background: #000; }
    main { display: flex; justify-content: center; align-items: center; height: 100vh; }
  </style>
</head>
<body>
  <main></main>
  <script>
    try {
      ${code}
    } catch (e) {
      console.error(e);
    }
  </script>
</body>
</html>`;

  const runCode = () => {
    setIsPlaying(true);
    setIframeKey(prev => prev + 1);
  };

  const stopCode = () => {
    setIsPlaying(false);
    setIframeKey(prev => prev + 1);
  };

  const resetCode = () => {
    // 選択中のテンプレートの初期コードに戻す
    setCode(starterTemplates[selectedTemplate].code);
    setIsPlaying(false);
    setIframeKey(prev => prev + 1);
  };

  const handleTemplateSelect = (index) => {
    setSelectedTemplate(index);
    setCode(starterTemplates[index].code);
    setIsPlaying(false);
  };

  const processAICommand = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsProcessing(true);
    
    try {
      const response = await fetch('/api/claude', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `You are a p5.js creative coding expert. Modify the following p5.js code based on the user's instruction.

Current code:
${code}

User instruction: "${aiPrompt}"

Guidelines:
- "色を増やす" → Add colorful random colors using fill(random(255), random(255), random(255))
- "もっとぐちゃぐちゃ" → Add more randomness, noise(), and chaotic movements
- "動きを速く" → Increase all speed-related parameters
- "大きく" → Make shapes bigger
- "小さく" → Make shapes smaller
- Be creative and make interesting modifications!

Return ONLY the complete modified p5.js code without any explanations or markdown.`
            }
          ]
        })
      });

      console.log('API Response status:', response.status);
      
      const responseData = await response.json();
      console.log('API Response data:', responseData);
      
      if (response.status === 429) {
        throw new Error('リクエストが多すぎます。しばらく待ってから再試行してください。');
      }
      
      if (response.status === 529) {
        throw new Error('サーバーが混雑しています。数秒後に再試行してください。');
      }
      
      if (response.ok) {
        if (responseData.content && responseData.content[0] && responseData.content[0].text) {
          let newCode = responseData.content[0].text;
          
          // クリーンアップ
          newCode = newCode.replace(/^```(?:javascript|js)?\s*\n/g, '');
          newCode = newCode.replace(/\n```\s*$/g, '');
          newCode = newCode.trim();
          
          console.log('✅ AIによるコード生成成功');
          setCode(newCode);
          setAiPrompt('');
          
          // プレビュー中の場合は自動的に更新
          if (isPlaying) {
            setIframeKey(prev => prev + 1);
          }
        } else {
          throw new Error('Invalid response format from API');
        }
      } else {
        console.error('API Error Details:', responseData);
        throw new Error(`Anthropic API error: ${responseData.error || responseData.details || 'Unknown error'}`);
      }
      
    } catch (error) {
      console.error('AI処理エラー:', error);
      alert('エラーが発生しました: ' + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div style={{ 
      height: '100vh', 
      backgroundColor: '#111827', 
      color: 'white', 
      display: 'flex', 
      flexDirection: 'column',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* ヘッダー */}
      <div style={{ 
        backgroundColor: '#1f2937', 
        padding: '1rem', 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: '1px solid #374151'
      }}>
        <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0 }}>
          ジェネラティブアート・スタジオ
        </h1>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {isPlaying ? (
            <button
              onClick={stopCode}
              style={{
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Pause size={16} />
              停止
            </button>
          ) : (
            <button
              onClick={runCode}
              style={{
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '0.5rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Play size={16} />
              再生
            </button>
          )}
          <button
            onClick={resetCode}
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <RefreshCw size={16} />
            リセット
          </button>
        </div>
      </div>

      {/* テンプレート選択 */}
      <div style={{ 
        backgroundColor: '#1f2937', 
        padding: '0.5rem', 
        borderBottom: '1px solid #374151',
        overflowX: 'auto'
      }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {starterTemplates.map((template, index) => (
            <button
              key={template.id}
              onClick={() => handleTemplateSelect(index)}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '0.375rem',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                backgroundColor: selectedTemplate === index ? '#2563eb' : '#374151',
                color: 'white'
              }}
            >
              {template.name}
            </button>
          ))}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        {/* エディタ */}
        <div style={{ width: '50%', padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ 
            flex: 1, 
            backgroundColor: '#1f2937', 
            borderRadius: '0.5rem', 
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              コードエディタ
            </h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              style={{
                flex: 1,
                backgroundColor: '#111827',
                color: 'white',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                padding: '1rem',
                borderRadius: '0.375rem',
                border: '1px solid #374151',
                outline: 'none',
                resize: 'none'
              }}
              spellCheck={false}
            />
          </div>

          {/* AI対話 */}
          <div style={{ 
            marginTop: '1rem', 
            backgroundColor: '#1f2937', 
            borderRadius: '0.5rem', 
            padding: '1rem' 
          }}>
            <h3 style={{ 
              fontSize: '0.875rem', 
              fontWeight: '600', 
              marginBottom: '0.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Wand2 size={16} />
              AIアシスタント
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && !isProcessing) {
                    e.preventDefault();
                    processAICommand();
                  }
                }}
                placeholder="例: 色を増やす、もっとぐちゃぐちゃ、動きを速く"
                style={{
                  flex: 1,
                  backgroundColor: '#111827',
                  color: 'white',
                  padding: '0.5rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #374151',
                  outline: 'none'
                }}
                disabled={isProcessing}
              />
              <button
                onClick={processAICommand}
                disabled={isProcessing}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  backgroundColor: isProcessing ? '#4b5563' : '#7c3aed',
                  color: 'white'
                }}
              >
                {isProcessing ? '処理中...' : '変換'}
              </button>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
              Cmd/Ctrl + Enter でも実行できます
            </p>
          </div>
        </div>

        {/* プレビュー */}
        <div style={{ width: '50%', padding: '1rem' }}>
          <div style={{ 
            height: '100%', 
            backgroundColor: '#1f2937', 
            borderRadius: '0.5rem', 
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
              プレビュー
            </h2>
            <div style={{ 
              flex: 1,
              backgroundColor: 'black', 
              borderRadius: '0.375rem', 
              overflow: 'hidden',
              position: 'relative'
            }}>
              {isPlaying ? (
                <iframe
                  key={iframeKey}
                  srcDoc={p5Template}
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    border: 'none' 
                  }}
                  sandbox="allow-scripts"
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280'
                }}>
                  再生ボタンを押してプレビューを開始
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}