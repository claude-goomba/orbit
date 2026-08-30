(function(){
  var $=function(s){return document.querySelector(s);};
  function load(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  var THEMES=['aurora','sunset','neon','forest'];
  var COMPANIES={
    apple:{name:'Apple',badge:'US • EU',models:{
      'iPhone 15':{w:390,h:844,hw:{chip:'A16 Bionic',display:'6.1" OLED 2556×1179',camera:'48MP + 12MP',battery:'3349mAh',ram:'6GB',storage:'128–512GB'}},
      'iPhone 15 Pro':{w:393,h:852,hw:{chip:'A17 Pro',display:'6.1" OLED 2556×1179 120Hz',camera:'48MP + 12MP + 12MP',battery:'3274mAh',ram:'8GB',storage:'128GB–1TB'}},
      'iPad Pro 12.9':{w:1024,h:1366,hw:{chip:'M2',display:'12.9" Liquid Retina XDR',camera:'12MP + 10MP',battery:'10758mAh',ram:'8–16GB',storage:'128GB–2TB'}},
      'Watch Series 9':{w:240,h:280,hw:{chip:'S9',display:'1.9" OLED',camera:'—',battery:'18h',ram:'—',storage:'64GB'}}
    }},
    samsung:{name:'Samsung',badge:'US • EU',models:{
      'Galaxy S24':{w:360,h:780,hw:{chip:'Snapdragon 8 Gen 3',display:'6.2" AMOLED 2340×1080 120Hz',camera:'50MP + 12MP + 10MP',battery:'4000mAh',ram:'8GB',storage:'128–256GB'}},
      'Galaxy S24 Ultra':{w:384,h:854,hw:{chip:'Snapdragon 8 Gen 3',display:'6.8" AMOLED 3120×1440 120Hz',camera:'200MP + 12MP + 10MP + 50MP',battery:'5000mAh',ram:'12GB',storage:'256GB–1TB'}},
      'Galaxy Z Fold 5':{w:768,h:1024,hw:{chip:'Snapdragon 8+ Gen 1',display:'7.6" Foldable',camera:'50MP + 12MP + 10MP',battery:'4400mAh',ram:'12GB',storage:'256GB–1TB'}},
      'Galaxy Watch 6':{w:240,h:280,hw:{chip:'Exynos W930',display:'1.5" AMOLED',camera:'—',battery:'30h',ram:'—',storage:'16GB'}}
    }},
    google:{name:'Google',badge:'US • EU',models:{
      'Pixel 8':{w:412,h:915,hw:{chip:'Tensor G3',display:'6.2" OLED 2400×1080 120Hz',camera:'50MP + 12MP',battery:'4575mAh',ram:'8GB',storage:'128–256GB'}},
      'Pixel 8 Pro':{w:412,h:915,hw:{chip:'Tensor G3',display:'6.7" OLED 2992×1344 120Hz',camera:'50MP + 48MP + 48MP',battery:'5050mAh',ram:'12GB',storage:'128GB–1TB'}},
      'Pixel Tablet':{w:800,h:1280,hw:{chip:'Tensor G2',display:'11" LCD 2560×1600',camera:'8MP',battery:'7020mAh',ram:'8GB',storage:'128–256GB'}},
      'Pixel Watch 2':{w:240,h:280,hw:{chip:'Snapdragon W5',display:'1.2" OLED',camera:'—',battery:'24h',ram:'—',storage:'32GB'}}
    }},
    motorola:{name:'Motorola',badge:'US • EU',models:{
      'Edge 40':{w:402,h:874,hw:{chip:'Dimensity 8020',display:'6.55" OLED 2400×1080 144Hz',camera:'50MP + 13MP',battery:'4400mAh',ram:'8GB',storage:'256GB'}},
      'Razr 40 Ultra':{w:402,h:874,hw:{chip:'Snapdragon 8+ Gen 1',display:'6.9" Foldable 2640×1080',camera:'12MP + 13MP',battery:'3800mAh',ram:'8–12GB',storage:'256–512GB'}},
      'Moto G84':{w:360,h:800,hw:{chip:'Snapdragon 695',display:'6.55" OLED 2400×1080',camera:'50MP + 8MP',battery:'5000mAh',ram:'12GB',storage:'256GB'}}
    }},
    oneplus:{name:'OnePlus',badge:'US • EU',models:{
      'OnePlus 12':{w:360,h:800,hw:{chip:'Snapdragon 8 Gen 3',display:'6.82" AMOLED 3168×1440 120Hz',camera:'50MP + 64MP + 48MP',battery:'5400mAh',ram:'12–16GB',storage:'256–512GB'}},
      'OnePlus Pad':{w:800,h:1280,hw:{chip:'Dimensity 9000',display:'11.61" LCD 2800×2000 144Hz',camera:'13MP',battery:'9510mAh',ram:'8–12GB',storage:'128–256GB'}},
      'OnePlus Watch 2':{w:240,h:280,hw:{chip:'Snapdragon W5',display:'1.43" AMOLED',camera:'—',battery:'100h',ram:'—',storage:'32GB'}}
    }},
    nokia:{name:'Nokia',badge:'US • EU',models:{
      'G60':{w:360,h:800,hw:{chip:'Snapdragon 695',display:'6.58" LCD 2408×1080 120Hz',camera:'50MP + 5MP + 2MP',battery:'4500mAh',ram:'4–6GB',storage:'64–128GB'}},
      'X30':{w:360,h:800,hw:{chip:'Snapdragon 695',display:'6.43" AMOLED 2400×1080',camera:'50MP + 13MP',battery:'4200mAh',ram:'6–8GB',storage:'128–256GB'}}
    }},
    xiaomi:{name:'Xiaomi',badge:'EU • US limited',models:{
      '14':{w:360,h:800,hw:{chip:'Snapdragon 8 Gen 3',display:'6.36" OLED 2670×1200 120Hz',camera:'50MP + 50MP + 50MP',battery:'4610mAh',ram:'8–12GB',storage:'256–512GB'}},
      '14 Pro':{w:360,h:800,hw:{chip:'Snapdragon 8 Gen 3',display:'6.73" OLED 3200×1440 120Hz',camera:'50MP + 50MP + 50MP',battery:'4880mAh',ram:'12–16GB',storage:'256GB–1TB'}},
      'Pad 6':{w:800,h:1280,hw:{chip:'Snapdragon 870',display:'11" LCD 2880×1800 144Hz',camera:'13MP',battery:'8840mAh',ram:'6–8GB',storage:'128–256GB'}}
    }},
    sony:{name:'Sony',badge:'US • EU',models:{
      'Xperia 1 V':{w:384,h:854,hw:{chip:'Snapdragon 8 Gen 2',display:'6.5" OLED 3840×1644 120Hz',camera:'48MP + 12MP + 12MP',battery:'5000mAh',ram:'12GB',storage:'256GB'}},
      'Xperia 5 V':{w:360,h:800,hw:{chip:'Snapdragon 8 Gen 2',display:'6.1" OLED 2520×1080 120Hz',camera:'48MP + 12MP',battery:'5000mAh',ram:'8GB',storage:'128GB'}}
    }},
    nothing:{name:'Nothing',badge:'US • EU',models:{
      'Phone (2)':{w:360,h:800,hw:{chip:'Snapdragon 8+ Gen 1',display:'6.7" OLED 2412×1080 120Hz',camera:'50MP + 50MP',battery:'4700mAh',ram:'8–12GB',storage:'128–512GB'}}
    }}
  };
  var TEMPLATES={
    blank:[],
    login:[{type:'text',x:110,y:80,w:170,h:36,text:'Welcome',bg:'transparent',color:'#fff',size:22,r:0},{type:'input',x:45,y:150,w:300,h:44,text:'Email',bg:'#1a1f2e',color:'#fff',size:14,r:10},{type:'input',x:45,y:210,w:300,h:44,text:'Password',bg:'#1a1f2e',color:'#fff',size:14,r:10},{type:'button',x:45,y:280,w:300,h:48,text:'Sign in',bg:'#5eead4',color:'#06121a',size:16,r:12},{type:'text',x:130,y:350,w:130,h:20,text:'Forgot password?',bg:'transparent',color:'#a78bfa',size:12,r:0}],
    profile:[{type:'image',x:135,y:40,w:120,h:120,text:'',bg:'#2a2f45',color:'#fff',size:16,r:60},{type:'text',x:110,y:180,w:170,h:28,text:'Alex Rivera',bg:'transparent',color:'#fff',size:18,r:0},{type:'text',x:110,y:210,w:170,h:20,text:'Product Designer',bg:'transparent',color:'#9aa0b5',size:13,r:0},{type:'button',x:95,y:250,w:200,h:44,text:'Follow',bg:'#a78bfa',color:'#fff',size:15,r:12},{type:'card',x:20,y:320,w:350,h:90,text:'About — Crafting friendly interfaces for everyone.',bg:'#151a2e',color:'#eef1f8',size:13,r:14}],
    shop:[{type:'text',x:20,y:20,w:150,h:28,text:'Shop',bg:'transparent',color:'#fff',size:20,r:0},{type:'card',x:20,y:70,w:350,h:80,text:'🎧 Headphones — $59',bg:'#151a2e',color:'#fff',size:14,r:12},{type:'card',x:20,y:170,w:350,h:80,text:'⌚ Watch — $129',bg:'#151a2e',color:'#fff',size:14,r:12},{type:'card',x:20,y:270,w:350,h:80,text:'📱 Phone Case — $19',bg:'#151a2e',color:'#fff',size:14,r:12},{type:'button',x:20,y:380,w:350,h:48,text:'Checkout',bg:'#22d3ee',color:'#06121a',size:16,r:12}]
  };
  var desEls=load('designer_els', null) ? load('designer_els', []) : [];
  var desSel=null;
  var desCompany=load('designer_company','apple');
  var desModel=load('designer_model','iPhone 15');
  function desSave(){ save('designer_els', desEls); save('designer_company', desCompany); save('designer_model', desModel); }
  function desCurrent(){ var c=COMPANIES[desCompany]; if(!c) return {w:390,h:844,label:'Phone',hw:{},company:'',model:''}; var m=c.models[desModel]; if(!m){ var k=Object.keys(c.models)[0]; m=c.models[k]; desModel=k; } return {w:m.w,h:m.h,label: c.name+' • '+desModel+' • '+m.w+'×'+m.h, hw:m.hw||{}, company:c.name, model:desModel}; }
  function desUid(){ return 'e'+Date.now()+Math.random().toString(36).slice(2,5); }
  function desRender(){
    var fr=$('#phoneFrame'), sc=$('#phoneScreen'), lb=$('#deviceLabel');
    if(!fr||!sc) return;
    var d=desCurrent();
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
    renderCompanies(); renderModels(); renderHardware();
  }
  function renderCompanies(){
    var el=$('#companyList'); if(!el) return; el.innerHTML='';
    Object.keys(COMPANIES).forEach(function(k){
      var c=COMPANIES[k];
      var b=document.createElement('button'); b.className='cBtn'+(k===desCompany?' on':''); b.dataset.company=k;
      b.innerHTML=c.name+'<small>'+c.badge+'</small>';
      b.title=c.name+' — '+c.badge;
      b.addEventListener('click', function(){ desSelectCompany(k); });
      el.appendChild(b);
    });
  }
  function renderModels(){
    var el=$('#modelList'); if(!el) return; el.innerHTML='';
    var c=COMPANIES[desCompany]; if(!c) return;
    Object.keys(c.models).forEach(function(m){
      var b=document.createElement('button'); b.className='mBtn'+(m===desModel?' on':''); b.dataset.model=m;
      var hw=c.models[m].hw;
      b.innerHTML=m+'<small>'+(hw.chip||'')+' • '+(hw.display||'').split(' ')[0]+'</small>';
      b.title=m;
      b.addEventListener('click', function(){ desSelectModel(m); });
      el.appendChild(b);
    });
  }
  function renderHardware(){
    var el=$('#hardwareInfo'); if(!el) return;
    var d=desCurrent(); var hw=d.hw||{};
    el.style.display='';
    el.innerHTML='<div class="hwTitle">'+d.company+' • '+d.model+'</div><div><b>Chip:</b> '+(hw.chip||'—')+'</div><div><b>Display:</b> '+(hw.display||'—')+'</div><div><b>Camera:</b> '+(hw.camera||'—')+'</div><div><b>Battery:</b> '+(hw.battery||'—')+'</div><div><b>RAM:</b> '+(hw.ram||'—')+' • <b>Storage:</b> '+(hw.storage||'—')+'</div><div style="opacity:.6;margin-top:4px;font-size:10px">US • EU • hardware • very friendly</div>';
  }
  function desSelectCompany(c){ desCompany=c; var mods=Object.keys(COMPANIES[c].models); desModel=mods[0]; desSave(); desRender(); }
  function desSelectModel(m){ desModel=m; desSave(); desRender(); }
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
    var d=desCurrent();
    var w= type==='text'?160: type==='button'?140: type==='input'?260: type==='card'?320: 80;
    var h= type==='text'?32: type==='button'?44: type==='input'?44: type==='card'?80: 80;
    var el={id:desUid(),type:type,x:Math.max(0,(d.w-w)/2),y:120,w:w,h:h,text: type==='text'?'Hello': type==='button'?'Button': type==='input'?'Input': type==='card'?'Card text': type==='icon'?'⭐':'', bg: type==='button'?'#5eead4': type==='card'?'#151a2e': type==='input'?'#1a1f2e': type==='image'?'#2a2f45':'transparent', color: type==='button'?'#06121a':'#fff', size: type==='text'?18:14, r: type==='button'||type==='input'||type==='card'?10: type==='image'?12:0};
    desEls.push(el); desSel=el.id; desSave(); desRender(); desUpdateProps();
  }
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
    (function(){ function tick(){ var a=$('#liveTime'), b=$('#phoneTime'); var d=new Date(); var t=d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); if(a) a.textContent=t+' • '+d.toLocaleDateString([],{month:'short',day:'numeric'}); if(b) b.textContent=d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); } tick(); setInterval(tick,60000); setInterval(function(){ var b=$('#phoneTime'); if(b){ var d=new Date(); b.textContent=d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); }},1000); })();
    desRender(); desUpdateProps();
    document.querySelectorAll('#palette .pBtn').forEach(function(b){ b.addEventListener('click', function(){ desAdd(this.dataset.type); }); });
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
    var ex=$('#exportDesign'); if(ex) ex.addEventListener('click', function(){ var blob=new Blob([JSON.stringify({company:desCompany,model:desModel,elements:desEls},null,2)],{type:'application/json'}); var a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='phone-design.json'; a.click(); });
    var im=$('#importDesign'); if(im) im.addEventListener('click', function(){ var j=prompt('Paste design JSON:'); if(!j) return; try{ var o=JSON.parse(j); desEls=o.elements||o; if(o.company) desCompany=o.company; if(o.model) desModel=o.model; if(o.device&&!o.company) desCompany='apple'; desSave(); desRender(); desUpdateProps(); }catch(e){ alert('Invalid JSON'); }});
    var sc=$('#phoneScreen'); if(sc) sc.addEventListener('click', function(e){ if(e.target===this){ desSel=null; desUpdateProps(); desRender(); }});
  });
})();
