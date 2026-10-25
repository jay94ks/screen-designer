import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const CHROME_PATH = '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe';
const WIN_OUT_DIR = 'C:\\Users\\jay94\\AppData\\Local\\Temp\\sd_vdom_verify';
const WSL_OUT_DIR = '/mnt/c/Users/jay94/AppData/Local/Temp/sd_vdom_verify';
const ARTIFACT_DIR = '/home/jay94ks/.gemini/antigravity/brain/86f787a1-39a6-4538-91d5-58acb15c5691';

fs.mkdirSync(WSL_OUT_DIR, { recursive: true });

const targets = [
  // 14 Solo 1:1 VDOM renders (1600x1000)
  { id: 'vdom-solo-01-workspace', url: 'http://localhost:5173/?page=1&artboard=0&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-02-components', url: 'http://localhost:5173/?page=1&artboard=1&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-03-templates', url: 'http://localhost:5173/?page=1&artboard=2&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-04-code', url: 'http://localhost:5173/?page=1&artboard=3&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-05-play', url: 'http://localhost:5173/?page=2&artboard=0&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-06-events', url: 'http://localhost:5173/?page=2&artboard=1&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-07-rulers', url: 'http://localhost:5173/?page=2&artboard=2&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-08-tweaks', url: 'http://localhost:5173/?page=2&artboard=3&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-09-design-system', url: 'http://localhost:5173/?page=3&artboard=0&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-10-git-desktop', url: 'http://localhost:5173/?page=3&artboard=1&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-11-command-palette', url: 'http://localhost:5173/?page=4&artboard=0&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-12-settings', url: 'http://localhost:5173/?page=4&artboard=1&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-13-shortcuts', url: 'http://localhost:5173/?page=4&artboard=2&solo=1', w: 1600, h: 1000 },
  { id: 'vdom-solo-14-file-menu', url: 'http://localhost:5173/?page=4&artboard=3&solo=1', w: 1600, h: 1000 },
  // 4 Canvas views showing the VDOM artboards inside the Screen Designer workspace
  { id: 'vdom-canvas-p1', url: 'http://localhost:5173/?page=1&artboard=0&zoom=55', w: 1920, h: 1080 },
  { id: 'vdom-canvas-p2', url: 'http://localhost:5173/?page=2&artboard=0&zoom=55', w: 1920, h: 1080 },
  { id: 'vdom-canvas-p3', url: 'http://localhost:5173/?page=3&artboard=0&zoom=55', w: 1920, h: 1080 },
  { id: 'vdom-canvas-p4', url: 'http://localhost:5173/?page=4&artboard=0&zoom=55', w: 1920, h: 1080 }
];

for (let i = 0; i < targets.length; i++) {
  const t = targets[i];
  const dest = path.join(ARTIFACT_DIR, `${t.id}.png`);
  if (fs.existsSync(dest)) {
    console.log(`[${i + 1}/${targets.length}] ↷ ${t.id}.png (already captured)`);
    continue;
  }
  const winFile = `${WIN_OUT_DIR}\\${t.id}.png`;
  const wslFile = `${WSL_OUT_DIR}/${t.id}.png`;
  const userDir = `C:\\Users\\jay94\\AppData\\Local\\Temp\\chrome-vdom-shared`;
  const cmd = `"${CHROME_PATH}" --headless=new --user-data-dir="${userDir}" --disable-gpu --virtual-time-budget=2500 --screenshot="${winFile}" --window-size=${t.w},${t.h} "${t.url}"`;
  try {
    execSync(cmd, { stdio: 'ignore', timeout: 30000 });
    if (fs.existsSync(wslFile)) {
      fs.copyFileSync(wslFile, dest);
      console.log(`[${i + 1}/${targets.length}] ✓ ${t.id}.png`);
    }
  } catch (e) {
    console.error(`[${i + 1}/${targets.length}] ✗ ${t.id}: ${e.message}`);
  }
}
