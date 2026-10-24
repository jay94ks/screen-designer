export interface ImagePreset {
  id: string;
  name: string;
  fileName: string;
  category: 'gradient' | 'avatar' | 'finance' | 'tech' | 'minimal' | 'nature';
  description: string;
  svgContent: string;
  dataUrl: string;
}

const PRESET_GRADIENT_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="50%" stop-color="#1e1b4b" />
      <stop offset="100%" stop-color="#090514" />
    </linearGradient>
    <radialGradient id="blob1" cx="30%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.85" />
      <stop offset="50%" stop-color="#a855f7" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#1e1b4b" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="blob2" cx="75%" cy="65%" r="55%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.8" />
      <stop offset="50%" stop-color="#3b82f6" stop-opacity="0.3" />
      <stop offset="100%" stop-color="#0f172a" stop-opacity="0" />
    </radialGradient>
    <radialGradient id="blob3" cx="50%" cy="85%" r="45%">
      <stop offset="0%" stop-color="#ec4899" stop-opacity="0.75" />
      <stop offset="60%" stop-color="#8b5cf6" stop-opacity="0.2" />
      <stop offset="100%" stop-color="#090514" stop-opacity="0" />
    </radialGradient>
    <filter id="meshBlur" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="40" />
    </filter>
  </defs>
  <rect width="100%" height="100%" fill="url(#bgGrad)" />
  <g filter="url(#meshBlur)">
    <circle cx="260" cy="180" r="220" fill="url(#blob1)" />
    <circle cx="620" cy="320" r="240" fill="url(#blob2)" />
    <circle cx="420" cy="400" r="190" fill="url(#blob3)" />
  </g>
  <g opacity="0.15">
    <circle cx="400" cy="250" r="180" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="6 8" />
    <circle cx="400" cy="250" r="260" fill="none" stroke="#ffffff" stroke-width="1" />
  </g>
</svg>`;

const PRESET_AVATAR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
  <defs>
    <linearGradient id="avatarBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4f46e5" />
      <stop offset="50%" stop-color="#7c3aed" />
      <stop offset="100%" stop-color="#db2777" />
    </linearGradient>
    <radialGradient id="faceShade" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#fed7aa" />
      <stop offset="100%" stop-color="#fba868" />
    </radialGradient>
    <filter id="avatarDrop" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.25" />
    </filter>
  </defs>
  <rect width="100%" height="100%" rx="80" fill="url(#avatarBg)" />
  <circle cx="200" cy="200" r="150" fill="#ffffff" opacity="0.08" />
  <g filter="url(#avatarDrop)">
    <!-- Shoulders / Clothes -->
    <path d="M110 350 C110 270, 290 270, 290 350 Z" fill="#0f172a" />
    <!-- Collar -->
    <path d="M165 275 L200 310 L235 275 Z" fill="#ffffff" />
    <!-- Neck -->
    <rect x="180" y="240" width="40" height="45" rx="6" fill="#fba868" />
    <!-- Head -->
    <ellipse cx="200" cy="180" rx="55" ry="68" fill="url(#faceShade)" />
    <!-- Hair -->
    <path d="M140 180 C140 100, 260 100, 260 180 C245 155, 230 145, 200 145 C170 145, 155 155, 140 180 Z" fill="#1e293b" />
    <!-- Glasses -->
    <rect x="155" y="165" width="36" height="24" rx="6" fill="none" stroke="#0f172a" stroke-width="4" />
    <rect x="209" y="165" width="36" height="24" rx="6" fill="none" stroke="#0f172a" stroke-width="4" />
    <line x1="191" y1="177" x2="209" y2="177" stroke="#0f172a" stroke-width="4" />
    <!-- Eyes -->
    <circle cx="173" cy="177" r="4.5" fill="#0f172a" />
    <circle cx="227" cy="177" r="4.5" fill="#0f172a" />
    <!-- Smile -->
    <path d="M185 212 Q200 224 215 212" fill="none" stroke="#0f172a" stroke-width="3.5" stroke-linecap="round" />
  </g>
</svg>`;

const PRESET_CHART_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 450" width="800" height="450">
  <defs>
    <linearGradient id="chartBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b0f19" />
      <stop offset="100%" stop-color="#111827" />
    </linearGradient>
    <linearGradient id="chartArea" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#6366f1" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#6366f1" stop-opacity="0.0" />
    </linearGradient>
    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="50%" stop-color="#818cf8" />
      <stop offset="100%" stop-color="#c084fc" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" rx="20" fill="url(#chartBg)" />
  
  <!-- Subtle Grid Lines -->
  <g stroke="#334155" stroke-opacity="0.4" stroke-dasharray="4 6" stroke-width="1">
    <line x1="60" y1="120" x2="740" y2="120" />
    <line x1="60" y1="200" x2="740" y2="200" />
    <line x1="60" y1="280" x2="740" y2="280" />
    <line x1="60" y1="360" x2="740" y2="360" />
  </g>

  <!-- Area Fill -->
  <path d="M 60 350 C 180 320, 240 370, 340 260 C 440 150, 520 220, 620 140 C 670 100, 710 110, 740 90 L 740 380 L 60 380 Z" fill="url(#chartArea)" />
  
  <!-- Main Stroke -->
  <path d="M 60 350 C 180 320, 240 370, 340 260 C 440 150, 520 220, 620 140 C 670 100, 710 110, 740 90" fill="none" stroke="url(#lineGrad)" stroke-width="5" stroke-linecap="round" />

  <!-- Data Point Highlighting -->
  <circle cx="740" cy="90" r="7" fill="#c084fc" stroke="#ffffff" stroke-width="2.5" />
  <circle cx="340" cy="260" r="5" fill="#818cf8" />
  <circle cx="620" cy="140" r="5" fill="#c084fc" />

  <!-- Floating Stats Badge -->
  <rect x="580" y="45" width="160" height="34" rx="10" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5" />
  <text x="660" y="67" fill="#38bdf8" font-family="sans-serif" font-size="13" font-weight="bold" text-anchor="middle">▲ +24.8% (30일)</text>
</svg>`;

const PRESET_TECH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#050110" />
      <stop offset="60%" stop-color="#1e0836" />
      <stop offset="100%" stop-color="#ff007f" />
    </linearGradient>
    <linearGradient id="sunGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffde59" />
      <stop offset="100%" stop-color="#ff007f" />
    </linearGradient>
  </defs>
  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#skyGrad)" />
  
  <!-- Retro Cyber Sun -->
  <circle cx="400" cy="240" r="100" fill="url(#sunGrad)" />
  <rect x="290" y="240" width="220" height="6" fill="#1e0836" />
  <rect x="290" y="254" width="220" height="9" fill="#1e0836" />
  <rect x="290" y="271" width="220" height="14" fill="#1e0836" />
  <rect x="290" y="293" width="220" height="20" fill="#1e0836" />

  <!-- Horizon Line -->
  <line x1="0" y1="310" x2="800" y2="310" stroke="#00ffff" stroke-width="2" />

  <!-- Perspective Grid Floor -->
  <g stroke="#00ffff" stroke-width="1.2" opacity="0.65">
    <line x1="400" y1="310" x2="-200" y2="520" />
    <line x1="400" y1="310" x2="0" y2="520" />
    <line x1="400" y1="310" x2="160" y2="520" />
    <line x1="400" y1="310" x2="280" y2="520" />
    <line x1="400" y1="310" x2="360" y2="520" />
    <line x1="400" y1="310" x2="440" y2="520" />
    <line x1="400" y1="310" x2="520" y2="520" />
    <line x1="400" y1="310" x2="640" y2="520" />
    <line x1="400" y1="310" x2="800" y2="520" />
    <line x1="400" y1="310" x2="1000" y2="520" />

    <!-- Horizontal Grid Lines -->
    <line x1="0" y1="322" x2="800" y2="322" />
    <line x1="0" y1="340" x2="800" y2="340" />
    <line x1="0" y1="365" x2="800" y2="365" />
    <line x1="0" y1="400" x2="800" y2="400" />
    <line x1="0" y1="450" x2="800" y2="450" />
  </g>
</svg>`;

const PRESET_MINIMAL_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="deskBg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc" />
      <stop offset="100%" stop-color="#e2e8f0" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#deskBg)" />

  <!-- Wooden Desk Surface -->
  <rect x="0" y="320" width="800" height="180" fill="#cbd5e1" />
  <line x1="0" y1="320" x2="800" y2="320" stroke="#94a3b8" stroke-width="2" />

  <!-- Minimal Laptop -->
  <g transform="translate(260, 160)">
    <!-- Screen Bezel -->
    <rect x="0" y="0" width="280" height="180" rx="12" fill="#0f172a" />
    <!-- Display -->
    <rect x="12" y="12" width="256" height="156" rx="6" fill="#1e293b" />
    <circle cx="140" cy="90" r="28" fill="#6366f1" opacity="0.8" />
    <path d="M 60 140 Q 140 80 220 140" fill="none" stroke="#38bdf8" stroke-width="3" />
    <!-- Laptop Base -->
    <path d="M -25 180 L 305 180 L 290 196 L -10 196 Z" fill="#94a3b8" />
    <rect x="110" y="180" width="60" height="4" rx="2" fill="#64748b" />
  </g>

  <!-- Coffee Mug -->
  <g transform="translate(600, 270)">
    <rect x="0" y="0" width="46" height="54" rx="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="2" />
    <path d="M 46 12 C 60 12, 60 42, 46 42" fill="none" stroke="#ffffff" stroke-width="5" />
    <path d="M 46 12 C 60 12, 60 42, 46 42" fill="none" stroke="#cbd5e1" stroke-width="2" />
  </g>

  <!-- Plant Leaves -->
  <g transform="translate(120, 240)">
    <rect x="25" y="60" width="40" height="40" rx="6" fill="#475569" />
    <ellipse cx="30" cy="40" rx="14" ry="26" fill="#10b981" transform="rotate(-25 30 40)" />
    <ellipse cx="60" cy="35" rx="14" ry="28" fill="#059669" transform="rotate(20 60 35)" />
    <ellipse cx="45" cy="20" rx="12" ry="30" fill="#34d399" />
  </g>
</svg>`;

const PRESET_NATURE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">
  <defs>
    <linearGradient id="twilightSky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0b132b" />
      <stop offset="40%" stop-color="#1c2541" />
      <stop offset="75%" stop-color="#474973" />
      <stop offset="100%" stop-color="#f28e2b" />
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#twilightSky)" />

  <!-- Moon -->
  <circle cx="640" cy="110" r="38" fill="#ffeedd" />
  <circle cx="654" cy="100" r="34" fill="#0b132b" />

  <!-- Stars -->
  <g fill="#ffffff" opacity="0.7">
    <circle cx="120" cy="70" r="1.5" />
    <circle cx="280" cy="50" r="2" />
    <circle cx="450" cy="90" r="1" />
    <circle cx="200" cy="140" r="1.5" />
    <circle cx="340" cy="110" r="1" />
    <circle cx="520" cy="60" r="2" />
  </g>

  <!-- Distant Mountain Range -->
  <polygon points="-20,500 180,240 380,420 540,280 720,400 820,330 820,500" fill="#2d3142" opacity="0.6" />
  
  <!-- Mid-distance Mountains -->
  <polygon points="-20,500 100,320 290,460 480,310 660,470 820,370 820,500" fill="#1f2438" opacity="0.85" />

  <!-- Foreground Dark Mountain -->
  <polygon points="-20,500 240,360 440,500 600,380 820,490 820,500" fill="#0d1117" />
</svg>`;

export const IMAGE_PRESETS: ImagePreset[] = [
  {
    id: 'gradient-aurora',
    name: '추상 오로라 그라디언트',
    fileName: 'preset-gradient.svg',
    category: 'gradient',
    description: '모던 네온 메쉬 그라디언트 벡터 이미지',
    svgContent: PRESET_GRADIENT_SVG,
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(PRESET_GRADIENT_SVG)}`
  },
  {
    id: 'avatar-user',
    name: '사용자 프로필 아바타',
    fileName: 'preset-avatar.svg',
    category: 'avatar',
    description: '스타일리시한 사용자 일러스트 아바타',
    svgContent: PRESET_AVATAR_SVG,
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(PRESET_AVATAR_SVG)}`
  },
  {
    id: 'chart-hero',
    name: '핀테크 & 자산 차트 배너',
    fileName: 'preset-chart.svg',
    category: 'finance',
    description: '다크모드 핀테크 자산 분석 차트',
    svgContent: PRESET_CHART_SVG,
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(PRESET_CHART_SVG)}`
  },
  {
    id: 'cyber-grid',
    name: '사이버펑크 네온 그리드',
    fileName: 'preset-tech.svg',
    category: 'tech',
    description: '레트로 퓨처리즘 네온 그리드 배경',
    svgContent: PRESET_TECH_SVG,
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(PRESET_TECH_SVG)}`
  },
  {
    id: 'minimal-desk',
    name: '미니멀 워크스페이스',
    fileName: 'preset-minimal.svg',
    category: 'minimal',
    description: '깔끔한 데스크 환경 벡터 그래픽',
    svgContent: PRESET_MINIMAL_SVG,
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(PRESET_MINIMAL_SVG)}`
  },
  {
    id: 'nature-mountain',
    name: '자연 풍경 & 산맥',
    fileName: 'preset-nature.svg',
    category: 'nature',
    description: '황혼 산맥 실루엣 배경',
    svgContent: PRESET_NATURE_SVG,
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(PRESET_NATURE_SVG)}`
  }
];

export function getPresetById(id: string): ImagePreset | undefined {
  return IMAGE_PRESETS.find((p) => p.id === id);
}

export function getPresetByFileName(fileName: string): ImagePreset | undefined {
  return IMAGE_PRESETS.find((p) => p.fileName === fileName);
}
