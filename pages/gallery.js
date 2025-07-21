// pages/gallery.js
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Play } from 'lucide-react';

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

function TemplatePreview({ template, index }) {
  const canvasRef = useRef(null);
  const router = useRouter();
  
  useEffect(() => {
    const p5Template = `
<!DOCTYPE html>
<html>
<head>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.7.0/p5.min.js"></script>
  <style>
    body { margin: 0; padding: 0; overflow: hidden; background: #000; }
    canvas { width: 100% !important; height: 100% !important; }
  </style>
</head>
<body>
  <script>
    ${template.code}
  </script>
</body>
</html>`;
    
    if (canvasRef.current) {
      canvasRef.current.srcdoc = p5Template;
    }
  }, [template.code]);
  
  const handleSelect = () => {
    // エディタページに遷移し、選択したテンプレートのインデックスを渡す
    router.push(`/?template=${index}`);
  };
  
  return (
    <div 
      onClick={handleSelect}
      style={{
        backgroundColor: '#1f2937',
        borderRadius: '0.5rem',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px solid transparent'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#3b82f6';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'transparent';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={{ position: 'relative', paddingBottom: '100%', backgroundColor: '#000' }}>
        <iframe
          ref={canvasRef}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            border: 'none',
            pointerEvents: 'none'
          }}
          sandbox="allow-scripts"
        />
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '0.75rem 1.5rem',
            borderRadius: '0.375rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.opacity = 1; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = 0; }}
        >
          <Play size={20} />
          <span>選択</span>
        </div>
      </div>
      <div style={{ padding: '1rem' }}>
        <h3 style={{ 
          margin: '0 0 0.5rem 0', 
          fontSize: '1.125rem', 
          fontWeight: '600',
          color: 'white'
        }}>
          {template.name}
        </h3>
        <p style={{ 
          margin: 0, 
          fontSize: '0.875rem', 
          color: '#9ca3af' 
        }}>
          {template.description}
        </p>
      </div>
    </div>
  );
}

export default function Gallery() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#111827', 
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* ヘッダー */}
      <div style={{ 
        backgroundColor: '#1f2937', 
        padding: '2rem', 
        textAlign: 'center',
        borderBottom: '1px solid #374151'
      }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          margin: '0 0 0.5rem 0' 
        }}>
          ジェネラティブアート・スタジオ
        </h1>
        <p style={{ 
          fontSize: '1.125rem', 
          color: '#9ca3af',
          margin: 0
        }}>
          テンプレートを選んで、あなただけのアートを作りましょう
        </p>
      </div>
      
      {/* ギャラリー */}
      <div style={{ 
        padding: '3rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {starterTemplates.map((template, index) => (
            <TemplatePreview 
              key={template.id} 
              template={template} 
              index={index}
            />
          ))}
        </div>
      </div>
    </div>
  );
}