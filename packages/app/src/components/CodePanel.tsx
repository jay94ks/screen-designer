import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

interface CodePanelProps {
  code: string;
  onCodeChange?: (newCode: string) => void;
}

export const CodePanel: React.FC<CodePanelProps> = ({ code, onCodeChange }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-mono text-xs">
      <div className="flex items-center justify-between p-2.5 bg-slate-950 border-b border-slate-800 text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5 font-sans">
          <Code2 size={13} className="text-indigo-400" />
          <span>JSX / Tailwind Component</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
        >
          {copied ? <Check size={11} className="text-emerald-400" /> : <Copy size={11} />}
          <span>{copied ? '복사됨' : '복사'}</span>
        </button>
      </div>

      <textarea
        value={code}
        onChange={(e) => onCodeChange && onCodeChange(e.target.value)}
        spellCheck={false}
        className="flex-1 w-full p-3 bg-transparent text-slate-200 resize-none focus:outline-none leading-relaxed text-[11px]"
      />
    </div>
  );
};
