(function(root,initialize){
  if(typeof module==='object'&&module.exports)module.exports=initialize;
  else initialize(root.document);
})(typeof window==='object'?window:this,function initializeServices(document){
  'use strict';
  const tabs=Array.from(document.querySelectorAll('[data-service-tab]'));
  const picker=document.getElementById('service-mobile-select');
  if(!tabs.length)return;
  const panels=tabs.map(tab=>document.getElementById(tab.getAttribute('aria-controls')));
  if(panels.some(panel=>!panel))return;
  function select(index,focus=false){
    if(!Number.isInteger(index)||index<0||index>=tabs.length)return;
    tabs.forEach((tab,i)=>{
      tab.setAttribute('aria-selected',String(i===index));
      tab.tabIndex=i===index?0:-1;
      panels[i].hidden=i!==index;
    });
    if(picker)picker.value=String(index);
    if(focus)tabs[index].focus();
  }
  tabs.forEach((tab,i)=>{
    tab.addEventListener('click',()=>select(i));
    tab.addEventListener('keydown',event=>{
      let next;
      if(event.key==='ArrowDown'||event.key==='ArrowRight')next=(i+1)%tabs.length;
      if(event.key==='ArrowUp'||event.key==='ArrowLeft')next=(i+tabs.length-1)%tabs.length;
      if(event.key==='Home')next=0;
      if(event.key==='End')next=tabs.length-1;
      if(next!==undefined){event.preventDefault();select(next,true);}
    });
  });
  if(picker)picker.addEventListener('change',()=>select(Number(picker.value)));
  select(Math.max(0,tabs.findIndex(tab=>tab.getAttribute('aria-selected')==='true')));
});
