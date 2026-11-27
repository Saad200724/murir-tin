import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const buildDir = path.resolve(__dirname, '../../build/webgl');
const releaseDir = path.resolve(__dirname, '../../release');
const zipPath = path.join(releaseDir, 'MurirTin-WebGL-Publish.zip');

if (!fs.existsSync(path.join(buildDir, 'index.html'))) {
  console.error('Missing build/webgl/index.html. Run npm run build first.');
  process.exit(1);
}

fs.mkdirSync(releaseDir, { recursive: true });
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
}

execFileSync('powershell.exe', [
  '-NoProfile',
  '-Command',
  `Compress-Archive -Path "${buildDir}\\*" -DestinationPath "${zipPath}" -CompressionLevel Optimal -Force`,
], { stdio: 'inherit' });

const stat = fs.statSync(zipPath);
console.log(`Packaged publishable ZIP: ${zipPath} (${(stat.size / 1024).toFixed(1)} KB)`);
