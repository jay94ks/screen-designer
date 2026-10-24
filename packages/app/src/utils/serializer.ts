import React from 'react';
import { VNode, VNodeStyle } from '../types/vdom';

export function styleToCssProperties(style: VNodeStyle): React.CSSProperties {
  const css: React.CSSProperties = {};

  // Display & Flex/Grid
  if (style.display) css.display = style.display;
  if (style.flexDirection) css.flexDirection = style.flexDirection;
  if (style.flex !== undefined) css.flex = style.flex;
  if (style.flexWrap) css.flexWrap = style.flexWrap;
  if (style.flexGrow !== undefined) css.flexGrow = style.flexGrow;
  if (style.flexShrink !== undefined) css.flexShrink = style.flexShrink;
  if (style.flexBasis !== undefined) css.flexBasis = typeof style.flexBasis === 'number' ? `${style.flexBasis}px` : style.flexBasis;
  if (style.alignItems) css.alignItems = style.alignItems;
  if (style.alignContent) css.alignContent = style.alignContent;
  if (style.justifyContent) css.justifyContent = style.justifyContent;
  if (style.gap !== undefined) css.gap = typeof style.gap === 'number' ? `${style.gap}px` : style.gap;
  if (style.rowGap !== undefined) css.rowGap = typeof style.rowGap === 'number' ? `${style.rowGap}px` : style.rowGap;
  if (style.columnGap !== undefined) css.columnGap = typeof style.columnGap === 'number' ? `${style.columnGap}px` : style.columnGap;
  if (style.gridTemplateColumns) css.gridTemplateColumns = style.gridTemplateColumns;
  if (style.gridTemplateRows) css.gridTemplateRows = style.gridTemplateRows;

  // Dimensions & Box
  if (style.width !== undefined) css.width = typeof style.width === 'number' ? `${style.width}px` : style.width;
  if (style.minWidth !== undefined) css.minWidth = typeof style.minWidth === 'number' ? `${style.minWidth}px` : style.minWidth;
  if (style.maxWidth !== undefined) css.maxWidth = typeof style.maxWidth === 'number' ? `${style.maxWidth}px` : style.maxWidth;
  if (style.height !== undefined) css.height = typeof style.height === 'number' ? `${style.height}px` : style.height;
  if (style.minHeight !== undefined) css.minHeight = typeof style.minHeight === 'number' ? `${style.minHeight}px` : style.minHeight;
  if (style.maxHeight !== undefined) css.maxHeight = typeof style.maxHeight === 'number' ? `${style.maxHeight}px` : style.maxHeight;
  if (style.boxSizing) css.boxSizing = style.boxSizing;

  // Padding & Margin
  if (style.padding !== undefined) css.padding = typeof style.padding === 'number' ? `${style.padding}px` : style.padding;
  if (style.paddingTop !== undefined) css.paddingTop = typeof style.paddingTop === 'number' ? `${style.paddingTop}px` : style.paddingTop;
  if (style.paddingRight !== undefined) css.paddingRight = typeof style.paddingRight === 'number' ? `${style.paddingRight}px` : style.paddingRight;
  if (style.paddingBottom !== undefined) css.paddingBottom = typeof style.paddingBottom === 'number' ? `${style.paddingBottom}px` : style.paddingBottom;
  if (style.paddingLeft !== undefined) css.paddingLeft = typeof style.paddingLeft === 'number' ? `${style.paddingLeft}px` : style.paddingLeft;
  if (style.margin !== undefined) css.margin = typeof style.margin === 'number' ? `${style.margin}px` : style.margin;
  if (style.marginTop !== undefined) css.marginTop = typeof style.marginTop === 'number' ? `${style.marginTop}px` : style.marginTop;
  if (style.marginRight !== undefined) css.marginRight = typeof style.marginRight === 'number' ? `${style.marginRight}px` : style.marginRight;
  if (style.marginBottom !== undefined) css.marginBottom = typeof style.marginBottom === 'number' ? `${style.marginBottom}px` : style.marginBottom;
  if (style.marginLeft !== undefined) css.marginLeft = typeof style.marginLeft === 'number' ? `${style.marginLeft}px` : style.marginLeft;

  // Background & Image Background
  if (style.backgroundColor) css.backgroundColor = style.backgroundColor;
  if (style.backgroundGradient) css.background = style.backgroundGradient;
  if (style.backgroundImage) {
    const bg = style.backgroundImage.trim();
    css.backgroundImage = bg.startsWith('url(') || bg.startsWith('linear-gradient(') || bg.startsWith('radial-gradient(')
      ? bg
      : `url("${bg}")`;
  }
  if (style.backgroundSize) css.backgroundSize = style.backgroundSize;
  if (style.backgroundPosition) css.backgroundPosition = style.backgroundPosition;
  if (style.backgroundRepeat) css.backgroundRepeat = style.backgroundRepeat;
  if (style.backgroundAttachment) css.backgroundAttachment = style.backgroundAttachment;
  if (style.backgroundBlendMode) css.backgroundBlendMode = style.backgroundBlendMode;

  // Image Specific Properties
  if (style.objectFit) css.objectFit = style.objectFit;
  if (style.objectPosition) css.objectPosition = style.objectPosition;
  if (style.aspectRatio) css.aspectRatio = style.aspectRatio;

  // Filters (Image & Elements)
  const filterParts: string[] = [];
  if (style.brightness !== undefined) filterParts.push(`brightness(${style.brightness}%)`);
  if (style.contrast !== undefined) filterParts.push(`contrast(${style.contrast}%)`);
  if (style.grayscale !== undefined) filterParts.push(`grayscale(${style.grayscale}%)`);
  if (style.blur !== undefined && style.blur !== 0) filterParts.push(`blur(${typeof style.blur === 'number' ? `${style.blur}px` : style.blur})`);
  if (style.sepia !== undefined && style.sepia !== 0) filterParts.push(`sepia(${style.sepia}%)`);
  if (style.hueRotate !== undefined && style.hueRotate !== 0) filterParts.push(`hue-rotate(${style.hueRotate}deg)`);
  if (style.saturate !== undefined) filterParts.push(`saturate(${style.saturate}%)`);
  if (style.invert !== undefined && style.invert !== 0) filterParts.push(`invert(${style.invert}%)`);
  if (style.filter) {
    css.filter = style.filter;
  } else if (filterParts.length > 0) {
    css.filter = filterParts.join(' ');
  }
  if (style.backdropFilter) css.backdropFilter = style.backdropFilter;

  // Borders & Outlines
  if (style.borderRadius !== undefined) css.borderRadius = typeof style.borderRadius === 'number' ? `${style.borderRadius}px` : style.borderRadius;
  if (style.borderTopLeftRadius !== undefined) css.borderTopLeftRadius = typeof style.borderTopLeftRadius === 'number' ? `${style.borderTopLeftRadius}px` : style.borderTopLeftRadius;
  if (style.borderTopRightRadius !== undefined) css.borderTopRightRadius = typeof style.borderTopRightRadius === 'number' ? `${style.borderTopRightRadius}px` : style.borderTopRightRadius;
  if (style.borderBottomLeftRadius !== undefined) css.borderBottomLeftRadius = typeof style.borderBottomLeftRadius === 'number' ? `${style.borderBottomLeftRadius}px` : style.borderBottomLeftRadius;
  if (style.borderBottomRightRadius !== undefined) css.borderBottomRightRadius = typeof style.borderBottomRightRadius === 'number' ? `${style.borderBottomRightRadius}px` : style.borderBottomRightRadius;
  if (style.borderWidth !== undefined) css.borderWidth = typeof style.borderWidth === 'number' ? `${style.borderWidth}px` : style.borderWidth;
  if (style.borderColor) css.borderColor = style.borderColor;
  if (style.borderStyle) css.borderStyle = style.borderStyle;
  if (style.outlineWidth !== undefined) css.outlineWidth = typeof style.outlineWidth === 'number' ? `${style.outlineWidth}px` : style.outlineWidth;
  if (style.outlineColor) css.outlineColor = style.outlineColor;
  if (style.outlineStyle) css.outlineStyle = style.outlineStyle;
  if (style.outlineOffset !== undefined) css.outlineOffset = typeof style.outlineOffset === 'number' ? `${style.outlineOffset}px` : style.outlineOffset;

  // Effects & Shadows
  if (style.boxShadow) css.boxShadow = style.boxShadow;
  if (style.opacity !== undefined) css.opacity = style.opacity;
  if (style.cursor) css.cursor = style.cursor;
  if (style.pointerEvents) css.pointerEvents = style.pointerEvents;
  if (style.transform) css.transform = style.transform;
  if (style.transition) css.transition = style.transition;

  // Overflow & Scrolling (Scroll Container)
  if (style.overflow) css.overflow = style.overflow;
  if (style.overflowX) css.overflowX = style.overflowX;
  if (style.overflowY) css.overflowY = style.overflowY;
  if (style.scrollbarWidth) (css as any).scrollbarWidth = style.scrollbarWidth;
  if (style.scrollBehavior) css.scrollBehavior = style.scrollBehavior;

  // Typography
  if (style.color) css.color = style.color;
  if (style.fontFamily) css.fontFamily = style.fontFamily;
  if (style.fontSize !== undefined) css.fontSize = typeof style.fontSize === 'number' ? `${style.fontSize}px` : style.fontSize;
  if (style.fontWeight) css.fontWeight = style.fontWeight as any;
  if (style.fontStyle) css.fontStyle = style.fontStyle;
  if (style.textAlign) css.textAlign = style.textAlign;
  if (style.textDecoration) css.textDecoration = style.textDecoration;
  if (style.textTransform) css.textTransform = style.textTransform;
  if (style.lineHeight !== undefined) css.lineHeight = style.lineHeight;
  if (style.letterSpacing) css.letterSpacing = style.letterSpacing;
  if (style.textOverflow) css.textOverflow = style.textOverflow;
  if (style.whiteSpace) css.whiteSpace = style.whiteSpace;
  if (style.wordBreak) css.wordBreak = style.wordBreak;

  // Positioning
  if (style.position) css.position = style.position;
  if (style.top !== undefined) css.top = typeof style.top === 'number' ? `${style.top}px` : style.top;
  if (style.right !== undefined) css.right = typeof style.right === 'number' ? `${style.right}px` : style.right;
  if (style.bottom !== undefined) css.bottom = typeof style.bottom === 'number' ? `${style.bottom}px` : style.bottom;
  if (style.left !== undefined) css.left = typeof style.left === 'number' ? `${style.left}px` : style.left;
  if (style.zIndex !== undefined) css.zIndex = style.zIndex;

  return css;
}

export function getHtmlTag(type: string, props?: any): string {
  switch (type) {
    case 'heading':
      return `h${props?.headingLevel || 2}`;
    case 'text':
      return 'p';
    case 'button':
      return 'button';
    case 'input':
      return 'input';
    case 'textarea':
      return 'textarea';
    case 'select':
      return 'select';
    case 'image':
      return 'img';
    case 'video':
      return 'video';
    case 'audio':
      return 'audio';
    case 'iframe':
      return 'iframe';
    case 'dialog':
      return 'dialog';
    case 'section':
      return 'section';
    case 'header':
      return 'header';
    case 'footer':
      return 'footer';
    case 'nav':
      return 'nav';
    case 'aside':
      return 'aside';
    case 'main':
      return 'main';
    case 'article':
      return 'article';
    case 'blockquote':
      return 'blockquote';
    case 'code':
      return 'code';
    case 'pre':
      return 'pre';
    case 'span':
      return 'span';
    case 'label':
      return 'label';
    case 'form':
      return 'form';
    case 'table':
      return 'table';
    case 'thead':
      return 'thead';
    case 'tbody':
      return 'tbody';
    case 'tr':
      return 'tr';
    case 'th':
      return 'th';
    case 'td':
      return 'td';
    case 'ul':
      return 'ul';
    case 'ol':
      return 'ol';
    case 'li':
      return 'li';
    case 'details':
      return 'details';
    case 'summary':
      return 'summary';
    case 'divider':
      return 'hr';
    case 'scroll-container':
    case 'frame':
    case 'container':
    case 'box':
    case 'card':
    default:
      return 'div';
  }
}

export function vnodeToJsx(node: VNode, indentLevel = 2): string {
  const indent = ' '.repeat(indentLevel);
  const tag = getHtmlTag(node.type, node.props);

  const classAttr = node.className ? ` className="${node.className}"` : '';
  const inlineStyles = Object.entries(node.style || {})
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${typeof v === 'number' ? v : `'${v}'`}`)
    .join(', ');

  const styleAttr = inlineStyles ? ` style={{ ${inlineStyles} }}` : '';

  if (node.type === 'image') {
    const src = node.props?.src || node.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
    const alt = node.props?.alt ? ` alt="${node.props.alt}"` : ' alt="Image"';
    return `${indent}<img src="${src}"${alt}${classAttr}${styleAttr} />`;
  }

  if (node.type === 'input') {
    const placeholder = node.props?.placeholder || node.content ? ` placeholder="${node.props?.placeholder || node.content}"` : '';
    const inputType = node.props?.type ? ` type="${node.props.type}"` : ' type="text"';
    return `${indent}<input${inputType}${classAttr}${styleAttr}${placeholder} />`;
  }

  if (node.type === 'textarea') {
    const placeholder = node.props?.placeholder || node.content ? ` placeholder="${node.props?.placeholder || node.content}"` : '';
    const rows = node.props?.rows ? ` rows={${node.props.rows}}` : ' rows={3}';
    return `${indent}<textarea${rows}${classAttr}${styleAttr}${placeholder} />`;
  }

  if (node.type === 'divider') {
    return `${indent}<hr${classAttr}${styleAttr} />`;
  }

  const textContent = node.content ? node.content : '';
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren && !textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr} />`;
  }

  if (!hasChildren && textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr}>${textContent}</${tag}>`;
  }

  const childrenJsx = (node.children || [])
    .map((c) => vnodeToJsx(c, indentLevel + 2))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  ${textContent}\n` : ''}${childrenJsx}
${indent}</${tag}>`;
}

export function generateReactCode(componentName: string, rootNode: VNode): string {
  let safeName = componentName.replace(/[^a-zA-Z0-9가-힣]/g, '') || 'ScreenComponent';
  if (/^[0-9]/.test(safeName)) {
    safeName = `Screen_${safeName}`;
  }
  const jsxBody = vnodeToJsx(rootNode, 4);
  return `import React from 'react';

// Auto-generated React Component by Screen Designer VDOM Engine
export default function ${safeName}(props: { tweaks?: Record<string, any> }) {
  const { tweaks = {} } = props;

  return (
${jsxBody}
  );
}
`;
}

export const generateComponentCode = generateReactCode;

export function vnodeToVueTemplate(node: VNode, indentLevel = 2): string {
  const indent = ' '.repeat(indentLevel);
  const tag = getHtmlTag(node.type, node.props);

  const classAttr = node.className ? ` class="${node.className}"` : '';
  const inlineStyles = Object.entries(node.style || {})
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${typeof v === 'number' && !['zIndex', 'opacity', 'fontWeight', 'flexGrow', 'flexShrink'].includes(k) ? `${v}px` : v}`)
    .join('; ');

  const styleAttr = inlineStyles ? ` style="${inlineStyles}"` : '';

  if (node.type === 'image') {
    const src = node.props?.src || node.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
    const alt = node.props?.alt ? ` alt="${node.props.alt}"` : ' alt="Image"';
    return `${indent}<img src="${src}"${alt}${classAttr}${styleAttr} />`;
  }

  if (node.type === 'input') {
    const placeholder = node.props?.placeholder || node.content ? ` placeholder="${node.props?.placeholder || node.content}"` : '';
    const inputType = node.props?.type ? ` type="${node.props.type}"` : ' type="text"';
    return `${indent}<input${inputType}${classAttr}${styleAttr}${placeholder} />`;
  }

  if (node.type === 'divider') {
    return `${indent}<hr${classAttr}${styleAttr} />`;
  }

  const textContent = node.content ? node.content : '';
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren && !textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr} />`;
  }

  if (!hasChildren && textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr}>{{ '${textContent.replace(/'/g, "\\'")}' }}</${tag}>`;
  }

  const childrenHtml = (node.children || [])
    .map((c) => vnodeToVueTemplate(c, indentLevel + 2))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  {{ '${textContent.replace(/'/g, "\\'")}' }}\n` : ''}${childrenHtml}
${indent}</${tag}>`;
}

export function generateVueCode(componentName: string, rootNode: VNode): string {
  let safeName = componentName.replace(/[^a-zA-Z0-9가-힣]/g, '') || 'ScreenComponent';
  if (/^[0-9]/.test(safeName)) {
    safeName = `Screen_${safeName}`;
  }
  const templateBody = vnodeToVueTemplate(rootNode, 2);
  return `<script setup lang="ts">
// Auto-generated Vue 3 Component by Screen Designer VDOM Engine
interface Props {
  tweaks?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  tweaks: () => ({})
});
</script>

<template>
${templateBody}
</template>

<style scoped>
/* Utility and scoped styles managed by Screen Designer */
</style>
`;
}

export function vnodeToHtml(node: VNode, indentLevel = 2): string {
  const indent = ' '.repeat(indentLevel);
  const tag = getHtmlTag(node.type, node.props);

  const classAttr = node.className ? ` class="${node.className}"` : '';
  const inlineStyles = Object.entries(node.style || {})
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${typeof v === 'number' && !['zIndex', 'opacity', 'fontWeight', 'flexGrow', 'flexShrink'].includes(k) ? `${v}px` : v}`)
    .join('; ');

  const styleAttr = inlineStyles ? ` style="${inlineStyles}"` : '';

  if (node.type === 'image') {
    const src = node.props?.src || node.content || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80';
    const alt = node.props?.alt ? ` alt="${node.props.alt}"` : ' alt="Image"';
    return `${indent}<img src="${src}"${alt}${classAttr}${styleAttr} />`;
  }

  if (node.type === 'input') {
    const placeholder = node.props?.placeholder || node.content ? ` placeholder="${node.props?.placeholder || node.content}"` : '';
    const inputType = node.props?.type ? ` type="${node.props.type}"` : ' type="text"';
    return `${indent}<input${inputType}${classAttr}${styleAttr}${placeholder} />`;
  }

  if (node.type === 'divider') {
    return `${indent}<hr${classAttr}${styleAttr} />`;
  }

  const textContent = node.content ? node.content : '';
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren && !textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr} />`;
  }

  if (!hasChildren && textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr}>${textContent}</${tag}>`;
  }

  const childrenHtml = (node.children || [])
    .map((c) => vnodeToHtml(c, indentLevel + 2))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  ${textContent}\n` : ''}${childrenHtml}
${indent}</${tag}>`;
}

export function generateHtmlCode(componentName: string, rootNode: VNode): string {
  const htmlBody = vnodeToHtml(rootNode, 4);
  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${componentName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-900 text-slate-100 flex items-center justify-center min-h-screen p-4">
${htmlBody}
</body>
</html>
`;
}
