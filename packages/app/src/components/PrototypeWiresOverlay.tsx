import React, { useEffect, useState, useMemo } from 'react';
import { VDomArtboard, VNode } from '../types/vdom';
import { Zap, ArrowRight } from 'lucide-react';

interface NavigationWire {
  id: string;
  sourceArtboardId: string;
  sourceNodeId: string;
  sourceNodeName: string;
  targetArtboardId: string;
  trigger: string;
  description?: string;
}

interface PrototypeWiresOverlayProps {
  artboards: VDomArtboard[];
  selectedArtboardId: string | null;
  selectedNodeId: string | null;
  onSelectArtboard: (id: string) => void;
  onSelectNode: (node: VNode) => void;
  visible: boolean;
}

interface WireCoords {
  wire: NavigationWire;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx1: number;
  cy1: number;
  cx2: number;
  cy2: number;
  midX: number;
  midY: number;
  isHighlighted: boolean;
  targetTitle: string;
}

const PrototypeWiresOverlayComponent: React.FC<PrototypeWiresOverlayProps> = ({
  artboards,
  selectedArtboardId,
  selectedNodeId,
  onSelectArtboard,
  onSelectNode,
  visible
}) => {
  const [wireCoords, setWireCoords] = useState<WireCoords[]>([]);

  // Collect all navigate events
  const wires = useMemo(() => {
    const list: NavigationWire[] = [];

    const traverse = (node: VNode, artboardId: string) => {
      if (node.events && Array.isArray(node.events)) {
        for (const evt of node.events) {
          if (evt.action && evt.action.type === 'navigate' && evt.action.targetArtboardId) {
            list.push({
              id: evt.id || `wire-${node.id}-${evt.action.targetArtboardId}`,
              sourceArtboardId: artboardId,
              sourceNodeId: node.id,
              sourceNodeName: node.name,
              targetArtboardId: evt.action.targetArtboardId,
              trigger: evt.trigger,
              description: evt.description
            });
          }
        }
      }
      if (node.children && Array.isArray(node.children)) {
        for (const child of node.children) {
          traverse(child, artboardId);
        }
      }
    };

    for (const ab of artboards) {
      if (ab.rootNode) {
        traverse(ab.rootNode, ab.id);
      }
    }
    return list;
  }, [artboards]);

  // Recalculate pixel coordinates whenever artboards, selection, or DOM changes
  useEffect(() => {
    if (!visible || wires.length === 0) {
      setWireCoords([]);
      return;
    }

    const calculateCoords = () => {
      const transformContainer = document.getElementById('canvas-transform-layer');
      if (!transformContainer) return;

      const containerRect = transformContainer.getBoundingClientRect();
      // Current transform matrix or scale factor
      const scaleMatch = transformContainer.style.transform.match(/scale\(([^)]+)\)/);
      const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;

      const results: WireCoords[] = [];

      for (const wire of wires) {
        const sourceEl = document.querySelector(`[data-node-id="${wire.sourceNodeId}"]`);
        const targetBoardEl = document.getElementById(`artboard-frame-${wire.targetArtboardId}`);

        if (!sourceEl || !targetBoardEl) continue;

        const sourceRect = sourceEl.getBoundingClientRect();
        const targetRect = targetBoardEl.getBoundingClientRect();

        // Convert viewport coordinates to container local coordinates
        const x1 = (sourceRect.right - containerRect.left) / scale;
        const y1 = (sourceRect.top + sourceRect.height / 2 - containerRect.top) / scale;

        const x2 = (targetRect.left - containerRect.left) / scale;
        const y2 = (targetRect.top + 60 - containerRect.top) / scale;

        // Cubic Bezier control points
        const dx = Math.abs(x2 - x1);
        const curveOffset = Math.max(60, dx * 0.45);
        
        // If target is to the left (loop back)
        const isBackward = x2 < x1;
        const cx1 = isBackward ? x1 + curveOffset * 1.5 : x1 + curveOffset;
        const cy1 = isBackward ? y1 + 120 : y1;
        const cx2 = isBackward ? x2 - curveOffset * 1.5 : x2 - curveOffset;
        const cy2 = isBackward ? y2 - 80 : y2;

        const midX = (x1 + x2) / 2 + (isBackward ? curveOffset * 0.8 : 0);
        const midY = (y1 + y2) / 2 + (isBackward ? 90 : 0);

        const isHighlighted =
          selectedNodeId === wire.sourceNodeId ||
          selectedArtboardId === wire.sourceArtboardId ||
          selectedArtboardId === wire.targetArtboardId;

        const targetBoard = artboards.find((a) => a.id === wire.targetArtboardId);
        const targetTitle = targetBoard ? targetBoard.title.split('.')[1]?.trim() || targetBoard.title : wire.targetArtboardId;

        results.push({
          wire,
          x1,
          y1,
          x2,
          y2,
          cx1,
          cy1,
          cx2,
          cy2,
          midX,
          midY,
          isHighlighted,
          targetTitle
        });
      }

      setWireCoords(results);
    };

    // Delay slightly to let React render nodes and layout settle
    const timer = setTimeout(calculateCoords, 100);
    window.addEventListener('resize', calculateCoords);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateCoords);
    };
  }, [wires, visible, artboards, selectedArtboardId, selectedNodeId]);

  if (!visible || wireCoords.length === 0) return null;

  return (
    <svg
      className="absolute inset-0 pointer-events-none z-30 overflow-visible"
      style={{ width: '100%', height: '100%' }}
    >
      <defs>
        {/* Glow Filters */}
        <filter id="wire-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Gradient for regular wires */}
        <linearGradient id="flow-gradient-default" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.95" />
        </linearGradient>

        {/* Gradient for highlighted wires */}
        <linearGradient id="flow-gradient-active" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ec4899" stopOpacity="1" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
        </linearGradient>

        {/* Marker Arrowheads */}
        <marker
          id="wire-arrow-default"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#38bdf8" />
        </marker>

        <marker
          id="wire-arrow-active"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="8"
          markerHeight="8"
          orient="auto-start-reverse"
        >
          <path d="M 0 1 L 9 5 L 0 9 z" fill="#a855f7" />
        </marker>
      </defs>

      {wireCoords.map((coord) => {
        const pathData = `M ${coord.x1} ${coord.y1} C ${coord.cx1} ${coord.cy1}, ${coord.cx2} ${coord.cy2}, ${coord.x2} ${coord.y2}`;
        const strokeColor = coord.isHighlighted
          ? 'url(#flow-gradient-active)'
          : 'url(#flow-gradient-default)';
        const marker = coord.isHighlighted ? 'url(#wire-arrow-active)' : 'url(#wire-arrow-default)';

        return (
          <g key={coord.wire.id} className="transition-all duration-150">
            {/* Background Halo for legibility */}
            <path
              d={pathData}
              fill="none"
              stroke="#0f172a"
              strokeWidth={coord.isHighlighted ? 6 : 4}
              strokeOpacity="0.35"
              strokeLinecap="round"
            />

            {/* Main Interactive Curved Wire */}
            <path
              d={pathData}
              fill="none"
              stroke={strokeColor}
              strokeWidth={coord.isHighlighted ? 3 : 2}
              strokeDasharray={coord.isHighlighted ? '6 4' : '4 4'}
              filter={coord.isHighlighted ? 'url(#wire-glow)' : undefined}
              markerEnd={marker}
              strokeLinecap="round"
              className={coord.isHighlighted ? 'animate-pulse' : ''}
            />

            {/* Source Origin Pin */}
            <circle
              cx={coord.x1}
              cy={coord.y1}
              r={coord.isHighlighted ? 4.5 : 3.5}
              fill={coord.isHighlighted ? '#ec4899' : '#6366f1'}
              stroke="#ffffff"
              strokeWidth="1.5"
            />

            {/* Interactive Badge on Midpoint */}
            <foreignObject
              x={coord.midX - 90}
              y={coord.midY - 14}
              width="180"
              height="28"
              className="pointer-events-auto cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                onSelectArtboard(coord.wire.targetArtboardId);
              }}
            >
              <div
                className={`flex items-center justify-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-md transition-all hover:scale-105 active:scale-95 border ${
                  coord.isHighlighted
                    ? 'bg-purple-900/90 text-purple-100 border-purple-400 shadow-purple-500/30'
                    : 'bg-slate-900/85 text-slate-200 border-indigo-400/60 hover:bg-slate-900'
                }`}
                title={`클릭하여 '${coord.targetTitle}' 화면으로 이동`}
              >
                <Zap size={10} className={coord.isHighlighted ? 'text-pink-400 fill-pink-400' : 'text-indigo-400'} />
                <span className="truncate max-w-[130px]">{coord.targetTitle}</span>
                <ArrowRight size={9} className="opacity-70" />
              </div>
            </foreignObject>
          </g>
        );
      })}
    </svg>
  );
};

export const PrototypeWiresOverlay = React.memo(PrototypeWiresOverlayComponent);
