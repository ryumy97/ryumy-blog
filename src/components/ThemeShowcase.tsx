"use client";

import MDXCode from "./MDXCode";

const availableThemes = [
  "atomDark",
  "dracula",
  "githubLight",
  "nightOwl",
  "sandpackDark",
  "aquaBlue",
  "monokaiPro",
  "cobalt2",
  "cyberpunk",
  "amethyst",
  "ecoLight",
  "gruvboxDark",
  "gruvboxLight",
  "neoCyan",
  "freeCodeCampDark",
  "levelUp",
] as const;

const sampleCode = `function createVisualization(data) {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  
  // 데이터 처리
  const processedData = data.map(item => ({
    x: item.value * 10,
    y: item.category.length * 5
  }));
  
  // 시각화 그리기
  processedData.forEach(point => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, 2 * Math.PI);
    ctx.fillStyle = '#4ec9b0';
    ctx.fill();
  });
}`;

export default function ThemeShowcase() {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold mb-6">사용 가능한 테마들</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableThemes.map((theme) => (
          <div key={theme} className="space-y-3">
            <h3 className="text-lg font-semibold capitalize">
              {theme.replace(/([A-Z])/g, " $1").trim()}
            </h3>
            <MDXCode theme={theme} className="language-javascript">
              {sampleCode}
            </MDXCode>
          </div>
        ))}
      </div>
    </div>
  );
}
