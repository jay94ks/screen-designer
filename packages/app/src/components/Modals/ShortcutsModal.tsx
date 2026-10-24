import React from 'react';
import { X, Keyboard } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { category: '도구 선택 (Tools)', items: [
      { key: 'V', desc: '선택 도구 (Select Tool)' },
      { key: 'H / Space + 드래그', desc: '화면 이동 손바닥 도구 (Hand Tool)' },
      { key: 'F', desc: '새 프레임/아트보드 추가 (Frame Tool)' },
      { key: 'T', desc: '텍스트 삽입 (Text Tool)' },
      { key: 'R', desc: '사각형 컴포넌트 삽입 (Rectangle)' }
    ]},
    { category: '캔버스 제어 (Canvas)', items: [
      { key: 'Ctrl + 마우스 휠', desc: '캔버스 줌 인 / 줌 아웃' },
      { key: 'Ctrl + 0', desc: '100% 실제 크기로 재설정' },
      { key: 'Ctrl + 1', desc: '화면에 맞추기 (Zoom to Fit)' },
      { key: '스페이스바 + 드래그', desc: '캔버스 자유 패닝 (Pan)' }
    ]},
    { category: '편집 및 실행 (Edit)', items: [
      { key: 'Ctrl + Z', desc: '실행 취소 (Undo)' },
      { key: 'Ctrl + Y / Shift + Ctrl + Z', desc: '다시 실행 (Redo)' },
      { key: 'Ctrl + D', desc: '선택 화면 복제 (Duplicate)' },
      { key: 'Delete / Backspace', desc: '선택 화면 삭제' },
      { key: 'Ctrl + P', desc: '프로토타입 재생 (PLAY 모드)' },
      { key: 'Ctrl + E', desc: '내보내기 창 열기 (Export)' }
    ]}
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-100 select-none">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <Keyboard size={16} className="text-indigo-600" />
            <span>키보드 단축키 안내 (Keyboard Shortcuts)</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600">
            <X size={15} />
          </button>
        </div>

        <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
          {shortcuts.map((group) => (
            <div key={group.category} className="space-y-2">
              <div className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider">
                {group.category}
              </div>
              <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
                {group.items.map((item) => (
                  <div key={item.key} className="flex items-center justify-between text-xs py-1 px-1">
                    <span className="text-slate-600">{item.desc}</span>
                    <kbd className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[11px] font-mono text-slate-800 font-semibold shadow-2xs">
                      {item.key}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};
