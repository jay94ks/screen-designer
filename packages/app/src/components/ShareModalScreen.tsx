import React, { useState } from 'react';
import { Copy, Check, Smartphone, X } from 'lucide-react';

interface ShareModalScreenProps {
  onClose?: () => void;
}

export const ShareModalScreen: React.FC<ShareModalScreenProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = 'novelnote.zip/w/1042';

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-[420px] bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden text-xs text-slate-800 select-text font-sans">
      {/* Modal Header */}
      <div className="p-5 pb-3 flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">공유하기</h2>
          <p className="text-slate-500 text-[11px] mt-0.5">달빛 아래 검객 · 은하람</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <div className="p-5 pt-2 space-y-4">
        {/* Link Copy Box */}
        <div className="space-y-1.5">
          <label className="text-[11px] text-slate-400 font-medium block">공유 링크</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-slate-100/90 rounded-lg px-3 py-2 text-xs font-mono text-slate-700 border border-slate-200/80 focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs flex items-center gap-1.5 transition active:scale-95"
            >
              {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              <span>{copied ? '복사됨' : '복사'}</span>
            </button>
          </div>
        </div>

        {/* Mobile Share Action */}
        <button className="w-full py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 flex items-center justify-center gap-2 transition active:scale-98">
          <Smartphone size={14} className="text-slate-500" />
          <span>휴대폰 공유</span>
        </button>

        {/* Informational Guidance (스크린샷 내용 그대로) */}
        <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-[11px] text-slate-500 leading-relaxed border border-slate-100">
          <p className="flex items-start gap-1.5">
            <span className="text-slate-400">•</span>
            <span>링크를 열면 작품 상세로 가요. 앱이 깔려 있다면 앱으로 열려요.</span>
          </p>
          <p className="flex items-start gap-1.5">
            <span className="text-slate-400">•</span>
            <span>카드에는 표지 · 제목 · 작가 · 소개 앞부분이 표시돼요.</span>
          </p>
        </div>
      </div>
    </div>
  );
};
