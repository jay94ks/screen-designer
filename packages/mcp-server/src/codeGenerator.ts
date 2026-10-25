// Code generation helpers for Screen Designer MCP Server & CLI

export function vnodeToJsx(node: any, indentLevel = 4): string {
  const indent = ' '.repeat(indentLevel);
  const tag =
    node.type === 'button'
      ? 'button'
      : node.type === 'input'
      ? 'input'
      : node.type === 'text'
      ? 'p'
      : 'div';

  const classAttr = node.className ? ` className="${node.className}"` : '';
  const inlineStyles = Object.entries(node.style || {})
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k}: ${typeof v === 'number' ? v : `'${v}'`}`)
    .join(', ');

  const styleAttr = inlineStyles ? ` style={{ ${inlineStyles} }}` : '';

  if (node.type === 'input') {
    const placeholder = node.content ? ` placeholder="${node.content}"` : '';
    return `${indent}<${tag}${classAttr}${styleAttr}${placeholder} />`;
  }

  const textContent = node.content || '';
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren && !textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr} />`;
  }

  if (!hasChildren && textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr}>${textContent}</${tag}>`;
  }

  const childrenJsx = (node.children || [])
    .map((c: any) => vnodeToJsx(c, indentLevel + 2))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  ${textContent}\n` : ''}${childrenJsx}
${indent}</${tag}>`;
}

export function generateReactCode(componentName: string, rootNode: any): string {
  let safeName = componentName.replace(/[^a-zA-Z0-9가-힣]/g, '') || 'ScreenComponent';
  if (/^[0-9]/.test(safeName)) {
    safeName = `Screen_${safeName}`;
  }
  const jsxBody = vnodeToJsx(rootNode, 4);
  return `import React from 'react';

// Auto-generated React Component by Screen Designer MCP Engine
export default function ${safeName}(props: { tweaks?: Record<string, any> }) {
  const { tweaks = {} } = props;

  return (
${jsxBody}
  );
}
`;
}

export function vnodeToVueTemplate(node: any, indentLevel = 2): string {
  const indent = ' '.repeat(indentLevel);
  const tag =
    node.type === 'button'
      ? 'button'
      : node.type === 'input'
      ? 'input'
      : node.type === 'text'
      ? 'p'
      : 'div';

  const classAttr = node.className ? ` class="${node.className}"` : '';
  const inlineStyles = Object.entries(node.style || {})
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${typeof v === 'number' && !['zIndex', 'opacity', 'fontWeight'].includes(k) ? `${v}px` : v}`)
    .join('; ');

  const styleAttr = inlineStyles ? ` style="${inlineStyles}"` : '';

  if (node.type === 'input') {
    const placeholder = node.content ? ` placeholder="${node.content}"` : '';
    return `${indent}<${tag}${classAttr}${styleAttr}${placeholder} />`;
  }

  const textContent = node.content || '';
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren && !textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr} />`;
  }

  if (!hasChildren && textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr}>{{ '${textContent.replace(/'/g, "\\'")}' }}</${tag}>`;
  }

  const childrenHtml = (node.children || [])
    .map((c: any) => vnodeToVueTemplate(c, indentLevel + 2))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  {{ '${textContent.replace(/'/g, "\\'")}' }}\n` : ''}${childrenHtml}
${indent}</${tag}>`;
}

export function generateVueCode(componentName: string, rootNode: any): string {
  const templateBody = vnodeToVueTemplate(rootNode, 2);
  return `<script setup lang="ts">
// Auto-generated Vue 3 Component by Screen Designer MCP Engine
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
/* Scoped styles managed by Screen Designer */
</style>
`;
}

export function vnodeToHtml(node: any, indentLevel = 2): string {
  const indent = ' '.repeat(indentLevel);
  const tag =
    node.type === 'button'
      ? 'button'
      : node.type === 'input'
      ? 'input'
      : node.type === 'text'
      ? 'p'
      : 'div';

  const classAttr = node.className ? ` class="${node.className}"` : '';
  const inlineStyles = Object.entries(node.style || {})
    .filter(([_, v]) => v !== undefined)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${typeof v === 'number' && !['zIndex', 'opacity', 'fontWeight'].includes(k) ? `${v}px` : v}`)
    .join('; ');

  const styleAttr = inlineStyles ? ` style="${inlineStyles}"` : '';

  if (node.type === 'input') {
    const placeholder = node.content ? ` placeholder="${node.content}"` : '';
    return `${indent}<${tag}${classAttr}${styleAttr}${placeholder} />`;
  }

  const textContent = node.content || '';
  const hasChildren = node.children && node.children.length > 0;

  if (!hasChildren && !textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr} />`;
  }

  if (!hasChildren && textContent) {
    return `${indent}<${tag}${classAttr}${styleAttr}>${textContent}</${tag}>`;
  }

  const childrenHtml = (node.children || [])
    .map((c: any) => vnodeToHtml(c, indentLevel + 2))
    .join('\n');

  return `${indent}<${tag}${classAttr}${styleAttr}>
${textContent ? `${indent}  ${textContent}\n` : ''}${childrenHtml}
${indent}</${tag}>`;
}

export function generateHtmlCode(componentName: string, rootNode: any): string {
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
