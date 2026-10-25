import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2 } from 'lucide-react';

export interface GuideLine {
  id: string;
  type: 'horizontal' | 'vertical';
  pos: number; // canvas coordinate in px
}

interface CanvasRulersProps {
  zoom: number;
  pan: { x: number; y: number };
  containerWidth: number;
  containerHeight: number;
  guides: GuideLine[];
  onAddGuide: (guide: GuideLine) => void;
  onUpdateGuide: (id: string, newPos: number) => void;
  onRemoveGuide: (id: string) => void;
  showRulers: boolean;
  canvasRect: DOMRect | null;
}

const RULER_SIZE = 24;

export const CanvasRulers: React.FC<CanvasRulersProps> = ({
  zoom,
  pan,
  containerWidth,
  containerHeight,
  guides,
  onAddGuide,
  onUpdateGuide,
  onRemoveGuide,
  showRulers,
  canvasRect
}) => {
  const topHairlineRef = useRef<SVGLineElement | null>(null);
  const leftHairlineRef = useRef<SVGLineElement | null>(null);

  // Directly track and position hairline indicators without triggering React re-renders
  useEffect(() => {
    if (!showRulers) return;

    let rafId: number | null = null;
    const onMouseMove = (e: MouseEvent) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        if (!canvasRect) return;
        const relX = e.clientX - canvasRect.left;
        const relY = e.clientY - canvasRect.top;

        if (topHairlineRef.current) {
          if (relX >= RULER_SIZE && relX <= containerWidth) {
            topHairlineRef.current.style.display = 'block';
            topHairlineRef.current.setAttribute('x1', String(relX - RULER_SIZE));
            topHairlineRef.current.setAttribute('x2', String(relX - RULER_SIZE));
          } else {
            topHairlineRef.current.style.display = 'none';
          }
        }

        if (leftHairlineRef.current) {
          if (relY >= RULER_SIZE && relY <= containerHeight) {
            leftHairlineRef.current.style.display = 'block';
            leftHairlineRef.current.setAttribute('y1', String(relY - RULER_SIZE));
            leftHairlineRef.current.setAttribute('y2', String(relY - RULER_SIZE));
          } else {
            leftHairlineRef.current.style.display = 'none';
          }
        }
      });
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, [showRulers, canvasRect, containerWidth, containerHeight]);
  const [draggingGuide, setDraggingGuide] = useState<{
    id: string;
    type: 'horizontal' | 'vertical';
    isNew: boolean;
  } | null>(null);

  const [activeGuideHoverId, setActiveGuideHoverId] = useState<string | null>(null);

  // Convert client coordinate to canvas coordinate
  const clientToCanvasX = (clientX: number) => {
    if (!canvasRect) return 0;
    const offsetInContainer = clientX - canvasRect.left - RULER_SIZE;
    return Math.round((offsetInContainer - pan.x) / zoom);
  };

  const clientToCanvasY = (clientY: number) => {
    if (!canvasRect) return 0;
    const offsetInContainer = clientY - canvasRect.top - RULER_SIZE;
    return Math.round((offsetInContainer - pan.y) / zoom);
  };

  // Convert canvas coordinate to container display coordinate
  const canvasToDisplayX = (canvasX: number) => {
    return canvasX * zoom + pan.x + RULER_SIZE;
  };

  const canvasToDisplayY = (canvasY: number) => {
    return canvasY * zoom + pan.y + RULER_SIZE;
  };

  // Mouse move / up handler for guide dragging
  useEffect(() => {
    if (!draggingGuide) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (draggingGuide.type === 'horizontal') {
        const newY = clientToCanvasY(e.clientY);
        onUpdateGuide(draggingGuide.id, newY);
      } else {
        const newX = clientToCanvasX(e.clientX);
        onUpdateGuide(draggingGuide.id, newX);
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      // If dragged back onto ruler or out of canvas, delete it
      if (canvasRect) {
        if (draggingGuide.type === 'horizontal') {
          const clientY = e.clientY - canvasRect.top;
          if (clientY < RULER_SIZE) {
            onRemoveGuide(draggingGuide.id);
          }
        } else {
          const clientX = e.clientX - canvasRect.left;
          if (clientX < RULER_SIZE) {
            onRemoveGuide(draggingGuide.id);
          }
        }
      }
      setDraggingGuide(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggingGuide, zoom, pan, canvasRect]);

  if (!showRulers) return null;

  // Calculate ticks
  // Choose step based on zoom: at zoom 0.5 step is 100, at 1.0 step is 50, at 2.0 step is 20
  const majorStep = zoom < 0.6 ? 200 : zoom < 1.2 ? 100 : 50;
  const minorStep = majorStep / 5;

  // Canvas bounds currently visible
  const visibleStartCanvasX = clientToCanvasX(canvasRect ? canvasRect.left + RULER_SIZE : 0);
  const visibleEndCanvasX = clientToCanvasX(canvasRect ? canvasRect.left + containerWidth : containerWidth);
  const firstTickX = Math.floor(visibleStartCanvasX / majorStep) * majorStep;
  const lastTickX = Math.ceil(visibleEndCanvasX / majorStep) * majorStep;

  const horizontalTicks: Array<{ pos: number; label?: number; isMajor: boolean }> = [];
  for (let x = firstTickX; x <= lastTickX; x += minorStep) {
    horizontalTicks.push({
      pos: x,
      label: x % majorStep === 0 ? x : undefined,
      isMajor: x % majorStep === 0
    });
  }

  const visibleStartCanvasY = clientToCanvasY(canvasRect ? canvasRect.top + RULER_SIZE : 0);
  const visibleEndCanvasY = clientToCanvasY(canvasRect ? canvasRect.top + containerHeight : containerHeight);
  const firstTickY = Math.floor(visibleStartCanvasY / majorStep) * majorStep;
  const lastTickY = Math.ceil(visibleEndCanvasY / majorStep) * majorStep;

  const verticalTicks: Array<{ pos: number; label?: number; isMajor: boolean }> = [];
  for (let y = firstTickY; y <= lastTickY; y += minorStep) {
    verticalTicks.push({
      pos: y,
      label: y % majorStep === 0 ? y : undefined,
      isMajor: y % majorStep === 0
    });
  }

  const handleStartDragTopRuler = (e: React.MouseEvent) => {
    e.preventDefault();
    const newId = `guide-h-${Date.now()}`;
    const initialY = clientToCanvasY(e.clientY);
    const newGuide: GuideLine = { id: newId, type: 'horizontal', pos: initialY };
    onAddGuide(newGuide);
    setDraggingGuide({ id: newId, type: 'horizontal', isNew: true });
  };

  const handleStartDragLeftRuler = (e: React.MouseEvent) => {
    e.preventDefault();
    const newId = `guide-v-${Date.now()}`;
    const initialX = clientToCanvasX(e.clientX);
    const newGuide: GuideLine = { id: newId, type: 'vertical', pos: initialX };
    onAddGuide(newGuide);
    setDraggingGuide({ id: newId, type: 'vertical', isNew: true });
  };

  return (
    <>
      {/* 1. Corner Box (Intersection of Top & Left Rulers) */}
      <div
        style={{ width: `${RULER_SIZE}px`, height: `${RULER_SIZE}px` }}
        className="absolute top-0 left-0 bg-slate-200 border-r border-b border-slate-300 z-25 flex items-center justify-center font-mono text-[9px] text-slate-500 select-none cursor-pointer hover:bg-indigo-100 hover:text-indigo-700 transition"
        title="눈금자 (px 단위). 클릭 시 가이드 생성 도움말"
      >
        px
      </div>

      {/* 2. Top Horizontal Ruler */}
      <div
        onMouseDown={handleStartDragTopRuler}
        style={{ left: `${RULER_SIZE}px`, height: `${RULER_SIZE}px`, width: `calc(100% - ${RULER_SIZE}px)` }}
        className="absolute top-0 overflow-hidden bg-slate-100/95 backdrop-blur-2xs border-b border-slate-300 z-20 select-none cursor-ns-resize"
        title="아래로 드래그하여 수평 가이드라인 생성"
      >
        <svg className="w-full h-full">
          {horizontalTicks.map((t, idx) => {
            const screenX = (t.pos * zoom) + pan.x;
            if (screenX < 0 || screenX > containerWidth) return null;
            return (
              <g key={`ht-${idx}`}>
                <line
                  x1={screenX}
                  y1={t.isMajor ? 10 : 16}
                  x2={screenX}
                  y2={RULER_SIZE}
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                {t.isMajor && (
                  <text
                    x={screenX + 3}
                    y={11}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                  >
                    {t.label}
                  </text>
                )}
              </g>
            );
          })}
          {/* Mouse Coordinate Hairline Indicator */}
          <line
            ref={topHairlineRef}
            y1={0}
            y2={RULER_SIZE}
            stroke="#6366f1"
            strokeWidth="1.5"
            style={{ display: 'none' }}
          />
        </svg>
      </div>

      {/* 3. Left Vertical Ruler */}
      <div
        onMouseDown={handleStartDragLeftRuler}
        style={{ top: `${RULER_SIZE}px`, width: `${RULER_SIZE}px`, height: `calc(100% - ${RULER_SIZE}px)` }}
        className="absolute left-0 overflow-hidden bg-slate-100/95 backdrop-blur-2xs border-r border-slate-300 z-20 select-none cursor-ew-resize"
        title="우측으로 드래그하여 수직 가이드라인 생성"
      >
        <svg className="w-full h-full">
          {verticalTicks.map((t, idx) => {
            const screenY = (t.pos * zoom) + pan.y;
            if (screenY < 0 || screenY > containerHeight) return null;
            return (
              <g key={`vt-${idx}`}>
                <line
                  x1={t.isMajor ? 10 : 16}
                  y1={screenY}
                  x2={RULER_SIZE}
                  y2={screenY}
                  stroke="#94a3b8"
                  strokeWidth="1"
                />
                {t.isMajor && (
                  <text
                    x={2}
                    y={screenY - 3}
                    fill="#64748b"
                    fontSize="8"
                    fontFamily="monospace"
                    transform={`rotate(-90 2 ${screenY - 3})`}
                  >
                    {t.label}
                  </text>
                )}
              </g>
            );
          })}
          {/* Mouse Coordinate Hairline Indicator */}
          <line
            ref={leftHairlineRef}
            x1={0}
            x2={RULER_SIZE}
            stroke="#6366f1"
            strokeWidth="1.5"
            style={{ display: 'none' }}
          />
        </svg>
      </div>

      {/* 4. Canvas Guide Lines Overlay */}
      {guides.map((g) => {
        const isHovered = activeGuideHoverId === g.id;

        if (g.type === 'horizontal') {
          const displayY = canvasToDisplayY(g.pos);
          if (displayY < RULER_SIZE || displayY > containerHeight) return null;

          return (
            <div
              key={g.id}
              onMouseEnter={() => setActiveGuideHoverId(g.id)}
              onMouseLeave={() => setActiveGuideHoverId(null)}
              onMouseDown={(e) => {
                e.stopPropagation();
                setDraggingGuide({ id: g.id, type: 'horizontal', isNew: false });
              }}
              style={{
                top: `${displayY}px`,
                left: `${RULER_SIZE}px`,
                width: `calc(100% - ${RULER_SIZE}px)`
              }}
              className="absolute z-15 cursor-ns-resize group select-none pointer-events-auto"
            >
              {/* Actual Line */}
              <div
                className={`h-px w-full transition-colors ${
                  isHovered ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-cyan-400/80 border-t border-dashed border-cyan-400'
                }`}
              />
              {/* Coordinate Badge & Delete Pill */}
              <div
                className={`absolute left-2 -top-3.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs transition-opacity ${
                  isHovered ? 'bg-cyan-600 text-white opacity-100' : 'bg-cyan-700/80 text-white opacity-70 group-hover:opacity-100'
                }`}
              >
                <span>Y: {g.pos}px</span>
                {isHovered && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveGuide(g.id);
                    }}
                    className="hover:text-rose-200 ml-1"
                    title="가이드라인 삭제"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>
          );
        } else {
          const displayX = canvasToDisplayX(g.pos);
          if (displayX < RULER_SIZE || displayX > containerWidth) return null;

          return (
            <div
              key={g.id}
              onMouseEnter={() => setActiveGuideHoverId(g.id)}
              onMouseLeave={() => setActiveGuideHoverId(null)}
              onMouseDown={(e) => {
                e.stopPropagation();
                setDraggingGuide({ id: g.id, type: 'vertical', isNew: false });
              }}
              style={{
                left: `${displayX}px`,
                top: `${RULER_SIZE}px`,
                height: `calc(100% - ${RULER_SIZE}px)`
              }}
              className="absolute z-15 cursor-ew-resize group select-none pointer-events-auto"
            >
              {/* Actual Line */}
              <div
                className={`w-px h-full transition-colors ${
                  isHovered ? 'bg-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.8)]' : 'bg-cyan-400/80 border-l border-dashed border-cyan-400'
                }`}
              />
              {/* Coordinate Badge & Delete Pill */}
              <div
                className={`absolute top-2 -left-3.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 shadow-xs transition-opacity -rotate-90 origin-top-left ${
                  isHovered ? 'bg-cyan-600 text-white opacity-100' : 'bg-cyan-700/80 text-white opacity-70 group-hover:opacity-100'
                }`}
              >
                <span>X: {g.pos}px</span>
                {isHovered && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveGuide(g.id);
                    }}
                    className="hover:text-rose-200 ml-1"
                    title="가이드라인 삭제"
                  >
                    <X size={10} />
                  </button>
                )}
              </div>
            </div>
          );
        }
      })}
    </>
  );
};
