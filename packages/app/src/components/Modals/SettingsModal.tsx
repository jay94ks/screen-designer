import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  Palette,
  Grid,
  Ruler,
  MousePointer,
  Type,
  CreditCard,
  Square,
  Circle,
  RotateCcw,
  Sparkles,
  Sliders,
  FolderOpen,
  FolderGit2,
  GitBranch
} from 'lucide-react';
import { ProjectSettings, ComponentDefaultStyles, DEFAULT_COMPONENT_STYLES } from '../../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProjectSettings;
  onUpdateSettings: (newSettings: Partial<ProjectSettings>) => void;
  initialTab?: 'canvas' | 'components';
}

type ComponentKey = keyof ComponentDefaultStyles;

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  initialTab = 'components'
}) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'components'>(initialTab);
  const [selectedComp, setSelectedComp] = useState<ComponentKey>('button');

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const currentDefaults: ComponentDefaultStyles = {
    ...DEFAULT_COMPONENT_STYLES,
    ...(settings.componentDefaults || {})
  };

  const handleUpdateComponentDefault = <K extends ComponentKey>(
    compKey: K,
    updates: Partial<ComponentDefaultStyles[K]>
  ) => {
    const nextDefaults: ComponentDefaultStyles = {
      ...currentDefaults,
      [compKey]: {
        ...currentDefaults[compKey],
        ...updates
      }
    };
    onUpdateSettings({ componentDefaults: nextDefaults });
  };

  const handleResetComponent = (compKey: ComponentKey) => {
    handleUpdateComponentDefault(compKey, DEFAULT_COMPONENT_STYLES[compKey]);
  };

  const handleResetAllComponents = () => {
    onUpdateSettings({ componentDefaults: DEFAULT_COMPONENT_STYLES });
  };

  const PRESET_COLORS = [
    '#4f46e5',
    '#2563eb',
    '#0ea5e9',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#0f172a',
    '#1e293b',
    '#334155',
    '#64748b',
    '#94a3b8',
    '#f8fafc',
    '#ffffff'
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-4xl w-full h-[640px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sliders size={16} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">환경 설정 & 디자인 시스템 (Settings)</h2>
              <p className="text-[11px] text-slate-500">캔버스 및 신규 생성될 UI 컴포넌트의 기본 스타일 토큰 구성</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/60 text-xs">
              <button
                onClick={() => setActiveTab('components')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                  activeTab === 'components'
                    ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles size={13} className="text-indigo-600" />
                <span>컴포넌트 기본 스타일</span>
              </button>
              <button
                onClick={() => setActiveTab('canvas')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                  activeTab === 'canvas'
                    ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid size={13} className="text-slate-500" />
                <span>캔버스 환경</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200/80 rounded-lg text-slate-400 hover:text-slate-700 transition ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-hidden flex">
          {activeTab === 'canvas' ? (
            /* 1. Canvas Settings Tab */
            <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-xl mx-auto text-xs">
              {/* 0. Project Documents Storage & Git Settings */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FolderOpen size={16} className="text-indigo-600" />
                  <span>프로젝트 파일 저장소 및 Git (Project Storage)</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">페이지별 JSON 문서 저장 경로</span>
                      <span className="font-mono text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        기본값: docs/ui-boards
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">
                      각 페이지는 이 폴더 내에 별도의 독립된 JSON 파일(가상 DOM 구조)로 개별 저장됩니다.
                    </p>
                    <input
                      type="text"
                      value={settings.pageDocsPath || 'docs/ui-boards'}
                      onChange={(e) => onUpdateSettings({ pageDocsPath: e.target.value })}
                      className="w-full px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-mono text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px]">
                      <FolderGit2 size={13} className="text-slate-600" />
                      <span>.screen-designer 디렉터리 (자동 관리)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      프로젝트 루트의 <code>.screen-designer/</code> 폴더는 내부 설정(<code>config.json</code>)과 캐시(<code>cache/</code>)를 자동으로 생성 및 보관하는 데 사용됩니다.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-medium text-slate-700">Git 디자인 변경 사항 자동 감지</span>
                    <input
                      type="checkbox"
                      checked={settings.gitAutoCheck !== false}
                      onChange={(e) => onUpdateSettings({ gitAutoCheck: e.target.checked })}
                      className="rounded text-indigo-600 accent-indigo-600 cursor-pointer w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              {/* Grid Settings */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <Grid size={16} className="text-indigo-600" />
                  <span>그리드 및 가이드 (Grid & Guides)</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">도트 그리드 표시 (Show Grid)</span>
                    <input
                      type="checkbox"
                      checked={settings.gridVisible}
                      onChange={(e) => onUpdateSettings({ gridVisible: e.target.checked })}
                      className="rounded text-indigo-600 accent-indigo-600 cursor-pointer w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">그리드 스냅 (Snap to Grid)</span>
                    <input
                      type="checkbox"
                      checked={settings.snapToGrid}
                      onChange={(e) => onUpdateSettings({ snapToGrid: e.target.checked })}
                      className="rounded text-indigo-600 accent-indigo-600 cursor-pointer w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">그리드 간격</span>
                    <div className="flex gap-1.5">
                      {[8, 16, 24, 32].map((size) => (
                        <button
                          key={size}
                          onClick={() => onUpdateSettings({ gridSize: size })}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition ${
                            settings.gridSize === size
                              ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {size}px
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Ruler size={13} className="text-slate-400" />
                      <span>눈금자 표시 (Rulers)</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.rulersVisible}
                      onChange={(e) => onUpdateSettings({ rulersVisible: e.target.checked })}
                      className="rounded text-indigo-600 accent-indigo-600 cursor-pointer w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              {/* Canvas Background */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <Palette size={16} className="text-indigo-600" />
                  <span>캔버스 기본 배경색 (Canvas Background)</span>
                </div>
                <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {[
                    { label: '클래식 그레이', value: '#e5e7eb' },
                    { label: '다크 슬레이트', value: '#0f172a' },
                    { label: '쿨 그레이', value: '#f1f5f9' },
                    { label: '화이트', value: '#ffffff' }
                  ].map((bg) => (
                    <button
                      key={bg.value}
                      onClick={() => onUpdateSettings({ canvasBackground: bg.value })}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-2 ${
                        settings.canvasBackground === bg.value
                          ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-xs font-bold'
                          : 'border-slate-200 hover:bg-white bg-slate-50/50'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: bg.value }} />
                      <span className="text-[11px] text-slate-700 truncate">{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 2. Component Default Styles Tab (Dual Pane + Live Preview) */
            <div className="flex-1 flex overflow-hidden">
              {/* Component Selector Sidebar */}
              <div className="w-52 border-r border-slate-200 bg-slate-50/50 p-3 space-y-1 shrink-0 overflow-y-auto select-none">
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  설정할 컴포넌트
                </div>
                {[
                  { key: 'button' as const, label: '버튼 (Button)', icon: MousePointer, desc: 'CTA 및 인터랙티브 버튼' },
                  { key: 'text' as const, label: '텍스트 (Text)', icon: Type, desc: '제목 및 본문 라벨' },
                  { key: 'card' as const, label: '카드 (Card)', icon: CreditCard, desc: '컨테이너 그룹 박스' },
                  { key: 'input' as const, label: '입력창 (Input)', icon: Sliders, desc: '폼 텍스트 필드' },
                  { key: 'box' as const, label: '사각형 (Box)', icon: Square, desc: '레이아웃 구획 박스' },
                  { key: 'circle' as const, label: '원형 배지 (Circle)', icon: Circle, desc: '아바타 및 상태 아이콘' }
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = selectedComp === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => setSelectedComp(item.key)}
                      className={`w-full text-left p-2.5 rounded-xl transition flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <Icon size={14} />
                      </div>
                      <div className="truncate">
                        <div className="text-xs truncate">{item.label}</div>
                        <div className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {item.desc}
                        </div>
                      </div>
                    </button>
                  );
                })}

                <div className="pt-4 px-1">
                  <button
                    onClick={handleResetAllComponents}
                    className="w-full py-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-[11px] font-medium flex items-center justify-center gap-1.5 transition shadow-2xs"
                  >
                    <RotateCcw size={12} />
                    <span>모든 기본값 초기화</span>
                  </button>
                </div>
              </div>

              {/* Form Controls Column */}
              <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm capitalize">
                      {selectedComp} 기본 스타일 설정
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      앞으로 캔버스에 추가되는 모든 '{selectedComp}' 컴포넌트에 이 스타일이 기본 적용됩니다.
                    </p>
                  </div>
                  <button
                    onClick={() => handleResetComponent(selectedComp)}
                    className="px-2.5 py-1 text-[11px] text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition flex items-center gap-1 border border-slate-200"
                    title="해당 컴포넌트 기본값 복원"
                  >
                    <RotateCcw size={11} />
                    <span>기본값 복원</span>
                  </button>
                </div>

                {/* --- 1. BUTTON FORM --- */}
                {selectedComp === 'button' && (
                  <div className="space-y-4">
                    {/* Background Color */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">버튼 배경색 (Background)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentDefaults.button.backgroundColor}
                          onChange={(e) => handleUpdateComponentDefault('button', { backgroundColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                        />
                        <input
                          type="text"
                          value={currentDefaults.button.backgroundColor}
                          onChange={(e) => handleUpdateComponentDefault('button', { backgroundColor: e.target.value })}
                          className="w-24 px-2 py-1 font-mono text-xs border border-slate-200 rounded-lg bg-slate-50"
                        />
                        <div className="flex gap-1 overflow-x-auto py-1">
                          {PRESET_COLORS.map((c) => (
                            <button
                              key={c}
                              onClick={() => handleUpdateComponentDefault('button', { backgroundColor: c })}
                              className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110 shrink-0"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Text Color */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">버튼 글자색 (Color)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentDefaults.button.color}
                          onChange={(e) => handleUpdateComponentDefault('button', { color: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                        />
                        <input
                          type="text"
                          value={currentDefaults.button.color}
                          onChange={(e) => handleUpdateComponentDefault('button', { color: e.target.value })}
                          className="w-24 px-2 py-1 font-mono text-xs border border-slate-200 rounded-lg bg-slate-50"
                        />
                        <div className="flex gap-1">
                          {['#ffffff', '#0f172a', '#94a3b8', '#e2e8f0'].map((c) => (
                            <button
                              key={c}
                              onClick={() => handleUpdateComponentDefault('button', { color: c })}
                              className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Border Radius */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="font-semibold text-slate-700">모서리 둥글기 (Border Radius)</label>
                        <span className="font-mono text-indigo-600 font-bold">{currentDefaults.button.borderRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={32}
                        value={currentDefaults.button.borderRadius > 32 ? 32 : currentDefaults.button.borderRadius}
                        onChange={(e) => handleUpdateComponentDefault('button', { borderRadius: Number(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <div className="flex gap-1.5 pt-1">
                        {[0, 6, 10, 12, 16, 999].map((rad) => (
                          <button
                            key={rad}
                            onClick={() => handleUpdateComponentDefault('button', { borderRadius: rad })}
                            className={`px-2 py-1 rounded-md text-[11px] font-mono transition border ${
                              currentDefaults.button.borderRadius === rad
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {rad === 999 ? 'Pill' : `${rad}px`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Padding & Font Size Row */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <label className="font-semibold text-slate-700">내부 패딩 (Padding)</label>
                          <span className="font-mono text-indigo-600 font-bold">{currentDefaults.button.padding}px</span>
                        </div>
                        <input
                          type="range"
                          min={6}
                          max={24}
                          value={currentDefaults.button.padding}
                          onChange={(e) => handleUpdateComponentDefault('button', { padding: Number(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <label className="font-semibold text-slate-700">폰트 크기 (Font Size)</label>
                          <span className="font-mono text-indigo-600 font-bold">{currentDefaults.button.fontSize}px</span>
                        </div>
                        <input
                          type="range"
                          min={11}
                          max={20}
                          value={currentDefaults.button.fontSize}
                          onChange={(e) => handleUpdateComponentDefault('button', { fontSize: Number(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>
                    </div>

                    {/* Font Weight */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">폰트 굵기 (Font Weight)</label>
                      <div className="flex gap-2">
                        {['normal', '500', 'bold', '800'].map((w) => (
                          <button
                            key={w}
                            onClick={() => handleUpdateComponentDefault('button', { fontWeight: w })}
                            className={`flex-1 py-1.5 rounded-lg border text-xs capitalize transition ${
                              currentDefaults.button.fontWeight === w
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {w === '500' ? 'Medium' : w === '800' ? 'Extra' : w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 2. TEXT FORM --- */}
                {selectedComp === 'text' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">기본 글자색 (Color)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentDefaults.text.color}
                          onChange={(e) => handleUpdateComponentDefault('text', { color: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                        />
                        <input
                          type="text"
                          value={currentDefaults.text.color}
                          onChange={(e) => handleUpdateComponentDefault('text', { color: e.target.value })}
                          className="w-24 px-2 py-1 font-mono text-xs border border-slate-200 rounded-lg bg-slate-50"
                        />
                        <div className="flex gap-1 overflow-x-auto py-1">
                          {PRESET_COLORS.map((c) => (
                            <button
                              key={c}
                              onClick={() => handleUpdateComponentDefault('text', { color: c })}
                              className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110 shrink-0"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="font-semibold text-slate-700">기본 폰트 크기 (Font Size)</label>
                        <span className="font-mono text-indigo-600 font-bold">{currentDefaults.text.fontSize}px</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={36}
                        value={currentDefaults.text.fontSize}
                        onChange={(e) => handleUpdateComponentDefault('text', { fontSize: Number(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <div className="flex gap-1.5 pt-1">
                        {[12, 14, 16, 18, 24, 30].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => handleUpdateComponentDefault('text', { fontSize: sz })}
                            className={`px-2 py-1 rounded-md text-[11px] font-mono transition border ${
                              currentDefaults.text.fontSize === sz
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {sz}px
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">폰트 굵기 (Font Weight)</label>
                      <div className="flex gap-2">
                        {['normal', '500', 'bold', '800'].map((w) => (
                          <button
                            key={w}
                            onClick={() => handleUpdateComponentDefault('text', { fontWeight: w })}
                            className={`flex-1 py-1.5 rounded-lg border text-xs capitalize transition ${
                              currentDefaults.text.fontWeight === w
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                                : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {w === '500' ? 'Medium' : w === '800' ? 'Extra' : w}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 3. CARD FORM --- */}
                {selectedComp === 'card' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">카드 배경색 (Background)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentDefaults.card.backgroundColor}
                          onChange={(e) => handleUpdateComponentDefault('card', { backgroundColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                        />
                        <input
                          type="text"
                          value={currentDefaults.card.backgroundColor}
                          onChange={(e) => handleUpdateComponentDefault('card', { backgroundColor: e.target.value })}
                          className="w-24 px-2 py-1 font-mono text-xs border border-slate-200 rounded-lg bg-slate-50"
                        />
                        <div className="flex gap-1 overflow-x-auto py-1">
                          {['#ffffff', '#f8fafc', '#1e293b', '#0f172a', '#111827', '#1e1b4b'].map((c) => (
                            <button
                              key={c}
                              onClick={() => handleUpdateComponentDefault('card', { backgroundColor: c })}
                              className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110 shrink-0"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">테두리 선 색상 (Border Color)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentDefaults.card.borderColor}
                          onChange={(e) => handleUpdateComponentDefault('card', { borderColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                        />
                        <input
                          type="text"
                          value={currentDefaults.card.borderColor}
                          onChange={(e) => handleUpdateComponentDefault('card', { borderColor: e.target.value })}
                          className="w-24 px-2 py-1 font-mono text-xs border border-slate-200 rounded-lg bg-slate-50"
                        />
                        <div className="flex gap-1 overflow-x-auto py-1">
                          {['#e2e8f0', '#cbd5e1', '#374151', '#475569', '#6366f1'].map((c) => (
                            <button
                              key={c}
                              onClick={() => handleUpdateComponentDefault('card', { borderColor: c })}
                              className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110 shrink-0"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <label className="font-semibold text-slate-700">모서리 둥글기</label>
                          <span className="font-mono text-indigo-600 font-bold">{currentDefaults.card.borderRadius}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={32}
                          value={currentDefaults.card.borderRadius}
                          onChange={(e) => handleUpdateComponentDefault('card', { borderRadius: Number(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <label className="font-semibold text-slate-700">내부 패딩</label>
                          <span className="font-mono text-indigo-600 font-bold">{currentDefaults.card.padding}px</span>
                        </div>
                        <input
                          type="range"
                          min={8}
                          max={36}
                          value={currentDefaults.card.padding}
                          onChange={(e) => handleUpdateComponentDefault('card', { padding: Number(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 4. INPUT FORM --- */}
                {selectedComp === 'input' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">입력창 배경색 (Background)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentDefaults.input.backgroundColor}
                          onChange={(e) => handleUpdateComponentDefault('input', { backgroundColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                        />
                        <input
                          type="text"
                          value={currentDefaults.input.backgroundColor}
                          onChange={(e) => handleUpdateComponentDefault('input', { backgroundColor: e.target.value })}
                          className="w-24 px-2 py-1 font-mono text-xs border border-slate-200 rounded-lg bg-slate-50"
                        />
                        <div className="flex gap-1">
                          {['#ffffff', '#f8fafc', '#0f172a', '#1e293b'].map((c) => (
                            <button
                              key={c}
                              onClick={() => handleUpdateComponentDefault('input', { backgroundColor: c })}
                              className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">입력 텍스트 색상 (Color)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentDefaults.input.color}
                          onChange={(e) => handleUpdateComponentDefault('input', { color: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                        />
                        <input
                          type="text"
                          value={currentDefaults.input.color}
                          onChange={(e) => handleUpdateComponentDefault('input', { color: e.target.value })}
                          className="w-24 px-2 py-1 font-mono text-xs border border-slate-200 rounded-lg bg-slate-50"
                        />
                        <div className="flex gap-1">
                          {['#0f172a', '#334155', '#ffffff', '#cbd5e1'].map((c) => (
                            <button
                              key={c}
                              onClick={() => handleUpdateComponentDefault('input', { color: c })}
                              className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <label className="font-semibold text-slate-700">모서리 둥글기</label>
                          <span className="font-mono text-indigo-600 font-bold">{currentDefaults.input.borderRadius}px</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={24}
                          value={currentDefaults.input.borderRadius}
                          onChange={(e) => handleUpdateComponentDefault('input', { borderRadius: Number(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <label className="font-semibold text-slate-700">내부 패딩</label>
                          <span className="font-mono text-indigo-600 font-bold">{currentDefaults.input.padding}px</span>
                        </div>
                        <input
                          type="range"
                          min={6}
                          max={20}
                          value={currentDefaults.input.padding}
                          onChange={(e) => handleUpdateComponentDefault('input', { padding: Number(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* --- 5. BOX FORM --- */}
                {selectedComp === 'box' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">박스 배경색 (Background)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentDefaults.box.backgroundColor}
                          onChange={(e) => handleUpdateComponentDefault('box', { backgroundColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                        />
                        <input
                          type="text"
                          value={currentDefaults.box.backgroundColor}
                          onChange={(e) => handleUpdateComponentDefault('box', { backgroundColor: e.target.value })}
                          className="w-24 px-2 py-1 font-mono text-xs border border-slate-200 rounded-lg bg-slate-50"
                        />
                        <div className="flex gap-1 overflow-x-auto py-1">
                          {PRESET_COLORS.map((c) => (
                            <button
                              key={c}
                              onClick={() => handleUpdateComponentDefault('box', { backgroundColor: c })}
                              className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110 shrink-0"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <label className="font-semibold text-slate-700">기본 너비 (W)</label>
                          <span className="font-mono text-indigo-600 font-bold">{currentDefaults.box.width}px</span>
                        </div>
                        <input
                          type="range"
                          min={60}
                          max={300}
                          value={currentDefaults.box.width}
                          onChange={(e) => handleUpdateComponentDefault('box', { width: Number(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between">
                          <label className="font-semibold text-slate-700">기본 높이 (H)</label>
                          <span className="font-mono text-indigo-600 font-bold">{currentDefaults.box.height}px</span>
                        </div>
                        <input
                          type="range"
                          min={40}
                          max={200}
                          value={currentDefaults.box.height}
                          onChange={(e) => handleUpdateComponentDefault('box', { height: Number(e.target.value) })}
                          className="w-full accent-indigo-600 cursor-pointer"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="font-semibold text-slate-700">모서리 둥글기 (Border Radius)</label>
                        <span className="font-mono text-indigo-600 font-bold">{currentDefaults.box.borderRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={32}
                        value={currentDefaults.box.borderRadius}
                        onChange={(e) => handleUpdateComponentDefault('box', { borderRadius: Number(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {/* --- 6. CIRCLE FORM --- */}
                {selectedComp === 'circle' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">배경색 (Background)</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={currentDefaults.circle.backgroundColor}
                          onChange={(e) => handleUpdateComponentDefault('circle', { backgroundColor: e.target.value })}
                          className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5"
                        />
                        <input
                          type="text"
                          value={currentDefaults.circle.backgroundColor}
                          onChange={(e) => handleUpdateComponentDefault('circle', { backgroundColor: e.target.value })}
                          className="w-24 px-2 py-1 font-mono text-xs border border-slate-200 rounded-lg bg-slate-50"
                        />
                        <div className="flex gap-1 overflow-x-auto py-1">
                          {PRESET_COLORS.map((c) => (
                            <button
                              key={c}
                              onClick={() => handleUpdateComponentDefault('circle', { backgroundColor: c })}
                              className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110 shrink-0"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="font-semibold text-slate-700">원형 지름 크기 (Size)</label>
                        <span className="font-mono text-indigo-600 font-bold">{currentDefaults.circle.size}px</span>
                      </div>
                      <input
                        type="range"
                        min={20}
                        max={80}
                        value={currentDefaults.circle.size}
                        onChange={(e) => handleUpdateComponentDefault('circle', { size: Number(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Right Live Preview Column */}
              <div className="w-72 border-l border-slate-200 bg-slate-50/70 p-5 flex flex-col shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 pb-3 border-b border-slate-200">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>실시간 적용 프리뷰 (Preview)</span>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] my-3 rounded-2xl border border-slate-200/80 shadow-inner overflow-hidden">
                  {selectedComp === 'button' && (
                    <button
                      style={{
                        backgroundColor: currentDefaults.button.backgroundColor,
                        color: currentDefaults.button.color,
                        borderRadius: `${currentDefaults.button.borderRadius}px`,
                        padding: `${currentDefaults.button.padding}px 24px`,
                        fontSize: `${currentDefaults.button.fontSize}px`,
                        fontWeight: currentDefaults.button.fontWeight
                      }}
                      className="shadow-md transition hover:scale-105 active:scale-95 cursor-default"
                    >
                      미리보기 버튼 (CTA)
                    </button>
                  )}

                  {selectedComp === 'text' && (
                    <div
                      style={{
                        color: currentDefaults.text.color,
                        fontSize: `${currentDefaults.text.fontSize}px`,
                        fontWeight: currentDefaults.text.fontWeight
                      }}
                      className="text-center"
                    >
                      샘플 타이포그래피 텍스트
                    </div>
                  )}

                  {selectedComp === 'card' && (
                    <div
                      style={{
                        backgroundColor: currentDefaults.card.backgroundColor,
                        borderColor: currentDefaults.card.borderColor,
                        borderWidth: `${currentDefaults.card.borderWidth}px`,
                        borderRadius: `${currentDefaults.card.borderRadius}px`,
                        padding: `${currentDefaults.card.padding}px`
                      }}
                      className="w-48 shadow-lg text-xs space-y-2"
                    >
                      <div className="font-bold text-white/90">카드 헤더</div>
                      <div className="text-[11px] text-white/60">설정한 기본 스타일이 적용된 컨테이너 카드입니다.</div>
                    </div>
                  )}

                  {selectedComp === 'input' && (
                    <div className="w-full max-w-[200px]">
                      <input
                        type="text"
                        readOnly
                        placeholder="기본 입력창 프리뷰..."
                        style={{
                          backgroundColor: currentDefaults.input.backgroundColor,
                          color: currentDefaults.input.color,
                          borderColor: currentDefaults.input.borderColor,
                          borderWidth: `${currentDefaults.input.borderWidth}px`,
                          borderRadius: `${currentDefaults.input.borderRadius}px`,
                          padding: `${currentDefaults.input.padding}px`
                        }}
                        className="w-full text-xs shadow-xs focus:outline-none"
                      />
                    </div>
                  )}

                  {selectedComp === 'box' && (
                    <div
                      style={{
                        backgroundColor: currentDefaults.box.backgroundColor,
                        borderRadius: `${currentDefaults.box.borderRadius}px`,
                        width: `${currentDefaults.box.width}px`,
                        height: `${currentDefaults.box.height}px`
                      }}
                      className="shadow-md flex items-center justify-center text-white/70 text-[11px] font-mono"
                    >
                      {currentDefaults.box.width} × {currentDefaults.box.height}
                    </div>
                  )}

                  {selectedComp === 'circle' && (
                    <div
                      style={{
                        backgroundColor: currentDefaults.circle.backgroundColor,
                        color: currentDefaults.circle.color,
                        width: `${currentDefaults.circle.size}px`,
                        height: `${currentDefaults.circle.size}px`
                      }}
                      className="rounded-full shadow-md flex items-center justify-center text-xs font-bold"
                    >
                      ★
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-indigo-600 block mb-0.5">ℹ️ 안내:</span>
                  새로 추가되는 모든 요소에 이 기본 설정이 즉시 반영되며, 개별 화면에 추가된 후에도 우측 패널에서 언제든 자유롭게 개별 수정할 수 있습니다.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            실시간으로 프로젝트 설정에 자동 저장됩니다.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition active:scale-95"
          >
            적용 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
