import React, { useState } from 'react';
import { TweakDefinition } from '../types';
import { Plus, Trash2, Settings2, Sparkles } from 'lucide-react';

interface DynamicTweaksPanelProps {
  schema: TweakDefinition[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onAddTweak: (def: TweakDefinition) => void;
  onRemoveTweak: (id: string) => void;
}

export const DynamicTweaksPanel: React.FC<DynamicTweaksPanelProps> = ({
  schema,
  values,
  onChange,
  onAddTweak,
  onRemoveTweak
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newId, setNewId] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newControl, setNewControl] = useState<'boolean' | 'buttons' | 'select' | 'slider'>('buttons');
  const [newOptions, setNewOptions] = useState('옵션 1, 옵션 2');

  const handleCreateTweak = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newId.trim() || !newLabel.trim()) return;

    const opts = newOptions.split(',').map((s) => s.trim()).filter(Boolean);
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

  return (
    <div className="p-4 space-y-5 text-xs text-slate-700 select-none">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-100">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
          <Settings2 size={13} className="text-indigo-600" />
          <span>컴포넌트 상태 & Props (Tweaks)</span>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 px-2 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold transition active:scale-95 text-[11px]"
        >
          <Plus size={11} />
          <span>변수 추가</span>
        </button>
      </div>

      {/* Add New Tweak Form Inline */}
      {showAddForm && (
        <form onSubmit={handleCreateTweak} className="p-3 bg-slate-50 rounded-xl border border-indigo-200/80 space-y-2.5 shadow-xs">
          <div className="font-bold text-indigo-700 text-[11px] flex items-center gap-1">
            <Sparkles size={12} />
            <span>새 Props / State 변수 정의</span>
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">변수 키 (ID / Prop name)</label>
            <input
              type="text"
              placeholder="e.g. theme, isModalOpen, count"
              value={newId}
              onChange={(e) => setNewId(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">표시 라벨 (Display Label)</label>
            <input
              type="text"
              placeholder="e.g. 다크 테마, 결제창 열림"
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              required
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500 block mb-0.5">컨트롤 유형</label>
            <select
              value={newControl}
              onChange={(e) => setNewControl(e.target.value as any)}
              className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="buttons">세그먼트 버튼 (Buttons)</option>
              <option value="boolean">토글 스위치 (Boolean)</option>
              <option value="select">드롭다운 (Select)</option>
              <option value="slider">슬라이더 (Slider)</option>
            </select>
          </div>
          {(newControl === 'buttons' || newControl === 'select') && (
            <div>
              <label className="text-[10px] text-slate-500 block mb-0.5">옵션 목록 (쉼표로 구분)</label>
              <input
                type="text"
                placeholder="light, dark, system"
                value={newOptions}
                onChange={(e) => setNewOptions(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          )}
          <div className="flex justify-end gap-1.5 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-2.5 py-1 rounded bg-slate-200 hover:bg-slate-300 text-slate-600 text-[11px]"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-[11px]"
            >
              추가 완료
            </button>
          </div>
        </form>
      )}

      {/* Render Schema-based Tweak Controls */}
      {schema.length === 0 ? (
        <div className="p-6 text-center text-slate-400 border border-dashed border-slate-200 rounded-xl">
          <p className="text-xs">정의된 Tweak 변수가 없습니다.</p>
          <p className="text-[11px] text-slate-400 mt-1">상단의 '+ 변수 추가' 버튼으로 컴포넌트의 Props/State 컨트롤러를 만들어보세요.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {schema.map((item) => {
            const currentVal = values[item.id] !== undefined ? values[item.id] : item.defaultValue;

            return (
              <div key={item.id} className="space-y-1.5 group">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-600 tracking-wide">
                    {item.label} <span className="text-slate-400 font-normal lowercase font-mono">({item.id})</span>
                  </label>
                  <button
                    onClick={() => onRemoveTweak(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-0.5 hover:text-rose-600 text-slate-400 transition"
                    title="이 Tweak 제거"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>

                {/* 1. Buttons Control (Segmented) */}
                {item.control === 'buttons' && item.options && (
                  <div
                    className="grid p-0.5 bg-slate-100 rounded-lg border border-slate-200/80 gap-0.5"
                    style={{ gridTemplateColumns: `repeat(${item.options.length}, minmax(0, 1fr))` }}
                  >
                    {item.options.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => onChange(item.id, opt)}
                        className={`py-1.5 px-1.5 rounded-md text-center text-[11px] transition font-medium truncate ${
                          currentVal === opt
                            ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                            : 'text-slate-500 hover:text-slate-800'
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
                    <span className="text-[11px] text-slate-600 font-medium">
                      {currentVal ? '활성화 (TRUE)' : '비활성화 (FALSE)'}
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
                    className="w-full bg-white border border-slate-200 rounded-md py-1.5 px-2.5 text-xs text-slate-800 shadow-2xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
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
                  <div className="space-y-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">수치</span>
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
