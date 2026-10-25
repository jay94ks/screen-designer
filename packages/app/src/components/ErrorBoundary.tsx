import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Trash2, Terminal } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[Screen Designer ErrorBoundary caught an error]:', error, errorInfo);
    this.setState({ error, errorInfo });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetStorage = () => {
    if (confirm('로컬 캐시 및 임시 저장 설정을 초기화하고 새로고침하시겠습니까? (작업 파일은 유지됩니다)')) {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
        console.warn('Failed to clear storage:', e);
      }
      window.location.reload();
    }
  };

  private handleOpenDevTools = () => {
    const api = (window as any).electronAPI;
    if (api?.toggleDevTools) {
      api.toggleDevTools();
    } else {
      alert('개발자 도구는 F12 또는 Ctrl+Shift+I 키를 눌러 열 수 있습니다.');
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-8 select-none font-sans">
          <div className="max-w-2xl w-full bg-slate-900 border border-red-500/30 rounded-2xl p-8 shadow-2xl flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-5">
              <AlertTriangle size={32} />
            </div>

            <h1 className="text-xl font-bold text-white mb-2">
              런타임 렌더링 오류가 감지되었습니다
            </h1>
            <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-lg">
              화면 조작 중 예상치 못한 오류가 발생하여 안전하게 중단되었습니다. (화이트아웃 방지)<br />
              아래 버튼으로 복구하거나 개발자 도구(F12) 콘솔에서 상세 스택을 확인할 수 있습니다.
            </p>

            {this.state.error && (
              <div className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-left font-mono text-xs text-red-300 mb-6 max-h-48 overflow-auto select-text">
                <div className="font-bold text-red-400 mb-1">
                  {this.state.error.name}: {this.state.error.message}
                </div>
                {this.state.error.stack && (
                  <pre className="text-[11px] text-slate-500 whitespace-pre-wrap">
                    {this.state.error.stack}
                  </pre>
                )}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition active:scale-95 cursor-pointer"
              >
                <RefreshCw size={14} />
                <span>화면 새로고침 (Reload)</span>
              </button>

              <button
                onClick={this.handleOpenDevTools}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs border border-slate-700 transition active:scale-95 cursor-pointer"
              >
                <Terminal size={14} />
                <span>콘솔 열기 (DevTools / F12)</span>
              </button>

              <button
                onClick={this.handleResetStorage}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 hover:bg-red-950/40 text-slate-400 hover:text-red-300 text-xs border border-slate-800 hover:border-red-900/40 transition active:scale-95 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>캐시 초기화 후 복구</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
