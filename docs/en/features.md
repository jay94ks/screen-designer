# Screen Designer Feature Specification (Features)

This document provides a comprehensive overview of all core capabilities, UI systems, and workflows in **Screen Designer**.

---

## Table of Contents
1. [Caption & Top Bar](#1-caption--top-bar)
2. [Infinite Canvas & Artboard Management](#2-infinite-canvas--artboard-management)
3. [VDOM Element Hierarchy & Layers](#3-vdom-element-hierarchy--layers)
4. [Precision Property Inspector](#4-precision-property-inspector)
5. [Backgrounds, Gradients & SVG Patterns](#5-backgrounds-gradients--svg-patterns)
6. [Figma-Style Prototyping & Flow Wires](#6-figma-style-prototyping--flow-wires)
7. [Interactive Presentation Play Mode](#7-interactive-presentation-play-mode)
8. [Design System Studio](#8-design-system-studio)
9. [Dynamic Tweaks & Conditional Visibility Rules](#9-dynamic-tweaks--conditional-visibility-rules)
10. [Native Git Desktop Integration](#10-native-git-desktop-integration)
11. [Code Generation & Asset Export](#11-code-generation--asset-export)
12. [Command Palette & Productivity Shortcuts](#12-command-palette--productivity-shortcuts)
13. [Internationalization (i18n)](#13-internationalization-i18n)
14. [Domain-Centric MCP Tools & Headless CLI](#14-domain-centric-mcp-tools--headless-cli)

---

## 1. Caption & Top Bar

- **Separated Caption Bar and Top Bar Architecture**:
  - **Caption Bar (Topmost)**: Operates as native Electron titlebar featuring brand title, frameless drag region, and minimize/maximize/close controls.
  - **Top Bar**:
    - **File / Edit / View / Help Menus**: New project, Open, Save, Settings, Undo, Redo, Zoom controls.
    - **Integrated Search Bar**: `Command Palette (Ctrl+K)` shortcut.
    - **Creation Tool Palette**: Select (V), Hand (H), Text (T), Frame/Box (R), Circle (O).
    - **Alignment Tools**: Left, Center, Right, Top, Middle, Bottom alignment, and distribute evenly.
    - **Flow Toggle (`Flow ●`)**: Toggles visibility of prototyping bezier wires on the canvas.
    - **`▶ PLAY` Button**: Launches fullscreen interactive presentation inside mobile/desktop device mockups.
    - **`Design System` Button**: Dedicated studio modal for global tokens and component default styles.
    - **`Git Branch & Status` Badge**: Live tracking of modified UI files with one-click commit modal.

---

## 2. Infinite Canvas & Artboard Management

- **Canvas Navigation**:
  - Wheel zoom, drag panning, 100% reset (`Ctrl+0`), and fit-to-screen (`Shift+1`).
  - Dot grid background with toggle support.
- **Rulers & Interactive Guidelines**:
  - Real-time pixel coordinate rulers on top and left axes.
  - Drag from rulers onto canvas to place horizontal/vertical guidelines; double-click guideline to delete.
- **Multi-Artboard Workspace**:
  - Top header on each artboard: title, dimensions, individual Image/JSON/Code export, duplicate, and delete.
  - New Artboard Modal:
    - Blank artboards with device presets (iPhone, Android, Tablet, Desktop, Responsive).
    - Section templates: Login Form, Dashboard Stats Grid, E-Commerce Cards, etc.

---

## 3. VDOM Element Hierarchy & Layers

- **Supported Virtual DOM Primitives**:
  - Containers: `frame`, `card`, `box`, `scroll-container`, `dialog`
  - Typography: `heading`, `text`, `label`, `badge`
  - Form Controls: `button`, `input`, `checkbox`, `switch`, `select`
  - Media & Visuals: `image`, `avatar`, `icon`, `chart-card`
- **Hierarchical Layer Sidebar**:
  - Real-time search filter for layer names.
  - Drag-and-drop reordering, nesting, visibility toggling (eye icon), and lock protection.
  - 92% lightweight DOM rendering optimization for complex artboard trees.

---

## 4. Precision Property Inspector

- **Geometry & Alignment**: Direct numeric inputs for X, Y, Width, Height, Rotation, Opacity, and Auto-Layout padding/gap.
- **Color & Gradients**: Hex color pickers, linear and radial gradient editors with real-time swatch presets.
- **Typography**: Font family, font weight, letter spacing, line height, and text alignment.
- **Borders & Shadows**: Border radius, border width, border styles, and customizable drop shadow elevation.

---

## 5. Backgrounds, Gradients & SVG Patterns

- **Pre-bundled Vector Assets**: Includes gradient artboards, tech grid patterns, minimal abstracts, and nature illustrations under `assets/`.
- **Custom Image Uploads**: Local image files picked by users are automatically copied to project assets directory and saved with clean relative paths.

---

## 6. Figma-Style Prototyping & Flow Wires

- **Visual Connection Handles**:
  - Drag from an element handle directly onto any destination artboard to establish an interactive trigger wire.
- **Trigger Events**:
  - `onClick`, `onHover`, `onSwipeLeft`, `onSwipeRight`.
- **Transitions**:
  - Instant jump, Slide Left, Slide Right, Fade, and Modal Overlay presentation.

---

## 7. Interactive Presentation Play Mode

- **Device Mockups**: Realistic bezel frames (iPhone 15 Pro, Pixel 8, Desktop Safari).
- **Live User Testing**:
  - Clicking configured hotspot elements smoothly transitions to target artboards according to transition rules.
  - Blue hotspot highlight hints when clicking outside active areas.

---

## 8. Design System Studio

- **Centralized Design Tokens**:
  - Brand palette: `primary`, `secondary`, `background`, `surface`, `border`, `text`.
  - Typography scale: headings, body copy, and mono accents.
- **Component Default Styles**:
  - Modify base appearance of buttons, cards, and inputs across the entire canvas simultaneously.
  - One-click import / export of `design-system.json`.

---

## 9. Dynamic Tweaks & Conditional Visibility Rules

- **Tweak Controls**:
  - Parameterize variables: Currency, Account Balance, Language, Theme (Dark/Light/Cyber), and Density.
  - Changing a tweak immediately reformats live VDOM mockups (e.g. `₩34,820,000` ↔ `$26,000`).
- **Conditional Visibility Rules**:
  - Set elements to render only when specific tweak conditions or viewport resolution ranges match (`Resolution Rules`).

---

## 10. Native Git Desktop Integration

- **Zero External Dependencies**:
  - Built-in `es-git` native engine for staging, diffing, and committing.
- **Visual Git Modal**:
  - Inspect changed files, review side-by-side JSON diffs, type commit messages, and commit/push with one click.

---

## 11. Code Generation & Asset Export

- **React + Tailwind CSS**:
  - Generates clean, production-ready TSX components adhering to modern React 19 standards.
- **Multi-Format Export**:
  - High-resolution PNG raster images.
  - Structured VDOM JSON documents.
  - Standalone HTML5 previews.

---

## 12. Command Palette & Productivity Shortcuts

- **Command Palette (`Ctrl + K` / `Cmd + K`)**:
  - Instant fuzzy search across all actions, page navigations, tools, and export commands.
- **Shortcuts Modal (`Ctrl + /`)**:
  - Complete cheatsheet for rapid navigation and manipulation.

---

## 13. Internationalization (i18n)

- **Trilingual Core**: Full native support for English (`en`), Korean (`ko`), and Japanese (`ja`).
- **Runtime Switching**: Switch language on the fly via top bar selector without reloading the canvas.

---

## 14. Domain-Centric MCP Tools & Headless CLI

- **17 MCP Tools**: Standardized `screen_designer_*` protocol for seamless AI agent integration.
- **Automated CLI**: Direct headless control for CI/CD pipelines and agentic pair programming.
