import React from 'react';
import { Smartphone, Tablet, Monitor, ZoomIn, ZoomOut, RotateCcw, Radio } from 'lucide-react';

interface ToolbarProps {
  connected: boolean;
  viewport: 'mobile' | 'tablet' | 'desktop';
  onViewportChange: (vp: 'mobile' | 'tablet' | 'desktop') => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  artboardCount: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  connected,
  viewport,
  onViewportChange,
  zoom,
  onZoomChange,
  artboardCount
}) => {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/90 backdrop-blur px-4 flex items-center justify-between shrink-0">
      {/* Brand & Connection Status */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-100 tracking-wide">
          <div className="w-6 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-xs">
            🎨
          </div>
          <span>Screen Designer Canvas</span>
        </div>

        <div className="h-4 w-px bg-slate-800 mx-1" />

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-800 border border-slate-700/60">
          <span
            className={`w-2 h-2 rounded-full ${
              connected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
            }`}
          />
          <span className={connected ? 'text-emerald-400' : 'text-rose-400'}>
            {connected ? 'MCP Agent Connected' : 'Waiting for Agent...'}
          </span>
        </div>
      </div>

      {/* Viewport Presets & Artboard Counter */}
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
          <button
            onClick={() => onViewportChange('mobile')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition ${
              viewport === 'mobile'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Mobile (375px)"
          >
            <Smartphone size={14} />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => onViewportChange('tablet')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition ${
              viewport === 'tablet'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Tablet (768px)"
          >
            <Tablet size={14} />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => onViewportChange('desktop')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1.5 transition ${
              viewport === 'desktop'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Desktop (1200px)"
          >
            <Monitor size={14} />
            <span>Desktop</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 px-1">
          {artboardCount} Screens active
        </span>
      </div>

      {/* Zoom Controls */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onZoomChange(Math.max(0.5, zoom - 0.1))}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          title="Zoom Out"
        >
          <ZoomOut size={14} />
        </button>
        <span className="text-xs font-mono text-slate-300 w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          title="Zoom In"
        >
          <ZoomIn size={14} />
        </button>
        <button
          onClick={() => onZoomChange(1.0)}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          title="Reset Zoom"
        >
          <RotateCcw size={14} />
        </button>
      </div>
    </header>
  );
};
