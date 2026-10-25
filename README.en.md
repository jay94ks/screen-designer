<p align="center">
  <img src="docs/logo.png" width="128" height="128" alt="Screen Designer Logo" />
</p>

<h1 align="center">Screen Designer</h1>

<p align="center">
  <strong>Universal Cross-Agent Visual Storyboard Canvas, MCP Suite & Headless CLI</strong><br>
  Real-time UI design & visual prototyping tool for Claude Code, Cursor, OpenAI Codex/GPT, and Google Gemini (Antigravity).
</p>

<p align="center">
  <a href="README.en.md">English</a> • <a href="README.md">한국어</a> • <a href="README.ja.md">日本語</a>
</p>

<p align="center">
  <a href="https://www.npmjs.com/"><img src="https://img.shields.io/badge/npm-v1.0.0-blue.svg" alt="npm version" /></a>
  <a href="https://modelcontextprotocol.io/"><img src="https://img.shields.io/badge/MCP-17%20Tools-brightgreen.svg" alt="MCP Standard" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="docs/en/features.md#13-internationalization-i18n"><img src="https://img.shields.io/badge/i18n-KO%20%7C%20EN%20%7C%20JA-purple.svg" alt="i18n" /></a>
</p>

---

![Screen Designer Live Visual Canvas Workspace](docs/preview-canvas.png)

---

## 🌟 Key Features

1. **Live Canvas & Infinite Canvas**:
   - The interactive VDOM UI renders on the canvas as soon as an AI agent delivers code.
   - Built with layer tree DOM optimizations and a window-level rAF 60 FPS pan & zoom engine.
2. **📐 Canvas Roles & Responsive Resolution System**:
   - Frames are designed around screen purposes and roles (`main-page`, `sub-page`, `modal`, `bottom-sheet`, `widget`, `responsive-viewport`) rather than rigid device presets.
   - Supports direct width×height entry, one-click orientation toggle, live runtime preview presets, and conditional resolution rules.
3. **⚡ Interactive Prototyping & Dynamic Tweaks**:
   - Figma-style bezier curves (Wires), device mockup presentation mode (`▶ PLAY`), and hotspot click guides.
   - Real-time tweak adjustments (Theme, Currency ₩/$/€/¥, Language, UI Density) reformat live VDOM mockups dynamically.
4. **🛠️ 17 Domain-Centric MCP Tools (`screen_designer_*`)**:
   - Project inspection, page/artboard management, node style updates, design system tokens, and Chrome Headless visual validation via standard Model Context Protocol.
5. **💻 CLI Control Interface (`screen-designer`)**:
   - Control projects from the terminal without a GUI: `screen-designer page create`, `screen-designer artboard add/update/delete`, `screen-designer commit`, and more.
6. **📦 Native Git Engine (`es-git`) Integration**:
   - No external Git binary required. Integrated `es-git` engine tracks working changes with side-by-side diff view and one-click commit/push.
7. **🌐 Trilingual Localization (i18n)**:
   - Language switching between Korean (`ko`), English (`en`), and Japanese (`ja`) with persistent per-project settings.

---

## 🚀 Getting Started

### 1. Global Installation

```bash
# Install globally via npm
npm install -g screen-designer

# Launch directly targeting any project directory
screen-designer /path/to/my-project
```

### 2. Project Initialization

Set up Screen Designer in any existing project directory with a single command:

```bash
npx screen-designer init
```

The following files are automatically created:
- `.screen-designer/config.json`: Project configuration (pages path, design system path, etc.)
- `docs/ui-boards/`: UI storyboard workspace (`project.json`, `design-system.json`, `pages/`, `assets/`)
- `AGENTS.md` & `CLAUDE.md`: Guidelines for AI coding agents

### 3. Running MCP Server & UI

```bash
# Start standard MCP I/O server (for AI agents)
screen-designer serve
# or
screen-designer mcp

# Launch visual web/desktop canvas UI
screen-designer ui
```

---

## ⌨️ CLI Reference

Screen Designer provides the following command-line interface tools:

```bash
# Status & Diagnostics
screen-designer status                          # Check project status and page list
screen-designer doctor                          # Check environment & dependency health

# Page Management
screen-designer page list                       # List all registered pages
screen-designer page create "Checkout Flow"     # Create a new screen page

# Artboard Management
screen-designer artboard list <pageId>          # List artboards in page
screen-designer artboard add <pageId> -t "Login" --viewport mobile
screen-designer artboard update <pageId> <artboardId> --title "Login V2"
screen-designer artboard delete <pageId> <artboardId>

# Design Tokens & Code Export
screen-designer tokens get                      # View design tokens
screen-designer tokens set --primary "#4f46e5"  # Update primary brand color
screen-designer export <artboardId> -o ./src    # Export as React + Tailwind component
screen-designer render-image <pageId>           # Capture artboards via Chrome Headless

# Git Desktop Version Control
screen-designer commit -m "feat: add checkout flow artboard"
```

---

## 🔌 Available MCP Tools (17 Tools)

The Screen Designer MCP server supports both the standardized `screen_designer_*` namespace and backward-compatible aliases:

| Category | Tool Name | Description |
| :--- | :--- | :--- |
| **Project** | `screen_designer_get_project` | Get project config, canvas connection status, and list of all pages |
| **Pages** | `screen_designer_list_pages` | List all UI pages and metadata summaries |
| | `screen_designer_get_page` | Get complete details of a specific page (artboards, VDOM node tree, wires, tweaks) |
| | `screen_designer_create_page` | Create a new page document (supports templates and initial artboard) |
| | `screen_designer_save_page` | Save or update a Virtual DOM page document (`docs/ui-boards/pages/*.json`) |
| | `screen_designer_delete_page` | Delete a page document and sync project manifest |
| **Artboards** | `screen_designer_add_artboard` | Add a new artboard (mobile/desktop/template) to a page |
| | `screen_designer_update_artboard` | Partially update metadata, VDOM node tree, or styling of an artboard |
| | `screen_designer_delete_artboard` | Delete an artboard (synced with canvas, layer sidebar, properties panel, and hotkeys) |
| **Tokens** | `screen_designer_get_design_system` | Read design system tokens and default component styles |
| | `screen_designer_save_design_system` | Batch update tokens and default styles, and sync with live canvas |
| **Live Canvas**| `screen_designer_get_live_selection` | Get element ID clicked on canvas and real-time slider tweak values |
| | `screen_designer_sync_canvas` | Zoom/pan canvas viewport and focus camera onto specific artboard/element |
| **Visual & Code**| `screen_designer_render_image` | Artboard screenshot capture via Chrome Headless (visual verification) |
| | `screen_designer_export_code` | Compile VDOM structure into production-ready React 19 + Tailwind CSS components |
| **Git** | `screen_designer_git_status` | View staged UI files and git diffs powered by `es-git` |
| | `screen_designer_git_commit` | Auto-stage UI modifications and create git commit powered by `es-git` |

---

## 💬 AI Agent Prompt Examples

### 1. Google Gemini (Antigravity)
```text
"Gemini, create a 'Sign Up Flow' page using screen_designer_create_page and add 3 mobile onboarding artboards side by side."
```

### 2. Anthropic Claude (Claude Code / Desktop)
```text
"Inspect the active page with screen_designer_get_page, change the button color to #6366f1 using screen_designer_update_artboard, and verify the screenshot with screen_designer_render_image."
```

### 3. OpenAI GPT / Codex
```text
"Update the design system tokens to a Dark Cyberpunk theme, and commit the modified UI changes via es-git."
```

---

## 📚 Documentation Hub

Detailed specifications and guides are available in the [docs/en/](docs/en/README.md) directory:

- 📖 [Documentation Hub (docs/en/README.md)](docs/en/README.md)
- 📋 [Feature Specification (features.md)](docs/en/features.md)
- 🛠️ [MCP Tools & CLI Reference (mcp-and-cli-reference.md)](docs/en/mcp-and-cli-reference.md)
- 📁 [Project Storage Specification (project-structure.md)](docs/en/project-structure.md)
- 🌐 [Global Installation & Target Execution Architecture (global-install-and-target-execution.md)](docs/en/global-install-and-target-execution.md)
- ⌨️ [Shortcuts & Productivity Guide (shortcuts.md)](docs/en/shortcuts.md)
- 🤖 [Agent Development Manual (AGENTS.md)](AGENTS.md)

---

## 💻 Local Development & Contributing

```bash
# 1. Install dependencies
npm install

# 2. Build monorepo packages (packages/app, packages/mcp-server, packages/cli)
npm run build

# 3. Start browser development server (Vite)
npm run dev:app

# 4. Launch Electron desktop application
npm run start

# 5. Start standalone MCP server
npm run dev:mcp
```

---

## 📄 License

MIT License © 2026 jay94ks@gmail.com
