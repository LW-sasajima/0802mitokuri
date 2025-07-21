// pages/index.js
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RefreshCw, Wand2, Download } from 'lucide-react';
import { useRouter } from 'next/router';

const starterTemplates = [
  {
    id: 1,
    name: "01_なみなみ",
    code: `let popColors;
let numRows = 10;
let rowHeights = [];
let bgColor;
let seed;
let url = "https://coolors.co/564787-dbcbd8-f2fdff-9ad4d6-101935";

function createPallete(url) {
  let slashId = url.lastIndexOf('/');
  let colStr = url.slice(slashId + 1);
  let arr = colStr.split('-').map(c => color("#" + c));  // ← ここで color() を使う
  return arr;
}

function setup() {
  createCanvas(800, 600);
  noLoop();
  colorMode(RGB);
  seed = int(random(999999));
  randomSeed(seed);
  popColors = createPallete(url);
　bgColor = random(popColors);
  // ランダムな行の高さを生成（全体がちょうどcanvas高さになるように）
  generateRandomRowHeights();
}

function generateRandomRowHeights() {
  let rawHeights = [];
  let total = 0;
  for (let i = 0; i < numRows; i++) {
    let h = random(30, 80); // 各行の高さをランダムに（30〜80px）
    rawHeights.push(h);
    total += h;
  }
  // 正規化して高さを合計heightに合わせる
  for (let i = 0; i < numRows; i++) {
    rowHeights[i] = rawHeights[i] * (height / total);
  }
}

function draw() {
  background(bgColor);
  let y = 0;
  for (let i = 0; i < numRows; i++) {
    let h = rowHeights[i];

    // 波のような色の流れ（行番号によるsin波）
    let wave = sin(i * 0.8);
    let shiftRaw = map(wave, -1, 1, 0, popColors.length * 2);
    let shift = floor(shiftRaw) % popColors.length;
    let colors = rotateColors(popColors, shift);
    drawHorizontalGradientRect(0, y, width, h, colors);
    y += h;
  }
}

// グラデーションを描く
function drawHorizontalGradientRect(x, y, w, h, colors) {
  noStroke();
  for (let i = 0; i < w; i++) {
    let t = i / (w - 1);
    let c = getGradientColor(t, colors);
    fill(c);
    rect(x + i, y, 1, h);
  }
}

// グラデーション色の補間
function getGradientColor(t, colors) {
  let index = floor(t * (colors.length - 1));
  let localT = map(t, index / (colors.length - 1), (index + 1) / (colors.length - 1), 0, 1);
  return lerpColor(colors[index], colors[(index + 1) % colors.length], localT);
}

// 配列をローテート
function rotateColors(arr, n) {
  return arr.slice(n).concat(arr.slice(0, n));
}

function keyPressed() {
  if (key == 's' || key == 'S') saveCanvas(seed + "",'png');
}

`
  },
  {
    id: 2,
    name: "02_つみきのように",
    code: `let url = "https://coolors.co/333333-7f5af0-4ade80-22d3ee-fda4af"; 
let palette;
let bgColor;
let seed;

function createPallete(url) {
  let slashId = url.lastIndexOf('/');
  let colStr = url.slice(slashId + 1);
  let arr = colStr.split('-').map(c => "#" + c);
  return arr;
}

function setup() {
  createCanvas(600, 800);
  seed = int(random(999999));
  randomSeed(seed);
  palette = createPallete(url);
  bgColor = random(palette);
  noLoop();
  noStroke();
  rectMode(CENTER);
  angleMode(DEGREES);
}

function draw() {
  background(bgColor);
	
  let xnum = 10;
  let ynum = 100;
  let colWidth = width / xnum;

  // 波の振幅と周期（左右の揺れ）
  let waveAmplitude = 50; 
  let waveFrequency = TWO_PI / xnum * 4;  // x方向に4周期の波

  for (let x = 0; x < xnum; x++) {
    let shuffled = shuffle(palette);
    let colA = color(shuffled[0]);
    let colB = color(shuffled[1]);
    let colC = color(shuffled[2]);

    let shapeW = random(30, 120);
    let shapeH = height;

    let cx = x * colWidth + colWidth / 2;
    let cy = height / 2;

    let angle;
    if (random() < 0.3) {
      angle = 0;
    } else {
      angle = random(-60, 60);
    }

    push();
    translate(cx, cy);
    for (let i = 0; i < ynum; i++) {
      let waveOffsetX = sin(i * waveFrequency) * random(100);
      let t = i / (ynum - 1);
      let baseY = map(i, 0, ynum - 1, -shapeH / 2, shapeH / 2);

      let y = baseY;
      let xPos = waveOffsetX; // iではなくxを使った波のずれ

      let c;
      if (t < 0.5) {
        c = lerpColor(colA, colB, map(t, 0, 0.5, 0, 1));
      } else {
        c = lerpColor(colB, colC, map(t, 0.5, 1, 0, 1));
      }

      c.setAlpha(220);
      fill(c);
      rect(xPos, y, shapeW, shapeH / ynum + 1);
    }

    pop();
  }
}

function keyPressed() {
  if (key == 's' || key == 'S') saveCanvas(seed + "",'png');
}
`
  },
  {
    id: 3,
    name: " 3_カーテン",
    code: `let url = "https://coolors.co/ef476f-ffd166-06d6a0-118ab2-073b4c";  // 149
let palette;
let paletteColors;

function createPallete(url) {
  let slashId = url.lastIndexOf('/');
  let colStr = url.slice(slashId + 1);
  let arr = colStr.split('-').map(c => "#" + c);
  return arr;
}

function setup() {
		pixelDensity(3);
  createCanvas(600, 800);
  palette = createPallete(url);
  paletteColors = palette.map(c => color(c));
  paletteColors = shuffle(paletteColors, true);
  noLoop();
  background(0);
  strokeWeight(1);
  noFill();
}

function draw() {
  background(0);

  let waveCount = 300;
  let amplitude = 30;

  for (let i = 0; i < waveCount; i++) {
    let yOffset = map(i, 0, waveCount - 1, height * 0.05, height * 0.95);
    let waveFreq = map(i, 0, waveCount - 1, 0.02, 0.12);

    let segmentLength = 3;

    for (let x = 0; x < width; x += segmentLength) {
      let x0 = x;
      let x1 = min(x + segmentLength, width);

      let y0 = yOffset + sin(x0 * waveFreq + i * TWO_PI / waveCount) * amplitude;
      let y1 = yOffset + sin(x1 * waveFreq + i * TWO_PI / waveCount) * amplitude;

      // 色の補間パラメータを斜め方向に計算
      let t = ((x0 + y0) + (x1 + y1)) / 2 / (width + height);
      let col = getGradientColor(t);

      stroke(col);
      line(x0, y0, x1, y1);
    }
  }
}

function getGradientColor(t) {
  let n = paletteColors.length - 1;
  let scaledT = t * n;
  let idx = floor(scaledT);
  idx = constrain(idx, 0, n - 1);
  let localT = scaledT - idx;
  return lerpColor(paletteColors[idx], paletteColors[idx + 1], localT);
}

function keyPressed() {
  if (key == 's' || key == 'S') saveCanvas();
}
`
  },
  {
    id: 4,
    name: "4_ぐにゃぐにゃの線",
    code: `let url = "https://coolors.co/caffd0-c9e4e7-b4a0e5-ca3cff-1e1014";
let palette;
let bgColor;
let seed;

function createPallete(url) {
	let slashId = url.lastIndexOf('/');
	let colStr = url.slice(slashId + 1);
	let arr = colStr.split('-').map(c => "#" + c);
	return arr;
}

function keyPressed() {
  if (key == 's' || key == 'S') {
    saveCanvas();
  }
}

function setup() {
  createCanvas(600, 800);
  seed = int(random(999999));
  randomSeed(seed);
  palette = createPallete(url);
　bgColor = random(palette);
  shapePalette = palette.filter(c => c !== bgColor); 
  noLoop();
}

function draw() {
  background(bgColor);
  let xnum = 10;
  let ynum = 13;
  let w = width / xnum;
  let h = height / ynum;
  for (let y = 0; y < ynum; y++) {
    for (let x = 0; x < xnum; x++) {
      let cx = x * w + w / 2;
      let cy = y * h + h / 2;
      let c = color(random(shapePalette));
      stroke(c);
      noFill();
      let pts = drawRandomLine(cx, cy, w, h);

      // 線の始点と終点に円を描く
      let circleSize = 8;
      fill(c);
      noStroke();

      rectMode(CENTER);
      ellipse(pts[pts.length - 2].x, pts[pts.length -2].y, circleSize*0.8, circleSize*0.8); 
      rect(pts[1].x, pts[1].y, 1, circleSize*30);
    }
  }
}

function drawRandomLine(x, y, w, h) {
  let steps = int(random(10, 25));
  let len = min(w, h) * 0.5;
  let px = x;
  let py = y;
  let points = [];

  beginShape();
  for (let i = 0; i < steps; i++) {
    let angle = noise(px * 0.01, py * 0.01, i * 0.1) * TWO_PI * 2;
    let dx = cos(angle) * len;
    let dy = sin(angle) * len;
    let nx = px + dx;
    let ny = py + dy;
    let sw = (noise(px, py, i), 0, 1, 1, random(4));
    strokeWeight(sw);
  
    curveVertex(nx, ny);
    points.push({ x: nx, y: ny });
    px = nx;
    py = ny;
  }
  endShape();

  return points;
}

function keyPressed() {
  if (key == 's' || key == 'S') saveCanvas(seed + "",'png');
}

`
  },
  {
    id: 5,
    name: " 5_いばら",
    code: `let url = "https://coolors.co/fbaf00-ffd639-ffa3af-007cbe-00af54";
let palette;
let seed;

function createPallete(url) {
  let slashId = url.lastIndexOf('/');
  let colStr = url.slice(slashId + 1);
  let arr = colStr.split('-').map(c => "#" + c);
  return arr;
}

function setup() {
  createCanvas(600, 800);
  seed = int(random(999999));
  randomSeed(seed);
  palette = createPallete(url);
  angleMode(DEGREES);
  noLoop();
}

function draw() {
  background(0);
  let xnum = 6;
  let ynum = 8;
  let w = width / xnum;
  let h = height / ynum;

  let v1 = random(0.5, 1);
  let v2 = random(0.1, 0.3);
  
  for (let y = 0; y < ynum; y++) {
    for (let x = 0; x < xnum; x++) {
      let cx = x * w + w / 2;
      let cy = y * h + h / 2;

      push();
      translate(cx, cy);

      let blades = 4;             // 羽根は4枚
      let turns = 5;              // ぐるぐる巻きの回転数
      let bladeLength = w * v1;
      let bladeWidth = w * v2;

      for (let i = 0; i < blades; i++) {
        // ブレードごとにスパイラルの角度をずらす
        let baseAngle = i * (360 / blades);
        
        // さらに内側から外側へ少しずつ回転させて重ねるループ
        for (let t = 0; t < turns; t++) {
          push();
          // スパイラル角度は基本角 + 360度×回転数
          let spiralAngle = baseAngle + t * (360 / turns);
          rotate(spiralAngle);
          // ブレードの長さ方向に少しずつずらす
          let offset = (bladeLength / turns) * t;
					
          translate(0, -offset);
          fill(random(palette));
          noStroke();
          beginShape();
          vertex(0, 0);
          vertex(bladeWidth / 2, - (bladeLength / turns));
          vertex(-bladeWidth / 2, - (bladeLength / turns));
          endShape(CLOSE);

          pop();
        }
      }
      pop();
    }
  }
}

function keyPressed() {
  if (key == 's' || key == 'S') saveCanvas(seed + "",'png');
}
`
  },
  {
    id: 6,
    name: " 6_もじであそぶ",
    code: `let url = "https://coolors.co/e08dac-6a7fdb-57e2e5-45cb85-153131";
let palette;
let circles = [];
let bgColor;
let seed;

let pokemonNames = [
  "ピカチュウ", "イーブイ", "ゼニガメ", "フシギダネ", "ヒトカゲ",
  "プリン", "カビゴン", "ミュウ", "ミュウツー", "リザードン",
  "ニャース", "ルカリオ", "ゲンガー", "ポッチャマ", "キモリ",
  "ヒコザル", "ポカブ", "モクロー", "ケロマツ", "ヤドン"
];

function createPallete(url) {
  let slashId = url.lastIndexOf('/');
  let colStr = url.slice(slashId + 1);
  return colStr.split('-').map(c => "#" + c);
}

function setup() {
	// pixelDensity(3);
	// pixelDensity(4);
  createCanvas(600, 800);
  seed = int(random(999999));
  randomSeed(seed);
  palette = createPallete(url);
  bgColor = random(palette);
  shapePalette = palette.filter(c => c !== bgColor);
  angleMode(DEGREES);
  noLoop();
  noStroke();
  packCircles();
  assignCharacters();
}

function packCircles() {
  let attempts = 0;
  let maxTries = 20000;
  let maxCircles = 600;

  while (circles.length < maxCircles && attempts < maxTries) {
    let r = random(10, 60);
    let x = random(r, width - r);
    let y = random(r, height - r);

    let valid = true;
    for (let c of circles) {
      let d = dist(x, y, c.x, c.y);
      if (d < r + c.r + 0.5) {
        valid = false;
        break;
      }
    }

    if (valid) {
      circles.push({ x, y, r, char: "", angle: 0 });
    }

    attempts++;
  }
}

function assignCharacters() {
  let charPool = [];

  // 文字のプールを作る（ランダムな順番で全ポケモン名の文字）
  while (charPool.length < circles.length) {
    let name = random(pokemonNames);
    let chars = name.split("");
    for (let ch of chars) {
      charPool.push(ch);
      if (charPool.length >= circles.length) break;
    }
  }

  // 各円に1文字ずつと角度を割り当て
  for (let i = 0; i < circles.length; i++) {
    circles[i].char = charPool[i];
    circles[i].angle = random(-45, 45);  // -45〜+45度で回転
  }
}

function draw() {
  background(bgColor);
  for (let c of circles) {
    drawLabeledCircle(c);
  }
}

function drawLabeledCircle(c) {
  push();
  translate(c.x, c.y);
  rotate(c.angle);
  fill(random(shapePalette));
  textAlign(CENTER, CENTER);
  textFont('sans-serif');
  textLeading(c.r * 1.1); // 複数行になるときの行間も自然に
  textStyle(BOLD);
  textSize(c.r * 2.5);
  text(c.char, 0, 0);  // 回転中心に描画
  pop();
}

function keyPressed() {
  if (key == 's' || key == 'S') saveCanvas(seed + "",'png');
}
`
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
    // 画像保存機能を追加
    window.saveCanvas = function() {
      if (typeof saveCanvas !== 'undefined') {
        saveCanvas('generative-art', 'png');
      }
    };
    
    // 親ウィンドウからのメッセージを受信
    window.addEventListener('message', function(event) {
      if (event.data === 'SAVE_CANVAS') {
        window.saveCanvas();
      }
    });
    
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

  const saveImage = () => {
    if (!isPlaying) {
      alert('画像を保存するには、まずプレビューを実行してください。');
      return;
    }
    
    // iframeにメッセージを送信して画像を保存
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      // タイムスタンプを生成
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      
      // p5.jsのsaveCanvas関数を呼び出すメッセージを送信
      iframe.contentWindow.postMessage('SAVE_CANVAS', '*');
    } else {
      alert('プレビューが見つかりません。');
    }
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
          model: 'claude-3-5-sonnet-20241022',  // より高性能なモデルに変更
          max_tokens: 2000,
          messages: [
            {
              role: 'user',
              content: `You are an expert p5.js creative coder. Your task is to carefully analyze and modify the given code.

CURRENT CODE:
\`\`\`javascript
${code}
\`\`\`

USER INSTRUCTION: "${aiPrompt}"

CRITICAL RULES:
1. PRESERVE ALL VARIABLE DECLARATIONS (let, const, var) at the top of the code
2. PRESERVE ALL FUNCTION DEFINITIONS (especially helper functions like createPalette)
3. MAINTAIN THE EXACT STRUCTURE - only modify the parts relevant to the instruction
4. DO NOT remove or reorganize existing code structure
5. Keep all global variables, imports, and initial setup intact
6. ALWAYS keep the setup() function - it's required for p5.js
7. DO NOT use p5.js reserved words as variable names (setup, draw, width, height, etc.)
8. Ensure all parentheses, braces, and brackets are properly matched
9. Add semicolons at the end of statements

P5.JS SPECIFIC RULES:
- Never remove setup() function
- Never declare variables named: width, height, frameCount, mouseX, mouseY
- Always call createCanvas() inside setup()
- Use p5.js functions correctly (fill before drawing, stroke before lines, etc.)
- If using noLoop(), ensure draw() still exists

ANALYSIS STEPS:
1. Identify all global variables and preserve them
2. Identify if code is static (noLoop) or animated
3. Understand what the instruction is asking for
4. Make ONLY the necessary changes while keeping everything else intact

COMMON MODIFICATIONS:
- "色を変える/増やす" → Modify color values, add to palette array, or change fill() calls
- "もっとランダム/ぐちゃぐちゃ" → Adjust random() ranges, add noise to positions
- "大きく/小さく" → Modify size variables or multipliers
- "速く/遅く" → Only if animated, modify increment values
- "パターンを変える" → Modify probability values or shape drawing logic
- "アニメーション追加" → Remove noLoop() and add time-based variables

EXTREMELY IMPORTANT:
- Output ONLY valid p5.js code
- Do NOT include any explanations outside of code comments
- If you want to explain changes, use JavaScript comments: // 変更点: ...
- Do NOT output any text that is not valid JavaScript
- Do NOT use markdown formatting
- Start directly with the code (let/const/function declarations)
- Ensure the code will run without errors

OUTPUT: The COMPLETE modified p5.js code only. Nothing else.`
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
          
          // クリーンアップ - より徹底的に
          newCode = newCode.replace(/^```(?:javascript|js|jsx)?\s*\n/gm, '');
          newCode = newCode.replace(/\n```\s*$/gm, '');
          newCode = newCode.replace(/^```\s*/gm, '');
          newCode = newCode.replace(/\s*```$/gm, '');
          
          // 各行をチェックして、コード以外の説明文を除去
          const lines = newCode.split('\n');
          const cleanedLines = [];
          let inCode = false;
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            
            // コードの開始を検出
            if (!inCode && (
                trimmedLine.startsWith('let ') ||
                trimmedLine.startsWith('const ') ||
                trimmedLine.startsWith('var ') ||
                trimmedLine.startsWith('function ') ||
                trimmedLine.startsWith('//') ||
                trimmedLine.startsWith('/*') ||
                trimmedLine === '' ||
                trimmedLine.includes('=') ||
                trimmedLine.includes('{') ||
                trimmedLine.includes('}') ||
                trimmedLine.includes('(') ||
                trimmedLine.includes(');')
            )) {
              inCode = true;
            }
            
            // コードが始まったら、その行を含める
            if (inCode) {
              cleanedLines.push(line);
            } else {
              // コード外の説明文と思われる行をスキップ
              console.log('スキップした説明文:', line);
            }
          }
          
          newCode = cleanedLines.join('\n').trim();
          
          // 説明文として挿入された日本語行のみをコメント化
          const finalLines = [];
          for (const line of newCode.split('\n')) {
            const trimmedLine = line.trim();
            
            // 日本語のみで構成される説明文行を検出
            // 条件：
            // 1. 日本語を含む
            // 2. コメントではない（//や/*で始まらない）
            // 3. コード要素を含まない（=, (, ), {, }, ;, : などがない）
            // 4. 文字列リテラル内ではない（", ', ` がない）
            if (/[\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf]/.test(trimmedLine) && 
                !trimmedLine.startsWith('//') && 
                !trimmedLine.startsWith('/*') &&
                !trimmedLine.includes('"') &&
                !trimmedLine.includes("'") &&
                !trimmedLine.includes('`') &&
                !/[=(){}\[\];:,.]/.test(trimmedLine) &&
                trimmedLine.length > 0) {
              // 純粋な日本語説明文と判断
              finalLines.push('// ' + line);
              console.log('コメント化した説明文:', line);
            } else {
              finalLines.push(line);
            }
          }
          
          newCode = finalLines.join('\n').trim();
          
          // p5.js コード検証
          const validateP5Code = (code) => {
            const errors = [];
            
            // 1. 必須関数のチェック
            if (!code.includes('function setup()')) {
              errors.push('setup()関数が見つかりません');
            }
            
            // 2. 予約語の誤用チェック
            const p5Reserved = ['setup', 'draw', 'preload', 'mousePressed', 'mouseReleased', 
                               'keyPressed', 'keyReleased', 'width', 'height', 'frameCount'];
            const variableDeclarations = code.match(/(?:let|const|var)\s+(\w+)/g) || [];
            for (const decl of variableDeclarations) {
              const varName = decl.match(/(?:let|const|var)\s+(\w+)/)[1];
              if (p5Reserved.includes(varName)) {
                errors.push(`予約語 "${varName}" を変数名として使用しています`);
              }
            }
            
            // 3. 括弧の対応チェック
            const openParens = (code.match(/\(/g) || []).length;
            const closeParens = (code.match(/\)/g) || []).length;
            if (openParens !== closeParens) {
              errors.push(`括弧の数が一致しません: ( ${openParens}個, ) ${closeParens}個`);
            }
            
            const openBraces = (code.match(/\{/g) || []).length;
            const closeBraces = (code.match(/\}/g) || []).length;
            if (openBraces !== closeBraces) {
              errors.push(`波括弧の数が一致しません: { ${openBraces}個, } ${closeBraces}個`);
            }
            
            const openBrackets = (code.match(/\[/g) || []).length;
            const closeBrackets = (code.match(/\]/g) || []).length;
            if (openBrackets !== closeBrackets) {
              errors.push(`角括弧の数が一致しません: [ ${openBrackets}個, ] ${closeBrackets}個`);
            }
            
            // 4. セミコロンの欠落チェック（簡易）
            const lines = code.split('\n');
            for (let i = 0; i < lines.length; i++) {
              const line = lines[i].trim();
              if (line && 
                  !line.startsWith('//') && 
                  !line.startsWith('function') &&
                  !line.includes('{') &&
                  !line.includes('}') &&
                  !line.startsWith('if') &&
                  !line.startsWith('else') &&
                  !line.startsWith('for') &&
                  !line.startsWith('while') &&
                  line.match(/^(let|const|var|[a-zA-Z_$][\w$]*\s*=)/) &&
                  !line.endsWith(';') &&
                  !line.endsWith(',')) {
                errors.push(`行 ${i + 1}: セミコロンが欠けている可能性があります`);
              }
            }
            
            // 5. 基本的な構文エラーチェック
            try {
              // p5.js特有の関数をモック
              const mockP5 = `
                const width = 400, height = 400;
                const frameCount = 0;
                const PI = Math.PI, TWO_PI = Math.PI * 2, HALF_PI = Math.PI / 2;
                const mouseX = 0, mouseY = 0;
                function createCanvas() {}
                function background() {}
                function fill() {}
                function noFill() {}
                function stroke() {}
                function noStroke() {}
                function ellipse() {}
                function rect() {}
                function line() {}
                function point() {}
                function triangle() {}
                function arc() {}
                function random() { return Math.random(); }
                function noise() { return Math.random(); }
                function push() {}
                function pop() {}
                function translate() {}
                function rotate() {}
                function scale() {}
                function color() { return {}; }
                function colorMode() {}
                function beginShape() {}
                function endShape() {}
                function vertex() {}
                function noLoop() {}
                function loop() {}
                function redraw() {}
                function frameRate() {}
                function rectMode() {}
                function ellipseMode() {}
                function angleMode() {}
                function textAlign() {}
                function textSize() {}
                function text() {}
                function map() { return 0; }
                function constrain() { return 0; }
                function dist() { return 0; }
                function lerp() { return 0; }
                function lerpColor() { return {}; }
                function sin() { return Math.sin(); }
                function cos() { return Math.cos(); }
                function tan() { return Math.tan(); }
                function atan2() { return Math.atan2(); }
                function radians() { return 0; }
                function degrees() { return 0; }
                function saveCanvas() {}
                const CENTER = 'center';
                const CORNER = 'corner';
                const RADIANS = 'radians';
                const DEGREES = 'degrees';
                const RGB = 'rgb';
                const HSB = 'hsb';
                const PIE = 'pie';
                const CHORD = 'chord';
                const OPEN = 'open';
                const CLOSE = 'close';
              `;
              new Function(mockP5 + '\n' + code);
            } catch (e) {
              errors.push(`構文エラー: ${e.message}`);
            }
            
            return errors;
          };
          
          // コード検証実行
          const validationErrors = validateP5Code(newCode);
          if (validationErrors.length > 0) {
            console.error('コード検証エラー:', validationErrors);
            
            // エラーが致命的な場合は元のコードに戻す
            const criticalErrors = validationErrors.filter(err => 
              err.includes('setup()関数') || 
              err.includes('構文エラー') ||
              err.includes('括弧の数が一致しません')
            );
            
            if (criticalErrors.length > 0) {
              console.error('致命的なエラーのため、元のコードを保持します');
              alert('生成されたコードにエラーがあります:\n' + criticalErrors.join('\n') + '\n\n元のコードを保持します。');
              setIsProcessing(false);
              return;
            }
          }
          
          // 重要な変数が失われていないかチェック
          const originalVars = code.match(/^(let|const|var)\s+\w+/gm) || [];
          const newVars = newCode.match(/^(let|const|var)\s+\w+/gm) || [];
          
          if (originalVars.length > newVars.length) {
            console.warn('警告: 一部の変数宣言が失われた可能性があります');
            console.log('元の変数:', originalVars);
            console.log('新しい変数:', newVars);
          }
          
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
          <button
            onClick={saveImage}
            disabled={!isPlaying}
            style={{
              backgroundColor: isPlaying ? '#059669' : '#6b7280',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: isPlaying ? 'pointer' : 'not-allowed',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              opacity: isPlaying ? 1 : 0.6
            }}
          >
            <Download size={16} />
            画像保存
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
                  sandbox="allow-scripts allow-downloads allow-same-origin"
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