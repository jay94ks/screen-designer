# Screen Designer Documentation Hub

> Cross-platform visual screen design, UI storyboard authoring, and prototyping system powered by **React 19 + TypeScript + Electron + MCP + Headless CLI**.  
> Designed for product managers, UI/UX designers, frontend engineers, and AI coding agents (Claude, Gemini, Cursor, Codex).

---

## 📚 Documentation Index

- [Feature Specification (features.md)](./features.md): Comprehensive details on all 14 core capabilities (Infinite Canvas, Prototyping Wires, Design System Studio, Git Desktop, Localization, Headless CLI, etc.).
- [MCP Tools & CLI Reference (mcp-and-cli-reference.md)](./mcp-and-cli-reference.md): Full reference for the 17 domain-centric MCP tools (`screen_designer_*`) and terminal command syntax.
- [Project Storage Specification (project-structure.md)](./project-structure.md): Specifications for files stored under `docs/ui-boards/` and `.screen-designer/` (`project.json`, `design-system.json`, `pages/`, `config.json`).
- [Global Installation & Target Execution (global-install-and-target-execution.md)](./global-install-and-target-execution.md): Architecture for global `npm install -g`, `npx` execution, and smart fallback modes.
- [Keyboard Shortcuts Guide (shortcuts.md)](./shortcuts.md): Cheatsheet for command palette (`Ctrl+K`), tools, rulers, navigation, and editing hotkeys.
- [Agent Maintenance Manual (AGENTS.md)](../../AGENTS.md): Architecture guidelines, codebase conventions, and verification workflows for AI agents.

---

## 🚀 Quick Start

### System Requirements
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **Package Manager**: `npm` v9.0.0 or higher
- **Supported Operating Systems**: Windows 10/11, Linux (Ubuntu/Debian, WSL2), macOS

### 1. Global CLI Installation & Launch
```bash
# Install globally
npm install -g screen-designer

# Initialize project
screen-designer init

# Launch visual UI
screen-designer ui

# Start standard MCP server
screen-designer serve
```

### 2. Local Monorepo Setup
```bash
# Clone repository
git clone https://github.com/jay94ks/screen-designer.git
cd screen-designer

# Install dependencies
npm install

# Build all workspace packages
npm run build

# 1. Run web browser dev server (default port: 5173)
npm run dev

# 2. Run Electron desktop app
npm run electron:dev

# 3. Run standalone MCP server
npm run dev:mcp
```

---

## 🛠 Tech Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend Core** | React 19, TypeScript, Vite 6 | High-speed bundling and reactive Virtual DOM manipulation |
| **Desktop App** | Electron 35 | Native cross-platform desktop application container |
| **Styling** | Tailwind CSS 4, Lucide Icons | Utility-first styling with consistent iconography |
| **Version Control** | es-git (Toss libgit2 binding) | Built-in native Git engine for staging, diffing, and commits without external Git |
| **Cross-Agent MCP** | Model Context Protocol (SDK 1.6) | 17 domain tools for Claude, Cursor, Codex, and Gemini |
| **Visual Headless** | Chrome Headless | Headless screenshot capture for vision models |
| **Localization** | i18n Core (TypeScript Dictionaries) | Runtime language switching for English (`en`), Korean (`ko`), and Japanese (`ja`) |
| **CLI & Automation** | Commander.js, Chalk | Headless automation and project health diagnostics |

---

## 📁 Monorepo Layout

```
screen-designer/
├── docs/                             # Documentation and default storyboard workspace
│   ├── en/                           # English documentation
│   ├── ja/                           # Japanese documentation
│   ├── README.md                     # Korean documentation hub
│   ├── features.md                   # Feature specifications
│   ├── project-structure.md          # Storage specification
│   ├── shortcuts.md                  # Keyboard shortcuts
│   ├── mcp-and-cli-reference.md      # MCP tools & CLI reference
│   ├── global-install-and-target-execution.md # Architecture specification
│   └── ui-boards/                    # Default workspace project
│       ├── project.json              # Project manifest
│       ├── design-system.json        # Design tokens
│       ├── pages/                    # Structured JSON page documents
│       └── assets/                   # SVG presets and user image files
├── packages/
│   ├── app/                          # React 19 + Electron main application
│   │   ├── electron/                 # Electron main process & IPC bridges
│   │   ├── src/                      # UI components, VDOM engine, i18n
│   │   └── package.json
│   ├── mcp-server/                   # 17 domain MCP tools & headless renderer
│   └── cli/                          # Command-line interface executable
```
