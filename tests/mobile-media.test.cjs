const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname,'..');
const context = {window:{}};
for (const file of ['garage-media.js','garage-mobile.js']) vm.runInNewContext(fs.readFileSync(path.join(root,file),'utf8'),context);
test('each active film has a smaller mobile export with fast-start metadata',()=>{
  const sources = new Set(Object.values(context.window.BMD_GARAGE).flatMap(s=>[s.approach,...s.steps.map(t=>t.video)]).filter(Boolean));
  for(const source of sources){
    const mobile = context.window.BMD_MOBILE[source];
    assert.ok(mobile, 'Missing mobile export: '+source);
    const bytes = fs.readFileSync(path.join(root,mobile));
    assert.ok(bytes.length < fs.statSync(path.join(root,source)).size, 'Export is not smaller: '+mobile);
    const boxes=[];
    for(let p=0;p+8<=bytes.length;){
      const size=bytes.readUInt32BE(p), type=bytes.toString('ascii',p+4,p+8);
      boxes.push(type); assert.ok(size>=8,'Invalid MP4 box: '+mobile); p+=size;
    }
    assert.ok(boxes.indexOf('moov')>=0 && boxes.indexOf('moov')<boxes.indexOf('mdat'),'Metadata must precede video data: '+mobile);
  }
});
test('main-page local links, anchors and assets resolve without duplicate IDs',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,'Duplicate HTML IDs');
  for(const [,url] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)){
    if(url.startsWith('#')) {assert.ok(ids.includes(url.slice(1)), 'Missing anchor: '+url);continue;}
    if(/^(?:https?:|data:)/.test(url))continue;
    assert.ok(fs.existsSync(path.join(root,url.split('?')[0])),'Missing local asset: '+url);
  }
});
