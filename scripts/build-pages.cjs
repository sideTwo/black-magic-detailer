// Publish website assets while keeping unused video archives in the source repository.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const options = {};
for (let i = 2; i < process.argv.length; i += 2) options[process.argv[i]] = process.argv[i + 1];
const root = path.resolve(options['--root'] || path.join(__dirname, '..'));
const output = path.resolve(options['--out'] || path.join(root, '_site'));
if (output === root || (fs.existsSync(output) && fs.readdirSync(output).length)) throw new Error('Use an empty output directory');
const tracked = execFileSync('git', ['ls-files', '-z'], {cwd: root, encoding: 'utf8'}).split('\0').filter(Boolean);
const sourcePath = file => path.join(root, file);
const referenceFiles = tracked.filter(file => !file.startsWith('.github/') && !file.startsWith('scripts/') && !file.startsWith('tests/') && path.basename(file).toLowerCase() !== 'agents.md' && /\.(?:html|js|cjs|css|json|md|txt|svg)$/i.test(file));
const referenceText = referenceFiles.map(file => fs.readFileSync(sourcePath(file), 'utf8')).join('\n');
// Conservative inclusion: a mention anywhere in website code or its documentation keeps a video.
// Dynamic media paths need explicit inclusion rather than silently removing their targets.
if (/\$\{[^}]+\}[^`\n]*\.mp4/.test(referenceText)) throw new Error('Dynamic video path requires an explicit publishing rule');
const context = {window: {}};
for (const file of ['garage-media.js', 'garage-mobile.js']) vm.runInNewContext(fs.readFileSync(sourcePath(file), 'utf8'), context);
const active = new Set(Object.values(context.window.BMD_MOBILE));
for (const service of Object.values(context.window.BMD_GARAGE)) {
  if (service.approach) active.add(service.approach);
  for (const step of service.steps) for (const key of ['video', 'poster', 'before', 'after']) if (step[key]) active.add(step[key]);
}
fs.mkdirSync(output, {recursive: true});
const omitted = [], included = [];
let bytes = 0;
for (const file of tracked) {
  if (file.startsWith('.github/') || file.startsWith('scripts/') || file.startsWith('tests/') || path.basename(file).toLowerCase() === 'agents.md') continue;
  const absolute = sourcePath(file), stat = fs.lstatSync(absolute);
  if (stat.isSymbolicLink() || !stat.isFile()) throw new Error('Pages requires regular files: ' + file);
  if (file.endsWith('.mp4') && !active.has(file) && !referenceText.includes(path.basename(file))) {
    omitted.push({file, bytes: stat.size}); continue;
  }
  const destination = path.join(output, file);
  fs.mkdirSync(path.dirname(destination), {recursive: true});
  fs.copyFileSync(absolute, destination);
  included.push(file); bytes += stat.size;
}
for (const file of active) if (!fs.existsSync(path.join(output, file))) throw new Error('Missing active asset: ' + file);
// Every direct file reference on every retained HTML page must still resolve.
for (const file of included.filter(file => file.endsWith('.html'))) {
  const html = fs.readFileSync(sourcePath(file), 'utf8');
  for (const match of html.matchAll(/\b(?:src|href|poster)=["']([^"']+)["']/g)) {
    const ref = match[1].split(/[?#]/)[0];
    if (!ref || /^(?:[a-z]+:|\/\/)/i.test(ref)) continue;
    const relative = ref.startsWith('/') ? ref.slice(1) : path.join(path.dirname(file), decodeURIComponent(ref));
    if (fs.existsSync(sourcePath(relative)) && !fs.existsSync(path.join(output, relative))) throw new Error('Published reference missing: ' + file + ' -> ' + ref);
  }
}
const report = {included_files: included.length, published_bytes: bytes, omitted_video_count: omitted.length, omitted_video_bytes: omitted.reduce((sum, item) => sum + item.bytes, 0), omitted, active_assets_verified: active.size};
if (options['--report']) fs.writeFileSync(path.resolve(options['--report']), JSON.stringify(report, null, 2));
console.log(JSON.stringify({...report, omitted: undefined}));
