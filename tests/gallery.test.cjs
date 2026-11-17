const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const source=fs.readFileSync(path.join(root,'app.js'),'utf8');
// Run the production gallery with a minimal DOM, independently of the contact form.
const galleryCode=source.slice(source.indexOf("  const gallery=document"),source.indexOf("  const form=document"));
function fixture(){
  const elements=new Map();
  function element(id){
    if(!elements.has(id))elements.set(id,{id,hidden:false,textContent:'',listeners:{},dataset:{},
      classList:{values:new Set(),toggle(key,on){on?this.values.add(key):this.values.delete(key);},add(key){this.values.add(key);},remove(key){this.values.delete(key);}},
      addEventListener(type,fn){this.listeners[type]=fn;},focus(){this.focused=true;},
      querySelector(){return element('close');},showModal(){this.open=true;},close(){this.open=false;this.listeners.close();}});
    return elements.get(id);
  }
  const openers=[['paint',0],['classic',2],['bmw',0],['mercedes',0],['audi',0],['hyundai',0],['skoda',0]].map(([project,index],i)=>Object.assign(element('opener'+i),{dataset:{project,gallery:String(index)}}));
  const document={getElementById:element,querySelectorAll(){return openers;},body:element('body')};
  vm.runInNewContext(galleryCode,{document});
  return {element,open(project){const opener=openers.find(e=>e.dataset.project===project);opener.listeners.click();return opener;},press(key){element('project-gallery').listeners.keydown({key,preventDefault(){}});}};
}
function assertPair(f){
  assert.equal(f.element('gallery-image').hidden,true);
  assert.equal(f.element('gallery-pair').hidden,false);
  assert.notEqual(f.element('gallery-before').src,f.element('gallery-after').src);
  for(const side of ['before','after']){
    const image=f.element('gallery-'+side);
    assert.ok(image.alt.length>20);
    assert.ok(fs.existsSync(path.join(root,image.src)),image.src);
    assert.match(image.src,/-original-v1\.webp$/);
  }
  assert.match(f.element('gallery-source').textContent,/ORIGINALFOTOS/);
}
test('Both paint comparisons open as complete pairs with genuine, existing assets',()=>{
  const f=fixture();f.open('paint');assertPair(f);
  assert.match(f.element('gallery-after').src,/lack-heck-nachher/);
  f.press('ArrowRight');assertPair(f);assert.match(f.element('gallery-after').src,/lack-detail-nachher/);
  assert.equal(f.element('gallery-count').textContent,'02 / 02');
  f.press('ArrowRight');assert.equal(f.element('gallery-count').textContent,'01 / 02');
});
test('Classic interior and fuel recess pairs coexist with single photos and reset their labels',()=>{
  const f=fixture();f.open('classic');assertPair(f);
  assert.match(f.element('gallery-before').src,/innenraum-vorher/);
  f.press('End');assertPair(f);assert.match(f.element('gallery-before').src,/tankmulde-vorher/);
  f.press('Home');assert.equal(f.element('gallery-pair').hidden,true);assert.equal(f.element('gallery-image').hidden,false);
  assert.equal(f.element('gallery-source').textContent,'TIMS ARBEIT');
  assert.match(f.element('gallery-image').src,/mercedes-profile/);
});
test('Closing a paired gallery restores the opener; a different project cannot retain the pair',()=>{
  const f=fixture(),opener=f.open('paint');
  f.element('close').listeners.click();assert.equal(opener.focused,true);
  assert.equal(f.element('body').classList.values.has('modal-open'),false);
  f.open('bmw');assert.equal(f.element('gallery-pair').hidden,true);
  assert.match(f.element('gallery-title').textContent,/BMW/);
});
test('Misidentified paint after photo is no longer used; leasing uses the requested replacement',()=>{
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.doesNotMatch(html+source,/lackkorrektur-nachher-20261116-rekonstruiert-v2/);
  const leasing=html.match(/id="service-panel-6"[\s\S]*?<\/article>/)[0];
  assert.match(leasing,/mercedes-kompakt-cockpit-original/);assert.doesNotMatch(leasing,/hyundai|bmw-suv|mercedes-kompakt-fussraum/i);
});
test('BMW footwell is shown only with BMW; Mercedes opens an identifiable Mercedes original',()=>{
  const f=fixture();f.open('bmw');f.press('End');
  assert.match(f.element('gallery-title').textContent,/BMW/);
  assert.match(f.element('gallery-image').src,/bmw-suv-fussraum-original/);
  assert.match(f.element('gallery-source').textContent,/ORIGINALFOTO/);
  f.open('mercedes');assert.match(f.element('gallery-title').textContent,/Mercedes-Benz/);
  assert.match(f.element('gallery-image').src,/mercedes-kompakt-cockpit-original/);
  assert.match(f.element('gallery-image').alt,/Stern im Lenkrad/);
  assert.match(f.element('gallery-source').textContent,/ORIGINALFOTO/);
  f.press('ArrowRight');assert.equal(f.element('gallery-source').textContent,'TIMS ARBEIT');
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.doesNotMatch(html+source,/mercedes-kompakt-fussraum/);
});
test('Each enhanced Audi stage exposes its matching original and resets when advancing',()=>{
  const f=fixture();f.open('audi');
  for(let n=1;n<=3;n++){
    assert.equal(f.element('gallery-pair').hidden,true);
    assert.match(f.element('gallery-image').src,new RegExp(`audi-politur-schritt-${n}-aufbereitet`));
    assert.match(f.element('gallery-caption').textContent,new RegExp(`Aufnahme ${n} von 3`));
    assert.equal(f.element('gallery-source').textContent,'TIMS ARBEIT');
    assert.equal(f.element('gallery-original').hidden,false);
    assert.ok(fs.existsSync(path.join(root,f.element('gallery-image').src)));
    f.element('gallery-original').listeners.click();
    assert.match(f.element('gallery-image').src,new RegExp(`audi-politur-schritt-${n}-original`));
    assert.match(f.element('gallery-source').textContent,/ORIGINALFOTO/);
    assert.equal(f.element('gallery-original').textContent,'Bearbeitetes Foto ansehen');
    assert.ok(fs.existsSync(path.join(root,f.element('gallery-image').src)));
    f.element('gallery-original').listeners.click();
    assert.match(f.element('gallery-image').src,new RegExp(`audi-politur-schritt-${n}-aufbereitet`));
    f.press('ArrowRight');
  }
  assert.match(f.element('gallery-title').textContent,/Audi TT/);
  assert.equal(f.element('gallery-source').textContent,'TIMS ARBEIT');
  assert.match(f.element('gallery-image').src,/audi-sitze/);
  assert.equal(f.element('gallery-original').hidden,true);
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.doesNotMatch(html+source,/audi-lack-(vorher|nachher)-original/);
});

test('Hyundai cargo photo belongs to Hyundai; Skoda contains only its verified paint and cockpit',()=>{
  const f=fixture();f.open('hyundai');f.press('End');
  assert.equal(f.element('gallery-count').textContent,'04 / 04');
  assert.match(f.element('gallery-image').src,/hyundai-kofferraum/);
  assert.match(f.element('gallery-image').alt,/Hyundai/);
  assert.ok(fs.existsSync(path.join(root,f.element('gallery-image').src)));
  f.open('skoda');f.press('End');
  assert.equal(f.element('gallery-count').textContent,'02 / 02');
  assert.match(f.element('gallery-image').src,/skoda-cockpit/);
  assert.match(f.element('gallery-title').textContent,/Škoda/);
  const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
  assert.doesNotMatch(html+source,/skoda-kofferraum/);
  assert.match(html,/data-project="hyundai"[^>]*aria-label="Hyundai: 4/);
  assert.match(html,/data-project="skoda"[^>]*aria-label="Škoda: 2/);
});
