import React, { useState } from 'react';
import { TweakDefinition } from '../types';
import { VDomArtboard, VNode, ChangeTweakAction } from '../types/vdom';
import { Plus, Trash2, Settings2, Sparkles, RotateCcw, Eye, Zap } from 'lucide-react';

interface DynamicTweaksPanelProps {
  artboard?: VDomArtboard | null;
  schema: TweakDefinition[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onAddTweak: (def: TweakDefinition) => void;
  onRemoveTweak: (id: string) => void;
  onSelectNode?: (node: VNode) => void;
}

function findNodesUsingTweak(root: VNode | undefined, tweakId: string): VNode[] {
  if (!root) return [];
  const matches: VNode[] = [];
  const walk = (n: VNode) => {
    const usesInCondition =
      n.condition?.enabled && (n.condition.rules || []).some((r) => r.tweakId === tweakId);
    const usesInEvents = (n.events || []).some(
      (ev) => ev.action.type === 'change_tweak' && (ev.action as ChangeTweakAction).tweakId === tweakId
    );
    if (usesInCondition || usesInEvents) {
      matches.push(n);
    }
    if (n.children) {
      n.children.forEach(walk);
    }
  };
  walk(root);
  return matches;
}

const PRESET_TWEAKS: TweakDefinition[] = [
  {
    id: 'themeMode',
    label: '테마 모드 (Theme)',
    control: 'buttons',
    options: ['dark', 'light'],
    defaultValue: 'dark'
  },
  {
    id: 'isLoggedIn',
    label: '로그인 상태 (Auth)',
    control: 'boolean',
    options: ['true', 'false'],
    defaultValue: true
  },
  {
    id: 'planTier',
    label: '요금제 플랜 (Tier)',
    control: 'buttons',
    options: ['Free', 'Pro', 'Enterprise'],
    defaultValue: 'Pro'
  },
  {
    id: 'activeTab',
    label: '활성 탭 상태 (Tab)',
    control: 'select',
    options: ['overview', 'analytics', 'settings'],
    defaultValue: 'overview'
  }
];

export const DynamicTweaksPanel: React.FC<DynamicTweaksPanelProps> = ({
  artboard,
  schema,
  values,
  onChange,
  onAddTweak,
  onRemoveTweak,
  onSelectNode
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newId, setNewId] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newControl, setNewControl] = useState<'boolean' | 'buttons' | 'select' | 'slider'>('buttons');
  const [newOptions, setNewOptions] = useState('옵션 1, 옵션 2');

  const handleCreateTweak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newLabel.trim()) return;

    const opts = newOptions
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const def: TweakDefinition = {
      id: newId.trim(),
      label: newLabel.trim(),
      control: newControl,
      options: opts.length > 0 ? opts : ['Default'],
      defaultValue: newControl === 'boolean' ? false : opts[0] || ''
    };

    onAddTweak(def);
    setShowAddForm(false);
    setNewId('');
    setNewLabel('');
  };

  const handleAddPreset = (preset: TweakDefinition) => {
    if (schema.some((s) => s.id === preset.id)) return;
    onAddTweak(preset);
  };

  const handleResetAll = () => {
    schema.forEach((item) => {
      onChange(item.id, item.defaultValue);
    });
  };

  return (
    <div className="p-3.5 space-y-4 text-xs text-slate-700 select-none overflow-y-auto max-h-full min-w-0">
      {/* 1. Header with Add & Reset Buttons */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 truncate">
          <Settings2 size={14} className="text-indigo-600 shrink-0" />
          <span className="truncate">동적 트윅 변수 (Tweaks)</span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {schema.length > 0 && (
            <button
              type="button"
              onClick={handleResetAll}
              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
              title="모든 변수값을 초기 기본값으로 복원"
            >
              <RotateCcw size={12} />
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition active:scale-95 text-[10px] whitespace-nowrap"
          >
            <Plus size={11} />
            <span>변수 추가</span>
          </button>
        </div>
      </div>

      {/* 2. Quick Preset Tweaks Bar */}
      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
        <span className="text-[10px] font-bold text-slate-500 block">
          원클릭 추천 상태 변수 추가 (1-Click Presets)
        </span>
        <div className="grid grid-cols-2 gap-1">
          {PRESET_TWEAKS.map((preset) => {
            const exists = schema.some((s) => s.id === preset.id);
            return (
              <button
                key={preset.id}
                type="button"
                disabled={exists}
                onClick={() => handleAddPreset(preset)}
                className={`px-2 py-1 rounded-lg border text-left text-[10px] transition truncate whitespace-nowrap ${
                  exists
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border-slate-200 font-medium'
                }`}
                title={`${preset.label} (${preset.id})`}
              >
                {exists ? `✓ ${preset.label.split(' ')[0]}` : `+ ${preset.label.split(' (')[0]}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Add New Tweak Form Inline */}
      {showAddForm && (
        <form
          onSubmit={handleCreateTweak}
          className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-200 space-y-2.5 shadow-xs"
        >
          <div className="font-bold text-indigo-800 text-[11px] flex items-center gap-1">
            <Sparkles size={12} />
            <span>새 Props / State 변수 직접 정의</span>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">변수 키 (ID / 영문 식별자)</label>
            <input
              type="text"
              placeholder="예: theme, isModalOpen, userRole"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs font-mono focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">표시 라벨 (Display Label)</label>
            <input
              type="text"
              placeholder="예: 다크 테마, 결제 모달 표시"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">컨트롤 UI 유형</label>
            <select
              value={newControl}
              onChange={(e) => setNewControl(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="buttons">세그먼트 버튼 (Buttons)</option>
              <option value="boolean">토글 스위치 (Boolean)</option>
              <option value="select">드롭다운 (Select)</option>
              <option value="slider">수치 슬라이더 (Slider)</option>
            </select>
          </div>
          {(newControl === 'buttons' || newControl === 'select') && (
            <div>
              <label className="text-[10px] text-slate-500 block mb-0.5">선택 옵션 (쉼표로 구분)</label>
              <input
                type="text"
                placeholder="light, dark, system"
                value={newOptions}
                onChange={(e) => setNewOptions(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}
          <div className="flex justify-end gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-[11px]"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px]"
            >
              생성 완료
            </button>
          </div>
        </form>
      )}

      {/* 4. Render Schema-based Tweak Controls */}
      {schema.length === 0 ? (
        <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl space-y-1.5">
          <p className="text-xs font-semibold text-slate-600">정의된 Tweak 변수가 없습니다</p>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            위의 원클릭 프리셋을 누르거나 '+ 변수 추가'로 화면 상태를 제어할 변수를 추가하세요.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {schema.map((item) => {
            const currentVal = values[item.id] !== undefined ? values[item.id] : item.defaultValue;
            const boundNodes = findNodesUsingTweak(artboard?.rootNode, item.id);

            return (
              <div
                key={item.id}
                className="p-3 bg-white border border-slate-200 rounded-xl space-y-2 shadow-2xs group"
              >
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <div className="truncate min-w-0">
                    <span className="text-[11px] font-bold text-slate-800 truncate">{item.label}</span>
                    <span className="text-[10px] text-indigo-600 font-mono ml-1.5">${item.id}</span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[9px]">
                      {boundNodes.length}개 연결
                    </span>
                    <button
                      onClick={() => onRemoveTweak(item.id)}
                      className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-400 transition"
                      title="이 Tweak 변수 삭제"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {/* 1. Buttons Control (Segmented) */}
                {item.control === 'buttons' && item.options && (
                  <div
                    className="grid p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 gap-0.5"
                    style={{ gridTemplateColumns: `repeat(${Math.min(4, item.options.length)}, minmax(0, 1fr))` }}
                  >
                    {item.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => onChange(item.id, opt)}
                        className={`py-1.5 px-1.5 rounded-md text-center text-[11px] transition font-medium truncate whitespace-nowrap ${
                          String(currentVal) === String(opt)
                            ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                        title={opt}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}

                {/* 2. Boolean Control (Toggle Switch) */}
                {item.control === 'boolean' && (
                  <div className="flex items-center justify-between bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <span className="text-[11px] text-slate-700 font-semibold">
                      {currentVal ? '● 활성화됨 (TRUE)' : '○ 비활성화 (FALSE)'}
                    </span>
                    <button
                      onClick={() => onChange(item.id, !currentVal)}
                      className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                        currentVal ? 'bg-indigo-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white shadow-xs transform transition-transform ${
                          currentVal ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                )}

                {/* 3. Select Control (Dropdown) */}
                {item.control === 'select' && item.options && (
                  <select
                    value={currentVal}
                    onChange={(e) => onChange(item.id, e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    {item.options.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                )}

                {/* 4. Slider Control */}
                {item.control === 'slider' && (
                  <div className="space-y-1 bg-slate-50 p-2 rounded-lg border border-slate-200">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">현재 값</span>
                      <span className="font-mono text-indigo-600 font-bold">{currentVal}</span>
                    </div>
                    <input
                      type="range"
                      min={item.min ?? 0}
                      max={item.max ?? 100}
                      step={item.step ?? 1}
                      value={currentVal}
                      onChange={(e) => onChange(item.id, Number(e.target.value))}
                      className="w-full accent-indigo-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
                    />
                  </div>
                )}

                {/* Bound Nodes Chips */}
                {boundNodes.length > 0 && (
                  <div className="pt-1 border-t border-slate-100 flex flex-wrap items-center gap-1">
                    <span className="text-[9px] text-slate-400 mr-0.5">연결된 요소:</span>
                    {boundNodes.map((bn) => (
                      <button
                        key={bn.id}
                        type="button"
                        onClick={() => onSelectNode?.(bn)}
                        className="px-1.5 py-0.5 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[9px] font-medium truncate max-w-[120px] transition"
                        title={`${bn.name} (#${bn.id}) 선택`}
                      >
                        {bn.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Live Tweak State JSON Snapshot */}
      {schema.length > 0 && (
        <div className="p-2.5 bg-slate-900 text-slate-200 rounded-xl font-mono text-[10px] space-y-1">
          <div className="text-[9px] text-slate-400 font-sans font-semibold flex items-center justify-between">
            <span>실시간 Tweaks 상태 (tweakValues)</span>
            <span className="text-emerald-400">● Live</span>
          </div>
          <pre className="overflow-x-auto text-[10px] text-indigo-200 leading-relaxed">
            {JSON.stringify(values, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
