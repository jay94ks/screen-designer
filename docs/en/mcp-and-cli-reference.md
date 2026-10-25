# Screen Designer MCP Tools & CLI Reference

Screen Designer provides an **MCP (Model Context Protocol)** server enabling AI coding agents (Claude, Cursor, Codex, Gemini, etc.) to visually inspect and manipulate the UI directly, alongside a complete **CLI interface** for controlling projects from terminal workflows.

---

## 1. Domain-Centric MCP Tools (17 Tools)

The tools are organized under the official **`screen_designer_*`** namespace, with full backward-compatibility aliases:

```
🛠️ Screen Designer MCP Tools (17 tools registered)

📁 Project & Workspace:
  • screen_designer_get_project (alias: storyboard_init, storyboard_get_project)
    Get project configuration, workspace info, design documents path, canvas status, and list of all pages.
    Parameters: [workspacePath]

📄 Screen Pages (VDOM):
  • screen_designer_list_pages (alias: storyboard_list_pages)
    List all UI screen pages with metadata, artboard counts, viewport information, and summaries.
    Parameters: [workspacePath]

  • screen_designer_get_page (alias: storyboard_get_page)
    Get full details of a specific UI page document (all artboards, elements, coordinates, styling, layers, interactive flow wires, and tweaks).
    Parameters: <pageId> [workspacePath]

  • screen_designer_create_page (alias: create_page, page_create)
    Create a new screen page document in the project with an ID, title/name, and optional initial artboard or template.
    Parameters: <name> [pageId] [initialArtboardTitle] [viewport] [template] [workspacePath]

  • screen_designer_save_page (alias: storyboard_save_page)
    Create, save, or update a Virtual DOM page document in docs/ui-boards/pages/<pageId>.json and update project manifest.
    Parameters: <page> [workspacePath]

  • screen_designer_delete_page (alias: storyboard_delete_page)
    Delete a Virtual DOM page document from the project and update project manifest.
    Parameters: <pageId> [workspacePath]

  • screen_designer_add_artboard (alias: add_artboard, create_artboard, artboard_create)
    Add a new artboard (screen canvas) to a page with title, dimensions, viewport, and optional template or custom VDOM rootNode.
    Parameters: [pageId] <title> [viewport] [width] [height] [template] [rootNode] [tweaksSchema] [workspacePath]

  • screen_designer_update_artboard (alias: update_artboard, edit_artboard, artboard_update, artboard_edit)
    Update and modify an existing artboard on a page. Supports editing metadata (title, dimensions, viewport), replacing rootNode, or targeting specific nodes by ID to update text/styles/props without rewriting the whole tree.
    Parameters: <pageId> <artboardId> [title] [viewport] [width] [height] [x] [y] [rootNode] [nodeUpdates] [tweaksSchema] [tweakValues] [workspacePath]

  • screen_designer_delete_artboard (alias: delete_artboard, remove_artboard, artboard_delete)
    Delete an artboard (screen canvas) from a page by artboard ID or title.
    Parameters: <pageId> <artboardId> [workspacePath]

🎨 Design System & Tokens:
  • screen_designer_get_design_system (alias: storyboard_get_design_system)
    Read the design system tokens and component default styles from docs/ui-boards/design-system.json.
    Parameters: [workspacePath]

  • screen_designer_save_design_system (alias: storyboard_set_tokens, storyboard_save_design_system)
    Update or replace design system tokens or default element styles in docs/ui-boards/design-system.json, and sync with live canvas.
    Parameters: [tokens] [designSystem] [workspacePath]

👁️ Visual Inspection & Screenshots:
  • screen_designer_render_artboard_image (alias: storyboard_render_artboard_image)
    Render a high-resolution screenshot image (base64 PNG) of an artboard using headless Chrome. Returns direct image data for visual inspection and multimodal vision.
    Parameters: <pageId> [artboardId] [outPath] [width] [height] [workspacePath]

💻 Code Generation & Handoff:
  • screen_designer_export_code (alias: storyboard_export_code, storyboard_export)
    Generate production-ready React (TSX), Vue 3 SFC, or HTML code on-demand from structured VDOM page documents into project filesystem.
    Parameters: [pageId] [format] [outDir] [workspacePath]

🎛️ Live Canvas Interaction:
  • screen_designer_get_live_selection (alias: storyboard_get_live_selection)
    Read real-time canvas state: currently selected elements, active tweak slider values, and viewport zoom level.
    Parameters: [workspacePath]

  • screen_designer_sync_canvas (alias: storyboard_sync_canvas)
    Synchronize canvas camera, focus on specific artboard or node, and apply real-time highlights.
    Parameters: [artboardId] [nodeId] [zoom] [workspacePath]

📦 Git & Version Control:
  • screen_designer_git_status (alias: storyboard_git_status)
    Inspect current working directory git modifications, staged files, and diff output for UI boards.
    Parameters: [workspacePath]

  • screen_designer_git_commit (alias: storyboard_git_commit)
    Stage and commit UI storyboard changes with an automated or customized message.
    Parameters: <message> [workspacePath]
```

---

## 2. CLI Command Structure

```bash
# 1. Project Scaffolding & Diagnosis
screen-designer init [path]
screen-designer doctor [path]
screen-designer status [path]

# 2. Page & Artboard Commands
screen-designer page list
screen-designer page create "Profile Settings"
screen-designer artboard add <pageId> --title "Security Tab" --viewport desktop
screen-designer artboard delete <pageId> <artboardId>

# 3. Headless Verification & Code Export
screen-designer render-image <pageId> [artboardId] -o ./screenshots
screen-designer export <pageId> --format=react --out=./src/components

# 4. Git Integration
screen-designer commit -m "feat(ui): update onboarding artboard"
```
