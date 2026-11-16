const {test}=require('node:test');
const assert=require('node:assert/strict');
const initialize=require('../services.js');
function fixture(){
 const panels=Array.from({length:9},()=>({hidden:true})),tabs=[];let focused=-1;
 const picker={value:'0',listeners:{},addEventListener(type,fn){this.listeners[type]=fn;}};
 for(let i=0;i<9;i++)tabs.push({attrs:{'aria-controls':'service-panel-'+i,'aria-selected':String(i===0)},listeners:{},tabIndex:i?-1:0,
  getAttribute(key){return this.attrs[key];},setAttribute(key,value){this.attrs[key]=value;},addEventListener(type,fn){this.listeners[type]=fn;},focus(){focused=i;}});
 initialize({querySelectorAll(){return tabs;},getElementById(id){return id==='service-mobile-select'?picker:panels[Number(id.replace('service-panel-',''))];}});
 return {tabs,panels,picker,get focused(){return focused;},selected(){return tabs.findIndex(t=>t.attrs['aria-selected']==='true');}};
}
test('Initially only the selected service is visible and keyboard-reachable',()=>{
 const f=fixture();assert.equal(f.selected(),0);assert.equal(f.panels.filter(p=>!p.hidden).length,1);assert.equal(f.tabs.filter(t=>t.tabIndex===0).length,1);
});
test('Each of the nine desktop choices switches its own panel and mobile choice',()=>{
 const f=fixture();for(let i=0;i<9;i++){f.tabs[i].listeners.click();assert.equal(f.selected(),i);assert.equal(f.panels[i].hidden,false);assert.equal(f.panels.filter(p=>!p.hidden).length,1);assert.equal(f.picker.value,String(i));}
});
test('Arrow navigation wraps and Home/End move selection and focus',()=>{
 const f=fixture();let prevented=0;const press=(i,key)=>f.tabs[i].listeners.keydown({key,preventDefault(){prevented++;}});
 press(0,'ArrowUp');assert.equal(f.selected(),8);assert.equal(f.focused,8);
 press(8,'ArrowDown');assert.equal(f.selected(),0);
 press(0,'End');assert.equal(f.selected(),8);
 press(8,'Home');assert.equal(f.selected(),0);assert.equal(f.focused,0);assert.equal(prevented,4);
});
test('Mobile picker exposes the same nine services without moving focus to hidden tabs',()=>{
 const f=fixture();f.picker.value='7';f.picker.listeners.change();assert.equal(f.selected(),7);assert.equal(f.panels[7].hidden,false);assert.equal(f.focused,-1);
});
test('Invalid picker values never hide every service panel',()=>{
 const f=fixture();f.picker.value='unknown';f.picker.listeners.change();assert.equal(f.selected(),0);assert.equal(f.panels[0].hidden,false);
});
