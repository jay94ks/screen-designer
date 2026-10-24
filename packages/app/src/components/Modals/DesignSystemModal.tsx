import React, { useState, useMemo } from 'react';
import {
  X,
  Palette,
  Search,
  RotateCcw,
  Check,
  Layout,
  Square,
  FileCode,
  Maximize2,
  CreditCard,
  Type,
  Quote,
  Code,
  Tag,
  MousePointer,
  Sliders,
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
  AlignRight,
  Circle,
  Copy,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Grid
} from 'lucide-react';
import {
  ProjectSettings,
  ComponentDefaultStyles,
  ComponentDefaultStyleItem,
  DEFAULT_COMPONENT_STYLES
} from '../../types';
import { NodeType, VNode } from '../../types/vdom';
import { VNodeRenderer } from '../VNodeRenderer';

interface DesignSystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: ProjectSettings;
  onUpdateSettings: (newSettings: Partial<ProjectSettings>) => void;
}

type ComponentCategory = 'all' | 'layout' | 'typography' | 'forms' | 'media' | 'data' | 'misc';

interface ComponentMeta {
  key: NodeType;
  name: string;
  tag: string;
  desc: string;
  category: 'layout' | 'typography' | 'forms' | 'media' | 'data' | 'misc';
  icon: any;
  defaultContent?: string;
  defaultProps?: Record<string, any>;
  sampleChildren?: VNode[];
}

const COMPONENT_CATALOG: ComponentMeta[] = [
  // 1. Containers & Layout (13)
  {
    key: 'frame',
    name: '프레임',
    tag: '<frame>',
    desc: '최상위 스크린 프레임',
    category: 'layout',
    icon: Layout,
    defaultContent: '',
    sampleChildren: [
      { id: 'f-sub-1', type: 'heading', name: '헤딩', content: '스크린 프레임 타이틀', style: { color: '#ffffff', fontSize: 18, fontWeight: 700 } },
      { id: 'f-sub-2', type: 'text', name: '본문', content: '프레임 내부의 컨텐트 영역입니다.', style: { color: '#94a3b8', fontSize: 13 } }
    ]
  },
  { key: 'container', name: '컨테이너', tag: '<div>', desc: '일반 레이아웃 블록', category: 'layout', icon: Square, defaultContent: '컨테이너 블록 (레이아웃 그룹)' },
  { key: 'section', name: '시맨틱 섹션', tag: '<section>', desc: '페이지 주요 블록 구획', category: 'layout', icon: Layout, defaultContent: '섹션 구획 (Section Container)' },
  { key: 'header', name: '헤더 영역', tag: '<header>', desc: '상단 네비게이션 및 타이틀 바', category: 'layout', icon: Layout, defaultContent: '앱/페이지 상단 헤더 (Header)' },
  { key: 'footer', name: '푸터 영역', tag: '<footer>', desc: '하단 정보 및 라이선스 영역', category: 'layout', icon: Layout, defaultContent: '© 2026 Screen Designer. All rights reserved.' },
  { key: 'nav', name: '네비게이션', tag: '<nav>', desc: '내비게이션 링크 컨테이너', category: 'layout', icon: Layout, defaultContent: '홈 · 대시보드 · 설정 · 프로필' },
  { key: 'aside', name: '사이드바', tag: '<aside>', desc: '보조 컨텐츠/사이드 패널', category: 'layout', icon: Layout, defaultContent: '사이드 패널 보조 정보' },
  { key: 'main', name: '메인 영역', tag: '<main>', desc: '페이지 주요 본문 블록', category: 'layout', icon: Layout, defaultContent: '메인 컨텐츠 본문 구역 (Main Area)' },
  { key: 'article', name: '아티클', tag: '<article>', desc: '독립적인 기사/포스트 블록', category: 'layout', icon: FileCode, defaultContent: '독립 아티클 카드 및 포스트 내용' },
  {
    key: 'scroll-container',
    name: '스크롤 컨테이너',
    tag: '<scroll>',
    desc: '마우스 휠 스크롤 영역',
    category: 'layout',
    icon: Maximize2,
    defaultContent: '',
    sampleChildren: [
      { id: 'sc-1', type: 'card', name: '아이템 1', content: '스크롤 아이템 1 (비트코인 ETF)', style: { padding: 12, backgroundColor: '#1e293b', color: '#fff', borderRadius: 8, marginBottom: 8 } },
      { id: 'sc-2', type: 'card', name: '아이템 2', content: '스크롤 아이템 2 (이더리움 스테이킹)', style: { padding: 12, backgroundColor: '#1e293b', color: '#fff', borderRadius: 8, marginBottom: 8 } },
      { id: 'sc-3', type: 'card', name: '아이템 3', content: '스크롤 아이템 3 (미국 나스닥 지수)', style: { padding: 12, backgroundColor: '#1e293b', color: '#fff', borderRadius: 8 } }
    ]
  },
  {
    key: 'dialog',
    name: '모달 다이얼로그',
    tag: '<dialog>',
    desc: '팝업 모달 창 (Backdrop + Close)',
    category: 'layout',
    icon: Square,
    defaultContent: '알림 모달 다이얼로그 내용',
    defaultProps: { open: true, title: '다이얼로그 팝업' }
  },
  { key: 'box', name: '사각형 박스', tag: '<box>', desc: '고정 크기 레이아웃 구획 박스', category: 'layout', icon: Square, defaultContent: '박스 레이아웃' },
  { key: 'card', name: '카드 컨테이너', tag: '<card>', desc: '배경색 및 곡률이 적용된 박스', category: 'layout', icon: CreditCard, defaultContent: '카드 컨테이너 (Card UI Component)' },

  // 2. Typography (7)
  { key: 'text', name: '본문 텍스트', tag: '<p>', desc: '일반 텍스트 단락', category: 'typography', icon: Type, defaultContent: '디자이너와 기획자를 위한 시각적 스토리보드 캔버스 시스템입니다.' },
  { key: 'heading', name: '대제목', tag: '<h2>', desc: '타이틀 헤딩 텍스트', category: 'typography', icon: Type, defaultContent: '스마트 자산 포트폴리오 관리' },
  { key: 'span', name: '인라인 텍스트', tag: '<span>', desc: '인라인 글자 요소', category: 'typography', icon: Type, defaultContent: '강조 인라인 텍스트' },
  { key: 'blockquote', name: '인용구', tag: '<blockquote>', desc: '강조 인용 블록', category: 'typography', icon: Quote, defaultContent: '“디자인은 어떻게 보이고 느껴지는가가 아니라 어떻게 작동하는가이다.”' },
  { key: 'code', name: '인라인 코드', tag: '<code>', desc: '고정폭 글꼴 인라인 코드', category: 'typography', icon: Code, defaultContent: 'const status = "active";' },
  { key: 'pre', name: '서식 텍스트', tag: '<pre>', desc: '코드 블록 및 원본 서식', category: 'typography', icon: FileCode, defaultContent: 'function calculate() {\n  return 42;\n}' },
  { key: 'label', name: '폼 라벨', tag: '<label>', desc: '입력 폼 필드 라벨', category: 'typography', icon: Tag, defaultContent: '사용자 이메일 주소' },

  // 3. Interactive & Form (7)
  { key: 'button', name: 'CTA 버튼', tag: '<button>', desc: '클릭 인터랙션 주 버튼', category: 'forms', icon: MousePointer, defaultContent: '지금 바로 시작하기' },
  { key: 'input', name: '텍스트 인풋', tag: '<input>', desc: '단일 라인 텍스트 입력', category: 'forms', icon: Sliders, defaultContent: '사용자 입력 값 예시', defaultProps: { placeholder: '값을 입력하세요...' } },
  { key: 'textarea', name: '멀티라인 입력', tag: '<textarea>', desc: '여러 줄 텍스트 입력창', category: 'forms', icon: FileCode, defaultContent: '상세 내용을 자유롭게 작성할 수 있는 멀티라인 입력 필드입니다.' },
  { key: 'select', name: '셀렉트 박스', tag: '<select>', desc: '옵션 드롭다운 선택', category: 'forms', icon: ChevronDown, defaultContent: '대한민국 (KRW)', defaultProps: { options: ['대한민국 (KRW)', '미국 (USD)', '일본 (JPY)'] } },
  { key: 'checkbox', name: '체크박스', tag: '<checkbox>', desc: '다중 선택 체크박스', category: 'forms', icon: CheckSquare, defaultContent: '서비스 이용약관 및 개인정보 처리방침에 동의합니다.', defaultProps: { checked: true } },
  { key: 'radio', name: '라디오 버튼', tag: '<radio>', desc: '단일 선택 라디오', category: 'forms', icon: CircleDot, defaultContent: '신용/체크카드 결제 방식 선택', defaultProps: { checked: true } },
  { key: 'form', name: '폼 그룹', tag: '<form>', desc: '입력 폼 래퍼 그룹', category: 'forms', icon: Layout, defaultContent: '폼 입력 그룹' },

  // 4. Media & Embedded (4)
  { key: 'image', name: '이미지', tag: '<img>', desc: '반응형 이미지 (Cover / Fit)', category: 'media', icon: ImageIcon, defaultProps: { src: 'assets/sample-fintech-chart.svg', alt: 'Sample Chart' } },
  { key: 'video', name: '비디오 플레이어', tag: '<video>', desc: '미디어 영상 플레이어', category: 'media', icon: Video, defaultProps: { controls: true } },
  { key: 'audio', name: '오디오 바', tag: '<audio>', desc: '음악 및 사운드 플레이어', category: 'media', icon: Music, defaultProps: { controls: true } },
  { key: 'iframe', name: '웹 프레임', tag: '<iframe>', desc: '외부 웹사이트 임베드', category: 'media', icon: ExternalLink, defaultProps: { src: 'https://example.com' } },

  // 5. Lists & Data (9)
  { key: 'ul', name: '비순서 목록', tag: '<ul>', desc: '글머리 기호 목록', category: 'data', icon: List, defaultContent: '• 첫 번째 목록 항목\n• 두 번째 목록 항목\n• 세 번째 목록 항목' },
  { key: 'ol', name: '순서 목록', tag: '<ol>', desc: '번호 매김 목록', category: 'data', icon: List, defaultContent: '1. 계정 생성 및 본인인증\n2. 포트폴리오 자산 등록\n3. 실시간 리밸런싱 실행' },
  { key: 'li', name: '목록 아이템', tag: '<li>', desc: '리스트 개별 항목', category: 'data', icon: List, defaultContent: '개별 리스트 항목' },
  {
    key: 'table',
    name: '데이터 테이블',
    tag: '<table>',
    desc: '표 컨테이너',
    category: 'data',
    icon: Table,
    defaultContent: '',
    sampleChildren: [
      { id: 'th-row', type: 'tr', name: '헤더 행', style: { borderColor: '#334155', borderWidth: 1, borderStyle: 'solid' }, children: [
        { id: 'th-1', type: 'th', name: '자산명', content: '자산명', style: { padding: 8, color: '#94a3b8', textAlign: 'left' } },
        { id: 'th-2', type: 'th', name: '평가액', content: '평가금액', style: { padding: 8, color: '#94a3b8', textAlign: 'right' } }
      ]},
      { id: 'td-row-1', type: 'tr', name: '데이터 행 1', style: {}, children: [
        { id: 'td-1', type: 'td', name: '비트코인', content: '비트코인 (BTC)', style: { padding: 8, color: '#f8fafc' } },
        { id: 'td-2', type: 'td', name: '10,000,000', content: '₩10,000,000', style: { padding: 8, color: '#38bdf8', textAlign: 'right', fontWeight: '600' } }
      ]}
    ]
  },
  { key: 'thead', name: '테이블 헤더 그룹', tag: '<thead>', desc: '표 상단 제목 그룹', category: 'data', icon: Table, defaultContent: '헤더 그룹' },
  { key: 'tbody', name: '테이블 본문 그룹', tag: '<tbody>', desc: '표 데이터 본문 행들', category: 'data', icon: Table, defaultContent: '본문 그룹' },
  { key: 'tr', name: '테이블 행', tag: '<tr>', desc: '표 가로 행 (Row)', category: 'data', icon: Table, defaultContent: '테이블 행' },
  { key: 'th', name: '테이블 헤더 셀', tag: '<th>', desc: '열 제목 셀 (Bold)', category: 'data', icon: Table, defaultContent: '제목 셀' },
  { key: 'td', name: '테이블 데이터 셀', tag: '<td>', desc: '개별 데이터 셀', category: 'data', icon: Table, defaultContent: '데이터 값' },

  // 6. Disclosure & Separators (5)
  { key: 'details', name: '아코디언', tag: '<details>', desc: '접기/펼치기 디스클로저', category: 'misc', icon: ChevronDown, defaultContent: '접힌 세부 상세 정보가 표시됩니다.', defaultProps: { open: true } },
  { key: 'summary', name: '아코디언 타이틀', tag: '<summary>', desc: '접기 헤더 제목', category: 'misc', icon: ChevronDown, defaultContent: '자주 묻는 질문 (FAQ) 열기/닫기' },
  { key: 'divider', name: '구분선', tag: '<hr>', desc: '컨텐츠 수평 구분선', category: 'misc', icon: Layout },
  { key: 'badge', name: '상태 뱃지', tag: '<badge>', desc: '인라인 라벨 및 뱃지', category: 'misc', icon: Tag, defaultContent: 'AI 추천 뱃지' },
  { key: 'circle', name: '원형 배지', tag: '<circle>', desc: '아바타 및 상태 아이콘', category: 'misc', icon: Circle, defaultContent: 'SY' }
];

const PRESET_PALETTE = [
  '#4f46e5', '#6366f1', '#2563eb', '#38bdf8', '#0ea5e9',
  '#10b981', '#14b8a6', '#f59e0b', '#ef4444', '#ec4899',
  '#8b5cf6', '#a855f7', '#0f172a', '#1e293b', '#334155',
  '#475569', '#64748b', '#94a3b8', '#e2e8f0', '#f8fafc', '#ffffff'
];

export const DesignSystemModal: React.FC<DesignSystemModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings
}) => {
  const [selectedComp, setSelectedComp] = useState<NodeType>('button');
  const [categoryFilter, setCategoryFilter] = useState<ComponentCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewBg, setPreviewBg] = useState<'slate' | 'white' | 'dark' | 'grid'>('dark');
  const [previewScale, setPreviewScale] = useState<number>(100);
  const [copiedCode, setCopiedCode] = useState(false);

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
    const freshDefault = DEFAULT_COMPONENT_STYLES[compKey] || {};
    const nextDefaults = { ...currentDefaults, [compKey]: freshDefault };
    onUpdateSettings({ componentDefaults: nextDefaults });
  };

  const handleResetAllComponents = () => {
    if (confirm('모든 컴포넌트의 기본 스타일을 초기 설정값으로 복원하시겠습니까?')) {
      onUpdateSettings({ componentDefaults: DEFAULT_COMPONENT_STYLES });
    }
  };

  // Filter Catalog
  const filteredCatalog = COMPONENT_CATALOG.filter((item) => {
    const matchCat = categoryFilter === 'all' || item.category === categoryFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.tag.toLowerCase().includes(q) ||
      item.key.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const selectedMeta = COMPONENT_CATALOG.find((c) => c.key === selectedComp) || COMPONENT_CATALOG[0];

  // Construct Sample VNode for Live Interactive Preview
  const previewNode: VNode = {
    id: `preview-${selectedMeta.key}`,
    type: selectedMeta.key,
    name: selectedMeta.name,
    content: selectedMeta.defaultContent,
    props: selectedMeta.defaultProps || {},
    children: selectedMeta.sampleChildren,
    style: {
      ...selectedDef
    }
  };

  // Count customized components
  const customizedCount = Object.keys(settings.componentDefaults || {}).filter((k) => {
    const cur = JSON.stringify(settings.componentDefaults?.[k]);
    const init = JSON.stringify((DEFAULT_COMPONENT_STYLES as any)[k]);
    return cur && cur !== init;
  }).length;

  const handleCopyStyleJson = () => {
    navigator.clipboard.writeText(JSON.stringify(selectedDef, null, 2));
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-150 select-none">
      <div className="w-full h-full max-w-[1720px] max-h-[96vh] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
        {/* 1. Header Toolbar */}
        <header className="h-16 px-6 border-b border-slate-200 flex items-center justify-between shrink-0 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <Palette size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">디자인 시스템 스튜디오</h2>
                <span className="text-[11px] font-semibold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  45종 컴포넌트 기본값 관리
                </span>
                {customizedCount > 0 && (
                  <span className="text-[11px] font-semibold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full border border-purple-200">
                    {customizedCount}개 커스텀 지정됨
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                각 VDOM 요소가 캔버스에 추가될 때 기본 적용되는 스타일을 편집하며, <span className="font-mono text-indigo-600">docs/ui-boards/design-system.json</span>에 자동 반영됩니다.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetAllComponents}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center gap-1.5 transition active:scale-95"
              title="모든 컴포넌트 기본값 초기화"
            >
              <RotateCcw size={13} />
              <span>전체 초기화</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition active:scale-95"
            >
              <Check size={14} />
              <span>적용 및 완료</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/60 transition ml-1"
              title="닫기 (ESC)"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* 2. Main Studio 3-Column Workspace */}
        <div className="flex-1 flex overflow-hidden">
          {/* COLUMN 1: Component Catalog Selector (320px) */}
          <aside className="w-72 xl:w-80 border-r border-slate-200 bg-slate-50/50 flex flex-col shrink-0">
            {/* Search Box */}
            <div className="p-3 border-b border-slate-200/80 bg-white">
              <div className="relative">
                <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="컴포넌트 검색 (태그, 이름)..."
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-100 hover:bg-slate-50 focus:bg-white border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none transition"
                />
              </div>

              {/* Category Filter Pills */}
              <div className="flex gap-1 overflow-x-auto pt-2.5 pb-1 no-scrollbar">
                {[
                  { id: 'all', label: '전체' },
                  { id: 'layout', label: '레이아웃' },
                  { id: 'typography', label: '텍스트' },
                  { id: 'forms', label: '폼·버튼' },
                  { id: 'media', label: '미디어' },
                  { id: 'data', label: '데이터' },
                  { id: 'misc', label: '특수' }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategoryFilter(cat.id as ComponentCategory)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-semibold shrink-0 transition ${
                      categoryFilter === cat.id
                        ? 'bg-indigo-600 text-white shadow-2xs'
                        : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Component List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredCatalog.map((item) => {
                const isSelected = selectedComp === item.key;
                const Icon = item.icon;
                const isCustomized = Boolean(
                  settings.componentDefaults?.[item.key] &&
                  JSON.stringify(settings.componentDefaults[item.key]) !==
                  JSON.stringify((DEFAULT_COMPONENT_STYLES as any)[item.key])
                );

                return (
                  <button
                    key={item.key}
                    onClick={() => setSelectedComp(item.key)}
                    className={`w-full p-2.5 rounded-xl flex items-center justify-between text-left transition group ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                        : 'hover:bg-white hover:shadow-2xs text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600'
                        }`}
                      >
                        <Icon size={14} />
                      </div>
                      <div className="truncate">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                            {item.name}
                          </span>
                          <span className={`font-mono text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {item.tag}
                          </span>
                        </div>
                        <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                          {item.desc}
                        </p>
                      </div>
                    </div>

                    {isCustomized && (
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ml-1 ${
                          isSelected ? 'bg-white' : 'bg-purple-600'
                        }`}
                        title="사용자 지정 커스텀 스타일 적용됨"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </aside>

          {/* COLUMN 2: Property Style Editor (480px) */}
          <main className="w-96 xl:w-[480px] border-r border-slate-200 bg-white flex flex-col shrink-0 overflow-y-auto">
            {/* Header of Editor */}
            <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <selectedMeta.icon size={16} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-slate-900">{selectedMeta.name}</h3>
                    <code className="text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded font-mono font-semibold">
                      {selectedMeta.tag}
                    </code>
                  </div>
                  <p className="text-[11px] text-slate-500">{selectedMeta.desc}</p>
                </div>
              </div>

              <button
                onClick={() => handleResetComponent(selectedComp)}
                className="px-2.5 py-1 text-[11px] text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-md font-medium flex items-center gap-1 transition"
                title="이 컴포넌트 스타일을 시스템 기본값으로 복원"
              >
                <RotateCcw size={11} />
                <span>기본값 복원</span>
              </button>
            </div>

            {/* Style Property Controls Form */}
            <div className="p-5 space-y-6">
              {/* Section 1: Colors (Background & Text) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Palette size={13} className="text-indigo-600" />
                    <span>색상 및 불투명도 (Colors & Opacity)</span>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">배경색 (Background)</span>
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                      <input
                        type="color"
                        value={selectedDef.backgroundColor?.slice(0, 7) || '#1e293b'}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { backgroundColor: e.target.value })}
                        className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={selectedDef.backgroundColor || ''}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { backgroundColor: e.target.value })}
                        placeholder="transparent / #hex"
                        className="flex-1 bg-transparent text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">글자색 (Text Color)</span>
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                      <input
                        type="color"
                        value={selectedDef.color?.slice(0, 7) || '#f8fafc'}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { color: e.target.value })}
                        className="w-7 h-7 rounded border border-slate-300 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={selectedDef.color || ''}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { color: e.target.value })}
                        placeholder="#ffffff"
                        className="flex-1 bg-transparent text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_PALETTE.map((c) => (
                    <button
                      key={c}
                      onClick={() => handleUpdateComponentDefault(selectedComp, { backgroundColor: c })}
                      style={{ backgroundColor: c }}
                      className="w-4 h-4 rounded-md border border-slate-300/80 hover:scale-125 transition shadow-2xs"
                      title={`배경색 적용: ${c}`}
                    />
                  ))}
                </div>

                {/* Opacity */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-600 mb-1">
                    <span>불투명도 (Opacity)</span>
                    <span className="font-mono">{selectedDef.opacity !== undefined ? selectedDef.opacity : 1}</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={selectedDef.opacity !== undefined ? selectedDef.opacity : 1}
                    onChange={(e) => handleUpdateComponentDefault(selectedComp, { opacity: parseFloat(e.target.value) })}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                </div>
              </div>

              {/* Section 2: Typography */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Type size={13} className="text-indigo-600" />
                  <span>타이포그래피 (Typography)</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">글꼴 크기 (Font Size)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="10"
                        max="48"
                        value={selectedDef.fontSize || 14}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { fontSize: parseInt(e.target.value, 10) })}
                        className="flex-1 accent-indigo-600"
                      />
                      <span className="font-mono text-xs w-8 text-right">{selectedDef.fontSize || 14}px</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">텍스트 정렬 (Align)</span>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      {[
                        { id: 'left', icon: AlignLeft },
                        { id: 'center', icon: AlignCenter },
                        { id: 'right', icon: AlignRight }
                      ].map((al) => (
                        <button
                          key={al.id}
                          onClick={() => handleUpdateComponentDefault(selectedComp, { textAlign: al.id as any })}
                          className={`flex-1 py-1 rounded flex items-center justify-center transition ${
                            (selectedDef.textAlign || 'left') === al.id ? 'bg-white shadow-2xs text-indigo-600 font-bold' : 'text-slate-500'
                          }`}
                        >
                          <al.icon size={12} />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Font Weight */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-600 block mb-1">글꼴 굵기 (Font Weight)</span>
                  <div className="grid grid-cols-6 gap-1">
                    {[300, 400, 500, 600, 700, 800].map((w) => (
                      <button
                        key={w}
                        onClick={() => handleUpdateComponentDefault(selectedComp, { fontWeight: String(w) })}
                        className={`py-1 rounded text-[11px] font-mono transition ${
                          String(selectedDef.fontWeight || '400') === String(w)
                            ? 'bg-indigo-600 text-white font-bold'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Section 3: Spacing & Box Model */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Maximize2 size={13} className="text-indigo-600" />
                  <span>여백 및 간격 (Padding, Margin & Gap)</span>
                </label>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">패딩 (Padding)</span>
                    <input
                      type="number"
                      min="0"
                      max="80"
                      value={selectedDef.padding !== undefined ? selectedDef.padding : 0}
                      onChange={(e) => handleUpdateComponentDefault(selectedComp, { padding: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">마진 (Margin)</span>
                    <input
                      type="number"
                      min="0"
                      max="80"
                      value={selectedDef.margin !== undefined ? selectedDef.margin : 0}
                      onChange={(e) => handleUpdateComponentDefault(selectedComp, { margin: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">간격 (Gap)</span>
                    <input
                      type="number"
                      min="0"
                      max="48"
                      value={selectedDef.gap !== undefined ? selectedDef.gap : 0}
                      onChange={(e) => handleUpdateComponentDefault(selectedComp, { gap: parseInt(e.target.value, 10) || 0 })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Border & Radius */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Square size={13} className="text-indigo-600" />
                  <span>테두리 및 곡률 (Border & Radius)</span>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">곡률 (Border Radius)</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={selectedDef.borderRadius || 0}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { borderRadius: parseInt(e.target.value, 10) })}
                        className="flex-1 accent-indigo-600"
                      />
                      <span className="font-mono text-xs w-8 text-right">{selectedDef.borderRadius || 0}px</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">테두리 두께 (Width)</span>
                    <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                      {[0, 1, 2, 4].map((bw) => (
                        <button
                          key={bw}
                          onClick={() => handleUpdateComponentDefault(selectedComp, { borderWidth: bw })}
                          className={`flex-1 py-1 rounded text-xs font-mono transition ${
                            (selectedDef.borderWidth || 0) === bw ? 'bg-white shadow-2xs text-indigo-600 font-bold' : 'text-slate-500'
                          }`}
                        >
                          {bw}px
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">테두리 색상 (Color)</span>
                    <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                      <input
                        type="color"
                        value={selectedDef.borderColor?.slice(0, 7) || '#334155'}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { borderColor: e.target.value })}
                        className="w-6 h-6 rounded border border-slate-300 cursor-pointer p-0"
                      />
                      <input
                        type="text"
                        value={selectedDef.borderColor || ''}
                        onChange={(e) => handleUpdateComponentDefault(selectedComp, { borderColor: e.target.value })}
                        placeholder="#334155"
                        className="flex-1 bg-transparent text-xs font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-600 block mb-1">테두리 스타일 (Style)</span>
                    <select
                      value={selectedDef.borderStyle || 'solid'}
                      onChange={(e) => handleUpdateComponentDefault(selectedComp, { borderStyle: e.target.value as any })}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold"
                    >
                      <option value="solid">Solid (실선)</option>
                      <option value="dashed">Dashed (점선)</option>
                      <option value="dotted">Dotted (원점선)</option>
                      <option value="none">None (없음)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 5: Shadow & Elevation */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-indigo-600" />
                  <span>그림자 효과 (Box Shadow)</span>
                </label>

                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { id: 'none', label: 'None' },
                    { id: '0 1px 2px 0 rgb(0 0 0 / 0.05)', label: 'SM' },
                    { id: '0 4px 6px -1px rgb(0 0 0 / 0.1)', label: 'MD' },
                    { id: '0 10px 15px -3px rgb(0 0 0 / 0.1)', label: 'LG' },
                    { id: '0 20px 25px -5px rgb(0 0 0 / 0.15)', label: 'XL' },
                    { id: '0 0 15px rgba(99, 102, 241, 0.5)', label: 'Glow' }
                  ].map((sh) => (
                    <button
                      key={sh.label}
                      onClick={() => handleUpdateComponentDefault(selectedComp, { boxShadow: sh.id })}
                      className={`py-1.5 rounded-lg border text-xs font-mono transition ${
                        selectedDef.boxShadow === sh.id
                          ? 'bg-indigo-50 border-indigo-500 text-indigo-700 font-bold'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {sh.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </main>

          {/* COLUMN 3: Live Interactive Preview Stage (Flex-1) */}
          <section className="flex-1 bg-slate-100/80 flex flex-col overflow-hidden">
            {/* Stage Toolbar */}
            <div className="h-12 px-4 border-b border-slate-200 bg-white/80 backdrop-blur-xs flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">미리보기 배경:</span>
                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setPreviewBg('dark')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      previewBg === 'dark' ? 'bg-slate-900 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    다크 (#0f172a)
                  </button>
                  <button
                    onClick={() => setPreviewBg('white')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      previewBg === 'white' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    라이트 (White)
                  </button>
                  <button
                    onClick={() => setPreviewBg('slate')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                      previewBg === 'slate' ? 'bg-slate-200 text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    슬레이트 (Gray)
                  </button>
                  <button
                    onClick={() => setPreviewBg('grid')}
                    className={`px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 transition ${
                      previewBg === 'grid' ? 'bg-indigo-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Grid size={11} />
                    <span>그리드</span>
                  </button>
                </div>
              </div>

              {/* Scale & Actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                  <span>배율:</span>
                  {[80, 100, 125].map((sc) => (
                    <button
                      key={sc}
                      onClick={() => setPreviewScale(sc)}
                      className={`px-1.5 py-0.5 rounded ${previewScale === sc ? 'bg-indigo-100 text-indigo-700 font-bold' : 'hover:bg-slate-100'}`}
                    >
                      {sc}%
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleCopyStyleJson}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium flex items-center gap-1 transition"
                  title="이 스타일의 JSON 설정 복사"
                >
                  {copiedCode ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  <span>{copiedCode ? '복사됨!' : 'JSON 복사'}</span>
                </button>
              </div>
            </div>

            {/* Stage Canvas Area */}
            <div
              className={`flex-1 overflow-auto p-12 flex items-center justify-center relative select-auto ${
                previewBg === 'dark'
                  ? 'bg-slate-900'
                  : previewBg === 'white'
                  ? 'bg-white'
                  : previewBg === 'slate'
                  ? 'bg-slate-200'
                  : 'bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:20px_20px] bg-slate-100'
              }`}
            >
              {/* Scaled Preview Frame */}
              <div
                style={{
                  transform: `scale(${previewScale / 100})`,
                  transformOrigin: 'center center'
                }}
                className="transition-transform duration-100 flex flex-col items-center max-w-full"
              >
                {/* Live Component Renderer */}
                <div className="p-8 rounded-2xl bg-black/5 border border-white/10 shadow-lg min-w-[320px] max-w-[500px] flex items-center justify-center">
                  <VNodeRenderer
                    node={previewNode}
                    selectedNodeId={null}
                    onSelectNode={() => {}}
                    interactive={true}
                    isPlayMode={true}
                  />
                </div>

                <div className="mt-4 text-center">
                  <span className="text-[11px] font-mono text-slate-400 bg-black/20 px-2.5 py-1 rounded-full backdrop-blur-xs">
                    직접 클릭하거나 타이핑하여 반응성을 테스트할 수 있습니다
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Live Code Inspector */}
            <div className="h-28 border-t border-slate-200 bg-slate-950 text-slate-300 p-3 flex flex-col font-mono text-[11px] shrink-0">
              <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-slate-400 text-[10px]">
                <span>디자인 시스템 JSON 속성 스펙 (docs/ui-boards/design-system.json)</span>
                <span className="text-emerald-400">● 실시간 반영 중</span>
              </div>
              <pre className="flex-1 overflow-y-auto pt-1 text-slate-300">
                {`"componentDefaults": {\n  "${selectedComp}": ${JSON.stringify(selectedDef, null, 2).replace(/\n/g, '\n  ')}\n}`}
              </pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};
