# Project Storage Specification

**Screen Designer** automatically saves and manages all active pages, design systems, and assets to the filesystem in real time without manual export steps.

By default, files are structured under `docs/ui-boards/` at the root of the target project. The storage path can be customized anytime in the **Settings** dialog.

---

## 1. Default Storage Layout

```
docs/ui-boards/
├── project.json          # Project metadata, page ordering, and asset registry
├── design-system.json   # Design system settings (component default styles & tokens)
├── pages/                # Structured JSON documents per page
│   ├── 1.json           # Page 1 (Artboards & hierarchical VDOM tree)
│   ├── 2.json           # Page 2
│   └── {number}.json    # Page N...
└── assets/               # Preset SVG vectors, user image uploads, etc.
    ├── preset-gradient.svg
    ├── preset-tech.svg
    ├── preset-nature.svg
    └── {uploaded_files}.png
```

---

## 2. File Specifications

### 2.1 `project.json`
Manages the top-level project overview, page sequence, and registered asset files.

```json
{
  "name": "Fintech Service UI Storyboard",
  "version": "1.0.0",
  "description": "Fintech mobile app & crypto asset management storyboard",
  "updatedAt": "2026-10-25T06:28:42.000Z",
  "pages": [
    {
      "id": "page-fintech-vdom",
      "name": "Page 1 (Fintech Virtual DOM)",
      "number": 1,
      "fileName": "pages/1.json",
      "artboardsCount": 3
    }
  ],
  "assets": [
    "assets/preset-gradient.svg",
    "assets/preset-tech.svg",
    "assets/preset-nature.svg"
  ]
}
```

### 2.2 `design-system.json`
Persists the default styles for core UI primitives (`frame`, `card`, `button`, `input`, `text`, etc.) configured in Design System Studio.

```json
{
  "colors": {
    "primary": "#4f46e5",
    "secondary": "#06b6d4",
    "background": "#0f172a",
    "surface": "#1e293b",
    "text": "#ffffff",
    "textMuted": "#94a3b8",
    "border": "#334155"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "headingFont": "Inter, sans-serif"
  },
  "defaultStyles": {
    "frame": {
      "backgroundColor": "#0f172a",
      "padding": 24,
      "color": "#ffffff"
    },
    "card": {
      "backgroundColor": "#1e293b",
      "borderRadius": 16,
      "padding": 16,
      "borderColor": "#334155",
      "borderWidth": 1
    },
    "button": {
      "backgroundColor": "#4f46e5",
      "color": "#ffffff",
      "borderRadius": 12,
      "padding": 12,
      "fontWeight": "bold"
    }
  }
}
```

### 2.3 `pages/{number}.json`
Stores the artboard list, layout geometry, interactive wire connections, and nested Virtual DOM (VDOM) node trees.

```json
{
  "id": "page-fintech-vdom",
  "name": "Page 1 (Fintech Virtual DOM)",
  "number": 1,
  "version": "1.0.0",
  "updatedAt": "2026-10-25T06:28:42.000Z",
  "artboards": [
    {
      "id": "artboard-s1",
      "title": "1. AI Asset Management Home",
      "viewport": "mobile",
      "x": 80,
      "y": 140,
      "width": 390,
      "height": 844,
      "rootNode": {
        "id": "node-s1-root",
        "type": "frame",
        "name": "Home Frame Container",
        "style": {
          "width": "100%",
          "height": "100%",
          "backgroundColor": "#090d16"
        },
        "children": [ ... ]
      },
      "tweaksSchema": [ ... ]
    }
  ]
}
```

### 2.4 `assets/` Directory
- Bundled vector SVG presets are automatically materialized and stored here.
- When users pick a custom background or image file via the Properties panel, it is automatically copied into this directory and referenced by a relative path (`assets/filename`).

---

## 3. Path Relocation & Automatic Migration

1. In the Top Bar **Settings** dialog (`⚙️` icon), you can change the **Page Docs Path** (e.g. `docs/mobile-spec`).
2. When updated, the Electron backend service automatically moves all existing storyboard files (`project.json`, `design-system.json`, `pages/`, `assets/`) from the old directory to the new target directory.
3. Subsequent auto-saves and Git tracking seamlessly operate on the new path.

---

## 4. Target Project Configuration (`.screen-designer/`)

When running the Screen Designer CLI or MCP server on any project, configuration and runtime cache are maintained in:

```
.screen-designer/
├── config.json       # Project integration settings (paths, ports, auto-commit)
└── cache/            # Chrome Headless rendering image cache (*.png)
```

### 4.1 `.screen-designer/config.json` Specification
```json
{
  "$schema": "https://screen-designer.dev/schema/config.json",
  "version": "1.0.0",
  "pagesDir": "docs/ui-boards/pages",
  "designSystemFile": "docs/ui-boards/design-system.json",
  "assetsDir": "docs/ui-boards/assets",
  "mcpPort": 4318,
  "appPort": 5173,
  "gitAutoCommit": true
}
```

---

## 5. Monorepo Package Architecture

The Screen Designer repository is divided into 3 modular packages powered by `npm workspaces`:

- **`packages/app`**: React 19 + TypeScript + Electron 35 visual canvas application
  - `packages/app/src/components/`: Canvas, layer sidebar, property inspector, command palette, Git desktop dialog, etc.
  - `packages/app/src/i18n/`: Trilingual dictionaries (`en`, `ko`, `ja`)
  - `packages/app/electron/`: File persistence, IPC bridges, and `es-git` services
- **`packages/mcp-server`**: Model Context Protocol (SDK 1.6) server exposing 17 domain tools and Chrome Headless renderer
  - `src/tools.ts`: Tool registrations and execution dispatchers
  - `src/headless-renderer.ts`: High-speed headless PNG screenshot capture engine
- **`packages/cli`**: Global and standalone command-line executable (`screen-designer`)
  - `bin/screen-designer`: CLI entry executable
  - `src/commands/`: Implementation for `init`, `serve/mcp`, `ui`, `page`, `artboard`, `tokens`, `commit`, `doctor`, etc.
