import React, { useState, useMemo } from 'react';
import { Copy, Check, Code2, Download, FileCode, FileJson, Globe, Layers } from 'lucide-react';
import { VDomArtboard, VNode } from '../types/vdom';
import { generateReactCode, generateHtmlCode, vnodeToJsx, vnodeToHtml } from '../utils/serializer';

interface CodePanelProps {
  code: string;
  artboard?: VDomArtboard | null;
  selectedNode?: VNode | null;
  onCodeChange?: (newCode: string) => void;
}

function countVNodes(node?: VNode | null): number {
  if (!node) return 0;
  let total = 1;
  if (node.children) {
    for (const c of node.children) {
      total += countVNodes(c);
    }
  }
  return total;
}

export const CodePanel: React.FC<CodePanelProps> = ({
  code,
  artboard,
  selectedNode,
  onCodeChange
}) => {
  const [format, setFormat] = useState<'react' | 'html' | 'json'>('react');
  const [scope, setScope] = useState<'node' | 'artboard'>('artboard');
  const [copied, setCopied] = useState(false);

  const targetNode = scope === 'node' && selectedNode ? selectedNode : artboard?.rootNode || null;
  const targetName =
    scope === 'node' && selectedNode
      ? selectedNode.name || selectedNode.type
      : artboard?.title || 'ScreenComponent';

  const displayedCode = useMemo(() => {
    if (!targetNode) return code || '';
    if (format === 'react') {
      if (scope === 'node' && selectedNode && selectedNode.id !== artboard?.rootNode.id) {
        return `// Selected Node: <${selectedNode.type}> (${selectedNode.name})\n${vnodeToJsx(selectedNode, 0)}`;
      }
      return generateReactCode(targetName, targetNode);
    }
    if (format === 'html') {
      if (scope === 'node' && selectedNode && selectedNode.id !== artboard?.rootNode.id) {
        return `<!-- Selected Node: <${selectedNode.type}> (${selectedNode.name}) -->\n${vnodeToHtml(selectedNode, 0)}`;
      }
      return generateHtmlCode(targetName, targetNode);
    }
    return JSON.stringify(targetNode, null, 2);
  }, [format, scope, targetNode, targetName, selectedNode, artboard, code]);

  const lines = useMemo(() => displayedCode.split('\n'), [displayedCode]);
  const nodeCount = useMemo(() => countVNodes(targetNode), [targetNode]);
  const byteSize = useMemo(() => new Blob([displayedCode]).size, [displayedCode]);

  const handleCopy = () => {
    navigator.clipboard.writeText(displayedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const ext = format === 'react' ? 'tsx' : format === 'html' ? 'html' : 'json';
    const mime = format === 'json' ? 'application/json' : 'text/plain;charset=utf-8';
    const blob = new Blob([displayedCode], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${targetName.replace(/[^a-zA-Z0-9가-힣_-]/g, '_')}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans text-xs select-none min-w-0">
      {/* 1. Top Format & Scope Control Bar */}
      <div className="p-2.5 bg-slate-950 border-b border-slate-800 space-y-2 shrink-0">
        {/* Format Tabs: React | HTML | JSON */}
        <div className="flex items-center justify-between gap-2">
          <div className="grid grid-cols-3 gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800 flex-1 min-w-0">
            <button
              type="button"
              onClick={() => setFormat('react')}
              className={`py-1 px-2 rounded-md text-[10px] font-bold flex items-center justify-center gap-1 whitespace-nowrap truncate transition ${
                format === 'react'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode size={11} className="shrink-0" />
              <span className="truncate">React TSX</span>
            </button>
            <button
              type="button"
              onClick={() => setFormat('html')}
              className={`py-1 px-2 rounded-md text-[10px] font-bold flex items-center justify-center gap-1 whitespace-nowrap truncate transition ${
                format === 'html'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Globe size={11} className="shrink-0" />
              <span className="truncate">HTML5</span>
            </button>
            <button
              type="button"
              onClick={() => setFormat('json')}
              className={`py-1 px-2 rounded-md text-[10px] font-bold flex items-center justify-center gap-1 whitespace-nowrap truncate transition ${
                format === 'json'
                  ? 'bg-indigo-600 text-white shadow-2xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileJson size={11} className="shrink-0" />
              <span className="truncate">VDOM JSON</span>
            </button>
          </div>

          {/* Copy & Download Buttons */}
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-semibold transition whitespace-nowrap"
              title="클립보드에 코드 복사"
            >
              {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
              <span>{copied ? '복사됨' : '복사'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownload}
              className="p-1 rounded-md bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white transition"
              title="코드 파일 다운로드"
            >
              <Download size={12} />
            </button>
          </div>
        </div>

        {/* Scope Toggle: Full Artboard vs Selected Node */}
        <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
          <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-md border border-slate-800">
            <button
              type="button"
              onClick={() => setScope('artboard')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap transition ${
                scope === 'artboard'
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              전체 장표 ({artboard?.width}×{artboard?.height})
            </button>
            <button
              type="button"
              disabled={!selectedNode}
              onClick={() => setScope('node')}
              className={`px-2 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap transition disabled:opacity-40 ${
                scope === 'node'
                  ? 'bg-slate-800 text-emerald-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              선택 요소만 {selectedNode ? `(<${selectedNode.type}>)` : ''}
            </button>
          </div>

          <span className="font-mono text-[10px] text-slate-500 truncate">
            {nodeCount} nodes · {lines.length} lines
          </span>
        </div>
      </div>

      {/* 2. Code Editor / Viewer with Line Numbers */}
      <div className="flex-1 flex overflow-auto font-mono text-[11px] leading-relaxed select-text">
        {/* Line Numbers Gutter */}
        <div className="py-3 px-2 bg-slate-950/60 text-slate-600 text-right select-none border-r border-slate-800/80 shrink-0">
          {lines.map((_, idx) => (
            <div key={idx} className="leading-[18px]">
              {idx + 1}
            </div>
          ))}
        </div>

        {/* Code Textarea */}
        <textarea
          value={displayedCode}
          onChange={(e) => onCodeChange && onCodeChange(e.target.value)}
          spellCheck={false}
          readOnly
          className="flex-1 w-full p-3 bg-transparent text-slate-200 resize-none focus:outline-none leading-[18px] text-[11px] font-mono overflow-x-auto whitespace-pre"
        />
      </div>

      {/* 3. Bottom Metadata Status Bar */}
      <div className="h-7 px-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-400 shrink-0">
        <div className="flex items-center gap-1.5 truncate">
          <Code2 size={11} className="text-indigo-400 shrink-0" />
          <span className="truncate font-mono">{targetName}</span>
        </div>
        <span className="font-mono text-slate-500 shrink-0">
          {(byteSize / 1024).toFixed(1)} KB · UTF-8
        </span>
      </div>
    </div>
  );
};
