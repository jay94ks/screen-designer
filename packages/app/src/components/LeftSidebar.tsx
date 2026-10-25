import React, { useState } from 'react';
import { VDomArtboard, VNode, NodeType } from '../types/vdom';
import {
  Layers,
  FileText,
  Plus,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Copy,
  Component,
  Smartphone,
  Tablet,
  Monitor,
  Type,
  Square,
  Circle,
  CreditCard,
  MousePointer,
  Sliders,
  Image as ImageIcon,
  ScrollText,
  MessageSquare,
  Heading,
  CheckSquare,
  CircleDot,
  Video,
  Minus,
  List,
  ChevronsUpDown,
  LayoutTemplate,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Search,
  X,
  Sparkles
} from 'lucide-react';
import { SECTION_TEMPLATES, SectionTemplate } from '../data/sectionTemplates';
import { useTranslation } from '../i18n';

interface LeftSidebarProps {
  artboards: VDomArtboard[];
  selectedArtboardId: string | null;
  selectedNodeId: string | null;
  onSelectArtboard: (id: string) => void;
  onSelectNode: (node: VNode) => void;
  onInsertNode: (type: NodeType, name: string, content?: string, props?: Record<string, any>) => void;
  onUpdateNode?: (nodeId: string, updates: Partial<VNode>) => void;
  onDeleteNode?: (nodeId: string) => void;
  onDuplicateNode?: (node: VNode) => void;
  onMoveNode?: (nodeId: string, direction: 'up' | 'down') => void;
  onInsertTemplate?: (templateNode: VNode) => void;
  onOpenSettings?: (tab?: 'canvas' | 'components') => void;
  isOpen: boolean;
  onClose: () => void;
  width?: number;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  artboards,
  selectedArtboardId,
  selectedNodeId,
  onSelectArtboard,
  onSelectNode,
  onInsertNode,
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  onMoveNode,
  onInsertTemplate,
  onOpenSettings,
  isOpen,
  onClose,
  width = 270
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'layers' | 'assets' | 'templates'>(() => {
    if (typeof window !== 'undefined') {
      if (window.location.search.includes('templates') || window.location.search.includes('tpl')) {
        return 'templates';
      }
      if (window.location.search.includes('components') || window.location.search.includes('assets') || window.location.search.includes('comps')) {
        return 'assets';
      }
    }
    return 'layers';
  });
  const [assetCategory, setAssetCategory] = useState<'all' | 'layout' | 'typography' | 'forms' | 'media'>('all');
  const [templateCategory, setTemplateCategory] = useState<'all' | 'hero' | 'metric' | 'nav' | 'form' | 'pricing' | 'mobile'>('all');
  const [layerSearch, setLayerSearch] = useState('');
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'node-s1-root': true,
    'node-s1-top': true,
    'node-s2-root': true,
    'node-s3-root': true
  });

  if (!isOpen) return null;

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getNodeIcon = (type: NodeType) => {
    switch (type) {
      case 'image':
        return <ImageIcon size={11} className="text-pink-500" />;
      case 'dialog':
        return <MessageSquare size={11} className="text-emerald-500" />;
      case 'scroll-container':
        return <ScrollText size={11} className="text-amber-500" />;
      case 'heading':
        return <Heading size={11} className="text-orange-500" />;
      case 'text':
      case 'span':
        return <Type size={11} className="text-amber-500" />;
      case 'button':
        return <MousePointer size={11} className="text-indigo-500" />;
      case 'card':
        return <CreditCard size={11} className="text-purple-500" />;
      case 'circle':
        return <Circle size={11} className="text-emerald-500" />;
      case 'checkbox':
        return <CheckSquare size={11} className="text-blue-500" />;
      case 'radio':
        return <CircleDot size={11} className="text-violet-500" />;
      case 'video':
        return <Video size={11} className="text-rose-500" />;
      case 'divider':
        return <Minus size={11} className="text-slate-400" />;
      case 'select':
        return <ChevronsUpDown size={11} className="text-cyan-500" />;
      default:
        return <Square size={11} className="text-blue-500" />;
    }
  };

  const nodeMatchesSearch = (n: VNode, query: string): boolean => {
    if (!query) return true;
    const q = query.toLowerCase();
    if (
      n.name.toLowerCase().includes(q) ||
      n.type.toLowerCase().includes(q) ||
      (n.content && n.content.toLowerCase().includes(q))
    ) {
      return true;
    }
    if (n.children && n.children.length > 0) {
      return n.children.some((child) => nodeMatchesSearch(child, query));
    }
    return false;
  };

  const handleStartRename = (node: VNode, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNodeId(node.id);
    setEditingName(node.name);
  };

  const handleFinishRename = (nodeId: string) => {
    if (editingName.trim()) {
      onUpdateNode?.(nodeId, { name: editingName.trim() });
    }
    setEditingNodeId(null);
  };

  const renderNodeTree = (node: VNode, depth = 0) => {
    const isSelected = selectedNodeId === node.id;
    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes[node.id] !== false;
    const isEditing = editingNodeId === node.id;

    if (layerSearch.trim() && !nodeMatchesSearch(node, layerSearch.trim())) {
      return null;
    }

    return (
      <div key={node.id} className="select-none group/layer">
        <div
          onClick={(e) => {
            e.stopPropagation();
            onSelectNode(node);
          }}
          onDoubleClick={(e) => handleStartRename(node, e)}
          style={{ paddingLeft: `${depth * 12 + 6}px` }}
          className={`flex items-center gap-1.5 py-1 px-1.5 rounded-md cursor-pointer transition text-xs relative ${
            isSelected
              ? 'bg-indigo-600 text-white font-bold shadow-2xs'
              : node.visible === false
              ? 'opacity-40 text-slate-400 hover:bg-slate-100'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          {hasChildren ? (
            <button
              onClick={(e) => toggleExpand(node.id, e)}
              className="p-0.5 hover:bg-black/10 rounded shrink-0"
            >
              {isExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
            </button>
          ) : (
            <span className="w-3 shrink-0" />
          )}

          <div className="shrink-0">{getNodeIcon(node.type)}</div>

          {/* Node Name / Inline Editor */}
          {isEditing ? (
            <input
              type="text"
              autoFocus
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={() => handleFinishRename(node.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleFinishRename(node.id);
                if (e.key === 'Escape') setEditingNodeId(null);
              }}
              onClick={(e) => e.stopPropagation()}
              className="px-1 py-0.5 text-xs text-slate-900 bg-white border border-indigo-500 rounded focus:outline-none flex-1 min-w-0"
            />
          ) : (
            <span
              className={`truncate flex-1 text-[11px] ${
                node.visible === false ? 'line-through' : ''
              }`}
              title="더블 클릭하여 레이어 이름 변경"
            >
              {node.name}
            </span>
          )}

          {/* Locked Badge if locked */}
          {node.locked && (
            <Lock size={10} className={isSelected ? 'text-amber-200 shrink-0' : 'text-amber-500 shrink-0'} />
          )}

          {/* Quick Hover Layer Actions: Move / Duplicate / Visibility / Lock / Delete */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover/layer:opacity-100 transition-opacity ml-1 shrink-0">
            {/* Move Up */}
            {node.type !== 'frame' && onMoveNode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveNode(node.id, 'up');
                }}
                className={`p-0.5 rounded transition ${
                  isSelected
                    ? 'text-white/80 hover:text-white hover:bg-white/20'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                }`}
                title="위로 이동 (순서 변경)"
              >
                <ChevronUp size={11} />
              </button>
            )}

            {/* Move Down */}
            {node.type !== 'frame' && onMoveNode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onMoveNode(node.id, 'down');
                }}
                className={`p-0.5 rounded transition ${
                  isSelected
                    ? 'text-white/80 hover:text-white hover:bg-white/20'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                }`}
                title="아래로 이동 (순서 변경)"
              >
                <ChevronDown size={11} />
              </button>
            )}

            {/* Duplicate */}
            {node.type !== 'frame' && onDuplicateNode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicateNode(node);
                }}
                className={`p-0.5 rounded transition ${
                  isSelected
                    ? 'text-white/80 hover:text-white hover:bg-white/20'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
                }`}
                title="레이어 복제 (Ctrl+D)"
              >
                <Copy size={10} />
              </button>
            )}

            {/* Visibility Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateNode?.(node.id, { visible: node.visible === false ? true : false });
              }}
              className={`p-0.5 rounded transition ${
                node.visible === false
                  ? 'text-rose-500 hover:bg-rose-100'
                  : isSelected
                  ? 'text-white/80 hover:text-white hover:bg-white/20'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
              }`}
              title={node.visible === false ? '숨김 해제 (표시)' : '레이어 숨기기'}
            >
              {node.visible === false ? <EyeOff size={11} /> : <Eye size={11} />}
            </button>

            {/* Lock Toggle */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUpdateNode?.(node.id, { locked: !node.locked });
              }}
              className={`p-0.5 rounded transition ${
                node.locked
                  ? 'text-amber-500 hover:bg-amber-100'
                  : isSelected
                  ? 'text-white/80 hover:text-white hover:bg-white/20'
                  : 'text-slate-400 hover:text-slate-700 hover:bg-slate-200'
              }`}
              title={node.locked ? '선택 잠금 해제' : '레이어 잠금'}
            >
              {node.locked ? <Lock size={11} /> : <Unlock size={11} />}
            </button>

            {/* Delete button (if not frame root) */}
            {node.type !== 'frame' && onDeleteNode && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteNode(node.id);
                }}
                className={`p-0.5 rounded transition ${
                  isSelected
                    ? 'text-rose-300 hover:text-white hover:bg-rose-500'
                    : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
                }`}
                title="레이어 삭제 (Delete)"
              >
                <Trash2 size={11} />
              </button>
            )}
          </div>
        </div>

        {hasChildren && isExpanded && (
          <div>{node.children!.map((child) => renderNodeTree(child, depth + 1))}</div>
        )}
      </div>
    );
  };

  // Complete Catalog of HTML5 Elements and Rich VDOM Nodes
  const UI_COMPONENTS: Array<{
    type: NodeType;
    name: string;
    description: string;
    category: 'layout' | 'typography' | 'forms' | 'media';
    content?: string;
    props?: Record<string, any>;
  }> = [
    // 1. Layout & Containers
    {
      type: 'scroll-container',
      name: '스크롤 컨테이너',
      description: '마우스 휠 스크롤 영역 (Auto Overflow Y)',
      category: 'layout',
      content: ''
    },
    {
      type: 'dialog',
      name: '모달 다이얼로그',
      description: '팝업 모달 창 (Backdrop + Close)',
      category: 'layout',
      content: '다이얼로그 팝업 상세 내용입니다.',
      props: { open: true, title: '확인 모달' }
    },
    {
      type: 'card',
      name: '카드 컨테이너',
      description: '배경색 및 곡률이 적용된 박스',
      category: 'layout',
      content: ''
    },
    {
      type: 'section',
      name: '시맨틱 섹션 (<section>)',
      description: '페이지 주요 블록 구획',
      category: 'layout',
      content: ''
    },
    {
      type: 'header',
      name: '헤더 영역 (<header>)',
      description: '상단 네비게이션 및 타이틀 바',
      category: 'layout',
      content: ''
    },
    {
      type: 'footer',
      name: '푸터 영역 (<footer>)',
      description: '하단 정보 및 라이선스 영역',
      category: 'layout',
      content: ''
    },

    // 2. Media
    {
      type: 'image',
      name: '이미지 (<img>)',
      description: '반응형 이미지 (Cover / Fit)',
      category: 'media',
      content: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      props: { alt: '샘플 이미지', loading: 'lazy' }
    },
    {
      type: 'video',
      name: '비디오 플레이어 (<video>)',
      description: '미디어 영상 플레이어',
      category: 'media',
      content: '',
      props: { controls: true }
    },

    // 3. Typography
    {
      type: 'heading',
      name: '대제목 (Heading H2)',
      description: '22px Bold 타이틀',
      category: 'typography',
      content: '새로운 서비스 시작하기',
      props: { headingLevel: 2 }
    },
    {
      type: 'text',
      name: '본문 단락 (<p>)',
      description: '일반 텍스트 문단',
      category: 'typography',
      content: '편리한 화면 디자인과 인터랙션을 시작해 보세요.'
    },
    {
      type: 'blockquote',
      name: '인용구 (<blockquote>)',
      description: '강조 인용 블록',
      category: 'typography',
      content: '“디자인은 어떻게 보이고 느껴지는가가 아니라 어떻게 동작하는가이다.”'
    },
    {
      type: 'code',
      name: '코드 블록 (<code>)',
      description: '고정폭 글꼴 인라인 코드',
      category: 'typography',
      content: 'npm install @screen-designer/core'
    },

    // 4. Interactive & Forms
    {
      type: 'button',
      name: 'CTA 액션 버튼',
      description: '클릭 인터랙션 주 버튼',
      category: 'forms',
      content: '확인 및 계속하기'
    },
    {
      type: 'input',
      name: '텍스트 인풋 필드',
      description: '단일 라인 텍스트 입력',
      category: 'forms',
      content: '이메일 주소를 입력하세요...',
      props: { type: 'text', placeholder: '이메일 주소를 입력하세요...' }
    },
    {
      type: 'textarea',
      name: '멀티라인 텍스트에어리어',
      description: '여러 줄 텍스트 입력창',
      category: 'forms',
      content: '문의 내용을 상세히 작성해주세요...',
      props: { rows: 3 }
    },
    {
      type: 'select',
      name: '셀렉트 드롭다운',
      description: '옵션 목록 선택 드롭다운',
      category: 'forms',
      content: '',
      props: {
        options: [
          { label: '옵션 A: 표준 요금제', value: 'standard' },
          { label: '옵션 B: 프리미엄 플랜', value: 'premium' }
        ]
      }
    },
    {
      type: 'checkbox',
      name: '체크박스 필드',
      description: '다중 선택 체크박스',
      category: 'forms',
      content: '이용약관에 동의합니다'
    },
    {
      type: 'radio',
      name: '라디오 버튼',
      description: '단일 선택 라디오',
      category: 'forms',
      content: '신용카드 결제 선택'
    },
    {
      type: 'divider',
      name: '가로 구분선 (<hr>)',
      description: '컨텐츠 구분 라인',
      category: 'layout',
      content: ''
    },
    {
      type: 'details',
      name: '아코디언 (<details>)',
      description: '접기/펼치기 디스클로저',
      category: 'forms',
      content: '자주 묻는 질문 (FAQ)',
      props: { open: true }
    }
  ];

  const filteredComponents = UI_COMPONENTS.filter(
    (c) => assetCategory === 'all' || c.category === assetCategory
  );

  const filteredTemplates = SECTION_TEMPLATES.filter(
    (t) => templateCategory === 'all' || t.category === templateCategory
  );

  return (
    <aside
      style={{ width: `${width}px` }}
      className="border-r border-slate-200 bg-white flex flex-col shrink-0 h-full shadow-xs z-20 select-none text-xs"
    >
      {/* Header Tabs: Layers / Components / Templates */}
      <div className="h-11 border-b border-slate-200 px-2 flex items-center justify-between shrink-0 bg-slate-50/70">
        <div className="flex items-center gap-1 w-full">
          <button
            onClick={() => setActiveTab('layers')}
            className={`flex-1 py-1.5 rounded-md font-medium transition flex items-center justify-center gap-1 whitespace-nowrap text-[11px] ${
              activeTab === 'layers'
                ? 'bg-white text-slate-900 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Layers size={12} />
            <span>{t('sidebar.layers')}</span>
          </button>
          <button
            onClick={() => setActiveTab('assets')}
            className={`flex-1 py-1.5 rounded-md font-medium transition flex items-center justify-center gap-1 whitespace-nowrap text-[11px] ${
              activeTab === 'assets'
                ? 'bg-white text-slate-900 shadow-2xs font-bold border border-slate-200/80'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Component size={12} />
            <span>{t('sidebar.components')}</span>
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`flex-1 py-1.5 rounded-md font-medium transition flex items-center justify-center gap-1 whitespace-nowrap text-[11px] ${
              activeTab === 'templates'
                ? 'bg-white text-indigo-700 shadow-2xs font-bold border border-indigo-200/80'
                : 'text-slate-500 hover:text-indigo-600'
            }`}
          >
            <Sparkles size={12} className={activeTab === 'templates' ? 'text-indigo-600' : ''} />
            <span>{t('sidebar.templates')}</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {/* TAB 1: Layers Tree with Search & Quick Controls */}
        {activeTab === 'layers' && (
          <div className="space-y-2">
            {/* Layer Search Bar */}
            <div className="relative">
              <Search size={11} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={layerSearch}
                onChange={(e) => setLayerSearch(e.target.value)}
                placeholder="레이어 검색..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-7 pr-7 py-1 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white transition"
              />
              {layerSearch && (
                <button
                  onClick={() => setLayerSearch('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={11} />
                </button>
              )}
            </div>

            {artboards.length === 0 ? (
              <div className="p-6 text-center text-slate-400 text-xs">
                <Layers className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-400" />
                <p className="font-semibold text-slate-600">등록된 프레임이 없습니다</p>
                <p className="text-[11px] text-slate-400 mt-1">상단 툴바의 + 버튼으로 새 프레임을 생성하세요.</p>
              </div>
            ) : (
              artboards.map((artboard) => {
                const isSelected = artboard.id === selectedArtboardId;
                const Icon =
                  artboard.viewport === 'mobile'
                    ? Smartphone
                    : artboard.viewport === 'tablet'
                    ? Tablet
                    : Monitor;

                return (
                  <div key={artboard.id} className="space-y-1">
                    {/* Artboard Root Header */}
                    <div
                      onClick={() => onSelectArtboard(artboard.id)}
                      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition ${
                        isSelected
                          ? 'bg-indigo-50 border border-indigo-200 font-bold text-indigo-900 shadow-2xs'
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Icon size={13} className="text-indigo-600 shrink-0" />
                        <span className="truncate">{artboard.title}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-400">
                        {artboard.width}×{artboard.height}
                      </span>
                    </div>

                    {/* Recursive Virtual DOM Node Tree */}
                    <div className="pl-1 space-y-0.5">
                      {renderNodeTree(artboard.rootNode)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB 2: Full HTML5 Elements Palette */}
        {activeTab === 'assets' && (
          <div className="space-y-2 p-1">
            {/* Category Filter Pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 mb-1">
              {[
                { id: 'all', label: '전체' },
                { id: 'layout', label: '레이아웃' },
                { id: 'media', label: '미디어' },
                { id: 'typography', label: '텍스트' },
                { id: 'forms', label: '폼·버튼' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setAssetCategory(cat.id as any)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition ${
                    assetCategory === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-1 px-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                클릭하여 캔버스에 추가 ({filteredComponents.length}개)
              </span>
              {onOpenSettings && (
                <button
                  onClick={() => onOpenSettings('components')}
                  className="text-[10px] text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                  title="컴포넌트 기본값 설정"
                >
                  <Sliders size={10} />
                  <span>기본값</span>
                </button>
              )}
            </div>

            {/* Component Cards */}
            <div className="space-y-1.5">
              {filteredComponents.map((asset) => (
                <div
                  key={asset.name}
                  onClick={() => onInsertNode(asset.type, asset.name, asset.content, asset.props)}
                  className="p-2.5 bg-slate-50/80 hover:bg-indigo-50/90 border border-slate-200/90 hover:border-indigo-300 rounded-xl cursor-pointer transition group shadow-2xs flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition shadow-2xs">
                      {getNodeIcon(asset.type)}
                    </div>
                    <div className="truncate">
                      <div className="font-bold text-xs text-slate-800 group-hover:text-indigo-700 truncate">
                        {asset.name}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {asset.description}
                      </div>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full bg-slate-200/80 flex items-center justify-center text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition font-bold text-xs shrink-0 ml-2">
                    +
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Ready-Made UI Section Templates */}
        {activeTab === 'templates' && (
          <div className="space-y-2 p-1">
            {/* Template Category Pills */}
            <div className="flex gap-1 overflow-x-auto pb-1 mb-1">
              {[
                { id: 'all', label: '전체' },
                { id: 'hero', label: '히어로' },
                { id: 'metric', label: '지표 카드' },
                { id: 'nav', label: '헤더 바' },
                { id: 'form', label: '로그인 폼' },
                { id: 'pricing', label: '요금제' },
                { id: 'mobile', label: '모바일 탭' }
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setTemplateCategory(cat.id as any)}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap transition ${
                    templateCategory === cat.id
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-between mb-1 px-0.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                원클릭 섹션 템플릿 삽입 ({filteredTemplates.length}개)
              </span>
            </div>

            {/* Template Cards */}
            <div className="space-y-2">
              {filteredTemplates.map((tpl) => (
                <div
                  key={tpl.id}
                  onClick={() => onInsertTemplate?.(tpl.createNode())}
                  className="p-3 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-xl cursor-pointer transition group shadow-2xs space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <LayoutTemplate size={13} className="text-indigo-600" />
                      <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-700">
                        {tpl.name}
                      </span>
                    </div>
                    {tpl.badge && (
                      <span className="text-[9px] font-bold text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded border border-indigo-200">
                        {tpl.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {tpl.description}
                  </p>
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onInsertTemplate?.(tpl.createNode());
                      }}
                      className="px-2.5 py-1 rounded-md bg-indigo-600 text-white font-semibold text-[10px] hover:bg-indigo-700 transition flex items-center gap-1 shadow-2xs"
                    >
                      <span>+ 장표에 추가</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
