import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

const CHROME_PATH = '/mnt/c/Program Files/Google/Chrome/Application/chrome.exe';
const WIN_OUT_DIR = 'C:\\Users\\jay94\\AppData\\Local\\Temp\\sd_live_captures';
const WSL_OUT_DIR = '/mnt/c/Users/jay94/AppData/Local/Temp/sd_live_captures';
const TARGET_DIR = '/home/jay94ks/screen-designer/docs/ui-boards/assets/screenshots';
const ROOT_ASSETS_DIR = '/home/jay94ks/screen-designer/assets/screenshots';

fs.mkdirSync(WSL_OUT_DIR, { recursive: true });
fs.mkdirSync(TARGET_DIR, { recursive: true });
fs.mkdirSync(ROOT_ASSETS_DIR, { recursive: true });

const screens = [
  { id: '01-workspace-main', url: 'http://localhost:5173/?node=root-ws-1&tab=properties', width: 1600, height: 1000 },
  { id: '02-components-palette', url: 'http://localhost:5173/?components', width: 1600, height: 1000 },
  { id: '03-templates-palette', url: 'http://localhost:5173/?templates', width: 1600, height: 1000 },
  { id: '04-inspector-events', url: 'http://localhost:5173/?node=root-ws-1&tab=events', width: 1600, height: 1000 },
  { id: '05-inspector-code', url: 'http://localhost:5173/?node=root-ws-1&tab=code', width: 1600, height: 1000 },
  { id: '06-inspector-tweaks', url: 'http://localhost:5173/?node=root-ws-1&tab=tweaks', width: 1600, height: 1000 },
  { id: '07-modal-play', url: 'http://localhost:5173/?play', width: 1600, height: 1000 },
  { id: '08-modal-design-system', url: 'http://localhost:5173/?ds', width: 1600, height: 1000 },
  { id: '09-modal-git-desktop', url: 'http://localhost:5173/?git', width: 1600, height: 1000 },
  { id: '10-modal-command-palette', url: 'http://localhost:5173/?cmd', width: 1600, height: 1000 },
  { id: '11-modal-settings', url: 'http://localhost:5173/?settings', width: 1600, height: 1000 },
  { id: '12-modal-shortcuts', url: 'http://localhost:5173/?shortcuts', width: 1600, height: 1000 },
  { id: '13-header-menu-file', url: 'http://localhost:5173/?menu=file', width: 1600, height: 1000 },
  { id: '14-canvas-rulers', url: 'http://localhost:5173/?rulers', width: 1600, height: 1000 }
];

console.log(`Starting capture of ${screens.length} screens...`);

for (let i = 0; i < screens.length; i++) {
  const s = screens[i];
  const winFile = `${WIN_OUT_DIR}\\${s.id}.png`;
  const wslFile = `${WSL_OUT_DIR}/${s.id}.png`;
  const userDir = `C:\\Users\\jay94\\AppData\\Local\\Temp\\chrome-cap-${i}`;

  const cmd = `"${CHROME_PATH}" --headless=new --user-data-dir="${userDir}" --disable-gpu --virtual-time-budget=3000 --screenshot="${winFile}" --window-size=${s.width},${s.height} "${s.url}"`;
  console.log(`[${i + 1}/${screens.length}] Capturing ${s.id}...`);
  try {
    execSync(cmd, { stdio: 'ignore', timeout: 15000 });
    if (fs.existsSync(wslFile)) {
      const dest1 = path.join(TARGET_DIR, `${s.id}.png`);
      const dest2 = path.join(ROOT_ASSETS_DIR, `${s.id}.png`);
      fs.copyFileSync(wslFile, dest1);
      fs.copyFileSync(wslFile, dest2);
      const stat = fs.statSync(dest1);
      console.log(`  ✓ Saved: ${dest1} (${Math.round(stat.size / 1024)} KB)`);
    } else {
      console.error(`  ✗ Output file not found: ${wslFile}`);
    }
  } catch (err) {
    console.error(`  ✗ Error capturing ${s.id}: ${err.message}`);
  }
}

console.log('Capture finished!');
