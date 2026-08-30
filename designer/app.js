(function(){
  var $=function(s){return document.querySelector(s);};
  function load(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  var THEMES=['aurora','sunset','neon','forest'];
  var DEVICES={ phone:{w:390,h:844,label:'📱 Phone • 390×844'}, tablet:{w:768,h:1024,label:'📖 Tablet • 768×1024'}, watch:{w:240,h:280,label:'⌚ Watch • 240×280'}, desktop:{w:1024,h:640,label:'🖥 Desktop • 1024×640'} };
  var TEMPLATES={
    blank:[],
    login:[{type:'text',x:110,y:80,w:170,h:36,text:'Welcome',bg:'transparent',color:'#fff',size:22,r:0},{type:'input',x:45,y:150,w:300,h:44,text:'Email',bg:'#1a1f2e',color:'#fff',size:14,r:10},{type:'input',x:45,y:210,w:300,h:44,text:'Password',bg:'#1a1f2e',color:'#fff',size:14,r:10},{type:'button',x:45,y:280,w:300,h:48,text:'Sign in',bg:'#5eead4',color:'#06121a',size:16,r:12},{type:'text',x:130,y:350,w:130,h:20,text:'Forgot password?',bg:'transparent',color:'#a78bfa',size:12,r:0}],
    profile:[{type:'image',x:135,y:40,w:120,h:120,text:'',bg:'#2a2f45',color:'#fff',size:16,r:60},{type:'text',x:110,y:180,w:170,h:28,text:'Alex Rivera',bg:'transparent',color:'#fff',size:18,r:0},{type:'text',x:110,y:210,w:170,h:20,text:'Product Designer',bg:'transparent',color:'#9aa0b5',size:13,r:0},{type:'button',x:95,y:250,w:200,h:44,text:'Follow',bg:'#a78bfa',color:'#fff',size:15,r:12},{type:'card',x:20,y:320,w:350,h:90,text:'About — Crafting friendly interfaces for everyone.',bg:'#151a2e',color:'#eef1f8',size:13,r:14}],
    shop:[{type:'text',x:20,y:20,w:150,h:28,text:'Shop',bg:'transparent',color:'#fff',size:20,r:0},{type:'card',x:20,y:70,w:350,h:80,text:'🎧 Headphones — $59',bg:'#151a2e',color:'#fff',size:14,r:12},{type:'card',x:20,y:170,w:350,h:80,text:'⌚ Watch — $129',bg:'#151a2e',color:'#fff',size:14,r:12},{type:'card',x:20,y:270,w:350,h:80,text:'📱 Phone Case — $19',bg:'#151a2e',color:'#fff',size:14,r:12},{type:'button',x:20,y:380,w:350,h:48,text:'Checkout',bg:'#22d3ee',color:'#06121a',size:16,r:12}]
  };
  var desEls=load('designer_els', null) ? load('designer_els', []) : [];
  var desSel=null;
  var desDev=load('designer_device','phone');
  function desSave(){ save('designer_els', desEls); save('designer_device', desDev); }
  function desUid(){ return 'e'+Date.now()+Math.random().toString(36).slice(2,5); }
  function desRender(){
    var fr=$('#phoneFrame'), sc=$('#phoneScreen'), lb=$('#deviceLabel');
    if(!fr||!sc) return;
    var d=DEVICES[desDev]||DEVICES.phone;
    fr.style.width=d.w+'px'; fr.style.height=d.h+'px';
    if(lb) lb.textContent=d.label;
    sc.innerHTML='';
    desEls.forEach(function(el){
      var e=document.createElement('div'); e.className='dEl'+(el.id===desSel?' sel':''); e.dataset.id=el.id;
      e.style.left=el.x+'px'; e.style.top=el.y+'px'; e.style.width=el.w+'px'; e.style.height=el.h+'px';
      e.style.background=el.bg; e.style.color=el.color; e.style.fontSize=el.size+'px'; e.style.borderRadius=el.r+'px';
      if(el.type==='text'){ e.textContent=el.text; e.style.background='transparent'; }
      else if(el.type==='button'){ e.textContent=el.text; e.style.fontWeight='700'; }
      else if(el.type==='input'){ e.textContent=el.text; e.style.border='1px solid rgba(255,255,255,.14)'; e.style.justifyContent='flex-start'; e.style.paddingLeft='12px'; }
      else if(el.type==='image'){ e.textContent='🖼'; e.style.fontSize='32px'; }
      else if(el.type==='card'){ e.textContent=el.text; e.style.padding='12px'; e.style.textAlign='left'; e.style.justifyContent='flex-start'; }
      else if(el.type==='icon'){ e.textContent='⭐'; e.style.fontSize='28px'; e.style.background='transparent'; }
      e.addEventListener('mousedown', desDown);
      e.addEventListener('touchstart', desDown, {passive:false});
      e.addEventListener('click', function(ev){ ev.stopPropagation(); desSelect(el.id); });
      e.addEventListener('dblclick', function(){ var t=prompt('Edit text:', el.text); if(t!==null){ el.text=t; desSave(); desRender(); desUpdateProps(); }});
      sc.appendChild(e);
    });
    document.querySelectorAll('#deviceList .dBtn').forEach(function(b){ b.classList.toggle('on', b.dataset.dev===desDev); });
  }
  function desSelect(id){ desSel=id; desRender(); desUpdateProps(); }
  function desUpdateProps(){
    var empty=$('#propsEmpty'), form=$('#propsForm');
    var el=desEls.find(function(x){return x.id===desSel;});
    if(!el){ if(empty) empty.style.display=''; if(form) form.style.display='none'; return; }
    if(empty) empty.style.display='none'; if(form) form.style.display='';
    $('#propText').value=el.text||''; $('#propBg').value=el.bg && el.bg!=='transparent'?el.bg:'#151a2e'; $('#propColor').value=el.color||'#ffffff';
    $('#propSize').value=el.size; $('#propW').value=el.w; $('#propH').value=el.h; $('#propR').value=el.r;
    var sv=document.getElementById('propSizeV'); if(sv) sv.textContent=el.size;
    var wv=document.getElementById('propWV'); if(wv) wv.textContent=el.w;
    var hv=document.getElementById('propHV'); if(hv) hv.textContent=el.h;
    var rv=document.getElementById('propRV'); if(rv) rv.textContent=el.r;
  }
  function desAdd(type){
    var d=DEVICES[desDev]||DEVICES.phone;
    var w= type==='text'?160: type==='button'?140: type==='input'?260: type==='card'?320: 80;
    var h= type==='text'?32: type==='button'?44: type==='input'?44: type==='card'?80: 80;
    var el={id:desUid(),type:type,x:Math.max(0,(d.w-w)/2),y:120,w:w,h:h,text: type==='text'?'Hello': type==='button'?'Button': type==='input'?'Input': type==='card'?'Card text': type==='icon'?'⭐':'', bg: type==='button'?'#5eead4': type==='card'?'#151a2e': type==='input'?'#1a1f2e': type==='image'?'#2a2f45':'transparent', color: type==='button'?'#06121a':'#fff', size: type==='text'?18:14, r: type==='button'||type==='input'||type==='card'?10: type==='image'?12:0};
    desEls.push(el); desSel=el.id; desSave(); desRender(); desUpdateProps();
  }
  function desSetDevice(dev){ desDev=dev; desSave(); desRender(); }
  function desLoadTemplate(name){
    var t=TEMPLATES[name]; if(t===undefined) return;
    if(t.length===0){ if(!confirm('Clear canvas?')) return; desEls=[]; desSel=null; desSave(); desRender(); desUpdateProps(); return; }
    if(!confirm('Load "'+name+'" template? This replaces the canvas.')) return;
    desEls=JSON.parse(JSON.stringify(t)).map(function(e){ e.id=desUid(); return e; });
    desSel=null; desSave(); desRender(); desUpdateProps();
  }
  var drag=null;
  function desDown(e){
    var id=e.currentTarget.dataset.id; desSelect(id);
    var el=desEls.find(function(x){return x.id===id;}); if(!el) return;
    var rect=$('#phoneScreen').getBoundingClientRect();
    var cx=(e.touches?e.touches[0].clientX:e.clientX)-rect.left;
    var cy=(e.touches?e.touches[0].clientY:e.clientY)-rect.top;
    drag={el:el, ox:cx-el.x, oy:cy-el.y};
    e.preventDefault();
  }
  function desMove(e){
    if(!drag) return;
    var rect=$('#phoneScreen').getBoundingClientRect();
    var cx=(e.touches?e.touches[0].clientX:e.clientX)-rect.left;
    var cy=(e.touches?e.touches[0].clientY:e.clientY)-rect.top;
    drag.el.x=Math.max(0, Math.min(rect.width - drag.el.w, cx - drag.ox));
    drag.el.y=Math.max(0, Math.min(rect.height - drag.el.h, cy - drag.oy));
    desRender();
  }
  function desUp(){ if(drag){ desSave(); drag=null; } }
  document.addEventListener('mousemove', desMove);
  document.addEventListener('mouseup', desUp);
  document.addEventListener('touchmove', desMove, {passive:false});
  document.addEventListener('touchend', desUp);
  function setTheme(i){
    var THEMES=['aurora','sunset','neon','forest'];
    i=((i%THEMES.length)+THEMES.length)%THEMES.length;
    document.documentElement.setAttribute('data-theme', THEMES[i]);
    var dots=document.querySelectorAll('#themes .dot');
    for(var d=0;d<dots.length;d++) dots[d].classList.toggle('on', d===i);
    save('designer_theme', i);
  }
  document.addEventListener('DOMContentLoaded', function(){
    var ti=load('designer_theme',0); document.documentElement.setAttribute('data-theme', THEMES[ti]||'aurora');
    var dots=$('#themes'); THEMES.forEach(function(th,i){ var d=document.createElement('span'); d.className='dot'; d.style.background=({aurora:'#5eead4',sunset:'#fb923c',neon:'#22d3ee',forest:'#34d399'})[th]; d.addEventListener('click', function(){ setTheme(i); }); dots.appendChild(d); });
    setTheme(ti);
    desRender(); desUpdateProps();
    document.querySelectorAll('#palette .pBtn').forEach(function(b){ b.addEventListener('click', function(){ desAdd(this.dataset.type); }); });
    document.querySelectorAll('#deviceList .dBtn').forEach(function(b){ b.addEventListener('click', function(){ desSetDevice(this.dataset.dev); }); });
    document.querySelectorAll('#tmplList .tBtn').forEach(function(b){ b.addEventListener('click', function(){ desLoadTemplate(this.dataset.tmpl); }); });
    var pt=$('#propText'); if(pt) pt.addEventListener('input', function(){ var e=desEls.find(function(x){return x.id===desSel;}); if(e){ e.text=this.value; desSave(); desRender(); }});
    var pb=$('#propBg'); if(pb) pb.addEventListener('input', function(){ var e=desEls.find(function(x){return x.id===desSel;}); if(e){ e.bg=this.value; desSave(); desRender(); }});
    var pc=$('#propColor'); if(pc) pc.addEventListener('input', function(){ var e=desEls.find(function(x){return x.id===desSel;}); if(e){ e.color=this.value; desSave(); desRender(); }});
    var ps=$('#propSize'); if(ps) ps.addEventListener('input', function(){ var e=desEls.find(function(x){return x.id===desSel;}); if(e){ e.size=parseInt(this.value,10); var v=document.getElementById('propSizeV'); if(v) v.textContent=e.size; desSave(); desRender(); }});
    var pw=$('#propW'); if(pw) pw.addEventListener('input', function(){ var e=desEls.find(function(x){return x.id===desSel;}); if(e){ e.w=parseInt(this.value,10); var v=document.getElementById('propWV'); if(v) v.textContent=e.w; desSave(); desRender(); }});
    var ph=$('#propH'); if(ph) ph.addEventListener('input', function(){ var e=desEls.find(function(x){return x.id===desSel;}); if(e){ e.h=parseInt(this.value,10); var v=document.getElementById('propHV'); if(v) v.textContent=e.h; desSave(); desRender(); }});
    var pr=$('#propR'); if(pr) pr.addEventListener('input', function(){ var e=desEls.find(function(x){return x.id===desSel;}); if(e){ e.r=parseInt(this.value,10); var v=document.getElementById('propRV'); if(v) v.textContent=e.r; desSave(); desRender(); }});
    var del=$('#propDelete'); if(del) del.addEventListener('click', function(){ desEls=desEls.filter(function(x){return x.id!==desSel;}); desSel=null; desSave(); desRender(); desUpdateProps(); });
    var cl=$('#clearDesign'); if(cl) cl.addEventListener('click', function(){ if(confirm('Clear canvas?')){ desEls=[]; desSel=null; desSave(); desRender(); desUpdateProps(); }});
    var sv=$('#saveDesign'); if(sv) sv.addEventListener('click', function(){ desSave(); alert('Saved to this browser.'); });
    var ex=$('#exportDesign'); if(ex) ex.addEventListener('click', function(){ var blob=new Blob([JSON.stringify({device:desDev,elements:desEls},null,2)],{type:'application/json'}); var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='phone-design.json'; a.click(); });
    var im=$('#importDesign'); if(im) im.addEventListener('click', function(){ var j=prompt('Paste design JSON:'); if(!j) return; try{ var o=JSON.parse(j); desEls=o.elements||o; desDev=o.device||desDev; desSave(); desRender(); desUpdateProps(); }catch(e){ alert('Invalid JSON'); }});
    var sc=$('#phoneScreen'); if(sc) sc.addEventListener('click', function(e){ if(e.target===this){ desSel=null; desUpdateProps(); desRender(); }});
  });
})();
