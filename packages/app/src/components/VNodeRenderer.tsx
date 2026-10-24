import React, { useState } from 'react';
import { VNode } from '../types/vdom';
import { styleToCssProperties } from '../utils/serializer';
import { evaluateNodeVisibility } from '../utils/conditionEvaluator';
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
  onNodeEvent?: (node: VNode, trigger: 'click' | 'dblclick' | 'contextmenu', e: React.MouseEvent) => void;
  onDeleteNode?: (nodeId: string) => void;
  onDuplicateNode?: (node: VNode) => void;
  tweakValues?: Record<string, any>;
  interactive?: boolean;
  isPlayMode?: boolean;
}

export const VNodeRenderer: React.FC<VNodeRendererProps> = ({
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
  isPlayMode = false
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

  // Currency tweak
  if (node.id === 'node-s1-balance-val') {
    displayContent = tweakValues.currency?.includes('USD') ? '$ 26,480.00' : '₩ 34,820,000';
  }

  // Order type tweak
  if (node.id === 'node-s2-badge') {
    displayContent = tweakValues.orderType ? `${tweakValues.orderType} 주문` : '시장가 주문';
  }

  // Theme tweaks (Dark / Light / Cyber)
  if (tweakValues.theme === 'light') {
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
  } else if (tweakValues.theme === 'cyber') {
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

  // Ensure scroll-container has auto overflow and height boundary if not set
  if (node.type === 'scroll-container') {
    if (!dynamicStyle.overflowY && !dynamicStyle.overflow) {
      dynamicStyle.overflowY = 'auto';
    }
    if (!dynamicStyle.maxHeight && !dynamicStyle.height) {
      dynamicStyle.maxHeight = 280;
    }
  }

  const cssStyle = styleToCssProperties(dynamicStyle);

  const handleClick = (e: React.MouseEvent) => {
    if (!interactive) return;
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
      const src = node.props?.src || node.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
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
    if (node.type === 'dialog') {
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
              />
            ))}
          </div>
        </div>
      );
    }

    // 3.3 Scroll Container Component
    if (node.type === 'scroll-container') {
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
      return <span>{displayContent}</span>;
    }

    // 3.5 Input & Form Elements
    if (node.type === 'input') {
      return (
        <input
          type={node.props?.type || 'text'}
          readOnly
          placeholder={node.props?.placeholder || displayContent || '입력하세요...'}
          className="w-full h-full bg-transparent border-0 focus:outline-none placeholder-slate-400 cursor-default"
        />
      );
    }

    if (node.type === 'textarea') {
      return (
        <textarea
          readOnly
          rows={node.props?.rows || 3}
          placeholder={node.props?.placeholder || displayContent || '내용을 입력하세요...'}
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
        <button className="w-full h-full bg-transparent border-0 cursor-pointer pointer-events-none font-bold">
          {displayContent}
        </button>
      );
    }

    if (node.type === 'divider') {
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
            />
          ))}
      </>
    );
  };

  const hasEventsInPlayMode = isPlayMode && node.events && node.events.length > 0;

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onContextMenu={handleContextMenu}
      style={cssStyle}
      className={`relative transition-all duration-75 group ${
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
