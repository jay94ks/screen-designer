import React, { useState } from 'react';
import { X, Smartphone, Tablet, Monitor, Sparkles, LayoutTemplate, Plus } from 'lucide-react';
import { Artboard, ViewportType } from '../../types';

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
  const [selectedCategory, setSelectedCategory] = useState<'phone' | 'tablet' | 'desktop' | 'custom'>('phone');
  const [title, setTitle] = useState(`${nextIndex}. 새 화면`);
  const [customW, setCustomW] = useState(390);
  const [customH, setCustomH] = useState(844);
  const [template, setTemplate] = useState<'blank' | 'login' | 'dashboard' | 'list'>('blank');

  if (!isOpen) return null;

  const presets = [
    { cat: 'phone', name: 'iPhone 16 Pro', w: 402, h: 874, vp: 'mobile' as ViewportType },
    { cat: 'phone', name: 'iPhone 15 / 14', w: 393, h: 852, vp: 'mobile' as ViewportType },
    { cat: 'phone', name: 'Galaxy S24', w: 412, h: 915, vp: 'mobile' as ViewportType },
    { cat: 'tablet', name: 'iPad Pro 11"', w: 834, h: 1194, vp: 'tablet' as ViewportType },
    { cat: 'tablet', name: 'iPad Mini', w: 744, h: 1133, vp: 'tablet' as ViewportType },
    { cat: 'desktop', name: 'MacBook Pro 14"', w: 1512, h: 982, vp: 'desktop' as ViewportType },
    { cat: 'desktop', name: 'Desktop Web (1440)', w: 1440, h: 900, vp: 'desktop' as ViewportType },
    { cat: 'desktop', name: '관리자 대시보드', w: 1200, h: 800, vp: 'desktop' as ViewportType }
  ];

  const handleSelectPreset = (p: { name: string; w: number; h: number; vp: ViewportType }) => {
    let code = `export default function Screen() {
  return (
    <div className="p-8 h-full bg-white flex flex-col items-center justify-center text-slate-800">
      <h2 className="text-xl font-bold">${title}</h2>
      <p className="text-xs text-slate-500 mt-1">새 컴포넌트 캔버스</p>
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
      title,
      viewport: p.vp,
      x: 0,
      y: 0,
      width: p.w,
      height: p.h,
      tweaksSchema: [],
      tweakValues: {},
      code
    };

    onAddArtboard(newArtboard, template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <Plus size={16} className="text-indigo-600" />
            <span>새 프레임 / 아트보드 추가 (New Frame)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600">
            <X size={15} />
          </button>
        </div>

        {/* Name input */}
        <div className="space-y-1.5 text-xs">
          <label className="text-slate-600 font-semibold">화면 명칭</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>

        {/* Template Select */}
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
                onClick={() => setTemplate(t.id as any)}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition ${
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

        {/* Category Filter */}
        <div className="flex gap-2 border-b border-slate-200 pb-2 text-xs">
          {[
            { id: 'phone', label: '스마트폰 (Phone)', icon: Smartphone },
            { id: 'tablet', label: '태블릿 (Tablet)', icon: Tablet },
            { id: 'desktop', label: '데스크톱 (Desktop)', icon: Monitor }
          ].map((cat) => {
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`pb-1 px-2 font-medium flex items-center gap-1.5 transition ${
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

        {/* Presets List Grid */}
        <div className="grid grid-cols-2 gap-2.5 max-h-56 overflow-y-auto pr-1">
          {presets
            .filter((p) => p.cat === selectedCategory)
            .map((p) => (
              <button
                key={p.name}
                onClick={() => handleSelectPreset(p)}
                className="p-3 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-xl text-left flex items-center justify-between transition group"
              >
                <div>
                  <div className="font-bold text-xs text-slate-800 group-hover:text-indigo-700">{p.name}</div>
                  <div className="text-[11px] font-mono text-slate-400 mt-0.5">{p.w} × {p.h} px</div>
                </div>
                <div className="w-6 h-6 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition">
                  +
                </div>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
