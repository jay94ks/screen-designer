import React from 'react';
import {
  Eye,
  EyeOff,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  Sliders,
  Sparkles,
  HelpCircle,
  ChevronRight
} from 'lucide-react';
import { VDomArtboard, VNode, VNodeCondition, TweakConditionRule, ConditionOperator } from '../types/vdom';
import { TweakDefinition } from '../types';
import { evaluateNodeVisibility } from '../utils/conditionEvaluator';

interface VisibilityConditionSectionProps {
  artboard: VDomArtboard;
  selectedNode: VNode;
  onUpdateNode: (nodeId: string, updates: Partial<VNode>) => void;
  onSwitchToTweaksTab?: () => void;
}

export const VisibilityConditionSection: React.FC<VisibilityConditionSectionProps> = ({
  artboard,
  selectedNode,
  onUpdateNode,
  onSwitchToTweaksTab
}) => {
  const tweaksSchema = artboard.tweaksSchema || [];
  const tweakValues = artboard.tweakValues || {};
  const condition: VNodeCondition = selectedNode.condition || {
    enabled: false,
    matchType: 'and',
    rules: []
  };

  // Live evaluation of current condition against active tweak values
  const evaluation = evaluateNodeVisibility(selectedNode, tweakValues);

  const handleToggleEnabled = (enabled: boolean) => {
    if (enabled && (!condition.rules || condition.rules.length === 0)) {
      // Create initial default rule using first available tweak
      const firstTweak = tweaksSchema[0];
      const initialRule: TweakConditionRule = firstTweak
        ? {
            id: `rule-${Date.now()}`,
            tweakId: firstTweak.id,
            operator: 'in',
            values: firstTweak.options && firstTweak.options.length > 0
              ? [firstTweak.options[0]]
              : firstTweak.control === 'boolean'
              ? [true]
              : [firstTweak.defaultValue]
          }
        : {
            id: `rule-${Date.now()}`,
            tweakId: '',
            operator: 'always',
            values: []
          };

      onUpdateNode(selectedNode.id, {
        condition: {
          enabled: true,
          matchType: 'and',
          rules: [initialRule]
        }
      });
      return;
    }

    onUpdateNode(selectedNode.id, {
      condition: {
        ...condition,
        enabled
      }
    });
  };

  const handleAddRule = () => {
    const firstTweak = tweaksSchema[0];
    const newRule: TweakConditionRule = {
      id: `rule-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
      tweakId: firstTweak ? firstTweak.id : '',
      operator: 'in',
      values: firstTweak?.options && firstTweak.options.length > 0
        ? [firstTweak.options[0]]
        : firstTweak?.control === 'boolean'
        ? [true]
        : []
    };

    onUpdateNode(selectedNode.id, {
      condition: {
        ...condition,
        enabled: true,
        rules: [...(condition.rules || []), newRule]
      }
    });
  };

  const handleUpdateRule = (ruleId: string, updates: Partial<TweakConditionRule>) => {
    const nextRules = (condition.rules || []).map((r) => {
      if (r.id !== ruleId) return r;
      const updated = { ...r, ...updates };

      // If tweakId changed, reset values to match new tweak type
      if (updates.tweakId && updates.tweakId !== r.tweakId) {
        const twk = tweaksSchema.find((t) => t.id === updates.tweakId);
        if (twk) {
          updated.values = twk.options && twk.options.length > 0
            ? [twk.options[0]]
            : twk.control === 'boolean'
            ? [true]
            : [twk.defaultValue];
        }
      }
      return updated;
    });

    onUpdateNode(selectedNode.id, {
      condition: {
        ...condition,
        rules: nextRules
      }
    });
  };

  const handleDeleteRule = (ruleId: string) => {
    const nextRules = (condition.rules || []).filter((r) => r.id !== ruleId);
    onUpdateNode(selectedNode.id, {
      condition: {
        ...condition,
        enabled: nextRules.length > 0 ? condition.enabled : false,
        rules: nextRules
      }
    });
  };

  // Toggle single value in rule.values (Multi-value support)
  const handleToggleValueInRule = (rule: TweakConditionRule, val: any) => {
    const currentValues = Array.isArray(rule.values) ? rule.values : [];
    const exists = currentValues.some((v) => String(v) === String(val));
    const nextValues = exists
      ? currentValues.filter((v) => String(v) !== String(val))
      : [...currentValues, val];

    handleUpdateRule(rule.id, { values: nextValues });
  };

  // Select all options for rule
  const handleSelectAllOptions = (rule: TweakConditionRule, options: string[]) => {
    handleUpdateRule(rule.id, { values: [...options] });
  };

  // Clear all options for rule
  const handleClearAllOptions = (rule: TweakConditionRule) => {
    handleUpdateRule(rule.id, { values: [] });
  };

  return (
    <div className="bg-slate-50/80 border border-indigo-100 rounded-xl p-3 space-y-3 shadow-2xs">
      {/* 1. Header with Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-900">
          <Eye size={13} className="text-indigo-600" />
          <span>표시 조건 설정 (Visibility Condition)</span>
        </div>

        {/* Enabled Switch */}
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={condition.enabled}
            onChange={(e) => handleToggleEnabled(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3.5 after:transition-all peer-checked:bg-indigo-600"></div>
        </label>
      </div>

      {/* 2. Live Evaluation Status Banner */}
      {condition.enabled && (
        <div
          className={`px-2.5 py-1.5 rounded-lg text-[10px] flex items-center justify-between font-medium border ${
            evaluation.isVisible
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          <div className="flex items-center gap-1.5 truncate">
            {evaluation.isVisible ? (
              <Check size={12} className="text-emerald-600 shrink-0" />
            ) : (
              <EyeOff size={12} className="text-amber-600 shrink-0" />
            )}
            <span className="font-bold">{evaluation.statusText}</span>
          </div>
          <span className="text-[9px] font-mono opacity-80 truncate ml-2">
            {evaluation.detailMessage}
          </span>
        </div>
      )}

      {/* 3. Empty Tweaks Notice */}
      {tweaksSchema.length === 0 ? (
        <div className="p-3 bg-white rounded-lg border border-dashed border-slate-200 text-center space-y-1.5">
          <Sliders size={18} className="mx-auto text-slate-400" />
          <p className="text-[11px] font-semibold text-slate-700">등록된 Tweaks 옵션이 없습니다</p>
          <p className="text-[10px] text-slate-400">
            상단 'Tweaks' 탭에서 컬러 모드, 로그인 상태 등 화면 제어 변수를 추가하세요.
          </p>
          {onSwitchToTweaksTab && (
            <button
              onClick={onSwitchToTweaksTab}
              className="mt-1 px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md font-bold text-[10px] transition"
            >
              Tweaks 탭으로 이동하기
            </button>
          )}
        </div>
      ) : !condition.enabled ? (
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Tweaks 옵션값에 따라 이 요소를 조건부로 표시하거나 숨길 수 있습니다. 우측 스위치를 켜서 조건을 설정하세요.
        </p>
      ) : (
        /* 4. Active Condition Rules Builder */
        <div className="space-y-3 pt-1">
          {/* Match Type (AND / OR) if multiple rules */}
          {(condition.rules || []).length > 1 && (
            <div className="flex items-center justify-between text-[10px] text-slate-500 bg-white p-1.5 rounded-lg border border-slate-200">
              <span className="font-semibold">다중 조건 결합 방식:</span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded">
                <button
                  onClick={() =>
                    onUpdateNode(selectedNode.id, {
                      condition: { ...condition, matchType: 'and' }
                    })
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                    (condition.matchType || 'and') === 'and'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  AND (모두 충족)
                </button>
                <button
                  onClick={() =>
                    onUpdateNode(selectedNode.id, {
                      condition: { ...condition, matchType: 'or' }
                    })
                  }
                  className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                    condition.matchType === 'or'
                      ? 'bg-white text-indigo-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  OR (하나라도 충족)
                </button>
              </div>
            </div>
          )}

          {/* Rules List */}
          <div className="space-y-2.5">
            {(condition.rules || []).map((rule, idx) => {
              const currentTweak = tweaksSchema.find((t) => t.id === rule.tweakId) || tweaksSchema[0];
              const ruleValues = Array.isArray(rule.values) ? rule.values : [];
              const actualValue = tweakValues[rule.tweakId];

              return (
                <div
                  key={rule.id}
                  className="bg-white border border-slate-200 rounded-xl p-2.5 space-y-2 shadow-2xs text-xs"
                >
                  {/* Rule Header: Tweak Selection + Operator + Delete */}
                  <div className="flex items-center gap-1.5 min-w-0">
                    {/* Tweak Target Dropdown */}
                    <select
                      value={rule.tweakId}
                      onChange={(e) => handleUpdateRule(rule.id, { tweakId: e.target.value })}
                      className="flex-1 min-w-0 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 truncate"
                    >
                      {tweaksSchema.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.label} ({t.id})
                        </option>
                      ))}
                    </select>

                    {/* Operator Dropdown */}
                    <select
                      value={rule.operator}
                      onChange={(e) =>
                        handleUpdateRule(rule.id, { operator: e.target.value as ConditionOperator })
                      }
                      className="w-24 shrink-0 bg-slate-50 border border-slate-200 rounded-lg px-1.5 py-1 text-[11px] text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="in">일치 (포함됨)</option>
                      <option value="not_in">불일치 (제외)</option>
                      <option value="equals">정확히 일치</option>
                      <option value="not_equals">정확히 불일치</option>
                      <option value="always">항상 표시</option>
                    </select>

                    {/* Delete Rule */}
                    <button
                      onClick={() => handleDeleteRule(rule.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                      title="조건 규칙 삭제"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>

                  {/* Multi-Value Selection for Select / Buttons Tweaks */}
                  {currentTweak && (currentTweak.options && currentTweak.options.length > 0) && (
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-500">
                        <span>표시할 옵션값 다중 선택 ({ruleValues.length}개 선택됨):</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSelectAllOptions(rule, currentTweak.options || [])}
                            className="text-[9px] text-indigo-600 hover:underline font-semibold"
                          >
                            전체 선택
                          </button>
                          <span>•</span>
                          <button
                            onClick={() => handleClearAllOptions(rule)}
                            className="text-[9px] text-slate-400 hover:underline"
                          >
                            해제
                          </button>
                        </div>
                      </div>

                      {/* Multi-select Option Chips */}
                      <div className="flex flex-wrap gap-1">
                        {currentTweak.options.map((opt) => {
                          const isChecked = ruleValues.some((v) => String(v) === String(opt));
                          const isCurrentActive = String(actualValue) === String(opt);

                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => handleToggleValueInRule(rule, opt)}
                              className={`px-2 py-1 rounded-md text-[10px] font-medium transition flex items-center gap-1 border ${
                                isChecked
                                  ? 'bg-indigo-600 text-white border-indigo-600 font-bold shadow-2xs'
                                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              <span>{opt}</span>
                              {isCurrentActive && (
                                <span className={`w-1.5 h-1.5 rounded-full ${isChecked ? 'bg-emerald-300' : 'bg-emerald-500'}`} title="현재 활성화된 Tweak 값" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      <div className="text-[9px] text-slate-400 pt-0.5">
                        {rule.operator === 'in'
                          ? '위에서 선택된 값 중 어느 하나라도 일치하면 화면에 표시됩니다.'
                          : '위에서 선택된 값들을 제외한 경우에만 화면에 표시됩니다.'}
                      </div>
                    </div>
                  )}

                  {/* Boolean Tweak Controls */}
                  {currentTweak && currentTweak.control === 'boolean' && (
                    <div className="space-y-1.5 pt-1">
                      <div className="text-[10px] text-slate-500">표시 조건 상태:</div>
                      <div className="grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleUpdateRule(rule.id, { values: [true] })}
                          className={`py-1 rounded-md text-[10px] font-bold border transition ${
                            ruleValues.includes(true)
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          참 (True / 켜짐)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateRule(rule.id, { values: [false] })}
                          className={`py-1 rounded-md text-[10px] font-bold border transition ${
                            ruleValues.includes(false)
                              ? 'bg-indigo-600 text-white border-indigo-600'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          거짓 (False / 꺼짐)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Text / Slider / Custom Value Inputs */}
                  {currentTweak && currentTweak.control !== 'boolean' && (!currentTweak.options || currentTweak.options.length === 0) && (
                    <div className="space-y-1 pt-1">
                      <label className="text-[10px] text-slate-500 block">
                        기준 값 (콤마로 구분하여 복수 값 입력 가능):
                      </label>
                      <input
                        type="text"
                        value={ruleValues.join(', ')}
                        placeholder="예: pro, vip, gold"
                        onChange={(e) => {
                          const raw = e.target.value;
                          const vals = raw
                            .split(',')
                            .map((s) => s.trim())
                            .filter((s) => s.length > 0);
                          handleUpdateRule(rule.id, { values: vals });
                        }}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Add Another Condition Rule Button */}
          <button
            onClick={handleAddRule}
            className="w-full py-1.5 bg-white hover:bg-indigo-50 border border-dashed border-indigo-300 text-indigo-700 rounded-lg font-bold text-[10px] flex items-center justify-center gap-1.5 transition"
          >
            <Plus size={12} />
            <span>추가 조건 규칙 추가 (AND/OR)</span>
          </button>
        </div>
      )}
    </div>
  );
};
