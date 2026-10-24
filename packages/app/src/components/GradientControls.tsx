import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Compass,
  Palette,
  RotateCw,
  Sliders,
  ChevronDown,
  ChevronUp,
  Layers,
  CircleDot
} from 'lucide-react';

export type GradientType = 'linear-neon' | 'dark-mesh' | null;

interface GradientControlsProps {
  currentValue: string;
  gradientType: GradientType;
  onChange: (value: string) => void;
  onClose?: () => void;
}

export const NEON_PALETTES = [
  { name: '오로라 네온', c1: '#6366f1', c2: '#a855f7' },
  { name: '사이버 핑크', c1: '#ec4899', c2: '#06b6d4' },
  { name: '선셋 오렌지', c1: '#f97316', c2: '#e11d48' },
  { name: '에메랄드 펄', c1: '#10b981', c2: '#3b82f6' },
  { name: '일렉트릭 블루', c1: '#3b82f6', c2: '#8b5cf6' },
  { name: '골든 앰버', c1: '#eab308', c2: '#ef4444' }
];

export const MESH_PALETTES = [
  { name: '인디고 & 퍼플', spot1: '#1e1b4b', spot2: '#311042', base: '#090514' },
  { name: '사이버 시안 & 핑크', spot1: '#083344', spot2: '#4a044e', base: '#030712' },
  { name: '에메랄드 나이트', spot1: '#064e3b', spot2: '#1e1b4b', base: '#022c22' },
  { name: '딥 오션 네이비', spot1: '#172554', spot2: '#0f172a', base: '#020617' },
  { name: '블러드 문 & 차콜', spot1: '#450a0a', spot2: '#18181b', base: '#09090b' },
  { name: '트와일라잇 마젠타', spot1: '#581c87', spot2: '#701a75', base: '#18021e' }
];

export const GradientControls: React.FC<GradientControlsProps> = ({
  currentValue,
  gradientType,
  onChange,
  onClose
}) => {
  // --- 1. Neon Linear Gradient State ---
  const [neonAngle, setNeonAngle] = useState(135);
  const [neonColor1, setNeonColor1] = useState('#6366f1');
  const [neonColor2, setNeonColor2] = useState('#a855f7');
  const [neonStop1, setNeonStop1] = useState(0);
  const [neonStop2, setNeonStop2] = useState(100);

  // --- 2. Dark Mesh Gradient State ---
  const [spot1Color, setSpot1Color] = useState('#1e1b4b');
  const [spot1X, setSpot1X] = useState(0);
  const [spot1Y, setSpot1Y] = useState(0);
  const [spot1Radius, setSpot1Radius] = useState(50);

  const [spot2Color, setSpot2Color] = useState('#311042');
  const [spot2X, setSpot2X] = useState(100);
  const [spot2Y, setSpot2Y] = useState(100);
  const [spot2Radius, setSpot2Radius] = useState(50);

  const [meshBaseColor, setMeshBaseColor] = useState('#090514');

  // Try to parse existing linear-gradient values if valid
  useEffect(() => {
    if (gradientType === 'linear-neon' && currentValue.includes('linear-gradient')) {
      const matchAngle = currentValue.match(/linear-gradient\(\s*(\d+)deg/i);
      if (matchAngle) setNeonAngle(parseInt(matchAngle[1], 10));

      const colors = currentValue.match(/#(?:[0-9a-fA-F]{3}){1,2}/g);
      if (colors && colors.length >= 2) {
        setNeonColor1(colors[0]);
        setNeonColor2(colors[1]);
      }

      const stopsMatch = Array.from(currentValue.matchAll(/#([0-9a-fA-F]{3,8})\s+(\d+)%/g));
      if (stopsMatch.length >= 2) {
        setNeonStop1(parseInt(stopsMatch[0][2], 10));
        setNeonStop2(parseInt(stopsMatch[1][2], 10));
      }
    } else if (gradientType === 'dark-mesh' && currentValue.includes('radial-gradient')) {
      const colors = currentValue.match(/#(?:[0-9a-fA-F]{3}){1,2}/g);
      if (colors && colors.length >= 2) {
        setSpot1Color(colors[0]);
        setSpot2Color(colors[1]);
        if (colors.length >= 3) setMeshBaseColor(colors[2]);
      }

      const spotsMatch = Array.from(
        currentValue.matchAll(/at\s+(\d+)%\s+(\d+)%[,\s]+(#[0-9a-fA-F]{3,8}|\w+)\s+0(?:px)?,\s*transparent\s+(\d+)%/g)
      );
      if (spotsMatch.length >= 1) {
        setSpot1X(parseInt(spotsMatch[0][1], 10));
        setSpot1Y(parseInt(spotsMatch[0][2], 10));
        setSpot1Radius(parseInt(spotsMatch[0][4], 10));
      }
      if (spotsMatch.length >= 2) {
        setSpot2X(parseInt(spotsMatch[1][1], 10));
        setSpot2Y(parseInt(spotsMatch[1][2], 10));
        setSpot2Radius(parseInt(spotsMatch[1][4], 10));
      }
    }
  }, [gradientType, currentValue]);

  // Update Neon Gradient
  const updateNeon = (
    angle = neonAngle,
    c1 = neonColor1,
    c2 = neonColor2,
    s1 = neonStop1,
    s2 = neonStop2
  ) => {
    setNeonAngle(angle);
    setNeonColor1(c1);
    setNeonColor2(c2);
    setNeonStop1(s1);
    setNeonStop2(s2);
    const css = `linear-gradient(${angle}deg, ${c1} ${s1}%, ${c2} ${s2}%)`;
    onChange(css);
  };

  // Update Dark Mesh Gradient
  const updateMesh = (
    c1 = spot1Color,
    x1 = spot1X,
    y1 = spot1Y,
    r1 = spot1Radius,
    c2 = spot2Color,
    x2 = spot2X,
    y2 = spot2Y,
    r2 = spot2Radius,
    base = meshBaseColor
  ) => {
    setSpot1Color(c1);
    setSpot1X(x1);
    setSpot1Y(y1);
    setSpot1Radius(r1);

    setSpot2Color(c2);
    setSpot2X(x2);
    setSpot2Y(y2);
    setSpot2Radius(r2);

    setMeshBaseColor(base);

    const css = `radial-gradient(at ${x1}% ${y1}%, ${c1} 0px, transparent ${r1}%), radial-gradient(at ${x2}% ${y2}%, ${c2} 0px, transparent ${r2}%), linear-gradient(0deg, ${base}, ${base})`;
    onChange(css);
  };

  if (!gradientType) return null;

  return (
    <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-xl border border-slate-700/80 shadow-md space-y-3 select-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-800">
        <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide">
          <Sparkles size={13} className={gradientType === 'linear-neon' ? 'text-indigo-400' : 'text-purple-400'} />
          <span className="text-white">
            {gradientType === 'linear-neon' ? '네온 그라데이션 옵션 제어' : '다크 메쉬 옵션 제어'}
          </span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-[10px] text-slate-400 hover:text-white px-1.5 py-0.5 rounded hover:bg-slate-800 transition"
          >
            닫기
          </button>
        )}
      </div>

      {/* ============================================================== */}
      {/* 1. NEON LINEAR GRADIENT CONTROLS                               */}
      {/* ============================================================== */}
      {gradientType === 'linear-neon' && (
        <div className="space-y-3">
          {/* Live Gradient Preview Swatch */}
          <div
            className="h-7 w-full rounded-lg border border-slate-700/80 shadow-inner flex items-center justify-between px-2 text-[9px] font-mono text-white/90 drop-shadow"
            style={{
              background: `linear-gradient(${neonAngle}deg, ${neonColor1} ${neonStop1}%, ${neonColor2} ${neonStop2}%)`
            }}
          >
            <span>{neonAngle}°</span>
            <span>{neonColor1} → {neonColor2}</span>
          </div>

          {/* Angle Slider & Quick Angle Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[10px] text-slate-300 font-semibold">
              <span className="flex items-center gap-1">
                <Compass size={11} className="text-indigo-400" />
                <span>방향 각도 (Angle: {neonAngle}°)</span>
              </span>
              <input
                type="number"
                min={0}
                max={360}
                value={neonAngle}
                onChange={(e) => updateNeon(Number(e.target.value) % 361)}
                className="w-12 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-right font-mono text-[10px] text-white focus:outline-none"
              />
            </div>
            <input
              type="range"
              min={0}
              max={360}
              value={neonAngle}
              onChange={(e) => updateNeon(Number(e.target.value))}
              className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            {/* Quick Angle Chips */}
            <div className="grid grid-cols-5 gap-1">
              {[
                { label: '0° (↑)', val: 0 },
                { label: '45° (↗)', val: 45 },
                { label: '90° (→)', val: 90 },
                { label: '135° (↘)', val: 135 },
                { label: '180° (↓)', val: 180 }
              ].map((a) => (
                <button
                  key={a.label}
                  onClick={() => updateNeon(a.val)}
                  className={`py-0.5 text-[9px] rounded font-mono transition ${
                    neonAngle === a.val
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Color 1 & Color 2 Rows */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* Start Color */}
            <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1.5">
              <span className="text-[10px] text-slate-400 block font-semibold">시작 색상 (Start)</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={neonColor1}
                  onChange={(e) => updateNeon(neonAngle, e.target.value, neonColor2, neonStop1, neonStop2)}
                  className="w-6 h-6 rounded border border-slate-600 cursor-pointer p-0 bg-transparent shrink-0"
                />
                <input
                  type="text"
                  value={neonColor1}
                  onChange={(e) => updateNeon(neonAngle, e.target.value, neonColor2, neonStop1, neonStop2)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 font-mono text-[10px] text-white focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span>정지 ({neonStop1}%)</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={neonStop1}
                  onChange={(e) => updateNeon(neonAngle, neonColor1, neonColor2, Number(e.target.value), neonStop2)}
                  className="w-16 accent-indigo-500 h-1 cursor-pointer"
                />
              </div>
            </div>

            {/* End Color */}
            <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-1.5">
              <span className="text-[10px] text-slate-400 block font-semibold">종료 색상 (End)</span>
              <div className="flex items-center gap-1.5">
                <input
                  type="color"
                  value={neonColor2}
                  onChange={(e) => updateNeon(neonAngle, neonColor1, e.target.value, neonStop1, neonStop2)}
                  className="w-6 h-6 rounded border border-slate-600 cursor-pointer p-0 bg-transparent shrink-0"
                />
                <input
                  type="text"
                  value={neonColor2}
                  onChange={(e) => updateNeon(neonAngle, neonColor1, e.target.value, neonStop1, neonStop2)}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 font-mono text-[10px] text-white focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between text-[9px] text-slate-400">
                <span>정지 ({neonStop2}%)</span>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={neonStop2}
                  onChange={(e) => updateNeon(neonAngle, neonColor1, neonColor2, neonStop1, Number(e.target.value))}
                  className="w-16 accent-indigo-500 h-1 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Quick Neon Color Combos */}
          <div className="space-y-1 pt-1">
            <span className="text-[9px] text-slate-400 block font-semibold">인기 네온 팔레트 프리셋</span>
            <div className="grid grid-cols-3 gap-1">
              {NEON_PALETTES.map((p) => (
                <button
                  key={p.name}
                  onClick={() => updateNeon(neonAngle, p.c1, p.c2)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left flex items-center gap-1.5 transition text-[9px] text-slate-300"
                >
                  <span
                    className="w-3.5 h-3.5 rounded shrink-0 border border-white/20"
                    style={{ background: `linear-gradient(135deg, ${p.c1}, ${p.c2})` }}
                  />
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. DARK MESH RADIAL GRADIENT CONTROLS                          */}
      {/* ============================================================== */}
      {gradientType === 'dark-mesh' && (
        <div className="space-y-3">
          {/* Live Mesh Preview Swatch */}
          <div
            className="h-10 w-full rounded-lg border border-slate-700/80 shadow-inner relative overflow-hidden flex items-center justify-between px-2 text-[9px] font-mono text-white/90 drop-shadow"
            style={{
              background: `radial-gradient(at ${spot1X}% ${spot1Y}%, ${spot1Color} 0px, transparent ${spot1Radius}%), radial-gradient(at ${spot2X}% ${spot2Y}%, ${spot2Color} 0px, transparent ${spot2Radius}%), linear-gradient(0deg, ${meshBaseColor}, ${meshBaseColor})`
            }}
          >
            <span>스팟1 ({spot1X}%, {spot1Y}%)</span>
            <span>스팟2 ({spot2X}%, {spot2Y}%)</span>
          </div>

          {/* Mesh Spot 1 Controls */}
          <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-indigo-300">
              <span className="flex items-center gap-1">
                <CircleDot size={12} className="text-indigo-400" />
                <span>메쉬 스팟 1 (Glow Spot 1)</span>
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={spot1Color}
                  onChange={(e) => updateMesh(e.target.value, spot1X, spot1Y, spot1Radius, spot2Color, spot2X, spot2Y, spot2Radius, meshBaseColor)}
                  className="w-5 h-5 rounded border border-slate-600 cursor-pointer p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={spot1Color}
                  onChange={(e) => updateMesh(e.target.value, spot1X, spot1Y, spot1Radius, spot2Color, spot2X, spot2Y, spot2Radius, meshBaseColor)}
                  className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 font-mono text-[9px] text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Spot 1 Position Sliders */}
            <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-300">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>위치 X</span>
                  <span className="font-mono text-indigo-400">{spot1X}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={spot1X}
                  onChange={(e) => updateMesh(spot1Color, Number(e.target.value), spot1Y, spot1Radius, spot2Color, spot2X, spot2Y, spot2Radius, meshBaseColor)}
                  className="w-full accent-indigo-500 h-1 bg-slate-900 rounded cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>위치 Y</span>
                  <span className="font-mono text-indigo-400">{spot1Y}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={spot1Y}
                  onChange={(e) => updateMesh(spot1Color, spot1X, Number(e.target.value), spot1Radius, spot2Color, spot2X, spot2Y, spot2Radius, meshBaseColor)}
                  className="w-full accent-indigo-500 h-1 bg-slate-900 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Spot 1 Radius Slider */}
            <div className="flex items-center justify-between text-[9px] text-slate-300 pt-0.5">
              <span>확산 반경 (Radius: {spot1Radius}%)</span>
              <input
                type="range"
                min={20}
                max={100}
                value={spot1Radius}
                onChange={(e) => updateMesh(spot1Color, spot1X, spot1Y, Number(e.target.value), spot2Color, spot2X, spot2Y, spot2Radius, meshBaseColor)}
                className="w-28 accent-indigo-500 h-1 bg-slate-900 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Mesh Spot 2 Controls */}
          <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/60 space-y-2">
            <div className="flex items-center justify-between text-[10px] font-bold text-pink-300">
              <span className="flex items-center gap-1">
                <CircleDot size={12} className="text-pink-400" />
                <span>메쉬 스팟 2 (Glow Spot 2)</span>
              </span>
              <div className="flex items-center gap-1">
                <input
                  type="color"
                  value={spot2Color}
                  onChange={(e) => updateMesh(spot1Color, spot1X, spot1Y, spot1Radius, e.target.value, spot2X, spot2Y, spot2Radius, meshBaseColor)}
                  className="w-5 h-5 rounded border border-slate-600 cursor-pointer p-0 bg-transparent"
                />
                <input
                  type="text"
                  value={spot2Color}
                  onChange={(e) => updateMesh(spot1Color, spot1X, spot1Y, spot1Radius, e.target.value, spot2X, spot2Y, spot2Radius, meshBaseColor)}
                  className="w-16 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 font-mono text-[9px] text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Spot 2 Position Sliders */}
            <div className="grid grid-cols-2 gap-2 text-[9px] text-slate-300">
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>위치 X</span>
                  <span className="font-mono text-pink-400">{spot2X}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={spot2X}
                  onChange={(e) => updateMesh(spot1Color, spot1X, spot1Y, spot1Radius, spot2Color, Number(e.target.value), spot2Y, spot2Radius, meshBaseColor)}
                  className="w-full accent-pink-500 h-1 bg-slate-900 rounded cursor-pointer"
                />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span>위치 Y</span>
                  <span className="font-mono text-pink-400">{spot2Y}%</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={spot2Y}
                  onChange={(e) => updateMesh(spot1Color, spot1X, spot1Y, spot1Radius, spot2Color, spot2X, Number(e.target.value), spot2Radius, meshBaseColor)}
                  className="w-full accent-pink-500 h-1 bg-slate-900 rounded cursor-pointer"
                />
              </div>
            </div>

            {/* Spot 2 Radius Slider */}
            <div className="flex items-center justify-between text-[9px] text-slate-300 pt-0.5">
              <span>확산 반경 (Radius: {spot2Radius}%)</span>
              <input
                type="range"
                min={20}
                max={100}
                value={spot2Radius}
                onChange={(e) => updateMesh(spot1Color, spot1X, spot1Y, spot1Radius, spot2Color, spot2X, spot2Y, Number(e.target.value), meshBaseColor)}
                className="w-28 accent-pink-500 h-1 bg-slate-900 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Mesh Base Background Color */}
          <div className="flex items-center justify-between p-2 bg-slate-800/60 rounded-lg border border-slate-700/60 text-[10px] text-slate-300">
            <span className="font-semibold">바탕 배경색 (Base Color)</span>
            <div className="flex items-center gap-1.5">
              <input
                type="color"
                value={meshBaseColor}
                onChange={(e) => updateMesh(spot1Color, spot1X, spot1Y, spot1Radius, spot2Color, spot2X, spot2Y, spot2Radius, e.target.value)}
                className="w-5 h-5 rounded border border-slate-600 cursor-pointer p-0 bg-transparent"
              />
              <input
                type="text"
                value={meshBaseColor}
                onChange={(e) => updateMesh(spot1Color, spot1X, spot1Y, spot1Radius, spot2Color, spot2X, spot2Y, spot2Radius, e.target.value)}
                className="w-18 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 font-mono text-[9px] text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Dark Mesh Palette Presets */}
          <div className="space-y-1 pt-1">
            <span className="text-[9px] text-slate-400 block font-semibold">인기 다크 메쉬 팔레트 프리셋</span>
            <div className="grid grid-cols-2 gap-1.5">
              {MESH_PALETTES.map((p) => (
                <button
                  key={p.name}
                  onClick={() => updateMesh(p.spot1, spot1X, spot1Y, spot1Radius, p.spot2, spot2X, spot2Y, spot2Radius, p.base)}
                  className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left flex items-center gap-2 transition text-[9px] text-slate-300"
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 border border-white/20"
                    style={{
                      background: `radial-gradient(at 0% 0%, ${p.spot1} 0px, transparent 50%), radial-gradient(at 100% 100%, ${p.spot2} 0px, transparent 50%), ${p.base}`
                    }}
                  />
                  <span className="truncate">{p.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
