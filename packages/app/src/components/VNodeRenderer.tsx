import React, { useState } from 'react';
import { VNode } from '../types/vdom';
import { styleToCssProperties } from '../utils/serializer';
import { evaluateNodeVisibility } from '../utils/conditionEvaluator';
import { getPresetByFileName } from '../data/imagePresets';
import * as LucideIcons from 'lucide-react';
import {
  Layers,
  Trash2,
  Copy,
  ChevronDown,
  X,
  ExternalLink,
  Sliders,
  Image as ImageIcon,
  ScrollText,
  MessageSquare,
  EyeOff
} from 'lucide-react';

interface VNodeRendererProps {
  node: VNode;
  selectedNodeId: string | null;
  onSelectNode: (node: VNode, e: React.MouseEvent) => void;
  onUpdateContent?: (nodeId: string, content: string) => void;
  onNodeAction?: (node: VNode) => void;
  onNodeEvent?: (node: VNode, trigger: 'click' | 'dblclick' | 'contextmenu' | 'mouseenter', e: React.MouseEvent) => void;
  onDeleteNode?: (nodeId: string) => void;
  onDuplicateNode?: (node: VNode) => void;
  tweakValues?: Record<string, any>;
  interactive?: boolean;
  isPlayMode?: boolean;
  showHotspots?: boolean;
}

const VNodeRendererComponent: React.FC<VNodeRendererProps> = ({
  node,
  selectedNodeId,
  onSelectNode,
  onUpdateContent,
  onNodeAction,
  onNodeEvent,
  onDeleteNode,
  onDuplicateNode,
  tweakValues = {},
  interactive = true,
  isPlayMode = false,
  showHotspots = false
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(node.content || '');
  const [imageError, setImageError] = useState(false);

  // 1. Dynamic Tweaks Visibility Rules & Condition Evaluation
  const isSelected = selectedNodeId === node.id;
  const evalResult = evaluateNodeVisibility(node, tweakValues);

  // Backward-compatible fallback for legacy demo nodes
  if (node.id === 'node-s1-ai-badge' && tweakValues.showAiBadge === false) {
    if (!isSelected) return null;
  }
  if (node.id === 'node-s3-share-card' && tweakValues.showShareCard === false) {
    if (!isSelected) return null;
  }

  // Node explicitly hidden
  if (node.visible === false) return null;

  // Evaluated condition is not met
  if (!evalResult.isVisible) {
    if (isPlayMode) return null;
    // In editor mode: hide if not actively selected in layer tree
    if (!isSelected) return null;
  }

  const isTextLike = ['text', 'heading', 'span', 'blockquote', 'code', 'label'].includes(node.type);

  // 2. Dynamic Tweaks Style & Content Overrides
  let dynamicStyle = { ...node.style };
  let displayContent = node.content;

  // If node is selected but condition failed, render with ghost dashed outline
  if (!evalResult.isVisible && isSelected) {
    dynamicStyle.opacity = 0.55;
    dynamicStyle.outline = '2px dashed #f59e0b';
  }

  // A. Template Variable Interpolation (e.g. {{key}})
  if (displayContent && typeof displayContent === 'string' && displayContent.includes('{{')) {
    displayContent = displayContent.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) =>
      tweakValues[key] !== undefined ? String(tweakValues[key]) : _
    );
  }

  // B. Zoom Level Tweak (zoomLevel)
  if (tweakValues.zoomLevel !== undefined) {
    if (node.id?.includes('zoom') || (displayContent && /^\d+%\s*(\(.*\))?$/.test(displayContent.trim()))) {
      displayContent = `${tweakValues.zoomLevel}%`;
    }
  }

  // C. Background Grid Tweak (showGrid)
  if (tweakValues.showGrid === false) {
    if (dynamicStyle.backgroundImage && dynamicStyle.backgroundImage.includes('radial-gradient')) {
      dynamicStyle.backgroundImage = 'none';
      dynamicStyle.backgroundColor = '#cbd5e1';
    }
  }

  // D. UI Density Tweak (uiDensity: 'Compact' | 'Default' | 'Comfortable')
  if (tweakValues.uiDensity === 'Compact') {
    if (typeof dynamicStyle.padding === 'number') dynamicStyle.padding = Math.max(4, Math.round(dynamicStyle.padding * 0.75));
    if (typeof dynamicStyle.paddingLeft === 'number') dynamicStyle.paddingLeft = Math.max(4, Math.round(dynamicStyle.paddingLeft * 0.75));
    if (typeof dynamicStyle.paddingRight === 'number') dynamicStyle.paddingRight = Math.max(4, Math.round(dynamicStyle.paddingRight * 0.75));
    if (typeof dynamicStyle.paddingTop === 'number') dynamicStyle.paddingTop = Math.max(2, Math.round(dynamicStyle.paddingTop * 0.75));
    if (typeof dynamicStyle.paddingBottom === 'number') dynamicStyle.paddingBottom = Math.max(2, Math.round(dynamicStyle.paddingBottom * 0.75));
    if (typeof dynamicStyle.gap === 'number') dynamicStyle.gap = Math.max(2, Math.round(dynamicStyle.gap * 0.75));
  } else if (tweakValues.uiDensity === 'Comfortable') {
    if (typeof dynamicStyle.padding === 'number') dynamicStyle.padding = Math.round(dynamicStyle.padding * 1.3);
    if (typeof dynamicStyle.paddingLeft === 'number') dynamicStyle.paddingLeft = Math.round(dynamicStyle.paddingLeft * 1.3);
    if (typeof dynamicStyle.paddingRight === 'number') dynamicStyle.paddingRight = Math.round(dynamicStyle.paddingRight * 1.3);
    if (typeof dynamicStyle.paddingTop === 'number') dynamicStyle.paddingTop = Math.round(dynamicStyle.paddingTop * 1.3);
    if (typeof dynamicStyle.paddingBottom === 'number') dynamicStyle.paddingBottom = Math.round(dynamicStyle.paddingBottom * 1.3);
    if (typeof dynamicStyle.gap === 'number') dynamicStyle.gap = Math.round(dynamicStyle.gap * 1.3);
  }

  // E. Balance & Currency Tweaks (balanceAmount & currency)
  const isBalanceNode =
    node.id === 'node-s1-balance-val' ||
    node.id?.includes('bal') ||
    node.id?.includes('amount') ||
    node.name?.includes('잔고') ||
    node.name?.includes('Balance') ||
    (displayContent && /^[₩\$€¥]\s*[\d,]+(\.\d+)?$/.test(displayContent.trim()));

  if (isBalanceNode && (tweakValues.balanceAmount !== undefined || tweakValues.currency !== undefined)) {
    const rawAmt = Number(tweakValues.balanceAmount !== undefined ? tweakValues.balanceAmount : 12480000);
    const currStr = String(tweakValues.currency || 'KRW (₩)');
    if (currStr.includes('USD') || currStr.includes('$')) {
      displayContent = `$ ${(rawAmt / 1350).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (currStr.includes('EUR') || currStr.includes('€')) {
      displayContent = `€ ${(rawAmt / 1450).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    } else if (currStr.includes('JPY') || currStr.includes('¥')) {
      displayContent = `¥ ${Math.round(rawAmt / 9.2).toLocaleString('ja-JP')}`;
    } else {
      displayContent = `₩ ${rawAmt.toLocaleString('ko-KR')}`;
    }
  }

  // F. Play Simulator Viewport Resolution (playResolution & playbackSpeed)
  if (tweakValues.playResolution) {
    if (node.id?.includes('res-combo') || node.id?.includes('combo-btn') || node.name?.includes('Resolution Combobox')) {
      displayContent = `📐 ${tweakValues.playResolution} ▾`;
    }
    if (node.id?.includes('sc-p') || node.name?.includes('RESPONSIVE PLAY')) {
      displayContent = `PLAY: ${tweakValues.playResolution}`;
    }
    if (node.id?.includes('screen') && node.name?.includes('Interactive Prototype Screen')) {
      const res = String(tweakValues.playResolution);
      if (res.includes('390×844') || res.includes('iPhone') || res.includes('Mobile')) {
        dynamicStyle.width = 390;
        dynamicStyle.height = 700;
      } else if (res.includes('768×1024') || res.includes('Tablet')) {
        dynamicStyle.width = 680;
        dynamicStyle.height = 720;
      } else if (res.includes('1920×1080') || res.includes('FHD')) {
        dynamicStyle.width = 1200;
        dynamicStyle.height = 675;
      } else if (res.includes('1440×900') || res.includes('HD')) {
        dynamicStyle.width = 1080;
        dynamicStyle.height = 675;
      } else if (res.includes('반응형')) {
        dynamicStyle.width = '92%';
        dynamicStyle.height = 680;
      }
    }
  }

  if (tweakValues.playbackSpeed && (node.id?.includes('speed') || node.name?.includes('Speed'))) {
    displayContent = `⚡ ${tweakValues.playbackSpeed}`;
  }

  // G. Ruler Unit & Snap Threshold (rulerUnit & snapThreshold)
  if (tweakValues.rulerUnit) {
    if (node.id?.includes('ruler-unit') || node.id?.includes('ruler-corner') || node.name?.includes('Unit Selector')) {
      displayContent = String(tweakValues.rulerUnit).toUpperCase();
    }
    if (node.id?.includes('rt-') || node.id?.includes('rl-')) {
      const u = String(tweakValues.rulerUnit).toUpperCase();
      const n = parseInt(node.content || '0', 10);
      if (!isNaN(n)) {
        if (u === 'REM') displayContent = `${(n / 16).toFixed(1)}rem`;
        else if (u === 'PT') displayContent = `${Math.round(n * 0.75)}pt`;
        else displayContent = `${n}px`;
      }
    }
  }

  if (tweakValues.snapThreshold !== undefined && (node.id?.includes('snap') || node.name?.includes('Snap Threshold'))) {
    displayContent = `${tweakValues.snapThreshold}px 스냅`;
  }

  // H. Code Generator Inspector (codeLanguage, includeTailwind, minifyCode, fontSize)
  if (tweakValues.codeLanguage && (node.id?.includes('cd-lbl') || node.name?.includes('JSX / Tailwind Component'))) {
    displayContent = `</> ${tweakValues.codeLanguage}`;
  }

  if (tweakValues.fontSize && (node.id?.includes('code-body') || node.id?.includes('cd-pre') || node.id?.includes('cl-') || node.name?.includes('Code Lines'))) {
    dynamicStyle.fontSize = Number(tweakValues.fontSize);
  }

  if ((node.id?.startsWith('ab4-cl-') || node.id?.startsWith('cl-')) && (tweakValues.codeLanguage || tweakValues.includeTailwind !== undefined || tweakValues.minifyCode !== undefined)) {
    const lang = tweakValues.codeLanguage || 'React TSX';
    const isTailwind = tweakValues.includeTailwind !== false;
    const lineIdx = parseInt(node.id.split('-').pop() || '0', 10);
    const tsxLines = isTailwind
      ? [
          "import React from 'react';",
          "",
          "export const Screen_Workspace = () => {",
          "  return (",
          "    <div className=\"flex flex-col w-full min-h-screen bg-slate-900 text-white p-6\">",
          "      <header className=\"flex items-center justify-between pb-4 border-b border-slate-800\">",
          "        <h1 className=\"text-xl font-bold tracking-tight\">Screen Designer VDOM</h1>",
          "        <span className=\"px-3 py-1 bg-indigo-600 rounded-full text-xs\">Live</span>",
          "      </header>",
          "      <main className=\"grid grid-cols-3 gap-4 mt-6\">",
          "        <div className=\"p-5 rounded-2xl bg-slate-800/80 border border-slate-700 shadow-lg\">",
          "          <p className=\"text-xs text-slate-400\">Total Asset Value</p>",
          "          <h2 className=\"text-2xl font-black mt-2 text-indigo-400\">₩ 34,820,000</h2>",
          "        </div>",
          "      </main>",
          "    </div>",
          "  );",
          "};"
        ]
      : [
          "import React from 'react';",
          "",
          "export const Screen_Workspace = () => {",
          "  return (",
          "    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh', backgroundColor: '#0f172a', padding: 24 }}>",
          "      <header style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #334155' }}>",
          "        <h1 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>Screen Designer VDOM</h1>",
          "        <span style={{ padding: '4px 12px', backgroundColor: '#4f46e5', borderRadius: 9999, fontSize: 12 }}>Live</span>",
          "      </header>",
          "      <main style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 24 }}>",
          "        <div style={{ padding: 20, borderRadius: 16, backgroundColor: '#1e293b', border: '1px solid #334155' }}>",
          "          <p style={{ fontSize: 12, color: '#94a3b8' }}>Total Asset Value</p>",
          "          <h2 style={{ fontSize: 24, fontWeight: 800, color: '#818cf8', marginTop: 8 }}>₩ 34,820,000</h2>",
          "        </div>",
          "      </main>",
          "    </div>",
          "  );",
          "};"
        ];

    const htmlLines = [
      "<!DOCTYPE html>",
      "<html lang=\"ko\">",
      "<head><title>Screen Designer</title></head>",
      "<body class=\"theme-dark\">",
      "  <header class=\"header-container\">",
      "    <h1 class=\"title\">Screen Designer VDOM</h1>",
      "    <span class=\"status-badge\">Live</span>",
      "  </header>",
      "  <main class=\"grid-view\">",
      "    <div class=\"asset-card\">",
      "      <p class=\"label\">Total Asset Value</p>",
      "      <h2 class=\"amount\">₩ 34,820,000</h2>",
      "    </div>",
      "  </main>",
      "</body>",
      "</html>"
    ];

    const jsonLines = [
      "{",
      "  \"id\": \"node-sd-root\",",
      "  \"type\": \"frame\",",
      "  \"name\": \"Screen Designer VDOM\",",
      "  \"style\": { \"backgroundColor\": \"#0f172a\" },",
      "  \"children\": [",
      "    { \"id\": \"hdr-1\", \"type\": \"header\", \"content\": \"Screen Designer\" },",
      "    { \"id\": \"card-1\", \"type\": \"card\", \"content\": \"₩ 34,820,000\" }",
      "  ]",
      "}"
    ];

    const lines = lang === 'HTML/CSS' ? htmlLines : lang === 'JSON VDOM' ? jsonLines : tsxLines;
    if (lineIdx < lines.length) {
      displayContent = tweakValues.minifyCode ? lines.join(' ').replace(/\s+/g, ' ') : lines[lineIdx];
    }
  }

  // I. Git Desktop Branch & Diff Mode (currentBranch & diffViewMode)
  if (tweakValues.currentBranch && (node.id?.includes('branch') || (displayContent && displayContent.includes('🌿')))) {
    displayContent = `🌿 ${tweakValues.currentBranch}`;
  }

  if (tweakValues.diffViewMode && (node.id?.includes('split') || node.id?.includes('unified'))) {
    const isSplit = String(tweakValues.diffViewMode).includes('Split');
    if (node.id?.includes('split')) {
      dynamicStyle.backgroundColor = isSplit ? '#4f46e5' : '#ffffff';
      dynamicStyle.color = isSplit ? '#ffffff' : '#64748b';
    } else if (node.id?.includes('unified')) {
      dynamicStyle.backgroundColor = !isSplit ? '#4f46e5' : '#ffffff';
      dynamicStyle.color = !isSplit ? '#ffffff' : '#64748b';
    }
  }

  // J. Key Symbols Tweak (osKeySymbols: 'macOS (⌘ Cmd)' vs 'Windows/Linux (Ctrl)')
  if (tweakValues.osKeySymbols) {
    const isMac = String(tweakValues.osKeySymbols).includes('macOS') || String(tweakValues.osKeySymbols).includes('⌘');
    if (displayContent && typeof displayContent === 'string') {
      if (isMac && displayContent.includes('Ctrl')) {
        displayContent = displayContent.replace(/Ctrl/g, '⌘');
      } else if (!isMac && displayContent.includes('⌘')) {
        displayContent = displayContent.replace(/⌘/g, 'Ctrl');
      }
    }
  }

  // K. Category & Tab Highlighting
  const activeCategoryFilter =
    tweakValues.compCategory ||
    tweakValues.templateCategory ||
    tweakValues.tokenCategory ||
    tweakValues.prefActiveTab ||
    tweakValues.shortcutGroup ||
    tweakValues.eventTriggerFilter;

  if (
    activeCategoryFilter &&
    (node.type === 'badge' || node.type === 'button') &&
    (displayContent === activeCategoryFilter || displayContent?.startsWith(activeCategoryFilter))
  ) {
    dynamicStyle.backgroundColor = '#4f46e5';
    dynamicStyle.color = '#ffffff';
    dynamicStyle.borderColor = '#4f46e5';
  }

  // L. Brand Accent Color & Primary Color (accentColor & primaryColor)
  const brandAccent = tweakValues.accentColor || tweakValues.primaryColor;
  if (brandAccent) {
    if (node.type === 'button' || node.type === 'badge' || node.id?.includes('btn') || node.id?.includes('sel') || node.id?.includes('active')) {
      if (dynamicStyle.backgroundColor === '#4f46e5' || dynamicStyle.backgroundColor === '#6366f1' || dynamicStyle.backgroundColor === '#312e81') {
        dynamicStyle.backgroundColor = brandAccent;
      }
    }
    if (dynamicStyle.color === '#4f46e5' || dynamicStyle.color === '#6366f1') {
      dynamicStyle.color = brandAccent;
    }
    if (dynamicStyle.borderColor === '#4f46e5' || dynamicStyle.borderColor === '#6366f1') {
      dynamicStyle.borderColor = brandAccent;
    }
  }

  // M. Base Radius (baseRadius)
  if (tweakValues.baseRadius !== undefined) {
    const r = Number(tweakValues.baseRadius);
    if (node.type === 'button' || node.type === 'badge' || node.type === 'card' || node.id?.includes('btn') || node.id?.includes('card') || node.id?.includes('bdg')) {
      if (dynamicStyle.borderRadius && typeof dynamicStyle.borderRadius === 'number' && dynamicStyle.borderRadius > 0 && dynamicStyle.borderRadius < 100) {
        dynamicStyle.borderRadius = r;
      }
    }
  }

  // N. Font Family (fontFamily)
  if (tweakValues.fontFamily) {
    dynamicStyle.fontFamily = tweakValues.fontFamily;
  }

  // O. Theme tweaks (themeMode: 'Light' | 'Dark' | 'System' or theme: 'dark' | 'light' | 'cyber')
  const themeMode = String(tweakValues.themeMode || tweakValues.theme || '').toLowerCase();
  if (themeMode === 'light') {
    if (node.type === 'frame') {
      dynamicStyle.backgroundColor = '#f8fafc';
      dynamicStyle.color = '#0f172a';
    } else if (node.type === 'card' && node.id !== 'node-s1-hero') {
      dynamicStyle.backgroundColor = '#ffffff';
      dynamicStyle.borderColor = '#e2e8f0';
      dynamicStyle.color = '#0f172a';
    } else if (node.id === 'node-s1-greeting') {
      dynamicStyle.color = '#64748b';
    } else if (node.id === 'node-s1-heading') {
      dynamicStyle.color = '#0f172a';
    } else if (node.id === 'node-s1-asset1-title' || node.id === 'node-s1-asset2-title') {
      dynamicStyle.color = '#1e293b';
    }
  } else if (themeMode === 'dark') {
    if (node.type === 'frame') {
      dynamicStyle.backgroundColor = '#0b0f19';
      dynamicStyle.color = '#f8fafc';
    } else if (node.type === 'card' && !node.id?.includes('hero') && !node.id?.includes('sc-card')) {
      dynamicStyle.backgroundColor = '#1e293b';
      dynamicStyle.borderColor = '#334155';
      dynamicStyle.color = '#f1f5f9';
    } else if (node.type === 'header' || node.type === 'sidebar') {
      if (dynamicStyle.backgroundColor === '#ffffff' || dynamicStyle.backgroundColor === '#f8fafc') {
        dynamicStyle.backgroundColor = '#0f172a';
        dynamicStyle.borderBottomColor = '#1e293b';
        dynamicStyle.borderRightColor = '#1e293b';
        dynamicStyle.borderLeftColor = '#1e293b';
        dynamicStyle.color = '#f8fafc';
      }
    }
    if (dynamicStyle.color === '#0f172a' || dynamicStyle.color === '#1e293b') {
      dynamicStyle.color = '#f1f5f9';
    } else if (dynamicStyle.color === '#64748b' || dynamicStyle.color === '#475569') {
      dynamicStyle.color = '#94a3b8';
    }
  } else if (themeMode === 'cyber') {
    if (node.type === 'frame') {
      dynamicStyle.backgroundColor = '#070514';
      dynamicStyle.color = '#38bdf8';
    } else if (node.type === 'card' && node.id !== 'node-s1-hero') {
      dynamicStyle.backgroundColor = '#110d29';
      dynamicStyle.borderColor = '#38bdf840';
      dynamicStyle.boxShadow = '0 0 15px rgba(56, 189, 248, 0.15)';
    } else if (node.id === 'node-s1-btn') {
      dynamicStyle.backgroundColor = '#06b6d4';
      dynamicStyle.boxShadow = '0 0 20px rgba(6, 182, 212, 0.4)';
    }
  }

  // Order type tweak (legacy demo)
  if (node.id === 'node-s2-badge') {
    displayContent = tweakValues.orderType ? `${tweakValues.orderType} 주문` : '시장가 주문';
  }

  // Ensure scroll-container has auto overflow and height boundary if not set
  if (node.type === 'scroll-container') {
    if (!dynamicStyle.overflowY && !dynamicStyle.overflow) {
      dynamicStyle.overflowY = 'auto';
    }
    if (!dynamicStyle.maxHeight && !dynamicStyle.height) {
      dynamicStyle.maxHeight = 280;
    }
  }

  // Play Mode: Interactive hotspot detection and pulse highlight
  const isInteractiveInPlay = isPlayMode && (
    (node.events && node.events.length > 0) ||
    node.type === 'button' ||
    node.id?.includes('btn') ||
    node.name?.toLowerCase().includes('버튼') ||
    node.name?.toLowerCase().includes('button')
  );

  if (isPlayMode && isInteractiveInPlay) {
    dynamicStyle.cursor = 'pointer';
    if (showHotspots) {
      dynamicStyle.outline = '2px solid #38bdf8';
      dynamicStyle.boxShadow = '0 0 12px rgba(56, 189, 248, 0.7)';
    }
  }

  const cssStyle = styleToCssProperties(dynamicStyle);

  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    if (!isPlayMode && node.locked) {
      return;
    }
    e.stopPropagation();
    if (isPlayMode) {
      if (onNodeEvent) {
        onNodeEvent(node, 'click', e);
      }
      if (
        node.type === 'button' ||
        node.id?.includes('btn') ||
        node.name?.toLowerCase().includes('버튼') ||
        node.name?.toLowerCase().includes('button')
      ) {
        onNodeAction?.(node);
      }
    } else {
      onSelectNode(node, e);
    }
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!interactive) return;
    e.stopPropagation();
    if (isPlayMode) {
      if (onNodeEvent) {
        onNodeEvent(node, 'dblclick', e);
      }
      return;
    }
    if (isTextLike) {
      setIsEditing(true);
      setEditText(displayContent || '');
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    if (!interactive) return;
    if (isPlayMode) {
      e.preventDefault();
      e.stopPropagation();
      if (onNodeEvent) {
        onNodeEvent(node, 'contextmenu', e);
      }
    }
  };

  const handleMouseEnter = (e: React.MouseEvent) => {
    if (!interactive) return;
    if (isPlayMode && onNodeEvent && node.events?.some((ev) => ev.trigger === 'mouseenter')) {
      e.stopPropagation();
      onNodeEvent(node, 'mouseenter', e);
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (onUpdateContent && editText !== displayContent) {
      onUpdateContent(node.id, editText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      if (onUpdateContent && editText !== displayContent) {
        onUpdateContent(node.id, editText);
      }
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(displayContent || '');
    }
  };

  // 3. Specialized Element Rendering
  const renderElementContent = () => {
    // 3.1 Image Element
    if (node.type === 'image') {
      let src = node.props?.dataUrl || node.props?.src || node.content;
      if (!src) {
        src = 'assets/preset-gradient.svg';
      }
      // Resolve built-in preset SVG dataUrl if referencing assets/preset-*.svg
      if (!node.props?.dataUrl && typeof src === 'string' && src.includes('preset-')) {
        const fileName = src.replace(/^assets\//, '').replace(/^\/assets\//, '');
        const preset = getPresetByFileName(fileName);
        if (preset) {
          src = preset.dataUrl;
        }
      }
      const alt = node.props?.alt || node.name || 'image';

      if (imageError) {
        return (
          <div className="w-full h-full min-h-[100px] bg-slate-800/80 border border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center p-4 text-center text-slate-400 gap-1.5 select-none">
            <ImageIcon size={24} className="opacity-50 text-indigo-400" />
            <span className="text-[11px] font-semibold">이미지를 불러올 수 없습니다</span>
            <span className="text-[9px] text-slate-500 font-mono truncate max-w-[200px]">{src}</span>
          </div>
        );
      }

      return (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: dynamicStyle.objectFit || 'cover',
            objectPosition: dynamicStyle.objectPosition || 'center',
            borderRadius: cssStyle.borderRadius,
            display: 'block'
          }}
          className="pointer-events-none select-none"
        />
      );
    }

    // 3.2 Dialog / Modal Component
    if (node.type === 'dialog' && (!node.children || node.children.length === 0) && !node.style?.backgroundColor) {
      const isOpen = node.props?.open !== false;
      return (
        <div className="w-full relative flex flex-col items-center justify-center py-2 select-none">
          {/* Dialog Header Badge */}
          <div className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-900/90 text-white rounded-t-xl text-[10px] font-bold border-b border-slate-700">
            <div className="flex items-center gap-1.5 text-indigo-400">
              <MessageSquare size={12} />
              <span>{node.props?.title || node.name || '모달 다이얼로그'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-1.5 py-0.2 rounded text-[9px] ${isOpen ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'}`}>
                {isOpen ? 'Open 상태' : 'Closed'}
              </span>
              <button className="text-slate-400 hover:text-white">
                <X size={11} />
              </button>
            </div>
          </div>

          {/* Dialog Body Box */}
          <div className="w-full bg-slate-800/95 border border-slate-700 rounded-b-xl shadow-2xl p-4 space-y-3">
            {displayContent && (
              <p className="text-xs text-slate-300 leading-relaxed">{displayContent}</p>
            )}
          </div>
        </div>
      );
    }

    // 3.3 Scroll Container Component
    if (node.type === 'scroll-container' && node.props?.showBadge) {
      return (
        <div className="w-full flex flex-col relative">
          {/* Scroll Indicator Badge in Canvas Mode */}
          {interactive && (
            <div className="flex items-center justify-between px-2 py-0.5 bg-indigo-950/80 text-indigo-300 border border-indigo-700/40 rounded-t text-[9px] font-mono tracking-wider">
              <span className="flex items-center gap-1">
                <ScrollText size={10} />
                <span>스크롤 컨테이너</span>
              </span>
              <span className="text-indigo-400/80">↕ 마우스 휠 스크롤 가능</span>
            </div>
          )}
          {/* Scroll Area */}
          <div
            style={{
              maxHeight: cssStyle.maxHeight || 280,
              overflowY: cssStyle.overflowY || 'auto',
              overflowX: cssStyle.overflowX || 'hidden'
            }}
            className="w-full pr-1 space-y-2 custom-scrollbar"
          >
            {displayContent && <div className="text-xs text-slate-400 p-2">{displayContent}</div>}
            {node.children && node.children.map((child) => (
              <VNodeRenderer
                key={child.id}
                node={child}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
                onUpdateContent={onUpdateContent}
                onNodeAction={onNodeAction}
                onNodeEvent={onNodeEvent}
                onDeleteNode={onDeleteNode}
                onDuplicateNode={onDuplicateNode}
                tweakValues={tweakValues}
                interactive={interactive}
                isPlayMode={isPlayMode}
                showHotspots={showHotspots}
              />
            ))}
          </div>
        </div>
      );
    }

    // 3.4 Text / Heading (inline editing)
    if (isTextLike) {
      if (isEditing) {
        return (
          <input
            type="text"
            value={editText}
            autoFocus
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-white text-slate-900 border border-indigo-500 rounded px-1.5 py-0.5 text-xs w-full focus:outline-none shadow-sm"
          />
        );
      }
      return (
        <>
          {displayContent && <span>{displayContent}</span>}
          {node.children &&
            node.children.map((child) => (
              <VNodeRenderer
                key={child.id}
                node={child}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
                onUpdateContent={onUpdateContent}
                onNodeAction={onNodeAction}
                onNodeEvent={onNodeEvent}
                onDeleteNode={onDeleteNode}
                onDuplicateNode={onDuplicateNode}
                tweakValues={tweakValues}
                interactive={interactive}
                isPlayMode={isPlayMode}
                showHotspots={showHotspots}
              />
            ))}
        </>
      );
    }

    // 3.5 Input & Form Elements
    if (node.type === 'input') {
      const hasVal = node.props?.value !== undefined || (displayContent && !node.props?.placeholder);
      return (
        <input
          type={node.props?.type || 'text'}
          readOnly
          value={hasVal ? (node.props?.value ?? displayContent ?? '') : ''}
          placeholder={node.props?.placeholder || (!hasVal ? displayContent : '') || '입력하세요...'}
          style={{
            color: cssStyle.color || '#0f172a',
            fontSize: cssStyle.fontSize || '11px',
            fontFamily: cssStyle.fontFamily,
            fontWeight: cssStyle.fontWeight
          }}
          className="w-full h-full bg-transparent border-0 focus:outline-none placeholder-slate-400 cursor-default"
        />
      );
    }

    if (node.type === 'textarea') {
      const hasVal = node.props?.value !== undefined || (displayContent && !node.props?.placeholder);
      return (
        <textarea
          readOnly
          rows={node.props?.rows || 3}
          value={hasVal ? (node.props?.value ?? displayContent ?? '') : ''}
          placeholder={node.props?.placeholder || (!hasVal ? displayContent : '') || '내용을 입력하세요...'}
          style={{
            color: cssStyle.color || '#0f172a',
            fontSize: cssStyle.fontSize || '11px',
            fontFamily: cssStyle.fontFamily
          }}
          className="w-full h-full bg-transparent border-0 focus:outline-none placeholder-slate-400 cursor-default resize-none"
        />
      );
    }

    if (node.type === 'select') {
      const options = node.props?.options || [
        { label: '옵션 1 선택', value: 'opt1' },
        { label: '옵션 2 선택', value: 'opt2' }
      ];
      return (
        <select
          disabled
          className="w-full h-full bg-transparent border-0 focus:outline-none text-xs cursor-default appearance-none"
        >
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    if (node.type === 'checkbox') {
      return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={node.props?.checked !== false}
            readOnly
            className="rounded text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-xs">{displayContent || node.name}</span>
        </label>
      );
    }

    if (node.type === 'radio') {
      return (
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input
            type="radio"
            checked={node.props?.checked !== false}
            readOnly
            className="text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-xs">{displayContent || node.name}</span>
        </label>
      );
    }

    if (node.type === 'button') {
      return (
        <>
          {displayContent && <span>{displayContent}</span>}
          {node.children &&
            node.children.map((child) => (
              <VNodeRenderer
                key={child.id}
                node={child}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
                onUpdateContent={onUpdateContent}
                onNodeAction={onNodeAction}
                onNodeEvent={onNodeEvent}
                onDeleteNode={onDeleteNode}
                onDuplicateNode={onDuplicateNode}
                tweakValues={tweakValues}
                interactive={interactive}
                isPlayMode={isPlayMode}
                showHotspots={showHotspots}
              />
            ))}
        </>
      );
    }

    if (node.type === 'icon') {
      const rawName = node.props?.icon || node.props?.name || node.content || '';
      const pascalName = rawName
        ? rawName.split('-').map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join('')
        : '';
      const IconComp = (LucideIcons as any)[pascalName] || (LucideIcons as any)[rawName];
      const iconSize = typeof node.style?.width === 'number' ? node.style.width : (node.props?.size || 15);
      const strokeWidth = node.props?.strokeWidth || 2;
      return (
        <span className="inline-flex items-center justify-center shrink-0" style={{ color: cssStyle.color }}>
          {IconComp ? (
            <IconComp size={iconSize} strokeWidth={strokeWidth} />
          ) : node.props?.svg ? (
            <span dangerouslySetInnerHTML={{ __html: node.props.svg }} />
          ) : (
            <span className="text-xs">{displayContent || '★'}</span>
          )}
        </span>
      );
    }

    if (node.type === 'divider') {
      if (cssStyle.width || cssStyle.height || cssStyle.backgroundColor) {
        return null;
      }
      return <hr className="w-full border-t border-slate-300/40 my-1" />;
    }

    if (node.type === 'details') {
      return (
        <details className="w-full space-y-2 cursor-pointer" open={node.props?.open !== false}>
          <summary className="font-bold text-xs cursor-pointer select-none">
            {displayContent || '아코디언 상세 정보'}
          </summary>
          <div className="pl-3 pt-2 text-xs text-slate-300">
            {node.children && node.children.map((child) => (
              <VNodeRenderer
                key={child.id}
                node={child}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
                onUpdateContent={onUpdateContent}
                tweakValues={tweakValues}
                interactive={interactive}
                isPlayMode={isPlayMode}
                showHotspots={showHotspots}
              />
            ))}
          </div>
        </details>
      );
    }

    // Default container content
    return (
      <>
        {displayContent && <span>{displayContent}</span>}
        {node.children &&
          node.children.map((child) => (
            <VNodeRenderer
              key={child.id}
              node={child}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
              onUpdateContent={onUpdateContent}
              onNodeAction={onNodeAction}
              onNodeEvent={onNodeEvent}
              onDeleteNode={onDeleteNode}
              onDuplicateNode={onDuplicateNode}
              tweakValues={tweakValues}
              interactive={interactive}
              isPlayMode={isPlayMode}
              showHotspots={showHotspots}
            />
          ))}
      </>
    );
  };

  const hasEventsInPlayMode = isPlayMode && node.events && node.events.length > 0;

  if (node.type === 'button') {
    if (!cssStyle.display) cssStyle.display = 'inline-flex';
    if (!cssStyle.alignItems) cssStyle.alignItems = 'center';
    if (!cssStyle.justifyContent) cssStyle.justifyContent = 'center';
    if (cssStyle.gap === undefined) cssStyle.gap = '4px';
  }

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      onMouseEnter={handleMouseEnter}
      style={cssStyle}
      className={`${cssStyle.position ? '' : 'relative'} group ${
        node.className || ''
      } ${
        interactive && isSelected
          ? 'ring-2 ring-indigo-500 ring-offset-1 z-30 shadow-md'
          : hasEventsInPlayMode
          ? 'cursor-pointer hover:opacity-95'
          : interactive
          ? 'hover:outline-1 hover:outline-dashed hover:outline-indigo-400/80 cursor-pointer'
          : ''
      }`}
      data-node-id={node.id}
      data-node-type={node.type}
    >
      {/* Selection Tag Badge & Quick Actions Toolbar */}
      {interactive && isSelected && (
        <div className="absolute -top-7 left-0 px-2 py-0.5 bg-indigo-600 text-white font-mono text-[9px] font-bold rounded shadow-lg z-50 flex items-center gap-2 whitespace-nowrap animate-in fade-in zoom-in-95">
          <span className="flex items-center gap-1 font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{node.name}</span>
          </span>
          <span className="text-indigo-200 uppercase font-mono text-[8px] px-1 py-0.2 bg-indigo-700 rounded">
            {node.type}
          </span>
          {cssStyle.width && cssStyle.height && (
            <span className="text-indigo-200 font-normal">
              {String(cssStyle.width).replace('px', '')}×{String(cssStyle.height).replace('px', '')}
            </span>
          )}
          {onDeleteNode && node.type !== 'frame' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteNode(node.id);
              }}
              className="p-0.5 hover:bg-rose-500 rounded text-indigo-200 hover:text-white transition cursor-pointer"
              title="삭제"
            >
              <Trash2 size={10} />
            </button>
          )}
        </div>
      )}

      {/* Render Node Body */}
      {renderElementContent()}
    </div>
  );
};

export const VNodeRenderer = React.memo(VNodeRendererComponent);
