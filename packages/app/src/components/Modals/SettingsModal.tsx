import React, { useState, useEffect } from 'react';
import {
  X,
  Palette,
  Grid,
  Ruler,
  MousePointer,
  Type,
  CreditCard,
  Square,
  Circle,
  RotateCcw,
  Sparkles,
  Sliders,
  FolderOpen,
  FolderGit2,
  Search,
  Layout,
  FileCode,
  Maximize2,
  Quote,
  Code,
  Tag,
  ChevronDown,
  CheckSquare,
  CircleDot,
  Image as ImageIcon,
  Video,
  Music,
  ExternalLink,
  List,
  Table,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { ProjectSettings, ComponentDefaultStyles, ComponentDefaultStyleItem, DEFAULT_COMPONENT_STYLES } from '../../types';
import { NodeType } from '../../types/vdom';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProjectSettings;
  onUpdateSettings: (newSettings: Partial<ProjectSettings>) => void;
  initialTab?: 'canvas' | 'components';
}

type ComponentCategory = 'all' | 'layout' | 'typography' | 'forms' | 'media' | 'data' | 'misc';

interface ComponentMeta {
  key: NodeType;
  name: string;
  tag: string;
  desc: string;
  category: 'layout' | 'typography' | 'forms' | 'media' | 'data' | 'misc';
  icon: any;
}

const COMPONENT_CATALOG: ComponentMeta[] = [
  // 1. Containers & Layout (13)
  { key: 'frame', name: '프레임', tag: '<frame>', desc: '최상위 스크린 프레임', category: 'layout', icon: Layout },
  { key: 'container', name: '컨테이너', tag: '<div>', desc: '일반 레이아웃 블록', category: 'layout', icon: Square },
  { key: 'section', name: '시맨틱 섹션', tag: '<section>', desc: '페이지 주요 블록 구획', category: 'layout', icon: Layout },
  { key: 'header', name: '헤더 영역', tag: '<header>', desc: '상단 네비게이션 및 타이틀 바', category: 'layout', icon: Layout },
  { key: 'footer', name: '푸터 영역', tag: '<footer>', desc: '하단 정보 및 라이선스 영역', category: 'layout', icon: Layout },
  { key: 'nav', name: '네비게이션', tag: '<nav>', desc: '내비게이션 링크 컨테이너', category: 'layout', icon: Layout },
  { key: 'aside', name: '사이드바', tag: '<aside>', desc: '보조 컨텐츠/사이드 패널', category: 'layout', icon: Layout },
  { key: 'main', name: '메인 영역', tag: '<main>', desc: '페이지 주요 본문 블록', category: 'layout', icon: Layout },
  { key: 'article', name: '아티클', tag: '<article>', desc: '독립적인 기사/포스트 블록', category: 'layout', icon: FileCode },
  { key: 'scroll-container', name: '스크롤 컨테이너', tag: '<scroll>', desc: '마우스 휠 스크롤 영역', category: 'layout', icon: Maximize2 },
  { key: 'dialog', name: '모달 다이얼로그', tag: '<dialog>', desc: '팝업 모달 창 (Backdrop + Close)', category: 'layout', icon: Square },
  { key: 'box', name: '사각형 박스', tag: '<box>', desc: '고정 크기 레이아웃 구획 박스', category: 'layout', icon: Square },
  { key: 'card', name: '카드 컨테이너', tag: '<card>', desc: '배경색 및 곡률이 적용된 박스', category: 'layout', icon: CreditCard },

  // 2. Typography (7)
  { key: 'text', name: '본문 텍스트', tag: '<p>', desc: '일반 텍스트 단락', category: 'typography', icon: Type },
  { key: 'heading', name: '대제목', tag: '<h2>', desc: '타이틀 헤딩 텍스트', category: 'typography', icon: Type },
  { key: 'span', name: '인라인 텍스트', tag: '<span>', desc: '인라인 글자 요소', category: 'typography', icon: Type },
  { key: 'blockquote', name: '인용구', tag: '<blockquote>', desc: '강조 인용 블록', category: 'typography', icon: Quote },
  { key: 'code', name: '인라인 코드', tag: '<code>', desc: '고정폭 글꼴 인라인 코드', category: 'typography', icon: Code },
  { key: 'pre', name: '서식 텍스트', tag: '<pre>', desc: '코드 블록 및 원본 서식', category: 'typography', icon: FileCode },
  { key: 'label', name: '폼 라벨', tag: '<label>', desc: '입력 폼 필드 라벨', category: 'typography', icon: Tag },

  // 3. Interactive & Form (7)
  { key: 'button', name: 'CTA 버튼', tag: '<button>', desc: '클릭 인터랙션 주 버튼', category: 'forms', icon: MousePointer },
  { key: 'input', name: '텍스트 인풋', tag: '<input>', desc: '단일 라인 텍스트 입력', category: 'forms', icon: Sliders },
  { key: 'textarea', name: '멀티라인 입력', tag: '<textarea>', desc: '여러 줄 텍스트 입력창', category: 'forms', icon: FileCode },
  { key: 'select', name: '셀렉트 박스', tag: '<select>', desc: '옵션 드롭다운 선택', category: 'forms', icon: ChevronDown },
  { key: 'checkbox', name: '체크박스', tag: '<checkbox>', desc: '다중 선택 체크박스', category: 'forms', icon: CheckSquare },
  { key: 'radio', name: '라디오 버튼', tag: '<radio>', desc: '단일 선택 라디오', category: 'forms', icon: CircleDot },
  { key: 'form', name: '폼 그룹', tag: '<form>', desc: '입력 폼 래퍼 그룹', category: 'forms', icon: Layout },

  // 4. Media & Embedded (4)
  { key: 'image', name: '이미지', tag: '<img>', desc: '반응형 이미지 (Cover / Fit)', category: 'media', icon: ImageIcon },
  { key: 'video', name: '비디오 플레이어', tag: '<video>', desc: '미디어 영상 플레이어', category: 'media', icon: Video },
  { key: 'audio', name: '오디오 바', tag: '<audio>', desc: '음악 및 사운드 플레이어', category: 'media', icon: Music },
  { key: 'iframe', name: '웹 프레임', tag: '<iframe>', desc: '외부 웹사이트 임베드', category: 'media', icon: ExternalLink },

  // 5. Lists & Data (9)
  { key: 'ul', name: '비순서 목록', tag: '<ul>', desc: '글머리 기호 목록', category: 'data', icon: List },
  { key: 'ol', name: '순서 목록', tag: '<ol>', desc: '번호 매김 목록', category: 'data', icon: List },
  { key: 'li', name: '목록 아이템', tag: '<li>', desc: '리스트 개별 항목', category: 'data', icon: List },
  { key: 'table', name: '데이터 테이블', tag: '<table>', desc: '표 컨테이너', category: 'data', icon: Table },
  { key: 'thead', name: '테이블 헤더 그룹', tag: '<thead>', desc: '표 상단 제목 그룹', category: 'data', icon: Table },
  { key: 'tbody', name: '테이블 본문 그룹', tag: '<tbody>', desc: '표 데이터 본문 행들', category: 'data', icon: Table },
  { key: 'tr', name: '테이블 행', tag: '<tr>', desc: '표 가로 행 (Row)', category: 'data', icon: Table },
  { key: 'th', name: '테이블 헤더 셀', tag: '<th>', desc: '열 제목 셀 (Bold)', category: 'data', icon: Table },
  { key: 'td', name: '테이블 데이터 셀', tag: '<td>', desc: '개별 데이터 셀', category: 'data', icon: Table },

  // 6. Disclosure & Separators (5)
  { key: 'details', name: '아코디언', tag: '<details>', desc: '접기/펼치기 디스클로저', category: 'misc', icon: ChevronDown },
  { key: 'summary', name: '아코디언 타이틀', tag: '<summary>', desc: '접기 헤더 제목', category: 'misc', icon: ChevronDown },
  { key: 'divider', name: '구분선', tag: '<hr>', desc: '컨텐츠 수평 구분선', category: 'misc', icon: Layout },
  { key: 'badge', name: '상태 뱃지', tag: '<badge>', desc: '인라인 라벨 및 뱃지', category: 'misc', icon: Tag },
  { key: 'circle', name: '원형 배지', tag: '<circle>', desc: '아바타 및 상태 아이콘', category: 'misc', icon: Circle }
];

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  initialTab = 'components'
}) => {
  const [activeTab, setActiveTab] = useState<'canvas' | 'components'>(initialTab);
  const [selectedComp, setSelectedComp] = useState<NodeType>('button');
  const [categoryFilter, setCategoryFilter] = useState<ComponentCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Path Migration State
  const [draftDocsPath, setDraftDocsPath] = useState(settings.pageDocsPath || 'docs/ui-boards');
  const [isMigratingPath, setIsMigratingPath] = useState(false);
  const [pathChangeSuccess, setPathChangeSuccess] = useState<string | null>(null);

  useEffect(() => {
    setDraftDocsPath(settings.pageDocsPath || 'docs/ui-boards');
  }, [settings.pageDocsPath]);

  const handleApplyPathChange = async () => {
    const trimmed = draftDocsPath.trim();
    if (!trimmed || trimmed === settings.pageDocsPath) return;

    setIsMigratingPath(true);
    setPathChangeSuccess(null);
    try {
      await onUpdateSettings({ pageDocsPath: trimmed });
      setPathChangeSuccess(`성공: '${settings.pageDocsPath || 'docs/ui-boards'}'의 모든 컨텐트가 '${trimmed}'(으)로 이동되었습니다.`);
    } finally {
      setIsMigratingPath(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  if (!isOpen) return null;

  const currentDefaults: ComponentDefaultStyles = {
    ...DEFAULT_COMPONENT_STYLES,
    ...(settings.componentDefaults || {})
  };

  const selectedDef: ComponentDefaultStyleItem =
    currentDefaults[selectedComp] || DEFAULT_COMPONENT_STYLES[selectedComp] || {};

  const handleUpdateComponentDefault = (
    compKey: NodeType,
    updates: Partial<ComponentDefaultStyleItem>
  ) => {
    const nextDefaults: ComponentDefaultStyles = {
      ...currentDefaults,
      [compKey]: {
        ...(currentDefaults[compKey] || {}),
        ...updates
      }
    };
    onUpdateSettings({ componentDefaults: nextDefaults });
  };

  const handleResetComponent = (compKey: NodeType) => {
    handleUpdateComponentDefault(compKey, DEFAULT_COMPONENT_STYLES[compKey]);
  };

  const handleResetAllComponents = () => {
    onUpdateSettings({ componentDefaults: DEFAULT_COMPONENT_STYLES });
  };

  const PRESET_COLORS = [
    '#4f46e5',
    '#2563eb',
    '#0ea5e9',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#8b5cf6',
    '#0f172a',
    '#1e293b',
    '#334155',
    '#64748b',
    '#94a3b8',
    '#f8fafc',
    '#ffffff'
  ];

  const filteredComponents = COMPONENT_CATALOG.filter((item) => {
    const matchesCat = categoryFilter === 'all' || item.category === categoryFilter;
    const query = searchQuery.trim().toLowerCase();
    if (!matchesCat) return false;
    if (!query) return true;
    return (
      item.name.toLowerCase().includes(query) ||
      item.key.toLowerCase().includes(query) ||
      item.tag.toLowerCase().includes(query) ||
      item.desc.toLowerCase().includes(query)
    );
  });

  const selectedMeta = COMPONENT_CATALOG.find((c) => c.key === selectedComp) || COMPONENT_CATALOG[0];
  const SelectedIcon = selectedMeta.icon;

  const categories: Array<{ id: ComponentCategory; label: string; count: number }> = [
    { id: 'all', label: '전체', count: COMPONENT_CATALOG.length },
    { id: 'layout', label: '레이아웃', count: COMPONENT_CATALOG.filter((c) => c.category === 'layout').length },
    { id: 'typography', label: '타이포', count: COMPONENT_CATALOG.filter((c) => c.category === 'typography').length },
    { id: 'forms', label: '폼/입력', count: COMPONENT_CATALOG.filter((c) => c.category === 'forms').length },
    { id: 'media', label: '미디어', count: COMPONENT_CATALOG.filter((c) => c.category === 'media').length },
    { id: 'data', label: '데이터/표', count: COMPONENT_CATALOG.filter((c) => c.category === 'data').length },
    { id: 'misc', label: '기타/구분자', count: COMPONENT_CATALOG.filter((c) => c.category === 'misc').length }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-5xl w-full h-[700px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sliders size={16} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm">환경 설정 & 디자인 시스템 (Settings)</h2>
              <p className="text-[11px] text-slate-500">
                캔버스 환경 및 VDOM 전체 요소({COMPONENT_CATALOG.length}종)의 기본 스타일 토큰 관리
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tab Switcher */}
            <div className="flex bg-slate-200/80 p-0.5 rounded-lg border border-slate-300/60 text-xs">
              <button
                onClick={() => setActiveTab('components')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                  activeTab === 'components'
                    ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Sparkles size={13} className="text-indigo-600" />
                <span>컴포넌트 기본 스타일 ({COMPONENT_CATALOG.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('canvas')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition ${
                  activeTab === 'canvas'
                    ? 'bg-white text-indigo-700 font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Grid size={13} className="text-slate-500" />
                <span>캔버스 환경</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-slate-200/80 rounded-lg text-slate-400 hover:text-slate-700 transition ml-2"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-hidden flex">
          {activeTab === 'canvas' ? (
            /* 1. Canvas Settings Tab */
            <div className="flex-1 p-8 overflow-y-auto space-y-6 max-w-xl mx-auto text-xs">
              {/* Project Documents Storage & Git Settings */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FolderOpen size={16} className="text-indigo-600" />
                  <span>프로젝트 파일 저장소 및 Git (Project Storage)</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3.5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">프로젝트 작업 및 저장 경로</span>
                      <span className="font-mono text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                        기본값: docs/ui-boards
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      변경 시 이 폴더 내의 모든 컨텐트(<code>project.json</code>, <code>design-system.json</code>, <code>pages/</code>, <code>assets/</code>)가 새로운 경로로 자동 이동됩니다.
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={draftDocsPath}
                        onChange={(e) => setDraftDocsPath(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleApplyPathChange();
                        }}
                        placeholder="docs/ui-boards"
                        className="flex-1 px-3 py-1.5 border border-slate-200 rounded-lg bg-white font-mono text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                      />
                      <button
                        onClick={handleApplyPathChange}
                        disabled={isMigratingPath || draftDocsPath.trim() === settings.pageDocsPath}
                        className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 shadow-2xs shrink-0"
                      >
                        <span>{isMigratingPath ? '이동 중...' : '경로 변경 및 파일 이동'}</span>
                      </button>
                    </div>

                    {/* Project Structure Hierarchy Info Box */}
                    <div className="p-2.5 rounded-lg bg-slate-900 text-slate-200 font-mono text-[10px] space-y-1">
                      <div className="text-[10px] font-bold text-indigo-400">📁 {draftDocsPath || 'docs/ui-boards'} 내 자동 저장 파일 구조:</div>
                      <div className="text-slate-300">├── project.json        <span className="text-slate-500"># 프로젝트 및 페이지 짜임새, asset 파일 목록 관리</span></div>
                      <div className="text-slate-300">├── design-system.json  <span className="text-slate-500"># 디자인 시스템 설정 (컴포넌트별 기본값들)</span></div>
                      <div className="text-slate-300">├── pages/              <span className="text-slate-500"># 페이지별 구조화된 JSON 데이터 (1.json, 2.json...)</span></div>
                      <div className="text-slate-300">└── assets/             <span className="text-slate-500"># 프로젝트에서 사용하는 이미지, 폰트 등 에셋</span></div>
                    </div>

                    {pathChangeSuccess && (
                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-[11px] text-emerald-700 font-medium flex items-center gap-1.5">
                        <CheckSquare size={13} className="text-emerald-600 shrink-0" />
                        <span>{pathChangeSuccess}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-700 text-[11px]">
                      <FolderGit2 size={13} className="text-slate-600" />
                      <span>.screen-designer 디렉터리 (자동 관리)</span>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      프로젝트 루트의 <code>.screen-designer/</code> 폴더는 내부 설정(<code>config.json</code>)과 캐시(<code>cache/</code>)를 자동으로 생성 및 보관하는 데 사용됩니다.
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-medium text-slate-700">Git 디자인 변경 사항 자동 감지</span>
                    <input
                      type="checkbox"
                      checked={settings.gitAutoCheck !== false}
                      onChange={(e) => onUpdateSettings({ gitAutoCheck: e.target.checked })}
                      className="rounded text-indigo-600 accent-indigo-600 cursor-pointer w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              {/* Grid Settings */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <Grid size={16} className="text-indigo-600" />
                  <span>그리드 및 가이드 (Grid & Guides)</span>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">도트 그리드 표시 (Show Grid)</span>
                    <input
                      type="checkbox"
                      checked={settings.gridVisible}
                      onChange={(e) => onUpdateSettings({ gridVisible: e.target.checked })}
                      className="rounded text-indigo-600 accent-indigo-600 cursor-pointer w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">그리드 스냅 (Snap to Grid)</span>
                    <input
                      type="checkbox"
                      checked={settings.snapToGrid}
                      onChange={(e) => onUpdateSettings({ snapToGrid: e.target.checked })}
                      className="rounded text-indigo-600 accent-indigo-600 cursor-pointer w-4 h-4"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-medium text-slate-700">그리드 간격</span>
                    <div className="flex gap-1.5">
                      {[8, 16, 24, 32].map((size) => (
                        <button
                          key={size}
                          onClick={() => onUpdateSettings({ gridSize: size })}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium transition ${
                            settings.gridSize === size
                              ? 'bg-indigo-600 text-white font-bold shadow-2xs'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          {size}px
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-medium text-slate-700">
                      <Ruler size={13} className="text-slate-400" />
                      <span>눈금자 표시 (Rulers)</span>
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.rulersVisible}
                      onChange={(e) => onUpdateSettings({ rulersVisible: e.target.checked })}
                      className="rounded text-indigo-600 accent-indigo-600 cursor-pointer w-4 h-4"
                    />
                  </div>
                </div>
              </div>

              {/* Canvas Background */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <Palette size={16} className="text-indigo-600" />
                  <span>캔버스 기본 배경색 (Canvas Background)</span>
                </div>
                <div className="grid grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                  {[
                    { label: '클래식 그레이', value: '#e5e7eb' },
                    { label: '다크 슬레이트', value: '#0f172a' },
                    { label: '쿨 그레이', value: '#f1f5f9' },
                    { label: '화이트', value: '#ffffff' }
                  ].map((bg) => (
                    <button
                      key={bg.value}
                      onClick={() => onUpdateSettings({ canvasBackground: bg.value })}
                      className={`p-3 rounded-xl border text-center transition flex flex-col items-center gap-2 ${
                        settings.canvasBackground === bg.value
                          ? 'border-indigo-600 bg-white ring-2 ring-indigo-500/20 shadow-xs font-bold'
                          : 'border-slate-200 hover:bg-white bg-slate-50/50'
                      }`}
                    >
                      <div className="w-6 h-6 rounded-full border border-slate-300 shadow-2xs" style={{ backgroundColor: bg.value }} />
                      <span className="text-[11px] text-slate-700 truncate">{bg.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* 2. All VDOM Component Default Styles Tab (3-Column Layout) */
            <div className="flex-1 flex overflow-hidden">
              {/* Column 1: Component Explorer Sidebar */}
              <div className="w-64 border-r border-slate-200 bg-slate-50/50 flex flex-col shrink-0 overflow-hidden">
                {/* Search Bar */}
                <div className="p-2.5 border-b border-slate-200 bg-white">
                  <div className="relative">
                    <Search size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="컴포넌트 검색 (45종)..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2 top-2 text-slate-400 hover:text-slate-600"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Category Pills */}
                <div className="px-2 py-1.5 border-b border-slate-200 flex gap-1 overflow-x-auto bg-slate-100/60 shrink-0">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap transition ${
                        categoryFilter === cat.id
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                      }`}
                    >
                      {cat.label} ({cat.count})
                    </button>
                  ))}
                </div>

                {/* Component List */}
                <div className="flex-1 overflow-y-auto p-2 space-y-1">
                  {filteredComponents.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      검색 결과가 없습니다
                    </div>
                  ) : (
                    filteredComponents.map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedComp === item.key;
                      return (
                        <button
                          key={item.key}
                          onClick={() => setSelectedComp(item.key)}
                          className={`w-full text-left p-2 rounded-xl transition flex items-center gap-2.5 ${
                            isSelected
                              ? 'bg-indigo-600 text-white font-bold shadow-xs'
                              : 'text-slate-700 hover:bg-slate-100/80'
                          }`}
                        >
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            <Icon size={13} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="text-xs truncate">{item.name}</span>
                              <span
                                className={`text-[9px] font-mono shrink-0 px-1 py-0.5 rounded ${
                                  isSelected ? 'bg-indigo-700 text-indigo-100' : 'bg-slate-200/70 text-slate-500'
                                }`}
                              >
                                {item.tag}
                              </span>
                            </div>
                            <div
                              className={`text-[10px] truncate ${
                                isSelected ? 'text-indigo-100' : 'text-slate-400'
                              }`}
                            >
                              {item.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Bottom Global Reset Button */}
                <div className="p-2 border-t border-slate-200 bg-white shrink-0">
                  <button
                    onClick={handleResetAllComponents}
                    className="w-full py-1.5 px-2 rounded-lg border border-slate-200 bg-slate-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 text-slate-600 text-[11px] font-medium flex items-center justify-center gap-1.5 transition shadow-2xs"
                  >
                    <RotateCcw size={12} />
                    <span>모든 컴포넌트 초기화</span>
                  </button>
                </div>
              </div>

              {/* Column 2: Style Property Editor */}
              <div className="flex-1 p-6 overflow-y-auto space-y-5 text-xs text-slate-700 bg-white">
                {/* Section Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                      <SelectedIcon size={16} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-900 text-sm">{selectedMeta.name}</h3>
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-mono text-[10px] border border-slate-200">
                          {selectedMeta.tag}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-medium">
                          {selectedMeta.category.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{selectedMeta.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => handleResetComponent(selectedComp)}
                    className="px-2.5 py-1.5 text-[11px] text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition flex items-center gap-1 border border-slate-200"
                    title="현재 컴포넌트 기본값 복원"
                  >
                    <RotateCcw size={11} />
                    <span>기본값 복원</span>
                  </button>
                </div>

                {/* 1. Colors & Background */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 flex items-center gap-1.5">
                      <Palette size={13} className="text-indigo-600" />
                      <span>배경색 및 텍스트 색상 (Colors)</span>
                    </span>
                  </div>

                  {/* Background Color */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-semibold text-slate-700">배경색 (Background Color)</label>
                      <button
                        onClick={() => handleUpdateComponentDefault(selectedComp, { backgroundColor: 'transparent' })}
                        className="text-[10px] text-indigo-600 hover:underline"
                      >
                        투명(Transparent) 적용
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedDef.backgroundColor && selectedDef.backgroundColor !== 'transparent' ? selectedDef.backgroundColor.slice(0, 7) : '#ffffff'}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { backgroundColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={selectedDef.backgroundColor || ''}
                        placeholder="transparent / #hex"
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { backgroundColor: e.target.value })}
                        className="w-28 px-2.5 py-1.5 font-mono text-xs border border-slate-200 rounded-lg bg-white"
                      />
                      <div className="flex gap-1 overflow-x-auto py-1">
                        {PRESET_COLORS.map((c) => (
                          <button
                            key={c}
                            onClick={() => handleUpdateComponentDefault(selectedComp, { backgroundColor: c })}
                            className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110 shrink-0"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Text Color */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">글자색 (Text Color)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedDef.color && selectedDef.color !== 'transparent' ? selectedDef.color.slice(0, 7) : '#0f172a'}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { color: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={selectedDef.color || ''}
                        placeholder="#ffffff"
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { color: e.target.value })}
                        className="w-28 px-2.5 py-1.5 font-mono text-xs border border-slate-200 rounded-lg bg-white"
                      />
                      <div className="flex gap-1">
                        {['#ffffff', '#0f172a', '#94a3b8', '#e2e8f0', '#4f46e5', '#10b981'].map((c) => (
                          <button
                            key={c}
                            onClick={() => handleUpdateComponentDefault(selectedComp, { color: c })}
                            className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Typography Settings */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Type size={13} className="text-indigo-600" />
                    <span>타이포그래피 (Typography)</span>
                  </span>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Font Size */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="font-semibold text-slate-700">폰트 크기 (Font Size)</label>
                        <span className="font-mono text-indigo-600 font-bold">{selectedDef.fontSize || 14}px</span>
                      </div>
                      <input
                        type="range"
                        min={10}
                        max={36}
                        value={selectedDef.fontSize || 14}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { fontSize: Number(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <div className="flex gap-1 pt-1 overflow-x-auto">
                        {[11, 12, 13, 14, 16, 18, 22].map((sz) => (
                          <button
                            key={sz}
                            onClick={() => handleUpdateComponentDefault(selectedComp, { fontSize: sz })}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition border ${
                              (selectedDef.fontSize || 14) === sz
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Font Weight */}
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">폰트 굵기 (Weight)</label>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { label: 'Normal', val: 'normal' },
                          { label: 'Medium', val: '500' },
                          { label: 'Bold', val: 'bold' },
                          { label: 'Extra', val: '800' }
                        ].map((w) => (
                          <button
                            key={w.val}
                            onClick={() => handleUpdateComponentDefault(selectedComp, { fontWeight: w.val })}
                            className={`py-1.5 rounded-lg border text-[11px] font-medium transition ${
                              (selectedDef.fontWeight || 'normal') === w.val
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {w.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Text Alignment */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">텍스트 정렬 (Alignment)</label>
                    <div className="flex gap-2">
                      {[
                        { label: '왼쪽 (Left)', val: 'left' as const, icon: AlignLeft },
                        { label: '가운데 (Center)', val: 'center' as const, icon: AlignCenter },
                        { label: '오른쪽 (Right)', val: 'right' as const, icon: AlignRight }
                      ].map((item) => {
                        const Icon = item.icon;
                        const isAlign = (selectedDef.textAlign || 'left') === item.val;
                        return (
                          <button
                            key={item.val}
                            onClick={() => handleUpdateComponentDefault(selectedComp, { textAlign: item.val })}
                            className={`flex-1 py-1.5 px-2 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 transition ${
                              isAlign
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-2xs'
                                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            <Icon size={13} />
                            <span>{item.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 3. Border & Radius */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Square size={13} className="text-indigo-600" />
                    <span>모서리 곡률 및 테두리 (Border & Radius)</span>
                  </span>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Border Radius */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="font-semibold text-slate-700">모서리 둥글기 (Radius)</label>
                        <span className="font-mono text-indigo-600 font-bold">
                          {selectedDef.borderRadius !== undefined ? `${selectedDef.borderRadius}px` : '0px'}
                        </span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={32}
                        value={selectedDef.borderRadius !== undefined ? Math.min(selectedDef.borderRadius, 32) : 0}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { borderRadius: Number(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <div className="flex gap-1 pt-1">
                        {[0, 4, 8, 12, 16, 999].map((rad) => (
                          <button
                            key={rad}
                            onClick={() => handleUpdateComponentDefault(selectedComp, { borderRadius: rad })}
                            className={`px-2 py-0.5 rounded text-[10px] font-mono transition border ${
                              selectedDef.borderRadius === rad
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {rad === 999 ? 'Pill' : `${rad}px`}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Border Width */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <label className="font-semibold text-slate-700">테두리 두께 (Border Width)</label>
                        <span className="font-mono text-indigo-600 font-bold">{selectedDef.borderWidth || 0}px</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={6}
                        value={selectedDef.borderWidth || 0}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { borderWidth: Number(e.target.value) })}
                        className="w-full accent-indigo-600 cursor-pointer"
                      />
                      <div className="flex gap-1 pt-1">
                        {[0, 1, 2, 3, 4].map((bw) => (
                          <button
                            key={bw}
                            onClick={() => handleUpdateComponentDefault(selectedComp, { borderWidth: bw })}
                            className={`px-2.5 py-0.5 rounded text-[10px] font-mono transition border ${
                              (selectedDef.borderWidth || 0) === bw
                                ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {bw}px
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Border Color */}
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-700 block">테두리 색상 (Border Color)</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={selectedDef.borderColor && selectedDef.borderColor !== 'transparent' ? selectedDef.borderColor.slice(0, 7) : '#334155'}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { borderColor: e.target.value })}
                        className="w-8 h-8 rounded-lg cursor-pointer border border-slate-200 p-0.5 bg-white"
                      />
                      <input
                        type="text"
                        value={selectedDef.borderColor || ''}
                        placeholder="#334155"
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { borderColor: e.target.value })}
                        className="w-28 px-2.5 py-1.5 font-mono text-xs border border-slate-200 rounded-lg bg-white"
                      />
                      <div className="flex gap-1">
                        {['#334155', '#475569', '#64748b', '#cbd5e1', '#4f46e5', '#e2e8f0'].map((c) => (
                          <button
                            key={c}
                            onClick={() => handleUpdateComponentDefault(selectedComp, { borderColor: c })}
                            className="w-5 h-5 rounded-md border border-slate-300 transition hover:scale-110"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Spacing & Dimensions */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Maximize2 size={13} className="text-indigo-600" />
                    <span>여백 및 크기 치수 (Spacing & Dimensions)</span>
                  </span>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="font-semibold text-slate-700">내부 여백 (Padding)</label>
                      <span className="font-mono text-indigo-600 font-bold">{selectedDef.padding ?? 0}px</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={32}
                      value={selectedDef.padding ?? 0}
                      onChange={(e) => handleUpdateComponentDefault(selectedComp, { padding: Number(e.target.value) })}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex gap-1 pt-1">
                      {[0, 4, 8, 12, 16, 20, 24].map((pad) => (
                        <button
                          key={pad}
                          onClick={() => handleUpdateComponentDefault(selectedComp, { padding: pad })}
                          className={`px-2 py-0.5 rounded text-[10px] font-mono transition border ${
                            selectedDef.padding === pad
                              ? 'bg-indigo-600 text-white font-bold border-indigo-600'
                              : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {pad}px
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Width & Height (for components that support fixed sizes) */}
                  <div className="grid grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">기본 너비 (Width)</label>
                      <input
                        type="text"
                        placeholder="100% / 140 / 40"
                        value={selectedDef.width ?? ''}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { width: e.target.value })}
                        className="w-full px-2.5 py-1.5 font-mono text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-700 block">기본 높이 (Height)</label>
                      <input
                        type="text"
                        placeholder="auto / 90 / 180"
                        value={selectedDef.height ?? ''}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { height: e.target.value })}
                        className="w-full px-2.5 py-1.5 font-mono text-xs border border-slate-200 rounded-lg bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* 5. Shadow & Effects */}
                <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 space-y-3.5">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles size={13} className="text-indigo-600" />
                    <span>그림자 효과 (Box Shadow)</span>
                  </span>

                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { label: '없음 (None)', val: undefined },
                      { label: '부드러움 (Soft)', val: '0 2px 4px rgba(0,0,0,0.1)' },
                      { label: '카드 (Card)', val: '0 4px 6px -1px rgba(0,0,0,0.3)' },
                      { label: '모달 (Modal)', val: '0 20px 25px -5px rgba(0,0,0,0.5)' }
                    ].map((sh) => (
                      <button
                        key={sh.label}
                        onClick={() => handleUpdateComponentDefault(selectedComp, { boxShadow: sh.val })}
                        className={`p-2 rounded-lg border text-center transition ${
                          selectedDef.boxShadow === sh.val
                            ? 'bg-indigo-600 text-white font-bold border-indigo-600 shadow-2xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        <div className="text-[11px] truncate">{sh.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Column 3: Live Interactive Preview */}
              <div className="w-80 border-l border-slate-200 bg-slate-50/70 p-5 flex flex-col shrink-0">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 pb-3 border-b border-slate-200">
                  <Sparkles size={14} className="text-amber-500" />
                  <span>실시간 적용 프리뷰 (Live Preview)</span>
                </div>

                {/* Render container preview */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px] my-3 rounded-2xl border border-slate-200/80 shadow-inner overflow-hidden max-h-[460px]">
                  {/* Dynamic Render based on selected component */}
                  {selectedComp === 'button' && (
                    <button
                      style={{
                        backgroundColor: selectedDef.backgroundColor || '#4f46e5',
                        color: selectedDef.color || '#ffffff',
                        borderRadius: selectedDef.borderRadius !== undefined ? `${selectedDef.borderRadius}px` : '12px',
                        padding: `${selectedDef.padding ?? 12}px 24px`,
                        fontSize: `${selectedDef.fontSize || 13}px`,
                        fontWeight: selectedDef.fontWeight || 'bold',
                        boxShadow: selectedDef.boxShadow,
                        borderColor: selectedDef.borderColor,
                        borderWidth: selectedDef.borderWidth ? `${selectedDef.borderWidth}px` : undefined,
                        borderStyle: selectedDef.borderWidth ? 'solid' : undefined
                      }}
                      className="transition active:scale-95 cursor-default"
                    >
                      CTA 버튼 액션
                    </button>
                  )}

                  {selectedComp === 'input' && (
                    <div className="w-full max-w-[220px]">
                      <input
                        type="text"
                        readOnly
                        placeholder="이메일을 입력하세요..."
                        style={{
                          backgroundColor: selectedDef.backgroundColor || '#ffffff',
                          color: selectedDef.color || '#0f172a',
                          borderRadius: `${selectedDef.borderRadius ?? 8}px`,
                          padding: `${selectedDef.padding ?? 10}px`,
                          fontSize: `${selectedDef.fontSize || 13}px`,
                          fontWeight: selectedDef.fontWeight || 'normal',
                          borderColor: selectedDef.borderColor || '#cbd5e1',
                          borderWidth: `${selectedDef.borderWidth ?? 1}px`,
                          borderStyle: 'solid',
                          boxShadow: selectedDef.boxShadow
                        }}
                        className="w-full text-xs focus:outline-none"
                      />
                    </div>
                  )}

                  {selectedComp === 'textarea' && (
                    <div className="w-full max-w-[220px]">
                      <textarea
                        readOnly
                        rows={3}
                        placeholder="상세 내용을 입력하세요..."
                        style={{
                          backgroundColor: selectedDef.backgroundColor || '#ffffff',
                          color: selectedDef.color || '#0f172a',
                          borderRadius: `${selectedDef.borderRadius ?? 8}px`,
                          padding: `${selectedDef.padding ?? 10}px`,
                          fontSize: `${selectedDef.fontSize || 13}px`,
                          fontWeight: selectedDef.fontWeight || 'normal',
                          borderColor: selectedDef.borderColor || '#cbd5e1',
                          borderWidth: `${selectedDef.borderWidth ?? 1}px`,
                          borderStyle: 'solid',
                          boxShadow: selectedDef.boxShadow
                        }}
                        className="w-full text-xs focus:outline-none resize-none"
                      />
                    </div>
                  )}

                  {selectedComp === 'select' && (
                    <div className="w-full max-w-[220px]">
                      <select
                        style={{
                          backgroundColor: selectedDef.backgroundColor || '#ffffff',
                          color: selectedDef.color || '#0f172a',
                          borderRadius: `${selectedDef.borderRadius ?? 8}px`,
                          padding: `${selectedDef.padding ?? 8}px`,
                          fontSize: `${selectedDef.fontSize || 13}px`,
                          fontWeight: selectedDef.fontWeight || 'normal',
                          borderColor: selectedDef.borderColor || '#cbd5e1',
                          borderWidth: `${selectedDef.borderWidth ?? 1}px`,
                          borderStyle: 'solid'
                        }}
                        className="w-full text-xs focus:outline-none"
                      >
                        <option>옵션 A: 표준 요금제</option>
                        <option>옵션 B: 프리미엄 플랜</option>
                      </select>
                    </div>
                  )}

                  {selectedComp === 'checkbox' && (
                    <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded-lg border border-slate-200">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded text-indigo-600 accent-indigo-600"
                      />
                      <span
                        style={{
                          color: selectedDef.color || '#0f172a',
                          fontSize: `${selectedDef.fontSize || 13}px`
                        }}
                      >
                        이용약관 동의
                      </span>
                    </label>
                  )}

                  {selectedComp === 'radio' && (
                    <div className="space-y-2 bg-white px-3 py-2 rounded-lg border border-slate-200">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="preview-radio" defaultChecked className="accent-indigo-600" />
                        <span style={{ color: selectedDef.color || '#0f172a', fontSize: `${selectedDef.fontSize || 13}px` }}>
                          옵션 1 (선택됨)
                        </span>
                      </label>
                    </div>
                  )}

                  {(selectedComp === 'text' || selectedComp === 'heading' || selectedComp === 'span' || selectedComp === 'label') && (
                    <div
                      style={{
                        color: selectedDef.color || '#0f172a',
                        fontSize: `${selectedDef.fontSize || (selectedComp === 'heading' ? 22 : 14)}px`,
                        fontWeight: selectedDef.fontWeight || (selectedComp === 'heading' ? 'bold' : 'normal'),
                        textAlign: selectedDef.textAlign || 'left',
                        padding: `${selectedDef.padding ?? 0}px`
                      }}
                      className="w-full text-center"
                    >
                      {selectedComp === 'heading'
                        ? '대제목 타이틀 (H2)'
                        : selectedComp === 'label'
                        ? '이메일 주소 라벨'
                        : selectedComp === 'span'
                        ? '인라인 강조 텍스트'
                        : '편리한 화면 디자인과 VDOM 구조를 경험해보세요.'}
                    </div>
                  )}

                  {selectedComp === 'blockquote' && (
                    <blockquote
                      style={{
                        backgroundColor: selectedDef.backgroundColor || '#f8fafc',
                        color: selectedDef.color || '#475569',
                        fontSize: `${selectedDef.fontSize || 14}px`,
                        fontWeight: selectedDef.fontWeight || 'normal',
                        padding: `${selectedDef.padding ?? 12}px`,
                        borderRadius: `${selectedDef.borderRadius ?? 6}px`,
                        borderLeftWidth: '4px',
                        borderLeftColor: selectedDef.borderColor || '#6366f1',
                        borderLeftStyle: 'solid'
                      }}
                      className="italic max-w-[240px]"
                    >
                      “디자인은 어떻게 보이고 느껴지는가가 아니라 어떻게 동작하는가이다.”
                    </blockquote>
                  )}

                  {(selectedComp === 'code' || selectedComp === 'pre') && (
                    <div
                      style={{
                        backgroundColor: selectedDef.backgroundColor || '#0f172a',
                        color: selectedDef.color || '#38bdf8',
                        fontSize: `${selectedDef.fontSize || 12}px`,
                        fontWeight: selectedDef.fontWeight || 'normal',
                        padding: `${selectedDef.padding ?? 10}px`,
                        borderRadius: `${selectedDef.borderRadius ?? 8}px`,
                        borderColor: selectedDef.borderColor || '#334155',
                        borderWidth: `${selectedDef.borderWidth ?? 1}px`,
                        borderStyle: 'solid'
                      }}
                      className="font-mono text-xs w-full max-w-[240px] overflow-x-auto"
                    >
                      npm install @screen-designer
                    </div>
                  )}

                  {selectedComp === 'badge' && (
                    <span
                      style={{
                        backgroundColor: selectedDef.backgroundColor || '#6366f120',
                        color: selectedDef.color || '#818cf8',
                        borderRadius: `${selectedDef.borderRadius ?? 999}px`,
                        padding: `${selectedDef.padding ?? 4}px 12px`,
                        fontSize: `${selectedDef.fontSize || 11}px`,
                        fontWeight: selectedDef.fontWeight || 'bold',
                        borderColor: selectedDef.borderColor || '#6366f140',
                        borderWidth: `${selectedDef.borderWidth ?? 1}px`,
                        borderStyle: 'solid'
                      }}
                    >
                      ★ 추천 뱃지 (Badge)
                    </span>
                  )}

                  {selectedComp === 'circle' && (
                    <div
                      style={{
                        backgroundColor: selectedDef.backgroundColor || '#10b981',
                        color: selectedDef.color || '#ffffff',
                        width: `${selectedDef.size || 40}px`,
                        height: `${selectedDef.size || 40}px`,
                        borderRadius: '999px',
                        boxShadow: selectedDef.boxShadow
                      }}
                      className="flex items-center justify-center text-xs font-bold shadow-md"
                    >
                      ●
                    </div>
                  )}

                  {selectedComp === 'divider' && (
                    <div className="w-full max-w-[220px] py-4">
                      <div
                        style={{
                          backgroundColor: selectedDef.backgroundColor || '#334155',
                          height: `${selectedDef.height || 1}px`
                        }}
                        className="w-full"
                      />
                    </div>
                  )}

                  {selectedComp === 'image' && (
                    <div
                      style={{
                        borderRadius: `${selectedDef.borderRadius ?? 12}px`,
                        borderColor: selectedDef.borderColor || '#334155',
                        borderWidth: `${selectedDef.borderWidth ?? 1}px`,
                        borderStyle: 'solid',
                        overflow: 'hidden'
                      }}
                      className="w-48 h-32 relative bg-slate-800 shadow-md"
                    >
                      <img
                        src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&auto=format&fit=crop&q=80"
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {selectedComp === 'video' && (
                    <div
                      style={{
                        borderRadius: `${selectedDef.borderRadius ?? 12}px`,
                        borderColor: selectedDef.borderColor || '#334155',
                        borderWidth: `${selectedDef.borderWidth ?? 1}px`,
                        borderStyle: 'solid'
                      }}
                      className="w-48 h-28 bg-black flex items-center justify-center relative shadow-md"
                    >
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center text-white">
                        ▶
                      </div>
                      <span className="absolute bottom-2 right-2 text-[9px] bg-black/60 px-1.5 py-0.5 rounded text-white font-mono">
                        02:45
                      </span>
                    </div>
                  )}

                  {selectedComp === 'audio' && (
                    <div
                      style={{
                        backgroundColor: selectedDef.backgroundColor || '#1e293b',
                        borderRadius: `${selectedDef.borderRadius ?? 8}px`,
                        padding: `${selectedDef.padding ?? 8}px 12px`,
                        borderColor: selectedDef.borderColor || '#334155',
                        borderWidth: `${selectedDef.borderWidth ?? 1}px`,
                        borderStyle: 'solid'
                      }}
                      className="w-56 flex items-center gap-3 text-white shadow-md"
                    >
                      <div className="w-6 h-6 rounded-full bg-indigo-600 flex items-center justify-center text-[10px]">
                        ▶
                      </div>
                      <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                        <div className="w-1/2 h-full bg-indigo-400 rounded-full" />
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">1:20</span>
                    </div>
                  )}

                  {selectedComp === 'iframe' && (
                    <div
                      style={{
                        borderRadius: `${selectedDef.borderRadius ?? 12}px`,
                        borderColor: selectedDef.borderColor || '#334155',
                        borderWidth: `${selectedDef.borderWidth ?? 1}px`,
                        borderStyle: 'solid'
                      }}
                      className="w-52 h-32 bg-white rounded-xl shadow-md overflow-hidden flex flex-col"
                    >
                      <div className="bg-slate-100 px-2 py-1 border-b border-slate-200 flex items-center gap-1.5">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 rounded-full bg-rose-400" />
                          <div className="w-2 h-2 rounded-full bg-amber-400" />
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                        </div>
                        <div className="text-[9px] font-mono text-slate-400 truncate">https://example.com</div>
                      </div>
                      <div className="flex-1 flex items-center justify-center text-slate-400 text-[11px]">
                        외부 웹사이트 임베드
                      </div>
                    </div>
                  )}

                  {(selectedComp === 'table' || selectedComp === 'thead' || selectedComp === 'tbody' || selectedComp === 'tr' || selectedComp === 'th' || selectedComp === 'td') && (
                    <div
                      style={{
                        backgroundColor: currentDefaults.table?.backgroundColor || '#0f172a',
                        borderRadius: `${currentDefaults.table?.borderRadius ?? 8}px`,
                        borderColor: currentDefaults.table?.borderColor || '#334155',
                        borderWidth: `${currentDefaults.table?.borderWidth ?? 1}px`,
                        borderStyle: 'solid'
                      }}
                      className="w-56 shadow-md overflow-hidden text-[11px]"
                    >
                      <table className="w-full text-left">
                        <thead>
                          <tr className="bg-slate-800 text-slate-300 font-bold border-b border-slate-700">
                            <th className="p-2">항목</th>
                            <th className="p-2">상태</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-300 divide-y divide-slate-800">
                          <tr>
                            <td className="p-2">아이템 A</td>
                            <td className="p-2 text-emerald-400">활성</td>
                          </tr>
                          <tr>
                            <td className="p-2">아이템 B</td>
                            <td className="p-2 text-indigo-400">대기</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  )}

                  {(selectedComp === 'ul' || selectedComp === 'ol' || selectedComp === 'li') && (
                    <ul className="list-disc list-inside space-y-1 text-slate-800 text-xs bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                      <li>첫 번째 리스트 항목</li>
                      <li>두 번째 중요 세부 사항</li>
                      <li>세 번째 인터랙션 완료</li>
                    </ul>
                  )}

                  {(selectedComp === 'details' || selectedComp === 'summary') && (
                    <div
                      style={{
                        backgroundColor: selectedDef.backgroundColor || '#1e293b80',
                        color: selectedDef.color || '#f8fafc',
                        borderRadius: `${selectedDef.borderRadius ?? 8}px`,
                        padding: `${selectedDef.padding ?? 12}px`,
                        borderColor: selectedDef.borderColor || '#334155',
                        borderWidth: `${selectedDef.borderWidth ?? 1}px`,
                        borderStyle: 'solid'
                      }}
                      className="w-56 text-xs shadow-md"
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>자주 묻는 질문 (FAQ)</span>
                        <ChevronDown size={13} />
                      </div>
                      <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-700/60 mt-2">
                        모든 요소는 VDOM과 완벽히 동기화됩니다.
                      </div>
                    </div>
                  )}

                  {/* Fallback for containers: frame, container, section, header, footer, nav, aside, main, article, scroll-container, dialog, box, card, form */}
                  {![
                    'button', 'input', 'textarea', 'select', 'checkbox', 'radio',
                    'text', 'heading', 'span', 'label', 'blockquote', 'code', 'pre',
                    'badge', 'circle', 'divider', 'image', 'video', 'audio', 'iframe',
                    'table', 'thead', 'tbody', 'tr', 'th', 'td', 'ul', 'ol', 'li',
                    'details', 'summary'
                  ].includes(selectedComp) && (
                    <div
                      style={{
                        backgroundColor: selectedDef.backgroundColor || '#1f2937',
                        color: selectedDef.color || '#ffffff',
                        borderColor: selectedDef.borderColor || '#374151',
                        borderWidth: selectedDef.borderWidth !== undefined ? `${selectedDef.borderWidth}px` : '1px',
                        borderStyle: 'solid',
                        borderRadius: selectedDef.borderRadius !== undefined ? `${selectedDef.borderRadius}px` : '16px',
                        padding: `${selectedDef.padding ?? 16}px`,
                        boxShadow: selectedDef.boxShadow,
                        width: selectedDef.width ? `${selectedDef.width}px` : '220px',
                        height: selectedDef.height ? `${selectedDef.height}px` : undefined
                      }}
                      className="shadow-lg text-xs space-y-2"
                    >
                      <div className="font-bold flex items-center justify-between">
                        <span>{selectedMeta.name}</span>
                        <span className="text-[10px] font-mono text-slate-400">{selectedMeta.tag}</span>
                      </div>
                      <div className="text-[11px] text-white/70 leading-relaxed">
                        기본 스타일 토큰이 실시간으로 적용되는 컨테이너 박스입니다.
                      </div>
                    </div>
                  )}
                </div>

                {/* Bottom Context Info */}
                <div className="text-[10px] text-slate-500 bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="font-bold text-indigo-600 block mb-0.5">ℹ️ 스타일 상속 안내:</span>
                  새로 추가되는 모든 '{selectedMeta.name}' 요소에 이 기본 스타일이 자동 적용되며, 캔버스에 추가된 후에도 우측 패널에서 언제든 자유롭게 개별 속성을 수정할 수 있습니다.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-slate-500">
            실시간으로 프로젝트 설정에 자동 저장됩니다.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition active:scale-95"
          >
            적용 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
