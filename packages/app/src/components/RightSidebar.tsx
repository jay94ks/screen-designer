import React, { useState } from 'react';
import { DynamicTweaksPanel } from './DynamicTweaksPanel';
import { CodePanel } from './CodePanel';
import { PropertiesPanel } from './PropertiesPanel';
import { EventsPanel } from './EventsPanel';
import { VDomArtboard, VNode } from '../types/vdom';
import { TweakDefinition } from '../types';
import { X, SlidersHorizontal, Zap, Code2, Sliders } from 'lucide-react';
import { useTranslation } from '../i18n';

export const MIN_RIGHT_SIDEBAR_WIDTH = 340;
export const DEFAULT_RIGHT_SIDEBAR_WIDTH = 360;

interface RightSidebarProps {
  artboard: VDomArtboard | null;
  selectedNode: VNode | null;
  allArtboards?: VDomArtboard[];
  onUpdateNode: (nodeId: string, updates: Partial<VNode>) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateArtboard?: (updates: Partial<VDomArtboard>) => void;
  onSelectArtboard?: (artboardId: string) => void;
  onSelectNode?: (node: VNode) => void;
  onUpdateCode: (newCode: string) => void;
  onUpdateTweakValue: (key: string, val: any) => void;
  onAddTweakDefinition: (def: TweakDefinition) => void;
  onRemoveTweakDefinition: (id: string) => void;
  activeCode: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenExport?: () => void;
  width?: number;
}

const RightSidebarComponent: React.FC<RightSidebarProps> = ({
  artboard,
  selectedNode,
  allArtboards = [],
  onUpdateNode,
  onDeleteNode,
  onUpdateArtboard,
  onSelectArtboard,
  onSelectNode,
  onUpdateCode,
  onUpdateTweakValue,
  onAddTweakDefinition,
  onRemoveTweakDefinition,
  activeCode,
  isOpen,
  onClose,
  width = DEFAULT_RIGHT_SIDEBAR_WIDTH
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'properties' | 'events' | 'code' | 'tweaks'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get('tab');
      if (tabParam === 'events' || tabParam === 'code' || tabParam === 'tweaks' || tabParam === 'properties') {
        return tabParam;
      }
    }
    return 'properties';
  });

  if (!isOpen) return null;

  const effectiveWidth = Math.max(MIN_RIGHT_SIDEBAR_WIDTH, width);
  const eventCount = selectedNode?.events?.length || 0;
  const tweakCount = artboard?.tweaksSchema?.length || 0;

  return (
    <aside
      style={{ width: `${effectiveWidth}px`, minWidth: `${MIN_RIGHT_SIDEBAR_WIDTH}px` }}
      className="border-l border-slate-200 bg-white flex flex-col shrink-0 h-full shadow-lg z-20 select-none overflow-hidden"
    >
      {/* 4-Tab Header (Properties | Events | Code | Tweaks) - Strict No-Wrap Text Overflow Policy */}
      <div className="h-11 border-b border-slate-200 px-2 flex items-center justify-between gap-1.5 shrink-0 bg-slate-50/80">
        <div className="grid grid-cols-4 gap-0.5 flex-1 min-w-0 bg-slate-200/60 p-0.5 rounded-lg">
          <button
            onClick={() => setActiveTab('properties')}
            title="속성 인스펙터 (Properties)"
            className={`px-1 py-1.5 rounded-md transition text-[11px] flex items-center justify-center gap-1 min-w-0 whitespace-nowrap ${
              activeTab === 'properties'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <SlidersHorizontal size={11} className="shrink-0" />
            <span>{t('properties.title')}</span>
          </button>

          <button
            onClick={() => setActiveTab('events')}
            title="프로토타입 이벤트 & 플로우 (Events)"
            className={`px-1 py-1.5 rounded-md transition text-[11px] flex items-center justify-center gap-1 min-w-0 whitespace-nowrap ${
              activeTab === 'events'
                ? 'bg-white text-amber-700 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Zap size={11} className={`shrink-0 ${activeTab === 'events' ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} />
            <span>{t('interactions.title')}</span>
            {eventCount > 0 && (
              <span className="px-1 py-0 rounded-full bg-amber-500 text-white text-[9px] font-bold leading-tight shrink-0">
                {eventCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('code')}
            title="코드 추출 및 편집 (React / HTML / JSON)"
            className={`px-1 py-1.5 rounded-md transition text-[11px] flex items-center justify-center gap-1 min-w-0 whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-white text-emerald-700 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Code2 size={11} className="shrink-0" />
            <span>{t('properties.tabCode')}</span>
          </button>

          <button
            onClick={() => setActiveTab('tweaks')}
            title="동적 트윅 변수 및 상태 제어 (Tweaks)"
            className={`px-1 py-1.5 rounded-md transition text-[11px] flex items-center justify-center gap-1 min-w-0 whitespace-nowrap ${
              activeTab === 'tweaks'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-600 hover:text-slate-900 font-medium'
            }`}
          >
            <Sliders size={11} className="shrink-0" />
            <span>{t('properties.dynamicTweaks')}</span>
            {tweakCount > 0 && (
              <span className="px-1 py-0 rounded-full bg-indigo-600 text-white text-[9px] font-bold leading-tight shrink-0">
                {tweakCount}
              </span>
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition shrink-0"
          title="패널 닫기"
        >
          <X size={14} />
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden min-w-0">
        {!artboard ? (
          <div className="p-8 text-center text-slate-400 text-xs">
            선택된 화면이 없습니다.
          </div>
        ) : (
          <>
            {activeTab === 'properties' && (
              <PropertiesPanel
                artboard={artboard}
                selectedNode={selectedNode}
                onUpdateNode={onUpdateNode}
                onDeleteNode={onDeleteNode}
                onUpdateArtboard={onUpdateArtboard}
                onSwitchToTweaksTab={() => setActiveTab('tweaks')}
              />
            )}
            {activeTab === 'events' && (
              <EventsPanel
                artboard={artboard}
                selectedNode={selectedNode}
                allArtboards={allArtboards}
                onUpdateNode={onUpdateNode}
                onUpdateTweakValue={onUpdateTweakValue}
                onSelectArtboard={onSelectArtboard}
                onSelectNode={onSelectNode}
              />
            )}
            {activeTab === 'code' && (
              <CodePanel
                code={activeCode}
                artboard={artboard}
                selectedNode={selectedNode}
                onCodeChange={onUpdateCode}
              />
            )}
            {activeTab === 'tweaks' && (
              <DynamicTweaksPanel
                artboard={artboard}
                schema={artboard.tweaksSchema || []}
                values={artboard.tweakValues || {}}
                onChange={onUpdateTweakValue}
                onAddTweak={onAddTweakDefinition}
                onRemoveTweak={onRemoveTweakDefinition}
                onSelectNode={onSelectNode}
              />
            )}
          </>
        )}
      </div>
    </aside>
  );
};

export const RightSidebar = React.memo(RightSidebarComponent);
