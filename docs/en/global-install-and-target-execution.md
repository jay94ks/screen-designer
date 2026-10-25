# Global Installation & Target Execution Architecture

This document defines the architecture and CLI design allowing **Screen Designer** to be installed globally and run immediately against any arbitrary target project path.

---

## 1. Overview & Objectives

### 1.1 Problem Statement
- Previously, the application could only run from inside the `screen-designer` codebase.
- Users want to launch the visual storyboard canvas inside their existing project directories (e.g. `C:\workspace\my-fintech-app`, `/home/user/nextjs-shopping-mall`) with a single command and manage the `docs/ui-boards/` structure directly within their target repository.

### 1.2 Core Architectural Principles
1. **Zero-Config One-Click Launch**: Simply run `screen-designer [path]` to initialize and launch immediately without configuration overhead.
2. **First-Class Global & npx Support**:
   - `npm install -g screen-designer`
   - `npx screen-designer [target-path]`
3. **Intelligent Environment Adaptation (Electron Desktop vs Web Mode)**:
   - On display-capable desktops (Windows, macOS, Desktop Linux), it boots into a native **Electron window**.
   - In headless environments (WSL2 terminal, remote SSH servers, Linux CLI) or with `--web`, it seamlessly falls back to a **local Web server + automatic browser launcher**.
4. **Automatic Project Detection & Scaffolding**:
   - If `docs/ui-boards/` does not yet exist in the target project, it scaffolds the standard structure (`project.json`, `design-system.json`, `pages/1.json`, `assets/`).
   - If it already exists, it immediately loads the active storyboard data.

---

## 2. CLI Specification

### 2.1 Basic Syntax
```bash
screen-designer [target-path] [options]
```

### 2.2 Usage Examples

```bash
# 1. Run against the current directory
screen-designer .

# 2. Run against a specific project path
screen-designer /home/jay94ks/projects/e-commerce-app
screen-designer C:\Projects\FintechMobileApp

# 3. Path defaults to current directory (.) when omitted
screen-designer

# 4. Force web browser mode
screen-designer . --web

# 5. Specify web mode port and disable automatic browser launch
screen-designer . --web --port=3000 --no-open

# 6. Initialize directory structure without launching GUI
screen-designer . --init
# or
screen-designer init ./my-new-app

# 7. Generate React / Tailwind components from storyboard
screen-designer export --workspace=./my-app --format=react --out=src/components

# 8. Render a specific artboard screenshot as PNG via headless Chrome
screen-designer render-image page-1 screen-1-main --workspace=./my-app
```

### 2.3 Options & Flags

| Flag | Alias | Default | Description |
| :--- | :---: | :---: | :--- |
| `[target-path]` | - | `.` (current folder) | Target project directory path (relative or absolute) |
| `--web` | `-w` | `false` | Run with local Web server & browser instead of Electron |
| `--port <num>` | `-p` | `5173` | Port number to bind when running in web mode |
| `--host <ip>` | - | `0.0.0.0` | Host IP address (allows external local network connections) |
| `--no-open` | - | `false` | Prevent auto-opening default browser when server boots |
| `--init` | `-i` | `false` | Scaffold standard `docs/ui-boards` structure without GUI |
| `--help` | `-h` | - | Show command help |
| `--version` | `-v` | - | Print Screen Designer version |

---

## 3. Project Scaffolding & Lifecycle

When `screen-designer` initializes in a project:
1. Validates or resolves the target absolute directory.
2. Checks for `.screen-designer/config.json`. If missing, creates default configuration.
3. Checks for `docs/ui-boards/`. If missing, initializes default Fintech sample boards and component tokens so users can immediately interact with a populated canvas.
4. Spawns either the Electron window or local Vite web server configured with environment variable `SCREEN_DESIGNER_WORKSPACE=<target-path>`.
