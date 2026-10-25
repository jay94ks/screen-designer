import React, { useState } from 'react';
import {
  X,
  GitBranch,
  GitCommit,
  CheckCircle2,
  AlertCircle,
  FileCode,
  FolderGit2,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { GitStatusInfo } from '../../types';

interface GitStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  gitStatus: GitStatusInfo;
  pageDocsPath: string;
  onRefresh: () => void;
  onCommit: (message: string) => Promise<boolean>;
}

export const GitStatusModal: React.FC<GitStatusModalProps> = ({
  isOpen,
  onClose,
  gitStatus,
  pageDocsPath,
  onRefresh,
  onCommit
}) => {
  const [commitMessage, setCommitMessage] = useState('feat(ui): update storyboard canvas design documents');
  const [isCommitting, setIsCommitting] = useState(false);
  const [commitSuccess, setCommitSuccess] = useState(false);

  if (!isOpen) return null;

  const handleCommitSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commitMessage.trim() || isCommitting) return;

    setIsCommitting(true);
    const ok = await onCommit(commitMessage);
    setIsCommitting(false);

    if (ok) {
      setCommitSuccess(true);
      setTimeout(() => {
        setCommitSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full flex flex-col overflow-hidden text-xs">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <FolderGit2 size={16} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">Git 화면 디자인 변경 현황</h2>
              <p className="text-[11px] text-slate-500">프로젝트 Git 리포지토리의 UI 스토리보드 변경 사항 추적</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onRefresh}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-500 transition"
              title="Git 상태 새로고침"
            >
              <RotateCcw size={14} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[70vh]">
          {/* Repository Info Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">현재 브랜치</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800 text-xs">
                <GitBranch size={13} className="text-indigo-600 shrink-0" />
                <span className="truncate">{gitStatus.branch || 'main'}</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
              <span className="text-[10px] text-slate-400 font-semibold uppercase block">디자인 문서 저장 위치</span>
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-semibold text-slate-700 truncate">
                <FileCode size={13} className="text-emerald-600 shrink-0" />
                <span className="truncate">{pageDocsPath}/</span>
              </div>
            </div>
          </div>

          {/* Managed Directories Notice */}
          <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start gap-2 text-indigo-950">
            <Sparkles size={14} className="text-indigo-600 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed">
              <strong>.screen-designer/</strong> (내부 설정 및 캐시) 및 <strong>{pageDocsPath}/</strong> (페이지별 VDOM JSON 문서) 경로의 변경사항을 실시간 감지하여 프로젝트 git과 안전하게 동기화합니다.
            </div>
          </div>

          {/* Change Status Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800">
                디자인 파일 변경 목록 ({gitStatus.uiChangesCount}개)
              </span>
              {gitStatus.clean ? (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                  <CheckCircle2 size={11} />
                  <span>모든 화면이 최신 상태</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
                  <AlertCircle size={11} />
                  <span>미커밋 디자인 변경 있음</span>
                </span>
              )}
            </div>

            {gitStatus.designChanges.length === 0 ? (
              <div className="p-6 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <CheckCircle2 size={24} className="mx-auto text-emerald-500 mb-1.5 opacity-80" />
                <p className="font-semibold text-slate-600 text-xs">작업 중인 모든 페이지가 커밋되어 있습니다.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">캔버스에서 디자인을 수정하면 이곳에 변경된 페이지 파일이 실시간 표시됩니다.</p>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden bg-white">
                {gitStatus.designChanges.map((change) => {
                  const isUntracked = change.status === 'untracked';
                  const isAdded = change.status === 'added';
                  const isDeleted = change.status === 'deleted';

                  return (
                    <div key={change.path} className="p-3 flex items-center justify-between hover:bg-slate-50 transition">
                      <div className="flex items-center gap-2 truncate">
                        <FileCode size={13} className="text-slate-400 shrink-0" />
                        <div className="truncate">
                          <div className="font-bold text-slate-800 truncate">{change.filename}</div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">{change.path}</div>
                        </div>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold shrink-0 ${
                          isUntracked
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : isAdded
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isDeleted
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isUntracked ? 'NEW' : isAdded ? 'ADDED' : isDeleted ? 'DELETED' : 'MODIFIED'}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Commit Form */}
          {!gitStatus.clean && (
            <form onSubmit={handleCommitSubmit} className="space-y-3 pt-2 border-t border-slate-100">
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 block">Git 커밋 메시지 (Commit Message)</label>
                <input
                  type="text"
                  value={commitMessage}
                  onChange={(e) => setCommitMessage(e.target.value)}
                  placeholder="커밋 메시지를 입력하세요..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-slate-50 text-xs text-slate-800"
                />
              </div>

              <button
                type="submit"
                disabled={isCommitting || !commitMessage.trim()}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-98 disabled:opacity-50"
              >
                <GitCommit size={14} />
                <span>{isCommitting ? '커밋 중...' : commitSuccess ? '커밋 완료!' : '디자인 변경사항 Git 커밋하기'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            총 {gitStatus.allChangesCount}개 변경 파일 중 {gitStatus.uiChangesCount}개 UI 디자인 파일
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-medium text-xs shadow-2xs"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
