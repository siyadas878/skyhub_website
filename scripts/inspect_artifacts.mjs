import fs from 'fs';
import path from 'path';

const artifactDir = '/Users/mohammedsiyadh/.gemini/antigravity-ide/brain/9e2e5436-0fd7-4331-8125-041bc9fd062a';
const files = fs.readdirSync(artifactDir);

console.log('PNG files in artifact directory:');
files.filter(f => f.endsWith('.png')).forEach(f => {
  const stat = fs.statSync(path.join(artifactDir, f));
  console.log(`- ${f} (${(stat.size / 1024).toFixed(1)} KB, modified ${stat.mtime.toISOString()})`);
});
