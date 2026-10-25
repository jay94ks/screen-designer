import React from 'react';
import { VDomArtboard, VNode } from '../types/vdom';
import { VNodeRenderer } from './VNodeRenderer';
import { PrototypeWiresOverlay } from './PrototypeWiresOverlay';
import {
  inferCanvasRoleFromArtboard,
  evaluateArtboardResolution,
  EDITOR_PREVIEW_RESOLUTIONS
} from '../utils/canvasRolesAndResolution';
import {
  Image as ImageIcon,
  FileJson,
  FileCode,
  Copy,
  Trash2,
  Plus
} from 'lucide-react';

interface CanvasArtboardsLayerProps {
  artboards: VDomArtboard[];
  selectedArtboardId: string | null;
  selectedNodeId: string | null;
  showPrototypeWires: boolean;
  resizingArtboardId: string | null;
  onSelectArtboard: (id: string) => void;
  onSelectNode: (artboardId: string, node: VNode) => void;
  onUpdateArtboardTitle: (artboardId: string, title: string) => void;
  onExportImage: (artboard: VDomArtboard) => void;
  onExportJson: (artboard: VDomArtboard) => void;
  onExportCode: (artboard: VDomArtboard) => void;
  onDuplicateArtboard: (artboardId: string) => void;
  onDeleteArtboard: (artboardId: string) => void;
  onChangePreviewResolution: (artboardId: string, val: string) => void;
  onResetPreviewResolution: (artboardId: string) => void;
  onResizeMouseDown: (e: React.MouseEvent, artboard: VDomArtboard) => void;
  onUpdateContent: (nodeId: string, content: string) => void;
  onDeleteNode: (nodeId: string) => void;
  onOpenNewFrame: () => void;
}

const CanvasArtboardsLayerComponent: React.FC<CanvasArtboardsLayerProps> = ({
  artboards,
  selectedArtboardId,
  selectedNodeId,
  showPrototypeWires,
  resizingArtboardId,
  onSelectArtboard,
  onSelectNode,
  onUpdateArtboardTitle,
  onExportImage,
  onExportJson,
  onExportCode,
  onDuplicateArtboard,
  onDeleteArtboard,
  onChangePreviewResolution,
  onResetPreviewResolution,
  onResizeMouseDown,
  onUpdateContent,
  onDeleteNode,
  onOpenNewFrame
}) => {
  return (
    <>
      {/* Figma-Style Visual Prototype Flow Overlay */}
      <PrototypeWiresOverlay
        artboards={artboards}
        selectedArtboardId={selectedArtboardId}
        selectedNodeId={selectedNodeId}
        onSelectArtboard={(id) => {
          onSelectArtboard(id);
          const ab = artboards.find((a) => a.id === id);
          if (ab) onSelectNode(id, ab.rootNode);
        }}
        onSelectNode={(node) => {
          const owner = artboards.find((a) => {
            const hasNode = (n: VNode): boolean => {
              if (n.id === node.id) return true;
              return Boolean(n.children?.some(hasNode));
            };
            return hasNode(a.rootNode);
          });
          if (owner) {
            onSelectNode(owner.id, node);
          }
        }}
        visible={showPrototypeWires}
      />

      {artboards.map((artboard) => {
        const isSelected = artboard.id === selectedArtboardId;
        const roleMeta = inferCanvasRoleFromArtboard(artboard);
        const isPreviewActive = Boolean(artboard.previewResolution?.enabled);
        const activeW = isPreviewActive
          ? artboard.previewResolution!.width
          : artboard.width;
        const activeH = isPreviewActive
          ? artboard.previewResolution!.height
          : artboard.height;
        const resEval = evaluateArtboardResolution(
          artboard.resolutionRule,
          activeW,
          activeH
        );

        return (
          <div
            key={artboard.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelectArtboard(artboard.id);
            }}
            className="flex flex-col relative group cursor-pointer"
          >
            {/* Top Label, Role Badge, In-Editor Driving Resolution Preview & Actions */}
            <div
              className="flex flex-col gap-1 pb-1.5 px-0.5 text-xs"
              style={{ width: `${Math.max(360, activeW)}px` }}
            >
              {/* Row 1: Role Badge + Artboard Title + Export/Duplicate/Delete */}
              <div className="flex items-center justify-between gap-1.5 min-w-0">
                <div className="flex items-center gap-1.5 min-w-0 flex-1">
                  <span
                    className={`px-1.5 py-0.5 rounded border text-[10px] font-bold shrink-0 ${roleMeta.badgeClass}`}
                    title={roleMeta.description}
                  >
                    {roleMeta.shortLabel}
                  </span>
                  <input
                    type="text"
                    value={artboard.title}
                    onChange={(e) => onUpdateArtboardTitle(artboard.id, e.target.value)}
                    className="font-bold text-slate-800 bg-transparent border-0 hover:bg-white/60 rounded px-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none min-w-0 flex-1 truncate"
                  />
                </div>

                <div
                  className={`flex items-center gap-1 shrink-0 ${
                    isSelected ? 'opacity-100' : 'opacity-75 group-hover:opacity-100'
                  }`}
                >
                  {/* 1. Per-Artboard Export Group: Image, JSON, Code */}
                  <div className="flex items-center bg-white/90 backdrop-blur-xs border border-slate-200/90 rounded-lg p-0.5 shadow-2xs">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportImage(artboard);
                      }}
                      className="px-1.5 py-0.5 hover:bg-indigo-50 hover:text-indigo-600 rounded text-slate-600 flex items-center gap-1 text-[10px] font-semibold"
                      title="장표를 PNG 이미지 파일로 내보내기"
                    >
                      <ImageIcon size={11} className="text-indigo-500" />
                      <span className="hidden xl:inline">이미지</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportJson(artboard);
                      }}
                      className="px-1.5 py-0.5 hover:bg-emerald-50 hover:text-emerald-600 rounded text-slate-600 flex items-center gap-1 text-[10px] font-semibold"
                      title="장표를 VDOM JSON 파일로 내보내기"
                    >
                      <FileJson size={11} className="text-emerald-500" />
                      <span className="hidden xl:inline">JSON</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onExportCode(artboard);
                      }}
                      className="px-1.5 py-0.5 hover:bg-purple-50 hover:text-purple-600 rounded text-slate-600 flex items-center gap-1 text-[10px] font-semibold"
                      title="장표를 React (TSX) 컴포넌트 코드로 내보내기"
                    >
                      <FileCode size={11} className="text-purple-500" />
                      <span className="hidden xl:inline">코드</span>
                    </button>
                  </div>

                  {/* 2. Duplicate & Delete */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateArtboard(artboard.id);
                    }}
                    className="p-1 hover:bg-white rounded text-slate-500 shadow-2xs"
                    title="화면 복제 (Ctrl+D)"
                  >
                    <Copy size={12} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteArtboard(artboard.id);
                    }}
                    className="p-1 hover:bg-rose-100 hover:text-rose-600 rounded text-slate-500 shadow-2xs"
                    title="화면 삭제"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>

              {/* Row 2: Live Driving Resolution Preview Selector & Resolution Visibility Rule Status */}
              <div className="flex items-center justify-between gap-1.5 min-w-0">
                <div className="flex items-center gap-1 min-w-0">
                  <select
                    onClick={(e) => e.stopPropagation()}
                    value={
                      !isPreviewActive
                        ? 'original'
                        : EDITOR_PREVIEW_RESOLUTIONS.find(
                            (r) => r.width === activeW && r.height === activeH
                          )?.id || 'custom'
                    }
                    onChange={(e) => {
                      e.stopPropagation();
                      onChangePreviewResolution(artboard.id, e.target.value);
                    }}
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-mono font-bold border shadow-2xs focus:outline-none cursor-pointer ${
                      isPreviewActive
                        ? 'bg-cyan-600 text-white border-cyan-700'
                        : 'bg-white/90 text-slate-600 border-slate-200/90 hover:border-indigo-300'
                    }`}
                    title="편집 중 이 장표가 다른 해상도에서 구동될 때의 모습을 즉시 미리봅니다"
                  >
                    <option value="original" className="bg-white text-slate-800">
                      📐 설계 원본 ({artboard.width}×{artboard.height})
                    </option>
                    {isPreviewActive && (
                      <option value="custom" className="bg-white text-slate-800">
                        🔍 구동 프리뷰 ({activeW}×{activeH})
                      </option>
                    )}
                    {EDITOR_PREVIEW_RESOLUTIONS.map((opt) => (
                      <option key={opt.id} value={opt.id} className="bg-white text-slate-800">
                        🔍 구동 프리뷰: {opt.width}×{opt.height} ({opt.label.split('(')[1]?.replace(')', '') || opt.id})
                      </option>
                    ))}
                  </select>

                  {isPreviewActive && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onResetPreviewResolution(artboard.id);
                      }}
                      className="px-1.5 py-0.5 rounded bg-cyan-50 hover:bg-cyan-100 text-cyan-800 border border-cyan-200 text-[9px] font-bold shrink-0"
                      title="원본 설계 크기로 복원"
                    >
                      원본복원
                    </button>
                  )}
                </div>

                {/* Resolution Visibility Condition Badge */}
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectArtboard(artboard.id);
                  }}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold border shrink-0 ${
                    !resEval.isRestricted
                      ? 'bg-slate-100/90 text-slate-500 border-slate-200/80'
                      : resEval.matches
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-300'
                  }`}
                  title={resEval.reasonText}
                >
                  {!resEval.isRestricted
                    ? '모든 해상도 표시'
                    : resEval.matches
                    ? `표시 조건: ${resEval.badgeText}`
                    : `숨김 (${resEval.badgeText})`}
                </span>
              </div>
            </div>

            {/* Artboard Frame with Selection / Preview / Hidden Ring */}
            <div
              id={`artboard-frame-${artboard.id}`}
              className={`relative rounded-2xl overflow-hidden shadow-xl ${
                !resEval.matches
                  ? 'ring-2 ring-rose-500 ring-offset-2 opacity-80'
                  : isPreviewActive
                  ? 'ring-2 ring-cyan-500 ring-offset-2'
                  : isSelected
                  ? 'ring-2 ring-indigo-500 ring-offset-2'
                  : 'hover:ring-1 hover:ring-slate-400'
              }`}
              style={{ width: `${activeW}px`, height: `${activeH}px` }}
            >
              {/* Resolution Condition Hidden Warning Banner on Canvas */}
              {!resEval.matches && (
                <div className="bg-rose-600/95 text-white px-3 py-1.5 text-[11px] font-bold flex items-center justify-between gap-2 z-40 relative">
                  <span>
                    🚫 현재 구동 해상도({activeW}×{activeH}px)에서는 숨김 설정된 장표입니다 (조건: {resEval.summaryText})
                  </span>
                </div>
              )}

              {/* Corner Handles */}
              {isSelected && (
                <>
                  <span className="w-2.5 h-2.5 bg-white border-2 border-indigo-600 absolute -top-1.5 -left-1.5 rounded-xs z-40 pointer-events-none" />
                  <span className="w-2.5 h-2.5 bg-white border-2 border-indigo-600 absolute -top-1.5 -right-1.5 rounded-xs z-40 pointer-events-none" />
                  <span className="w-2.5 h-2.5 bg-white border-2 border-indigo-600 absolute -bottom-1.5 -left-1.5 rounded-xs z-40 pointer-events-none" />
                  {/* Interactive Drag-to-Resize Bottom-Right Handle */}
                  <div
                    onMouseDown={(e) => onResizeMouseDown(e, artboard)}
                    className={`w-4 h-4 ${
                      isPreviewActive ? 'bg-cyan-600' : 'bg-indigo-600'
                    } border-2 border-white absolute -bottom-2 -right-2 rounded-xs z-50 cursor-nwse-resize hover:scale-125 shadow-md flex items-center justify-center group/handle`}
                    title={
                      isPreviewActive
                        ? '드래그하여 구동 프리뷰 해상도 실시간 조절 (W × H)'
                        : '드래그하여 설계 크기 변경 (W × H)'
                    }
                  >
                    <div className="w-1 h-1 bg-white rounded-full pointer-events-none" />
                  </div>
                </>
              )}

              {/* Resizing Live Dimension Badge */}
              {resizingArtboardId === artboard.id && (
                <div className="absolute bottom-3 right-3 bg-slate-900/90 text-white font-mono text-[10px] px-2 py-1 rounded-md shadow-lg z-50 border border-slate-700 pointer-events-none animate-in fade-in">
                  {isPreviewActive ? `프리뷰 ${activeW} × ${activeH}` : `${activeW} × ${activeH}`}
                </div>
              )}

              {/* Pure React High-Performance Virtual DOM Renderer */}
              <VNodeRenderer
                node={artboard.rootNode}
                selectedNodeId={isSelected ? selectedNodeId : null}
                onSelectNode={(node) => onSelectNode(artboard.id, node)}
                onUpdateContent={onUpdateContent}
                onDeleteNode={onDeleteNode}
                tweakValues={artboard.tweakValues}
                interactive={true}
              />
            </div>
          </div>
        );
      })}

      {/* + Add New Frame Button */}
      <div
        onClick={onOpenNewFrame}
        className="flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white/40 hover:bg-white/80 w-64 min-h-[300px] text-center gap-3 cursor-pointer group shadow-2xs"
      >
        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold group-hover:scale-110">
          <Plus size={18} />
        </div>
        <div>
          <div className="text-xs font-bold text-slate-700">새 프레임 추가</div>
          <div className="text-[10px] text-slate-400">단축키 F 또는 클릭</div>
        </div>
      </div>
    </>
  );
};

export const CanvasArtboardsLayer = React.memo(CanvasArtboardsLayerComponent);
