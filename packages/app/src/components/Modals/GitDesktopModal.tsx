import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  Search,
  Check,
  Plus,
  Minus,
  RotateCcw,
  GitBranch,
  GitCommit,
  Upload,
  AlertTriangle,
  Settings,
  Columns,
  AlignJustify,
  Clock,
  User,
  CheckCircle2,
  FileCode,
  FolderGit2,
  ChevronRight,
  Sparkles,
  ArrowUp
} from 'lucide-react';
import {
  GitStatusInfo,
  GitCommitItem,
  FileDiffResult,
  SideBySideRow,
  CommitDetailsResult,
  DesignGitChange
} from '../../types';
import { gitClient } from '../../utils/gitClient';

interface GitDesktopModalProps {
  isOpen: boolean;
  onClose: () => void;
  gitStatus: GitStatusInfo;
  pageDocsPath: string;
  workspacePath?: string;
  onRefresh: () => void;
}

export const GitDesktopModal: React.FC<GitDesktopModalProps> = ({
  isOpen,
  onClose,
  gitStatus,
  pageDocsPath,
  workspacePath,
  onRefresh
}) => {
  // Navigation Tabs: 'changes' | 'history'
  const [activeTab, setActiveTab] = useState<'changes' | 'history'>('changes');

  // Filter Search
  const [changesFilter, setChangesFilter] = useState('');
  const [historyFilter, setHistoryFilter] = useState('');

  // Selected File for Diff
  const [selectedFilePath, setSelectedFilePath] = useState<string>('');
  const [diffResult, setDiffResult] = useState<FileDiffResult | null>(null);
  const [isLoadingDiff, setIsLoadingDiff] = useState(false);
  const [diffMode, setDiffMode] = useState<'split' | 'unified'>('split');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  // Staged Files Selection Checkboxes
  const [stagedFiles, setStagedFiles] = useState<Set<string>>(new Set());

  // Commit Form State
  const [commitSummary, setCommitSummary] = useState('');
  const [commitDescription, setCommitDescription] = useState('');
  const [isCommitting, setIsCommitting] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Push State: unpushed commits count
  const [unpushedCount, setUnpushedCount] = useState<number>(gitStatus.ahead || 0);
  const [justCommitted, setJustCommitted] = useState(false);

  // History State
  const [historyList, setHistoryList] = useState<GitCommitItem[]>([]);
  const [selectedCommitHash, setSelectedCommitHash] = useState<string>('');
  const [commitDetails, setCommitDetails] = useState<CommitDetailsResult | null>(null);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // All changed files list (combine designChanges or allChanges)
  const allChangedFiles = useMemo(() => {
    return gitStatus.allChanges && gitStatus.allChanges.length > 0
      ? gitStatus.allChanges
      : gitStatus.designChanges;
  }, [gitStatus]);

  // Check if a changed file is managed by screen-designer
  const isManagedByApp = (filePath: string): boolean => {
    const norm = filePath.replace(/\\/g, '/');
    const cleanDocs = (pageDocsPath || 'docs/ui-boards').replace(/^\.?\/?/, '').replace(/\/$/, '');
    return (
      norm.startsWith(cleanDocs + '/') ||
      norm === cleanDocs ||
      norm.startsWith('.screen-designer/') ||
      norm === '.screen-designer'
    );
  };

  // Sync unpushed count whenever gitStatus updates
  useEffect(() => {
    if (gitStatus.ahead !== undefined) {
      setUnpushedCount(gitStatus.ahead);
    }
  }, [gitStatus.ahead]);

  // Initialize selected file and staged files when modal opens or files change
  useEffect(() => {
    if (!isOpen) return;

    // By default, ONLY stage files managed by screen-designer (e.g. docs/ui-boards, .screen-designer)
    const managedFiles = allChangedFiles.filter((f) => isManagedByApp(f.path));
    const managedPaths = new Set(managedFiles.map((f) => f.path));
    setStagedFiles(managedPaths);

    // Default select first managed file if available, otherwise first changed file
    if (managedFiles.length > 0) {
      if (!selectedFilePath || !managedPaths.has(selectedFilePath)) {
        setSelectedFilePath(managedFiles[0].path);
      }
    } else if (allChangedFiles.length > 0) {
      if (!selectedFilePath || !allChangedFiles.some((f) => f.path === selectedFilePath)) {
        setSelectedFilePath(allChangedFiles[0].path);
      }
    } else {
      setSelectedFilePath('');
    }

    // Default summary suggestion
    if (!commitSummary) {
      setCommitSummary('feat(ui): update storyboard canvas design documents');
    }
  }, [isOpen, allChangedFiles, pageDocsPath]);

  // Load Diff when selectedFilePath changes (for 'changes' tab)
  useEffect(() => {
    if (!isOpen || activeTab !== 'changes' || !selectedFilePath) {
      if (!selectedFilePath) setDiffResult(null);
      return;
    }

    let isMounted = true;
    setIsLoadingDiff(true);

    gitClient.getDiff(selectedFilePath, workspacePath).then((res) => {
      if (isMounted) {
        setDiffResult(res);
        setIsLoadingDiff(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeTab, selectedFilePath, workspacePath]);

  // Load History when switching to 'history' tab
  useEffect(() => {
    if (!isOpen || activeTab !== 'history') return;

    let isMounted = true;
    setIsLoadingHistory(true);

    gitClient.getHistory(50, workspacePath).then((commits) => {
      if (isMounted) {
        setHistoryList(commits);
        setIsLoadingHistory(false);
        if (commits.length > 0 && !selectedCommitHash) {
          setSelectedCommitHash(commits[0].hash);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeTab, workspacePath]);

  // Load Commit Details when selectedCommitHash changes
  useEffect(() => {
    if (!isOpen || activeTab !== 'history' || !selectedCommitHash) return;

    let isMounted = true;
    gitClient.getCommitDetails(selectedCommitHash, workspacePath).then((details) => {
      if (isMounted) {
        setCommitDetails(details);
        if (details?.files && details.files.length > 0) {
          setSelectedFilePath(details.files[0].path);
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeTab, selectedCommitHash, workspacePath]);

  // Load Diff for selected file inside Commit Details (for 'history' tab)
  useEffect(() => {
    if (!isOpen || activeTab !== 'history' || !selectedCommitHash || !selectedFilePath) return;

    let isMounted = true;
    setIsLoadingDiff(true);
    gitClient.getDiff(selectedFilePath, workspacePath, selectedCommitHash).then((res) => {
      if (isMounted) {
        setDiffResult(res);
        setIsLoadingDiff(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [isOpen, activeTab, selectedCommitHash, selectedFilePath, workspacePath]);

  if (!isOpen) return null;

  // Filtered Changes
  const filteredChangedFiles = allChangedFiles.filter((f) =>
    f.path.toLowerCase().includes(changesFilter.toLowerCase()) ||
    f.filename.toLowerCase().includes(changesFilter.toLowerCase())
  );

  // Toggle Single Staged File
  const handleToggleStageFile = (filePath: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setStagedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(filePath)) next.delete(filePath);
      else next.add(filePath);
      return next;
    });
  };

  // Toggle All Staged Files
  const handleToggleSelectAll = () => {
    if (stagedFiles.size === allChangedFiles.length) {
      setStagedFiles(new Set());
    } else {
      setStagedFiles(new Set(allChangedFiles.map((f) => f.path)));
    }
  };

  // Select only files managed by screen-designer
  const handleSelectManagedOnly = () => {
    const managedFiles = allChangedFiles.filter((f) => isManagedByApp(f.path));
    setStagedFiles(new Set(managedFiles.map((f) => f.path)));
  };

  // Handle Commit Submit
  const handleCommitSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commitSummary.trim() || stagedFiles.size === 0 || isCommitting) return;

    setIsCommitting(true);
    setActionFeedback(null);

    const filesToCommit = Array.from(stagedFiles);
    const res = await gitClient.commit(filesToCommit, commitSummary, commitDescription, workspacePath);

    setIsCommitting(false);

    if (res.success) {
      setJustCommitted(true);
      setUnpushedCount((prev) => (res.ahead !== undefined ? res.ahead : prev + 1));
      setActionFeedback({
        type: 'success',
        message: `커밋 완료! [${res.commitHash ? res.commitHash.slice(0, 7) : 'HEAD'}] 이제 Push 버튼을 눌러 원격에 반영하세요.`
      });
      setCommitSummary('');
      setCommitDescription('');
      onRefresh();
    } else {
      setActionFeedback({
        type: 'error',
        message: `커밋 실패: ${res.error || '알 수 없는 오류'}`
      });
    }
  };

  // Handle Push Submit
  const handlePushSubmit = async () => {
    if (isPushing) return;

    setIsPushing(true);
    setActionFeedback(null);

    const res = await gitClient.push(workspacePath);
    setIsPushing(false);

    if (res.success) {
      setUnpushedCount(0);
      setJustCommitted(false);
      setActionFeedback({
        type: 'success',
        message: '성공적으로 원격 저장소(origin)에 푸시되었습니다!'
      });
      onRefresh();
    } else {
      setActionFeedback({
        type: 'error',
        message: `푸시 실패: ${res.error || '원격 저장소 인증 또는 upstream 브랜치 설정을 확인하세요.'}`
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'added':
        return (
          <span className="w-4 h-4 rounded flex items-center justify-center border border-emerald-500 bg-emerald-50 text-emerald-600 font-bold text-[10px]">
            +
          </span>
        );
      case 'deleted':
        return (
          <span className="w-4 h-4 rounded flex items-center justify-center border border-rose-500 bg-rose-50 text-rose-600 font-bold text-[10px]">
            -
          </span>
        );
      case 'untracked':
        return (
          <span className="w-4 h-4 rounded flex items-center justify-center border border-blue-500 bg-blue-50 text-blue-600 font-bold text-[10px]">
            +
          </span>
        );
      default: // modified
        return (
          <span className="w-4 h-4 rounded flex items-center justify-center border border-amber-500 bg-amber-50 text-amber-600 font-bold text-[9px]">
            ■
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/65 backdrop-blur-xs flex items-center justify-center p-3 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-300 w-full max-w-[1280px] h-[88vh] flex flex-col overflow-hidden text-xs font-sans">
        {/* 1. Modal Top Navigation Bar (GitHub Desktop Style) */}
        <div className="h-12 border-b border-slate-200 px-4 flex items-center justify-between shrink-0 bg-slate-50">
          <div className="flex items-center gap-1 h-full">
            {/* Changes Tab */}
            <button
              onClick={() => setActiveTab('changes')}
              className={`h-full px-5 flex items-center gap-2 font-semibold text-xs border-b-2 transition relative ${
                activeTab === 'changes'
                  ? 'border-blue-600 text-blue-600 font-bold bg-white/70'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>Changes</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'changes' ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {allChangedFiles.length}
              </span>
            </button>

            {/* History Tab */}
            <button
              onClick={() => setActiveTab('history')}
              className={`h-full px-5 flex items-center gap-2 font-semibold text-xs border-b-2 transition relative ${
                activeTab === 'history'
                  ? 'border-blue-600 text-blue-600 font-bold bg-white/70'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <Clock size={13} />
              <span>History</span>
            </button>
          </div>

          {/* Current Diff Target / Tools & Close */}
          <div className="flex items-center gap-3">
            {selectedFilePath && (
              <div className="font-mono text-[11px] text-slate-600 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded truncate max-w-sm">
                {selectedFilePath}
              </div>
            )}

            {/* Diff View Mode (Split / Unified) */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-md">
              <button
                onClick={() => setDiffMode('split')}
                className={`p-1 rounded text-slate-600 transition ${
                  diffMode === 'split' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
                title="Split (Side-by-side) Diff View"
              >
                <Columns size={13} />
              </button>
              <button
                onClick={() => setDiffMode('unified')}
                className={`p-1 rounded text-slate-600 transition ${
                  diffMode === 'unified' ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
                title="Unified Diff View"
              >
                <AlignJustify size={13} />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={onRefresh}
              className="p-1.5 hover:bg-slate-200 rounded-md text-slate-500 hover:text-slate-800 transition"
              title="Git 상태 새로고침"
            >
              <RotateCcw size={14} />
            </button>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200 rounded-md text-slate-400 hover:text-slate-700 transition"
              title="닫기"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* 2. Main Body Content (Two Columns) */}
        <div className="flex flex-1 overflow-hidden relative">
          {/* ======================================================== */}
          {/* TAB 1: CHANGES VIEW                                      */}
          {/* ======================================================== */}
          {activeTab === 'changes' && (
            <>
              {/* Left Column: Filter + Changed Files + Commit / Push Form */}
              <div className="w-[330px] border-r border-slate-200 flex flex-col shrink-0 bg-white">
                {/* Filter Input */}
                <div className="p-2 border-b border-slate-100 flex items-center gap-1.5 bg-white">
                  <div className="relative flex-1">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={changesFilter}
                      onChange={(e) => setChangesFilter(e.target.value)}
                      placeholder="Filter"
                      className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs focus:bg-white focus:outline-none focus:border-blue-500 transition"
                    />
                  </div>
                </div>

                {/* Master Select All Checkbox Header */}
                <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                    <input
                      type="checkbox"
                      checked={stagedFiles.size === allChangedFiles.length && allChangedFiles.length > 0}
                      onChange={handleToggleSelectAll}
                      className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer"
                    />
                    <span>{allChangedFiles.length} files</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectManagedOnly}
                      className="text-[10px] text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-1.5 py-0.5 rounded border border-emerald-200 transition font-medium"
                      title="screen-designer가 관리하는 폴더의 파일만 선택"
                    >
                      앱 관리만
                    </button>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {stagedFiles.size} selected
                    </span>
                  </div>
                </div>

                {/* Changed Files List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
                  {filteredChangedFiles.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <CheckCircle2 size={28} className="mx-auto text-emerald-500 mb-2 opacity-80" />
                      <p className="font-semibold text-xs text-slate-600">No uncommitted changes</p>
                      <p className="text-[11px] text-slate-400 mt-1">
                        캔버스 디자인을 변경하면 이곳에 변경 파일이 실시간 표시됩니다.
                      </p>
                    </div>
                  ) : (
                    filteredChangedFiles.map((f) => {
                      const isSelected = selectedFilePath === f.path;
                      const isStaged = stagedFiles.has(f.path);
                      const isManaged = isManagedByApp(f.path);

                      return (
                        <div
                          key={f.path}
                          onClick={() => setSelectedFilePath(f.path)}
                          className={`px-3 py-2 flex items-center justify-between cursor-pointer border-l-2 transition text-xs ${
                            isSelected
                              ? 'bg-blue-50/80 border-blue-600 text-blue-900 font-semibold'
                              : 'border-transparent hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate pr-2">
                            <input
                              type="checkbox"
                              checked={isStaged}
                              onChange={() => {}}
                              onClick={(e) => handleToggleStageFile(f.path, e)}
                              className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 cursor-pointer shrink-0"
                            />
                            <div className="flex items-center gap-1.5 truncate">
                              {isManaged ? (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/80 shrink-0">
                                  앱 관리
                                </span>
                              ) : (
                                <span className="text-[9px] px-1 py-0.2 rounded bg-slate-100 text-slate-400 font-normal shrink-0">
                                  외부
                                </span>
                              )}
                              <span className="truncate font-mono text-[11px]" title={f.path}>
                                {f.path}
                              </span>
                            </div>
                          </div>
                          <div className="shrink-0">{getStatusBadge(f.status)}</div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Bottom Commit & Push Form (matching screenshot) */}
                <div className="border-t border-slate-200 p-3 bg-white space-y-2.5 shrink-0">
                  {/* Action Feedback Banner */}
                  {actionFeedback && (
                    <div
                      className={`p-2 rounded text-[11px] flex items-center justify-between ${
                        actionFeedback.type === 'success'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border border-rose-200'
                      }`}
                    >
                      <span className="truncate">{actionFeedback.message}</span>
                      <button onClick={() => setActionFeedback(null)} className="shrink-0 ml-1 text-slate-400 hover:text-slate-600">
                        <X size={12} />
                      </button>
                    </div>
                  )}

                  {/* Summary Input */}
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-[9px] shrink-0 shadow-2xs">
                      SD
                    </div>
                    <input
                      type="text"
                      value={commitSummary}
                      onChange={(e) => setCommitSummary(e.target.value)}
                      placeholder="Summary (required)"
                      className="flex-1 px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                  </div>

                  {/* Description Textarea */}
                  <textarea
                    value={commitDescription}
                    onChange={(e) => setCommitDescription(e.target.value)}
                    placeholder="Description"
                    rows={3}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                  />

                  {/* Toolbar & Commit/Push Button */}
                  <div className="space-y-2 pt-1">
                    {/* Branch Status Pill */}
                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <GitBranch size={12} className="text-slate-400" />
                        <span className="font-mono font-semibold text-slate-700">{gitStatus.branch || 'main'}</span>
                        {unpushedCount > 0 && (
                          <span className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.2 rounded font-bold border border-blue-200">
                            {unpushedCount} unpushed
                          </span>
                        )}
                      </div>
                    </div>

                    {/* DYNAMIC PRIMARY BUTTON:
                        If just committed or unpushed commits exist and no staged files selected -> PUSH BUTTON
                        Otherwise -> COMMIT BUTTON
                    */}
                    {unpushedCount > 0 && stagedFiles.size === 0 ? (
                      <button
                        onClick={handlePushSubmit}
                        disabled={isPushing}
                        className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-98 disabled:opacity-50"
                      >
                        {isPushing ? (
                          <>
                            <RotateCcw size={13} className="animate-spin" />
                            <span>Pushing to {gitStatus.tracking || 'origin'}...</span>
                          </>
                        ) : (
                          <>
                            <Upload size={13} />
                            <span>Push {unpushedCount} commit{unpushedCount > 1 ? 's' : ''} to {gitStatus.tracking || 'origin'}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleCommitSubmit()}
                        disabled={isCommitting || !commitSummary.trim() || stagedFiles.size === 0}
                        className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-98 disabled:opacity-50"
                      >
                        {isCommitting ? (
                          <>
                            <RotateCcw size={13} className="animate-spin" />
                            <span>Committing...</span>
                          </>
                        ) : (
                          <>
                            <GitCommit size={13} />
                            <span>
                              Commit {stagedFiles.size} file{stagedFiles.size > 1 ? 's' : ''} to {gitStatus.branch || 'main'}
                            </span>
                          </>
                        )}
                      </button>
                    )}

                    {/* Secondary Push Link if commits exist alongside new uncommitted edits */}
                    {unpushedCount > 0 && stagedFiles.size > 0 && (
                      <button
                        onClick={handlePushSubmit}
                        disabled={isPushing}
                        className="w-full py-1 text-center text-[11px] text-indigo-600 hover:text-indigo-800 font-semibold hover:underline flex items-center justify-center gap-1"
                      >
                        <Upload size={11} />
                        <span>또는 이전 커밋 {unpushedCount}개 바로 푸시하기</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column: Diff Viewer (GitHub Desktop Style) */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {/* Line Endings Warning Banner */}
                {diffResult?.lineEndingWarning && (
                  <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-200/80 flex items-center gap-2 text-amber-900 text-[11px]">
                    <AlertTriangle size={13} className="text-amber-600 shrink-0" />
                    <span>{diffResult.lineEndingWarning}</span>
                  </div>
                )}

                {/* Diff Viewer Canvas */}
                <div className="flex-1 overflow-auto font-mono text-[11px]">
                  {isLoadingDiff ? (
                    <div className="h-full flex items-center justify-center text-slate-400 gap-2">
                      <RotateCcw size={16} className="animate-spin" />
                      <span>Loading diff...</span>
                    </div>
                  ) : !selectedFilePath ? (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      <span>좌측에서 변경된 파일을 선택하면 Git Diff가 표시됩니다.</span>
                    </div>
                  ) : diffResult?.isBinary ? (
                    <div className="h-full flex items-center justify-center text-slate-500">
                      <span>바이너리 파일입니다. 시각적 텍스트 diff를 지원하지 않습니다.</span>
                    </div>
                  ) : !diffResult?.rows || diffResult.rows.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-slate-400">
                      <span>변경 내역이 없거나 파일이 비어 있습니다.</span>
                    </div>
                  ) : diffMode === 'split' ? (
                    /* SPLIT (SIDE-BY-SIDE) VIEW (Exact GitHub Desktop Layout) */
                    <table className="w-full border-collapse">
                      <tbody>
                        {diffResult.rows.map((row, idx) => {
                          if (row.isHunkHeader) {
                            return (
                              <tr key={`hunk-${idx}`} className="bg-slate-100/90 text-slate-500 select-none border-y border-slate-200">
                                <td colSpan={6} className="py-1 px-4 font-mono text-[11px] text-slate-600">
                                  <div className="flex items-center gap-2">
                                    <ArrowUp size={11} className="text-slate-400" />
                                    <span>{row.hunkHeader}</span>
                                  </div>
                                </td>
                              </tr>
                            );
                          }

                          const isDel = row.oldType === 'del';
                          const isAdd = row.newType === 'add';

                          return (
                            <tr key={`row-${idx}`} className="leading-5 hover:bg-slate-100/40">
                              {/* Left Side (Old) Gutter & Line */}
                              <td className={`w-12 text-right pr-2 select-none font-mono text-[10px] ${
                                isDel ? 'bg-red-100/80 text-red-600' : 'text-slate-400 bg-slate-50/50'
                              }`}>
                                {row.oldLineNo ?? ''}
                              </td>
                              <td className={`w-6 text-center select-none font-bold ${
                                isDel ? 'bg-red-100 text-red-700' : ''
                              }`}>
                                {isDel ? '-' : ''}
                              </td>
                              <td className={`w-1/2 px-2 whitespace-pre font-mono overflow-x-hidden border-r border-slate-200 ${
                                isDel ? 'bg-red-50 text-red-950 font-medium' : row.oldType === 'empty' ? 'bg-slate-50/30' : 'text-slate-800'
                              }`}>
                                {row.oldContent ?? ''}
                              </td>

                              {/* Right Side (New) Gutter & Line */}
                              <td className={`w-12 text-right pr-2 select-none font-mono text-[10px] ${
                                isAdd ? 'bg-green-100/80 text-green-700' : 'text-slate-400 bg-slate-50/50'
                              }`}>
                                {row.newLineNo ?? ''}
                              </td>
                              <td className={`w-6 text-center select-none font-bold ${
                                isAdd ? 'bg-green-100 text-green-700' : ''
                              }`}>
                                {isAdd ? '+' : ''}
                              </td>
                              <td className={`w-1/2 px-2 whitespace-pre font-mono overflow-x-hidden ${
                                isAdd ? 'bg-green-50 text-green-950 font-medium' : row.newType === 'empty' ? 'bg-slate-50/30' : 'text-slate-800'
                              }`}>
                                {row.newContent ?? ''}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : (
                    /* UNIFIED VIEW */
                    <table className="w-full border-collapse">
                      <tbody>
                        {diffResult.rows.map((row, idx) => {
                          if (row.isHunkHeader) {
                            return (
                              <tr key={`hunk-${idx}`} className="bg-slate-100 text-slate-500 border-y border-slate-200">
                                <td colSpan={3} className="py-1 px-4 font-mono text-[11px]">
                                  {row.hunkHeader}
                                </td>
                              </tr>
                            );
                          }

                          const isDel = row.oldType === 'del';
                          const isAdd = row.newType === 'add';

                          if (isDel) {
                            return (
                              <tr key={`del-${idx}`} className="bg-red-50 text-red-950 leading-5">
                                <td className="w-12 text-right pr-2 select-none text-red-500 bg-red-100/60 text-[10px]">
                                  {row.oldLineNo}
                                </td>
                                <td className="w-12 text-right pr-2 select-none text-slate-300 text-[10px]"></td>
                                <td className="px-3 whitespace-pre font-mono">
                                  <span className="font-bold text-red-600 mr-2">-</span>
                                  {row.oldContent}
                                </td>
                              </tr>
                            );
                          }

                          if (isAdd) {
                            return (
                              <tr key={`add-${idx}`} className="bg-green-50 text-green-950 leading-5">
                                <td className="w-12 text-right pr-2 select-none text-slate-300 text-[10px]"></td>
                                <td className="w-12 text-right pr-2 select-none text-green-600 bg-green-100/60 text-[10px]">
                                  {row.newLineNo}
                                </td>
                                <td className="px-3 whitespace-pre font-mono">
                                  <span className="font-bold text-green-600 mr-2">+</span>
                                  {row.newContent}
                                </td>
                              </tr>
                            );
                          }

                          return (
                            <tr key={`norm-${idx}`} className="text-slate-800 leading-5 hover:bg-slate-50">
                              <td className="w-12 text-right pr-2 select-none text-slate-400 bg-slate-50/50 text-[10px]">
                                {row.oldLineNo}
                              </td>
                              <td className="w-12 text-right pr-2 select-none text-slate-400 bg-slate-50/50 text-[10px]">
                                {row.newLineNo}
                              </td>
                              <td className="px-3 whitespace-pre font-mono">
                                <span className="text-transparent mr-2"> </span>
                                {row.newContent ?? row.oldContent}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </>
          )}

          {/* ======================================================== */}
          {/* TAB 2: HISTORY VIEW                                      */}
          {/* ======================================================== */}
          {activeTab === 'history' && (
            <>
              {/* Left Column: Commits List */}
              <div className="w-[330px] border-r border-slate-200 flex flex-col shrink-0 bg-white">
                {/* Search Filter */}
                <div className="p-2 border-b border-slate-100 flex items-center gap-1.5 bg-white">
                  <div className="relative flex-1">
                    <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={historyFilter}
                      onChange={(e) => setHistoryFilter(e.target.value)}
                      placeholder="Search commits"
                      className="w-full pl-7 pr-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs focus:bg-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Commit History List */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
                  {isLoadingHistory ? (
                    <div className="p-8 text-center text-slate-400 gap-2 flex items-center justify-center">
                      <RotateCcw size={14} className="animate-spin" />
                      <span>Loading commits...</span>
                    </div>
                  ) : historyList.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">
                      <Clock size={24} className="mx-auto text-slate-300 mb-2" />
                      <p className="font-semibold text-xs text-slate-600">No commits found</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">아직 커밋된 히스토리가 없습니다.</p>
                    </div>
                  ) : (
                    historyList
                      .filter((c) =>
                        c.message.toLowerCase().includes(historyFilter.toLowerCase()) ||
                        c.author_name.toLowerCase().includes(historyFilter.toLowerCase()) ||
                        c.shortHash.includes(historyFilter)
                      )
                      .map((c) => {
                        const isSelected = selectedCommitHash === c.hash;
                        return (
                          <div
                            key={c.hash}
                            onClick={() => setSelectedCommitHash(c.hash)}
                            className={`p-3 cursor-pointer border-l-2 transition text-xs ${
                              isSelected
                                ? 'bg-blue-50/80 border-blue-600 text-blue-950 font-semibold'
                                : 'border-transparent hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold text-slate-900 truncate">{c.message}</span>
                              <span className="font-mono text-[10px] text-slate-400 shrink-0 bg-slate-100 px-1 rounded">
                                {c.shortHash}
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span className="truncate">{c.author_name}</span>
                              <span className="shrink-0">{new Date(c.date).toLocaleDateString()}</span>
                            </div>
                          </div>
                        );
                      })
                  )}
                </div>
              </div>

              {/* Right Column: Commit Details & Changed Files & Diff */}
              <div className="flex-1 flex flex-col overflow-hidden bg-white">
                {commitDetails ? (
                  <>
                    {/* Commit Info Header */}
                    <div className="p-4 border-b border-slate-200 bg-slate-50/60 shrink-0 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-slate-900 text-sm">{commitDetails.message}</h3>
                          {commitDetails.body && (
                            <p className="text-xs text-slate-600 mt-1 whitespace-pre-wrap">{commitDetails.body}</p>
                          )}
                        </div>
                        <span className="font-mono text-[11px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded shadow-2xs">
                          {commitDetails.shortHash}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                        <div className="flex items-center gap-1.5">
                          <User size={12} className="text-slate-400" />
                          <span className="font-medium text-slate-700">{commitDetails.author_name}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={12} className="text-slate-400" />
                          <span>{new Date(commitDetails.date).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Commit Modified Files Pill List */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        <span className="text-[10px] text-slate-400 font-bold">FILES ({commitDetails.files.length}):</span>
                        {commitDetails.files.map((cf) => (
                          <button
                            key={cf.path}
                            onClick={() => setSelectedFilePath(cf.path)}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono border transition flex items-center gap-1 ${
                              selectedFilePath === cf.path
                                ? 'bg-blue-600 text-white border-blue-600 font-bold'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            <span>{cf.filename}</span>
                            {getStatusBadge(cf.status)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Diff Viewer for this commit */}
                    <div className="flex-1 overflow-auto font-mono text-[11px]">
                      {isLoadingDiff ? (
                        <div className="h-full flex items-center justify-center text-slate-400 gap-2">
                          <RotateCcw size={16} className="animate-spin" />
                          <span>Loading diff for commit...</span>
                        </div>
                      ) : !diffResult?.rows || diffResult.rows.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-slate-400">
                          <span>변경 내역이 없거나 바이너리 파일입니다.</span>
                        </div>
                      ) : (
                        <table className="w-full border-collapse">
                          <tbody>
                            {diffResult.rows.map((row, idx) => {
                              if (row.isHunkHeader) {
                                return (
                                  <tr key={`hunk-${idx}`} className="bg-slate-100 text-slate-500 border-y border-slate-200">
                                    <td colSpan={6} className="py-1 px-4 font-mono text-[11px]">
                                      {row.hunkHeader}
                                    </td>
                                  </tr>
                                );
                              }

                              const isDel = row.oldType === 'del';
                              const isAdd = row.newType === 'add';

                              return (
                                <tr key={`row-${idx}`} className="leading-5 hover:bg-slate-100/40">
                                  <td className={`w-12 text-right pr-2 select-none font-mono text-[10px] ${
                                    isDel ? 'bg-red-100 text-red-600' : 'text-slate-400 bg-slate-50/50'
                                  }`}>
                                    {row.oldLineNo ?? ''}
                                  </td>
                                  <td className={`w-6 text-center select-none font-bold ${
                                    isDel ? 'bg-red-100 text-red-700' : ''
                                  }`}>
                                    {isDel ? '-' : ''}
                                  </td>
                                  <td className={`w-1/2 px-2 whitespace-pre font-mono overflow-x-hidden border-r border-slate-200 ${
                                    isDel ? 'bg-red-50 text-red-950 font-medium' : 'text-slate-800'
                                  }`}>
                                    {row.oldContent ?? ''}
                                  </td>

                                  <td className={`w-12 text-right pr-2 select-none font-mono text-[10px] ${
                                    isAdd ? 'bg-green-100 text-green-700' : 'text-slate-400 bg-slate-50/50'
                                  }`}>
                                    {row.newLineNo ?? ''}
                                  </td>
                                  <td className={`w-6 text-center select-none font-bold ${
                                    isAdd ? 'bg-green-100 text-green-700' : ''
                                  }`}>
                                    {isAdd ? '+' : ''}
                                  </td>
                                  <td className={`w-1/2 px-2 whitespace-pre font-mono overflow-x-hidden ${
                                    isAdd ? 'bg-green-50 text-green-950 font-medium' : 'text-slate-800'
                                  }`}>
                                    {row.newContent ?? ''}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    <span>커밋을 선택하면 상세 정보 및 변경 Diff가 표시됩니다.</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
