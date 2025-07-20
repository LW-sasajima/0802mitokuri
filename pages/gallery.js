// pages/gallery.js
import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { Play } from 'lucide-react';

const starterTemplates = [
  {
    id: 1,
    name: "流れる粒子",
    description: "ランダムに現れる光の粒子",
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
    description: "中心で回転する四角形",
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
    description: "パーリンノイズで作る波形",
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
    description: "ランダムな色と大きさの円",
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
  },
  {
    id: 5,
    name: "スパイラル",
    description: "外側に広がる螺旋",
    code: `let angle = 0;
let radius = 0;

function setup() {
  createCanvas(400, 400);
  background(0);
}

function draw() {
  translate(width/2, height/2);
  let x = radius * cos(angle);
  let y = radius * sin(angle);
  stroke(255);
  point(x, y);
  angle += 0.1;
  radius += 0.1;
  if (radius > 200) {
    radius = 0;
    background(0);
  }
}`
  },
  {
    id: 6,
    name: "パーティクルシステム",
    description: "中心から広がる粒子",
    code: `let particles = [];

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0, 25);
  particles.push({
    x: width/2,
    y: height/2,
    vx: random(-2, 2),
    vy: random(-2, 2)
  });
  
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    stroke(255);
    point(p.x, p.y);
    
    if (p.x < 0 || p.x > width || p.y < 0 || p.y > height) {
      particles.splice(i, 1);
    }
  }
  
  if (particles.length > 100) {
    particles.splice(0, 1);
  }
}`
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