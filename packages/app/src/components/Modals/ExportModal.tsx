import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, Package, Image as ImageIcon } from 'lucide-react';
import { Artboard, DocumentProject } from '../../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  artboard: Artboard | null;
  project: DocumentProject;
  onSaveToWorkspace: (targetPath: string, code: string) => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  artboard,
  project,
  onSaveToWorkspace
}) => {
  const [exportType, setExportType] = useState<'jsx' | 'html' | 'project'>('jsx');
  const [targetPath, setTargetPath] = useState('src/components/MyScreen.tsx');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentCode = artboard ? artboard.code : '';

  const handleCopyCode = () => {
    let textToCopy = currentCode;
    if (exportType === 'project') {
      textToCopy = JSON.stringify(project, null, 2);
    }
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    let content = currentCode;
    let filename = `${artboard ? artboard.title.replace(/[^a-zA-Z0-9가-힣]/g, '_') : 'Screen'}.tsx`;
    let mimeType = 'text/plain';

    if (exportType === 'project') {
      content = JSON.stringify(project, null, 2);
      filename = `${project.name.replace(/[^a-zA-Z0-9가-힣]/g, '_')}.screendesigner.json`;
      mimeType = 'application/json';
    } else if (exportType === 'html') {
      filename = `${artboard ? artboard.title.replace(/[^a-zA-Z0-9가-힣]/g, '_') : 'Screen'}.html`;
      mimeType = 'text/html';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <Download size={16} className="text-indigo-600" />
            <span>디자인 및 코드 내보내기 (Export Studio)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600">
            <X size={15} />
          </button>
        </div>

        {/* Format Selector Pills */}
        <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setExportType('jsx')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              exportType === 'jsx' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode size={14} />
            <span>React (TSX/JSX)</span>
          </button>
          <button
            onClick={() => setExportType('html')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              exportType === 'html' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileCode size={14} />
            <span>Tailwind HTML</span>
          </button>
          <button
            onClick={() => setExportType('project')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
              exportType === 'project' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Package size={14} />
            <span>전체 프로젝트 JSON</span>
          </button>
        </div>

        {/* Target Workspace Path (for React code) */}
        {exportType !== 'project' && (
          <div className="space-y-1.5 text-xs">
            <label className="text-slate-600 font-semibold flex items-center justify-between">
              <span>내 프로젝트 내 저장 대상 경로</span>
              <span className="text-[11px] text-slate-400 font-normal">Handoff 연동</span>
            </label>
            <input
              type="text"
              value={targetPath}
              onChange={(e) => setTargetPath(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        )}

        {/* Code Preview Box */}
        <div className="bg-slate-900 rounded-xl p-3 text-slate-200 font-mono text-[11px] max-h-48 overflow-y-auto leading-relaxed border border-slate-800">
          <pre>{exportType === 'project' ? JSON.stringify(project, null, 2) : currentCode}</pre>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <button
            onClick={handleCopyCode}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs flex items-center gap-1.5 transition active:scale-95"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            <span>{copied ? '복사 완료!' : '클립보드 복사'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadFile}
              className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium text-xs flex items-center gap-1.5 shadow-2xs"
            >
              <Download size={13} />
              <span>파일로 다운로드</span>
            </button>
            {exportType !== 'project' && (
              <button
                onClick={() => {
                  onSaveToWorkspace(targetPath, currentCode);
                  alert(`[내보내기 완료] ${targetPath} 경로로 저장되었습니다!`);
                  onClose();
                }}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95"
              >
                <span>워크스페이스에 직접 쓰기</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
