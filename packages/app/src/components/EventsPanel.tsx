import React, { useState } from 'react';
import {
  Zap,
  Play,
  MousePointer,
  Plus,
  Trash2,
  Sliders,
  RotateCw,
  ArrowRight,
  CheckCircle2,
  GitBranch
} from 'lucide-react';
import {
  VDomArtboard,
  VNode,
  NodeEventBinding,
  EventTrigger,
  EventActionType,
  ChangeTweakAction,
  NavigateAction
} from '../types/vdom';

interface EventsPanelProps {
  artboard: VDomArtboard | null;
  selectedNode: VNode | null;
  allArtboards: VDomArtboard[];
  onUpdateNode: (nodeId: string, updates: Partial<VNode>) => void;
  onUpdateTweakValue?: (tweakId: string, value: any) => void;
  onSelectArtboard?: (artboardId: string) => void;
  onSelectNode?: (node: VNode) => void;
}

function collectNodesWithEvents(root: VNode): VNode[] {
  const result: VNode[] = [];
  const walk = (n: VNode) => {
    if (n.events && n.events.length > 0) {
      result.push(n);
    }
    if (n.children) {
      n.children.forEach(walk);
    }
  };
  walk(root);
  return result;
}

export const EventsPanel: React.FC<EventsPanelProps> = ({
  artboard,
  selectedNode,
  allArtboards,
  onUpdateNode,
  onUpdateTweakValue,
  onSelectArtboard,
  onSelectNode
}) => {
  const [testFeedback, setTestFeedback] = useState<string | null>(null);

  if (!artboard) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        선택된 아트보드가 없습니다.
      </div>
    );
  }

  const tweaksSchema = artboard.tweaksSchema || [];
  const tweakValues = artboard.tweakValues || {};
  const nodesWithEvents = collectNodesWithEvents(artboard.rootNode);

  // Test Event Execution right in the editor
  const handleTestEvent = (binding: NodeEventBinding) => {
    if (binding.action.type === 'change_tweak') {
      const action = binding.action as ChangeTweakAction;
      const twk = tweaksSchema.find((t) => t.id === action.tweakId);
      const currentVal = tweakValues[action.tweakId];
      let nextVal = currentVal;

      if (action.operation === 'toggle') {
        nextVal = !currentVal;
      } else if (action.operation === 'cycle' && twk?.options && twk.options.length > 0) {
        const idx = twk.options.indexOf(String(currentVal));
        const nextIdx = (idx + 1) % twk.options.length;
        nextVal = twk.options[nextIdx];
      } else {
        nextVal = action.value;
      }

      onUpdateTweakValue?.(action.tweakId, nextVal);
      setTestFeedback(`[테스트 완료] Tweak '${action.tweakId}' → '${String(nextVal)}'`);
      setTimeout(() => setTestFeedback(null), 3000);
    } else if (binding.action.type === 'navigate') {
      const action = binding.action as NavigateAction;
      const target = allArtboards.find((a) => a.id === action.targetArtboardId);
      onSelectArtboard?.(action.targetArtboardId);
      setTestFeedback(`[테스트 완료] '${target ? target.title : action.targetArtboardId}' 장표로 이동`);
      setTimeout(() => setTestFeedback(null), 3000);
    }
  };

  const renderArtboardEventOverview = () => (
    <div className="bg-slate-50/90 border border-slate-200 rounded-xl p-3 space-y-2 shadow-2xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 truncate">
          <GitBranch size={13} className="text-amber-500 shrink-0" />
          <span className="truncate">장표 내 연결된 이벤트 플로우</span>
        </div>
        <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[10px] font-bold shrink-0">
          {nodesWithEvents.length}개 요소
        </span>
      </div>

      {nodesWithEvents.length === 0 ? (
        <p className="text-[10px] text-slate-400 leading-relaxed">
          이 장표에 등록된 이벤트가 없습니다. 버튼이나 카드를 선택하여 화면 이동 또는 Tweak 상태 변경을 연결하세요.
        </p>
      ) : (
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-0.5">
          {nodesWithEvents.map((n) => (
            <div
              key={n.id}
              onClick={() => onSelectNode?.(n)}
              className={`p-2 rounded-lg border text-left transition cursor-pointer flex items-center justify-between gap-2 ${
                selectedNode?.id === n.id
                  ? 'bg-amber-50 border-amber-300 text-amber-900 font-bold'
                  : 'bg-white border-slate-200 hover:border-amber-300 text-slate-700'
              }`}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="px-1 py-0.2 rounded bg-slate-100 text-slate-600 font-mono text-[9px] uppercase shrink-0">
                    {n.type}
                  </span>
                  <span className="text-[11px] font-semibold truncate">{n.name}</span>
                </div>
                <div className="text-[10px] text-slate-400 truncate mt-0.5 font-mono">
                  {(n.events || [])
                    .map((ev) =>
                      ev.action.type === 'navigate'
                        ? `${ev.trigger} → 장표 이동`
                        : `${ev.trigger} → Tweak(${(ev.action as ChangeTweakAction).tweakId})`
                    )
                    .join(' · ')}
                </div>
              </div>
              <span className="text-[10px] font-bold text-amber-600 shrink-0 whitespace-nowrap">
                편집 →
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (!selectedNode) {
    return (
      <div className="p-3.5 space-y-4 text-xs text-slate-700 select-none">
        {renderArtboardEventOverview()}

        <div className="p-6 text-center text-slate-400 text-xs space-y-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
          <Zap size={22} className="mx-auto text-slate-300" />
          <p className="font-semibold text-slate-600">개별 요소가 선택되지 않았습니다</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            위 플로우 목록에서 요소를 클릭하거나 캔버스에서 요소를 선택하여 이벤트를 추가하세요.
          </p>
        </div>
      </div>
    );
  }

  const events: NodeEventBinding[] = selectedNode.events || [];

  const handleAddEvent = (presetTrigger?: EventTrigger, presetAction?: 'change_tweak' | 'navigate') => {
    const trigger: EventTrigger = presetTrigger || 'click';
    const actionType: EventActionType = presetAction || (tweaksSchema.length > 0 ? 'change_tweak' : 'navigate');

    let newEvent: NodeEventBinding;

    if (actionType === 'change_tweak' && tweaksSchema.length > 0) {
      const firstTweak = tweaksSchema[0];
      newEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        trigger,
        action: {
          type: 'change_tweak',
          tweakId: firstTweak.id,
          operation: firstTweak.control === 'boolean' ? 'toggle' : firstTweak.options ? 'cycle' : 'set',
          value: firstTweak.options && firstTweak.options.length > 0 ? firstTweak.options[0] : firstTweak.defaultValue
        }
      };
    } else {
      const otherArtboards = allArtboards.filter((a) => a.id !== artboard.id);
      const targetId = otherArtboards.length > 0 ? otherArtboards[0].id : artboard.id;
      newEvent = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        trigger,
        action: {
          type: 'navigate',
          targetArtboardId: targetId
        }
      };
    }

    onUpdateNode(selectedNode.id, {
      events: [...events, newEvent]
    });
  };

  const handleUpdateEvent = (eventId: string, updates: Partial<NodeEventBinding>) => {
    const nextEvents = events.map((ev) => (ev.id === eventId ? { ...ev, ...updates } : ev));
    onUpdateNode(selectedNode.id, { events: nextEvents });
  };

  const handleDeleteEvent = (eventId: string) => {
    const nextEvents = events.filter((ev) => ev.id !== eventId);
    onUpdateNode(selectedNode.id, { events: nextEvents });
  };

  return (
    <div className="p-3.5 space-y-4 text-xs text-slate-700 select-none overflow-y-auto max-h-full min-w-0">
      {/* 1. Header & Target Info */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs truncate">
            <Zap size={14} className="text-amber-500 fill-amber-500 shrink-0" />
            <span className="truncate">프로토타입 이벤트 & 플로우</span>
          </div>
          <span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-200 rounded-full font-bold text-[10px] whitespace-nowrap shrink-0">
            {events.length}개 바인딩
          </span>
        </div>

        {/* Selected Node Summary */}
        <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2 min-w-0">
          <div className="flex items-center gap-2 truncate min-w-0">
            <span className="px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-bold text-[10px] uppercase shrink-0">
              {selectedNode.type}
            </span>
            <span className="font-bold text-slate-800 truncate">{selectedNode.name}</span>
          </div>
          <span className="text-[10px] text-slate-400 font-mono shrink-0 truncate max-w-[90px]">
            #{selectedNode.id}
          </span>
        </div>

        {/* Test Execution Feedback */}
        {testFeedback && (
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] flex items-center gap-1.5 font-semibold animate-in fade-in">
            <CheckCircle2 size={13} className="text-emerald-600 shrink-0" />
            <span className="truncate">{testFeedback}</span>
          </div>
        )}
      </div>

      {/* 2. Configured Events List */}
      <div className="space-y-3">
        {events.length === 0 ? (
          <div className="p-5 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-1.5">
            <MousePointer size={20} className="mx-auto text-slate-300" />
            <p className="font-semibold text-slate-600 text-xs">이 요소에 연결된 이벤트가 없습니다</p>
            <p className="text-[10px] text-slate-400">
              아래 빠른 추가 버튼으로 클릭·더블클릭·호버 시 실행될 동작을 연결하세요.
            </p>
          </div>
        ) : (
          events.map((evt, idx) => {
            const isTweakAction = evt.action.type === 'change_tweak';
            const tweakAction = evt.action as ChangeTweakAction;
            const navAction = evt.action as NavigateAction;
            const currentTweak = tweaksSchema.find((t) => t.id === tweakAction.tweakId);
            const currentTweakVal = tweakValues[tweakAction.tweakId];

            return (
              <div
                key={evt.id}
                className="bg-white border border-slate-200 rounded-xl p-3 space-y-2.5 shadow-2xs text-xs"
              >
                {/* Event Card Header: Trigger Selector + Delete */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 gap-1.5">
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">트리거</span>
                  </div>

                  <div className="flex items-center gap-1 min-w-0">
                    <select
                      value={evt.trigger}
                      onChange={(e) =>
                        handleUpdateEvent(evt.id, { trigger: e.target.value as EventTrigger })
                      }
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-[11px] font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500 truncate"
                    >
                      <option value="click">🖱️ 클릭 시 (On Click)</option>
                      <option value="dblclick">⚡ 더블클릭 (On Double Click)</option>
                      <option value="mouseenter">✨ 마우스 호버 (On Hover)</option>
                      <option value="contextmenu">🖱️ 우클릭 (On Right Click)</option>
                    </select>

                    <button
                      onClick={() => handleDeleteEvent(evt.id)}
                      className="p-1 hover:bg-rose-50 hover:text-rose-600 rounded text-slate-400 transition shrink-0"
                      title="이벤트 삭제"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                {/* Action Type Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase">실행 동작 (Action)</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        const otherArtboards = allArtboards.filter((a) => a.id !== artboard.id);
                        handleUpdateEvent(evt.id, {
                          action: {
                            type: 'navigate',
                            targetArtboardId: otherArtboards.length > 0 ? otherArtboards[0].id : artboard.id
                          }
                        });
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border transition whitespace-nowrap truncate ${
                        !isTweakAction
                          ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <ArrowRight size={11} className="shrink-0" />
                      <span className="truncate">다른 장표로 이동</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const firstTweak = tweaksSchema[0];
                        handleUpdateEvent(evt.id, {
                          action: {
                            type: 'change_tweak',
                            tweakId: firstTweak?.id || '',
                            operation: 'set',
                            value: firstTweak?.defaultValue
                          }
                        });
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1 border transition whitespace-nowrap truncate ${
                        isTweakAction
                          ? 'bg-amber-500 text-white border-amber-500 shadow-2xs'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Sliders size={11} className="shrink-0" />
                      <span className="truncate">Tweaks 상태 변경</span>
                    </button>
                  </div>
                </div>

                {/* ACTION DETAILS 1: Change Tweak */}
                {isTweakAction && (
                  <div className="space-y-2 pt-1">
                    {tweaksSchema.length === 0 ? (
                      <div className="p-2 text-center text-slate-400 text-[10px] bg-slate-50 rounded border border-dashed border-slate-200">
                        현재 아트보드에 등록된 Tweak이 없습니다. 우측 '트윅' 탭에서 변수를 추가하세요.
                      </div>
                    ) : (
                      <>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-semibold block">대상 Tweak 변수</label>
                          <select
                            value={tweakAction.tweakId}
                            onChange={(e) => {
                              const twk = tweaksSchema.find((t) => t.id === e.target.value);
                              handleUpdateEvent(evt.id, {
                                action: {
                                  ...tweakAction,
                                  tweakId: e.target.value,
                                  operation: twk?.control === 'boolean' ? 'toggle' : 'set',
                                  value: twk?.defaultValue
                                }
                              });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            {tweaksSchema.map((t) => (
                              <option key={t.id} value={t.id}>
                                {t.label} ({t.id})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-semibold block">변경 연산</label>
                          <select
                            value={tweakAction.operation}
                            onChange={(e) => {
                              handleUpdateEvent(evt.id, {
                                action: {
                                  ...tweakAction,
                                  operation: e.target.value as any
                                }
                              });
                            }}
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                          >
                            <option value="set">지정한 값으로 변경 (Set)</option>
                            {currentTweak?.control === 'boolean' && (
                              <option value="toggle">토글 반전 (True ↔ False)</option>
                            )}
                            {currentTweak?.options && currentTweak.options.length > 0 && (
                              <option value="cycle">다음 옵션으로 순환 (Cycle)</option>
                            )}
                          </select>
                        </div>

                        {tweakAction.operation === 'set' && (
                          <div className="space-y-1">
                            <label className="text-[10px] text-slate-400 font-semibold block">목표 값</label>
                            {currentTweak?.control === 'boolean' ? (
                              <div className="grid grid-cols-2 gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateEvent(evt.id, {
                                      action: { ...tweakAction, value: true }
                                    })
                                  }
                                  className={`py-1 rounded text-[10px] font-bold border transition ${
                                    tweakAction.value === true
                                      ? 'bg-amber-500 text-white border-amber-500'
                                      : 'bg-slate-50 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  참 (True)
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleUpdateEvent(evt.id, {
                                      action: { ...tweakAction, value: false }
                                    })
                                  }
                                  className={`py-1 rounded text-[10px] font-bold border transition ${
                                    tweakAction.value === false
                                      ? 'bg-amber-500 text-white border-amber-500'
                                      : 'bg-slate-50 text-slate-600 border-slate-200'
                                  }`}
                                >
                                  거짓 (False)
                                </button>
                              </div>
                            ) : currentTweak?.options && currentTweak.options.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {currentTweak.options.map((opt) => (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() =>
                                      handleUpdateEvent(evt.id, {
                                        action: { ...tweakAction, value: opt }
                                      })
                                    }
                                    className={`px-2 py-1 rounded text-[10px] font-medium border transition ${
                                      String(tweakAction.value) === String(opt)
                                        ? 'bg-amber-500 text-white border-amber-500 font-bold'
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                                    }`}
                                  >
                                    {opt}
                                  </button>
                                ))}
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={tweakAction.value ?? ''}
                                onChange={(e) =>
                                  handleUpdateEvent(evt.id, {
                                    action: { ...tweakAction, value: e.target.value }
                                  })
                                }
                                placeholder="설정할 값 입력..."
                                className="w-full bg-slate-50 border border-slate-200 rounded px-2.5 py-1 text-xs"
                              />
                            )}
                          </div>
                        )}

                        <div className="text-[10px] text-slate-400 bg-slate-50 px-2 py-1 rounded flex items-center justify-between">
                          <span>현재 활성 값:</span>
                          <span className="font-mono font-bold text-slate-700">
                            {String(currentTweakVal ?? 'undefined')}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* ACTION DETAILS 2: Navigate to Screen */}
                {!isTweakAction && (
                  <div className="space-y-1.5 pt-1">
                    <label className="text-[10px] text-slate-400 font-semibold block">이동할 대상 장표</label>
                    <select
                      value={navAction.targetArtboardId}
                      onChange={(e) =>
                        handleUpdateEvent(evt.id, {
                          action: {
                            ...navAction,
                            targetArtboardId: e.target.value
                          }
                        })
                      }
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-[11px] font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {allArtboards.map((ab, i) => (
                        <option key={ab.id} value={ab.id}>
                          {i + 1}. {ab.title} ({ab.width}×{ab.height})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Event Test Trigger Button */}
                <div className="pt-1 border-t border-slate-100 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={() => handleTestEvent(evt)}
                    className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-[10px] transition flex items-center gap-1 shadow-2xs"
                    title="에디터에서 이벤트 동작 즉시 테스트"
                  >
                    <Play size={10} className="fill-amber-700" />
                    <span>즉시 실행 테스트</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Add Event Actions */}
      <div className="space-y-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => handleAddEvent()}
          className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs transition active:scale-98 whitespace-nowrap"
        >
          <Plus size={14} />
          <span>새 인터랙션 이벤트 추가</span>
        </button>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => handleAddEvent('click', 'navigate')}
            className="py-1.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition flex items-center justify-center gap-1 whitespace-nowrap truncate"
          >
            <ArrowRight size={11} className="text-indigo-600 shrink-0" />
            <span className="truncate">클릭 → 장표 이동</span>
          </button>
          <button
            onClick={() => handleAddEvent('click', 'change_tweak')}
            disabled={tweaksSchema.length === 0}
            className="py-1.5 px-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-[10px] font-medium transition flex items-center justify-center gap-1 disabled:opacity-40 whitespace-nowrap truncate"
          >
            <RotateCw size={11} className="text-amber-500 shrink-0" />
            <span className="truncate">클릭 → Tweak 변경</span>
          </button>
        </div>
      </div>

      {/* 4. Artboard-wide Event Flow Summary */}
      <div className="pt-2 border-t border-slate-100">
        {renderArtboardEventOverview()}
      </div>
    </div>
  );
};
