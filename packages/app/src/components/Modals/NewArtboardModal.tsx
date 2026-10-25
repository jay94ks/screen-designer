import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  Sliders,
  LayoutTemplate,
  Plus,
  RotateCw,
  Check
} from 'lucide-react';
import { Artboard, ViewportType } from '../../types';
import { MIN_ARTBOARD_WIDTH, MIN_ARTBOARD_HEIGHT } from '../PropertiesPanel';

interface NewArtboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddArtboard: (artboard: Artboard, template?: 'blank' | 'login' | 'dashboard' | 'list') => void;
  nextIndex: number;
}

export const NewArtboardModal: React.FC<NewArtboardModalProps> = ({
  isOpen,
  onClose,
  onAddArtboard,
  nextIndex
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'custom' | 'phone' | 'tablet' | 'desktop'>('custom');
  const [title, setTitle] = useState(`${nextIndex}. 새 화면`);
  const [customW, setCustomW] = useState<number>(1440);
  const [customH, setCustomH] = useState<number>(900);
  const [customViewport, setCustomViewport] = useState<ViewportType>('desktop');
  const [template, setTemplate] = useState<'blank' | 'login' | 'dashboard' | 'list'>('blank');

  useEffect(() => {
    if (isOpen) {
      setTitle(`${nextIndex}. 새 화면`);
    }
  }, [isOpen, nextIndex]);

  if (!isOpen) return null;

  const presets = [
    { cat: 'phone', name: 'iPhone 16 Pro Max', w: 430, h: 932, vp: 'mobile' as ViewportType },
    { cat: 'phone', name: 'iPhone 16 / 15 Pro', w: 393, h: 852, vp: 'mobile' as ViewportType },
    { cat: 'phone', name: 'Galaxy S24 Ultra', w: 412, h: 915, vp: 'mobile' as ViewportType },
    { cat: 'phone', name: 'Mobile Compact (SE)', w: 375, h: 667, vp: 'mobile' as ViewportType },
    { cat: 'tablet', name: 'iPad Pro 12.9"', w: 1024, h: 1366, vp: 'tablet' as ViewportType },
    { cat: 'tablet', name: 'iPad Air / Pro 11"', w: 834, h: 1194, vp: 'tablet' as ViewportType },
    { cat: 'tablet', name: 'iPad Mini', w: 768, h: 1024, vp: 'tablet' as ViewportType },
    { cat: 'desktop', name: 'FHD Desktop (16:9)', w: 1920, h: 1080, vp: 'desktop' as ViewportType },
    { cat: 'desktop', name: 'Studio Canvas (16:10)', w: 1600, h: 1000, vp: 'desktop' as ViewportType },
    { cat: 'desktop', name: 'MacBook / Web Standard', w: 1440, h: 900, vp: 'desktop' as ViewportType },
    { cat: 'desktop', name: 'HD Admin Dashboard', w: 1280, h: 800, vp: 'desktop' as ViewportType }
  ];

  const createArtboardWithSize = (w: number, h: number, vp: ViewportType) => {
    const safeW = Math.max(MIN_ARTBOARD_WIDTH, Math.min(7680, Math.round(w || MIN_ARTBOARD_WIDTH)));
    const safeH = Math.max(MIN_ARTBOARD_HEIGHT, Math.min(7680, Math.round(h || MIN_ARTBOARD_HEIGHT)));

    let code = `export default function Screen() {
  return (
    <div className="p-8 h-full bg-white flex flex-col items-center justify-center text-slate-800">
      <h2 className="text-xl font-bold">${title}</h2>
      <p className="text-xs text-slate-500 mt-1">새 컴포넌트 캔버스 (${safeW}×${safeH})</p>
    </div>
  );
}`;

    if (template === 'login') {
      code = `export default function LoginScreen() {
  return (
    <div className="p-6 h-full bg-slate-900 text-white flex flex-col justify-between">
      <div className="pt-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black">로그인</h1>
          <p className="text-xs text-slate-400 mt-1">계정으로 서비스를 시작하세요</p>
        </div>
        <div className="space-y-3">
          <input type="email" placeholder="이메일 주소" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
          <input type="password" placeholder="비밀번호" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white" />
        </div>
      </div>
      <button className="w-full py-3.5 bg-indigo-600 rounded-xl font-bold text-xs shadow-lg">로그인하기</button>
    </div>
  );
}`;
    } else if (template === 'dashboard') {
      code = `export default function DashboardScreen() {
  return (
    <div className="p-6 h-full bg-slate-50 text-slate-900 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-black">비즈니스 개요</h2>
        <span className="text-xs text-indigo-600 font-bold">실시간 업데이트</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs"><div className="text-xs text-slate-400">일일 활성 유저</div><div className="text-xl font-black mt-1">2,840명</div></div>
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs"><div className="text-xs text-slate-400">결제 전환율</div><div className="text-xl font-black mt-1">4.8%</div></div>
      </div>
    </div>
  );
}`;
    }

    const newArtboard: Artboard = {
      id: `screen-${Date.now()}`,
      title: title.trim() || `${nextIndex}. 새 화면`,
      viewport: vp,
      x: 0,
      y: 0,
      width: safeW,
      height: safeH,
      tweaksSchema: [],
      tweakValues: {},
      code
    };

    onAddArtboard(newArtboard, template);
    onClose();
  };

  const inferViewport = (w: number): ViewportType => {
    if (w < 600) return 'mobile';
    if (w < 1100) return 'tablet';
    return 'desktop';
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <Plus size={16} className="text-indigo-600" />
            <span>새 프레임 / 아트보드 추가 (New Frame)</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        </div>

        {/* 1. Frame Title + Direct Custom Size Input Box */}
        <div className="p-4 bg-indigo-50/50 border border-indigo-200/80 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Sliders size={13} className="text-indigo-600" />
              <span>프레임 명칭 및 해상도 직접 입력 (최소 {MIN_ARTBOARD_WIDTH}×{MIN_ARTBOARD_HEIGHT}px)</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
              {customW} × {customH} px
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.3fr_1fr_auto_1fr] gap-2 items-end">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-600 font-semibold block">화면 명칭 (Title)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 1. 메인 대시보드"
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Custom Width */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-600 font-semibold block">가로 너비 (Width, px)</label>
              <input
                type="number"
                min={MIN_ARTBOARD_WIDTH}
                max={7680}
                value={customW}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setCustomW(val);
                  setCustomViewport(inferViewport(val));
                }}
                onBlur={() => {
                  if (customW < MIN_ARTBOARD_WIDTH) setCustomW(MIN_ARTBOARD_WIDTH);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Swap Orientation Button */}
            <button
              type="button"
              onClick={() => {
                const prevW = customW;
                setCustomW(customH);
                setCustomH(prevW);
                setCustomViewport(inferViewport(customH));
              }}
              className="p-2 mb-0.5 rounded-lg bg-white hover:bg-indigo-100 border border-slate-200 text-slate-600 hover:text-indigo-700 transition"
              title="가로 ↔ 세로 크기 맞바꾸기 (회전)"
            >
              <RotateCw size={14} />
            </button>

            {/* Custom Height */}
            <div className="space-y-1">
              <label className="text-[11px] text-slate-600 font-semibold block">세로 높이 (Height, px)</label>
              <input
                type="number"
                min={MIN_ARTBOARD_HEIGHT}
                max={7680}
                value={customH}
                onChange={(e) => setCustomH(Number(e.target.value))}
                onBlur={() => {
                  if (customH < MIN_ARTBOARD_HEIGHT) setCustomH(MIN_ARTBOARD_HEIGHT);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Quick Aspect Ratio & Resolution Helpers */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[10px] text-slate-500 font-semibold mr-1">빠른 치수 입력:</span>
            {[
              { label: '1920×1080 (FHD)', w: 1920, h: 1080 },
              { label: '1600×1000 (16:10)', w: 1600, h: 1000 },
              { label: '1440×900 (Web)', w: 1440, h: 900 },
              { label: '1024×768 (4:3)', w: 1024, h: 768 },
              { label: '834×1194 (iPad)', w: 834, h: 1194 },
              { label: '393×852 (Mobile)', w: 393, h: 852 }
            ].map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => {
                  setCustomW(q.w);
                  setCustomH(q.h);
                  setCustomViewport(inferViewport(q.w));
                }}
                className={`px-2 py-0.5 rounded-md text-[10px] font-mono border transition ${
                  customW === q.w && customH === q.h
                    ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-700'
                }`}
              >
                {q.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Template Select */}
        <div className="space-y-1.5 text-xs">
          <label className="text-slate-600 font-semibold flex items-center gap-1">
            <LayoutTemplate size={13} className="text-indigo-600" />
            <span>시작 템플릿 선택</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'blank', label: '빈 캔버스 (Blank)' },
              { id: 'login', label: '로그인 / 인증 폼' },
              { id: 'dashboard', label: '지표 카드 대시보드' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id as any)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition whitespace-nowrap truncate ${
                  template === t.id
                    ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. Device Preset Categories */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs overflow-x-auto">
          {[
            { id: 'custom', label: '전체 프리셋 (All)', icon: Sliders },
            { id: 'desktop', label: '데스크톱 (Desktop)', icon: Monitor },
            { id: 'tablet', label: '태블릿 (Tablet)', icon: Tablet },
            { id: 'phone', label: '스마트폰 (Phone)', icon: Smartphone }
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`pb-1 px-2 font-medium flex items-center gap-1.5 transition whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'border-b-2 border-indigo-600 font-bold text-indigo-600'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon size={14} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4. Presets List Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
          {presets
            .filter((p) => selectedCategory === 'custom' || p.cat === selectedCategory)
            .map((p) => {
              const isSelected = customW === p.w && customH === p.h;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => {
                    setCustomW(p.w);
                    setCustomH(p.h);
                    setCustomViewport(p.vp);
                  }}
                  onDoubleClick={() => createArtboardWithSize(p.w, p.h, p.vp)}
                  className={`p-2.5 border rounded-xl text-left flex items-center justify-between transition group ${
                    isSelected
                      ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500'
                      : 'bg-slate-50 hover:bg-indigo-50/60 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <div className="min-w-0 flex-1 pr-1">
                    <div className="font-bold text-xs text-slate-800 group-hover:text-indigo-700 truncate">
                      {p.name}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                      {p.w} × {p.h} px
                    </div>
                  </div>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition shrink-0 ${
                      isSelected
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white border border-slate-200 text-slate-400 group-hover:bg-indigo-600 group-hover:text-white'
                    }`}
                  >
                    {isSelected ? <Check size={12} /> : '+'}
                  </div>
                </button>
              );
            })}
        </div>

        {/* 5. Footer Primary Create Action */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            프리셋 카드를 더블클릭하거나 우측 생성 버튼을 누르세요.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => createArtboardWithSize(customW, customH, customViewport)}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>
                {Math.max(MIN_ARTBOARD_WIDTH, customW || MIN_ARTBOARD_WIDTH)} ×{' '}
                {Math.max(MIN_ARTBOARD_HEIGHT, customH || MIN_ARTBOARD_HEIGHT)} px 프레임 생성
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
