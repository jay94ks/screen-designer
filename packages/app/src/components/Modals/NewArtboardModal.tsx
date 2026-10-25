import React, { useState, useEffect } from 'react';
import {
  X,
  Sliders,
  LayoutTemplate,
  Plus,
  RotateCw,
  Check,
  Layers,
  AppWindow,
  PanelRight,
  MessageSquare,
  Component,
  Eye
} from 'lucide-react';
import { Artboard, ViewportType } from '../../types';
import {
  ArtboardResolutionRule,
  CanvasRole,
  ResolutionRulePreset
} from '../../types/vdom';
import {
  CANVAS_ROLE_OPTIONS,
  RESOLUTION_RULE_PRESETS,
  buildResolutionRuleFromPreset,
  getCanvasRoleMeta
} from '../../utils/canvasRolesAndResolution';
import { MIN_ARTBOARD_WIDTH, MIN_ARTBOARD_HEIGHT } from '../PropertiesPanel';

export type FrameStarterTemplate = 'role-default' | 'blank' | 'login' | 'dashboard';

interface NewArtboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddArtboard: (artboard: Artboard, template?: FrameStarterTemplate) => void;
  nextIndex: number;
}

export const NewArtboardModal: React.FC<NewArtboardModalProps> = ({
  isOpen,
  onClose,
  onAddArtboard,
  nextIndex
}) => {
  const [roleCategory, setRoleCategory] = useState<'all' | 'screen' | 'overlay' | 'component'>('all');
  const [selectedRole, setSelectedRole] = useState<CanvasRole>('main-page');
  const [title, setTitle] = useState(`${nextIndex}. 메인 페이지`);
  const [customW, setCustomW] = useState<number>(1440);
  const [customH, setCustomH] = useState<number>(900);
  const [template, setTemplate] = useState<FrameStarterTemplate>('role-default');
  const [resolutionRule, setResolutionRule] = useState<ArtboardResolutionRule>({
    enabled: false,
    preset: 'all',
    orientation: 'any'
  });

  useEffect(() => {
    if (isOpen) {
      const roleMeta = getCanvasRoleMeta(selectedRole);
      setTitle(`${nextIndex}. ${roleMeta.shortLabel}`);
    }
  }, [isOpen, nextIndex]);

  if (!isOpen) return null;

  const inferViewport = (w: number): ViewportType => {
    if (w < 600) return 'mobile';
    if (w < 1100) return 'tablet';
    return 'desktop';
  };

  const handleSelectRole = (roleId: CanvasRole) => {
    const meta = getCanvasRoleMeta(roleId);
    setSelectedRole(roleId);
    setCustomW(meta.defaultWidth);
    setCustomH(meta.defaultHeight);
    if (/^\d+\.\s/.test(title)) {
      setTitle(`${nextIndex}. ${meta.shortLabel}`);
    }
  };

  const handleCreateArtboard = (overrideW?: number, overrideH?: number, overrideRole?: CanvasRole) => {
    const finalRole = overrideRole || selectedRole;
    const rawW = overrideW ?? customW;
    const rawH = overrideH ?? customH;
    const safeW = Math.max(MIN_ARTBOARD_WIDTH, Math.min(7680, Math.round(rawW || MIN_ARTBOARD_WIDTH)));
    const safeH = Math.max(MIN_ARTBOARD_HEIGHT, Math.min(7680, Math.round(rawH || MIN_ARTBOARD_HEIGHT)));
    const vp = inferViewport(safeW);

    const newArtboard: Artboard = {
      id: `screen-${Date.now()}`,
      title: title.trim() || `${nextIndex}. ${getCanvasRoleMeta(finalRole).shortLabel}`,
      viewport: vp,
      canvasRole: finalRole,
      resolutionRule,
      x: 0,
      y: 0,
      width: safeW,
      height: safeH,
      tweaksSchema: [],
      tweakValues: {},
      code: ''
    };

    onAddArtboard(newArtboard, template);
    onClose();
  };

  const activeRoleMeta = getCanvasRoleMeta(selectedRole);

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full p-5 space-y-3.5 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Plus size={15} />
            </div>
            <div>
              <div className="font-bold text-slate-800 text-sm">
                새 프레임 추가 — 캔버스 역할 & 구동 해상도 설정
              </div>
              <div className="text-[11px] text-slate-500">
                기기가 아닌 캔버스의 역할(페이지, 모달, 드로어, 섹션 등)을 기준으로 프레임을 설계하고 표시 해상도 조건을 지정하세요
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X size={16} />
          </button>
        </div>

        {/* 1. Canvas Role Selection Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Layers size={13} className="text-indigo-600" />
              <span>1. 캔버스 역할 선택 (Canvas Role)</span>
            </span>

            {/* Role Category Filter Tabs */}
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px]">
              {[
                { id: 'all', label: '전체 역할', icon: Layers },
                { id: 'screen', label: '화면 · 페이지', icon: AppWindow },
                { id: 'overlay', label: '모달 · 드로어 · 팝업', icon: PanelRight },
                { id: 'component', label: '부분 섹션 · 자유', icon: Component }
              ].map((cat) => {
                const Icon = cat.icon;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setRoleCategory(cat.id as any)}
                    className={`px-2.5 py-1 rounded-md flex items-center gap-1 transition whitespace-nowrap ${
                      roleCategory === cat.id
                        ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 font-medium'
                    }`}
                  >
                    <Icon size={11} />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Role Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {CANVAS_ROLE_OPTIONS.filter(
              (r) => roleCategory === 'all' || r.category === roleCategory
            ).map((role) => {
              const isSelected = selectedRole === role.id;
              return (
                <div
                  key={role.id}
                  onClick={() => handleSelectRole(role.id)}
                  onDoubleClick={() => handleCreateArtboard(role.defaultWidth, role.defaultHeight, role.id)}
                  className={`p-2.5 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between gap-1.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600 shadow-2xs'
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50/70'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-indigo-950' : 'text-slate-800'}`}>
                      {role.label}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold shrink-0 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {role.defaultWidth}×{role.defaultHeight}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-snug line-clamp-2">
                    {role.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Frame Title + Direct Custom Size Input Box */}
        <div className="p-3.5 bg-indigo-50/50 border border-indigo-200/80 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Sliders size={13} className="text-indigo-600" />
              <span>2. 프레임 명칭 및 설계 해상도 직접 입력 (최소 {MIN_ARTBOARD_WIDTH}×{MIN_ARTBOARD_HEIGHT}px)</span>
            </span>
            <div className="flex items-center gap-1.5">
              <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${activeRoleMeta.badgeClass}`}>
                역할: {activeRoleMeta.shortLabel}
              </span>
              <span className="text-[11px] font-mono font-bold text-indigo-700 bg-white px-2 py-0.5 rounded border border-indigo-200">
                {customW} × {customH} px
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[1.4fr_1fr_auto_1fr] gap-2 items-end">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-600 font-semibold block">장표 명칭 (Title)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 1. 메인 페이지"
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Custom Width */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-600 font-semibold block">가로 너비 (Width, px)</label>
              <input
                type="number"
                min={MIN_ARTBOARD_WIDTH}
                max={7680}
                value={customW}
                onChange={(e) => setCustomW(Number(e.target.value))}
                onBlur={() => {
                  if (customW < MIN_ARTBOARD_WIDTH) setCustomW(MIN_ARTBOARD_WIDTH);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Swap Orientation Button */}
            <button
              type="button"
              onClick={() => {
                const prevW = customW;
                setCustomW(customH);
                setCustomH(prevW);
              }}
              className="p-1.5 mb-0.5 rounded-lg bg-white hover:bg-indigo-100 border border-slate-200 text-slate-600 hover:text-indigo-700 transition"
              title="가로 ↔ 세로 크기 맞바꾸기 (회전)"
            >
              <RotateCw size={14} />
            </button>

            {/* Custom Height */}
            <div className="space-y-1">
              <label className="text-[10px] text-slate-600 font-semibold block">세로 높이 (Height, px)</label>
              <input
                type="number"
                min={MIN_ARTBOARD_HEIGHT}
                max={7680}
                value={customH}
                onChange={(e) => setCustomH(Number(e.target.value))}
                onBlur={() => {
                  if (customH < MIN_ARTBOARD_HEIGHT) setCustomH(MIN_ARTBOARD_HEIGHT);
                }}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Quick Aspect Ratio & Resolution Helpers */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[10px] text-slate-500 font-semibold mr-1">빠른 치수 지정:</span>
            {[
              { label: '1920×1080 (와이드)', w: 1920, h: 1080 },
              { label: '1600×1000 (워크스페이스)', w: 1600, h: 1000 },
              { label: '1440×900 (표준 페이지)', w: 1440, h: 900 },
              { label: '800×360 (부분 섹션)', w: 800, h: 360 },
              { label: '640×480 (모달 팝업)', w: 640, h: 480 },
              { label: '420×900 (드로어)', w: 420, h: 900 },
              { label: '390×844 (단일/소형 뷰)', w: 390, h: 844 }
            ].map((q) => (
              <button
                key={q.label}
                type="button"
                onClick={() => {
                  setCustomW(q.w);
                  setCustomH(q.h);
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

        {/* 3. Resolution Visibility Condition (특정 해상도에 해당하는 경우에만 표시 설정) */}
        <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <Eye size={13} className="text-emerald-600" />
              <span>3. 장표 표시 해상도 조건 (특정 해상도에서만 표시 여부)</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                resolutionRule.enabled && resolutionRule.preset !== 'all'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  : 'bg-slate-200/80 text-slate-600'
              }`}
            >
              {resolutionRule.enabled && resolutionRule.preset !== 'all'
                ? '특정 해상도 조건 활성'
                : '모든 해상도에서 표시'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
            {RESOLUTION_RULE_PRESETS.map((preset) => {
              const isActive =
                (!resolutionRule.enabled && preset.id === 'all') ||
                (resolutionRule.enabled && resolutionRule.preset === preset.id);
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() =>
                    setResolutionRule(buildResolutionRuleFromPreset(preset.id as ResolutionRulePreset, resolutionRule))
                  }
                  className={`py-1.5 px-2 rounded-lg border text-left transition ${
                    isActive
                      ? 'bg-emerald-600 text-white border-emerald-600 font-bold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[10px] font-bold truncate">{preset.shortBadge}</div>
                  <div className={`text-[9px] truncate ${isActive ? 'text-emerald-100' : 'text-slate-400'}`}>
                    {preset.label.split('(')[0]}
                  </div>
                </button>
              );
            })}
          </div>

          {resolutionRule.enabled && resolutionRule.preset !== 'all' && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
              <div>
                <label className="text-[9px] text-slate-500 font-semibold block mb-0.5">최소 가로 (minW, px)</label>
                <input
                  type="number"
                  placeholder="제한 없음"
                  value={resolutionRule.minWidth ?? ''}
                  onChange={(e) =>
                    setResolutionRule({
                      ...resolutionRule,
                      preset: 'custom',
                      minWidth: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 font-semibold block mb-0.5">최대 가로 (maxW, px)</label>
                <input
                  type="number"
                  placeholder="제한 없음"
                  value={resolutionRule.maxWidth ?? ''}
                  onChange={(e) =>
                    setResolutionRule({
                      ...resolutionRule,
                      preset: 'custom',
                      maxWidth: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 font-semibold block mb-0.5">최소 세로 (minH, px)</label>
                <input
                  type="number"
                  placeholder="제한 없음"
                  value={resolutionRule.minHeight ?? ''}
                  onChange={(e) =>
                    setResolutionRule({
                      ...resolutionRule,
                      preset: 'custom',
                      minHeight: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] font-mono text-slate-800"
                />
              </div>
              <div>
                <label className="text-[9px] text-slate-500 font-semibold block mb-0.5">최대 세로 (maxH, px)</label>
                <input
                  type="number"
                  placeholder="제한 없음"
                  value={resolutionRule.maxHeight ?? ''}
                  onChange={(e) =>
                    setResolutionRule({
                      ...resolutionRule,
                      preset: 'custom',
                      maxHeight: e.target.value ? Number(e.target.value) : undefined
                    })
                  }
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-[11px] font-mono text-slate-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* 4. Starter Structure Select */}
        <div className="space-y-1.5 text-xs">
          <label className="text-slate-700 font-bold flex items-center gap-1">
            <LayoutTemplate size={13} className="text-indigo-600" />
            <span>4. 초기 VDOM 레이아웃 구조</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'role-default', label: `역할 맞춤 구조 (${activeRoleMeta.shortLabel})` },
              { id: 'blank', label: '빈 캔버스 (Blank)' },
              { id: 'login', label: '로그인 / 인증 폼' },
              { id: 'dashboard', label: '지표 카드 대시보드' }
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplate(t.id as FrameStarterTemplate)}
                className={`py-2 px-2.5 rounded-xl border text-[11px] font-medium transition whitespace-nowrap truncate ${
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

        {/* Footer Primary Create Action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <span className="text-[11px] text-slate-400">
            생성 후 캔버스 상단이나 속성 탭에서 구동 해상도별 모습을 실시간으로 미리볼 수 있습니다.
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              취소
            </button>
            <button
              type="button"
              onClick={() => handleCreateArtboard()}
              className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5"
            >
              <Check size={14} />
              <span>
                [{activeRoleMeta.shortLabel}] {customW} × {customH} px 프레임 생성
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
