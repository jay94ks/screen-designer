import React, { useState } from 'react';
import { X, Share2, Copy, Check, QrCode, Globe } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectName: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, projectName }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `http://localhost:5173/?project=${encodeURIComponent(projectName)}`;
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="700" frameborder="0"></iframe>`;

  const copyText = (text: string, isEmbed: boolean) => {
    navigator.clipboard.writeText(text);
    if (isEmbed) {
      setCopiedEmbed(true);
      setTimeout(() => setCopiedEmbed(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-100">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <Share2 size={16} className="text-indigo-600" />
            <span>디자인 공유 및 임베드 (Share & Embed)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600">
            <X size={15} />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Share Link */}
          <div className="space-y-1.5">
            <label className="text-slate-600 font-semibold flex items-center gap-1">
              <Globe size={13} className="text-indigo-600" />
              <span>실시간 인터랙티브 웹 프리뷰 링크</span>
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700"
              />
              <button
                onClick={() => copyText(shareUrl, false)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg flex items-center gap-1 shadow-2xs"
              >
                {copiedLink ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedLink ? '복사됨' : '복사'}</span>
              </button>
            </div>
          </div>

          {/* Embed Code */}
          <div className="space-y-1.5">
            <label className="text-slate-600 font-semibold">웹사이트 임베드 코드 (HTML iFrame)</label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={embedCode}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-mono text-slate-700"
              />
              <button
                onClick={() => copyText(embedCode, true)}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-lg flex items-center gap-1 shadow-2xs"
              >
                {copiedEmbed ? <Check size={13} /> : <Copy size={13} />}
                <span>{copiedEmbed ? '복사됨' : '복사'}</span>
              </button>
            </div>
          </div>

          {/* Quick Notice */}
          <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-[11px] text-slate-600 space-y-1">
            <div className="font-semibold text-indigo-700">💡 팀원 및 고객사 공유 안내</div>
            <p>링크를 공유받은 사용자는 별도 설치 없이 모바일/데스크톱 브라우저에서 디자인을 직접 테스트할 수 있습니다.</p>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
