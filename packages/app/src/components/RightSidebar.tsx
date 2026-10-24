import React, { useState } from 'react';
import { DynamicTweaksPanel } from './DynamicTweaksPanel';
import { CodePanel } from './CodePanel';
import { PropertiesPanel } from './PropertiesPanel';
import { EventsPanel } from './EventsPanel';
import { VDomArtboard, VNode } from '../types/vdom';
import { TweakDefinition } from '../types';
import { X, Download, Save, Sparkles, Zap } from 'lucide-react';

interface RightSidebarProps {
  artboard: VDomArtboard | null;
  selectedNode: VNode | null;
  allArtboards?: VDomArtboard[];
  onUpdateNode: (nodeId: string, updates: Partial<VNode>) => void;
  onDeleteNode: (nodeId: string) => void;
  onUpdateArtboard?: (updates: Partial<VDomArtboard>) => void;
  onSelectArtboard?: (artboardId: string) => void;
  onUpdateCode: (newCode: string) => void;
  onUpdateTweakValue: (key: string, val: any) => void;
  onAddTweakDefinition: (def: TweakDefinition) => void;
  onRemoveTweakDefinition: (id: string) => void;
  activeCode: string;
  isOpen: boolean;
  onClose: () => void;
  onOpenExport: () => void;
  width?: number;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({
  artboard,
  selectedNode,
  allArtboards = [],
  onUpdateNode,
  onDeleteNode,
  onUpdateArtboard,
  onSelectArtboard,
  onUpdateCode,
  onUpdateTweakValue,
  onAddTweakDefinition,
  onRemoveTweakDefinition,
  activeCode,
  isOpen,
  onClose,
  onOpenExport,
  width = 320
}) => {
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

  return (
    <aside
      style={{ width: `${width}px` }}
      className="border-l border-slate-200 bg-white flex flex-col shrink-0 h-full shadow-lg z-20 select-none"
    >
      {/* 4-Tab Header (Properties | Events | Code | Tweaks) */}
      <div className="h-11 border-b border-slate-200 px-2.5 flex items-center justify-between shrink-0 bg-slate-50/70">
        <div className="flex items-center gap-1 text-xs">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition text-[11px] ${
              activeTab === 'properties'
                ? 'bg-white text-slate-900 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Properties
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition text-[11px] flex items-center gap-1 ${
              activeTab === 'events'
                ? 'bg-white text-amber-700 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Zap size={11} className={activeTab === 'events' ? 'text-amber-500 fill-amber-500' : 'text-slate-400'} />
            <span>Events</span>
            {selectedNode?.events && selectedNode.events.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition text-[11px] ${
              activeTab === 'code'
                ? 'bg-white text-slate-900 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Code
          </button>
          <button
            onClick={() => setActiveTab('tweaks')}
            className={`px-2.5 py-1.5 rounded-md font-medium transition text-[11px] flex items-center gap-1 ${
              activeTab === 'tweaks'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <span>Tweaks</span>
            {artboard && artboard.tweaksSchema && artboard.tweaksSchema.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600" />
            )}
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition"
          title="패널 닫기"
        >
          <X size={14} />
        </button>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto">
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
              />
            )}
            {activeTab === 'code' && (
              <CodePanel code={activeCode} onCodeChange={onUpdateCode} />
            )}
            {activeTab === 'tweaks' && (
              <DynamicTweaksPanel
                schema={artboard.tweaksSchema || []}
                values={artboard.tweakValues || {}}
                onChange={onUpdateTweakValue}
                onAddTweak={onAddTweakDefinition}
                onRemoveTweak={onRemoveTweakDefinition}
              />
            )}
          </>
        )}
      </div>

      {/* Bottom Export Action Footer */}
      {artboard && (
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 shrink-0">
          <button
            onClick={onOpenExport}
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-98"
          >
            <Download size={14} />
            <span>내보내기 스튜디오 (Export)</span>
          </button>
        </div>
      )}
    </aside>
  );
};
