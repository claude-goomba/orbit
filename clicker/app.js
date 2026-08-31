(function(){
  var $=function(s){return document.querySelector(s);};
  function load(k,d){try{var v=localStorage.getItem(k);return v==null?d:JSON.parse(v);}catch(e){return d;}}
  function save(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  function fmt(n){
    if(n<1000) return Math.floor(n).toLocaleString();
    if(n<1e6) return (n/1000).toFixed(1).replace(/\.0$/,'')+'K';
    if(n<1e9) return (n/1e6).toFixed(1).replace(/\.0$/,'')+'M';
    if(n<1e12) return (n/1e9).toFixed(1).replace(/\.0$/,'')+'B';
    return (n/1e12).toFixed(1).replace(/\.0$/,'')+'T';
  }
  var THEMES=['aurora','sunset','neon','forest'];
  var GENS=[
    {id:'cursor', name:'Cursor', icon:'👆', base:15, mult:1.15, cps:0.1, desc:'Clicks for you'},
    {id:'grandma', name:'Grandma', icon:'👵', base:100, mult:1.15, cps:1, desc:'Bakes cookies'},
    {id:'farm', name:'Farm', icon:'🌾', base:1100, mult:1.15, cps:8, desc:'Grows coins'},
    {id:'mine', name:'Mine', icon:'⛏️', base:12000, mult:1.15, cps:47, desc:'Mines coins'},
    {id:'factory', name:'Factory', icon:'🏭', base:130000, mult:1.15, cps:260, desc:'Mass production'},
    {id:'bank', name:'Bank', icon:'🏦', base:1400000, mult:1.15, cps:1400, desc:'Interest'},
    {id:'temple', name:'Temple', icon:'🛕', base:20000000, mult:1.15, cps:7800, desc:'Ancient power'},
    {id:'wizard', name:'Wizard', icon:'🧙', base:330000000, mult:1.15, cps:44000, desc:'Casts coins'},
    {id:'shipment', name:'Shipment', icon:'🚀', base:5100000000, mult:1.15, cps:260000, desc:'From space'},
  ];
  var UPGS=[
    {id:'click1', name:'Stronger Fingers', desc:'Click ×2', cost:100, type:'click', mult:2},
    {id:'click2', name:'Power Click', desc:'Click ×2', cost:500, type:'click', mult:2},
    {id:'click3', name:'Mega Click', desc:'Click ×3', cost:10000, type:'click', mult:3},
    {id:'cursor1', name:'Reinforced Cursors', desc:'Cursors ×2', cost:100, type:'gen', gen:'cursor', mult:2},
    {id:'grandma1', name:'Foremans', desc:'Grandmas ×2', cost:1000, type:'gen', gen:'grandma', mult:2},
    {id:'farm1', name:'Fertilizer', desc:'Farms ×2', cost:11000, type:'gen', gen:'farm', mult:2},
    {id:'mine1', name:'Drills', desc:'Mines ×2', cost:120000, type:'gen', gen:'mine', mult:2},
    {id:'factory1', name:'Assembly Line', desc:'Factories ×2', cost:1300000, type:'gen', gen:'factory', mult:2},
    {id:'bank1', name:'Vaults', desc:'Banks ×2', cost:14000000, type:'gen', gen:'bank', mult:2},
    {id:'crit1', name:'Lucky Touch', desc:'Crit chance +2% (now 4%)', cost:50000, type:'crit', mult:2},
  ];
  var ACHS=[
    {id:'click100', name:'First Hundred', desc:'Click 100 times', check:function(s){return s.totalClicks>=100;}},
    {id:'click1000', name:'Click Master', desc:'Click 1,000 times', check:function(s){return s.totalClicks>=1000;}},
    {id:'coins1k', name:'Thousandaire', desc:'Earn 1,000 coins total', check:function(s){return s.totalCoins>=1000;}},
    {id:'coins1m', name:'Millionaire', desc:'Earn 1M coins', check:function(s){return s.totalCoins>=1e6;}},
    {id:'gen10', name:'Small Business', desc:'Own 10 generators', check:function(s){ var t=0; for(var k in s.gens) t+=s.gens[k]; return t>=10;}},
    {id:'gen50', name:'Empire', desc:'Own 50 generators', check:function(s){ var t=0; for(var k in s.gens) t+=s.gens[k]; return t>=50;}},
    {id:'cps1k', name:'Speedy', desc:'Reach 1K cps', check:function(s){ return getCps(s)>=1000;}},
    {id:'prestige1', name:'Reborn', desc:'Prestige once', check:function(s){ return s.prestiges>=1;}},
    {id:'upg5', name:'Upgraded', desc:'Buy 5 upgrades', check:function(s){ var t=0; for(var k in s.upgs) if(s.upgs[k]) t++; return t>=5;}},
    {id:'golden1', name:'Shiny', desc:'Catch a Golden Orbit', check:function(s){ return (s.goldenCaught||0)>=1;}},
  ];
  function defaultState(){
    var g={}; GENS.forEach(function(x){g[x.id]=0;});
    return {coins:0,totalCoins:0,totalClicks:0,clickPower:1,prestige:0,shards:0,gens:g,upgs:{},achs:{},goldenCaught:0,prestiges:0,last:Date.now()};
  }
  var S=load('clicker_save', null) || defaultState();
  if(!S.gens) S.gens={}; GENS.forEach(function(x){ if(S.gens[x.id]==null) S.gens[x.id]=0; });
  if(S.shards==null) S.shards=S.prestige||0;
  if(S.last==null) S.last=Date.now();
  // offline
  (function(){
    var now=Date.now(), diff=Math.max(0,(now-(S.last||now))/1000);
    if(diff>2){ var c=getCps(S)*diff; if(c>0){ S.coins+=c; S.totalCoins+=c; showFloat('+'+fmt(c)+' offline', true); } }
    S.last=now; save('clicker_save', S);
  })();
  function getGenCost(id){
    var g=GENS.find(function(x){return x.id===id;});
    var n=S.gens[id]||0;
    return Math.floor(g.base * Math.pow(g.mult, n));
  }
  function getCps(state){
    state=state||S;
    var t=0;
    GENS.forEach(function(g){
      var n=state.gens[g.id]||0;
      var m=1;
      UPGS.forEach(function(u){ if(u.type==='gen' && u.gen===g.id && state.upgs[u.id]) m*=u.mult; });
      t+= n * g.cps * m;
    });
    var bonus=1 + (state.shards||0)*0.1;
    return t * bonus;
  }
  function getClickPower(){
    var m=1;
    UPGS.forEach(function(u){ if(u.type==='click' && S.upgs[u.id]) m*=u.mult; });
    var bonus=1 + (S.shards||0)*0.1;
    return m * bonus;
  }
  function getCritChance(){
    var c=0.02;
    if(S.upgs['crit1']) c+=0.02;
    return c;
  }
  function showFloat(txt, big){
    var d=document.createElement('div'); d.className='float'; d.textContent=txt;
    if(big) d.style.fontSize='22px';
    d.style.left=(Math.random()*40+30)+'vw'; d.style.top='42%';
    document.body.appendChild(d); setTimeout(function(){ d.remove(); },700);
  }
  function beep(f){
    try{
      var ac=new (window.AudioContext||window.webkitAudioContext)();
      var o=ac.createOscillator(), g=ac.createGain();
      o.frequency.value=f||700; g.gain.value=0.12;
      o.connect(g); g.connect(ac.destination);
      o.start(); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime+0.22); o.stop(ac.currentTime+0.23);
    }catch(e){}
  }
  function renderTop(){
    $('#coins').textContent=fmt(S.coins);
    $('#cps').textContent=fmt(getCps());
    $('#shards').textContent=S.shards||0;
    $('#clickPower').textContent=fmt(getClickPower());
    $('#prestigeBadge').textContent=(S.shards||0)+' shards';
    var p=Math.floor(Math.sqrt((S.totalCoins||0)/1e6));
    var b=$('#prestigeBtn'); if(b){ b.disabled=p<=S.shards; b.textContent=p>S.shards? '✨ Prestige +'+(p-S.shards)+' shards' : '✨ Prestige'; }
    $('#critInfo').textContent=' • crit '+(getCritChance()*100).toFixed(0)+'%';
  }
  function renderGens(){
    var el=$('#pane-gen'); if(!el) return; el.innerHTML='';
    GENS.forEach(function(g){
      var cost=getGenCost(g.id), n=S.gens[g.id]||0, afford=S.coins>=cost;
      var d=document.createElement('div'); d.className='gen'+(afford?' afford':'');
      d.innerHTML='<div class="genIcon">'+g.icon+'</div><div class="genInfo"><div class="genName">'+g.name+' <small>×'+n+'</small></div><div class="genDesc">'+g.desc+' — '+fmt(g.cps)+' cps</div><div class="genMeta">'+fmt(cost)+' coins</div></div>';
      var b=document.createElement('button'); b.className='genBuy'; b.textContent='Buy'; b.disabled=!afford;
      b.addEventListener('click', function(){ if(S.coins>=cost){ S.coins-=cost; S.gens[g.id]=(S.gens[g.id]||0)+1; S.totalCoins+=0; save('clicker_save',S); beep(500); renderAll(); }});
      d.appendChild(b); el.appendChild(d);
    });
  }
  function renderUpgs(){
    var el=$('#pane-upg'); if(!el) return; el.innerHTML='';
    UPGS.forEach(function(u){
      var owned=!!S.upgs[u.id], afford=S.coins>=u.cost;
      var d=document.createElement('div'); d.className='upg'+(owned?' owned':'')+(afford&&!owned?' afford':'');
      d.innerHTML='<div style="flex:1"><div style="font-weight:700;font-size:13px">'+u.name+(owned?' ✓':'')+'</div><div style="font-size:11px;opacity:.7">'+u.desc+' — '+fmt(u.cost)+' coins</div></div>';
      var b=document.createElement('button'); b.className='genBuy'; b.textContent=owned?'Owned': 'Buy'; b.disabled=owned||!afford;
      b.addEventListener('click', function(){ if(!owned && S.coins>=u.cost){ S.coins-=u.cost; S.upgs[u.id]=true; save('clicker_save',S); beep(900); renderAll(); }});
      d.appendChild(b); el.appendChild(d);
    });
  }
  function renderAchs(){
    var el=$('#pane-ach'); if(!el) return; el.innerHTML='';
    ACHS.forEach(function(a){
      var done=!!S.achs[a.id];
      if(!done && a.check(S)){ S.achs[a.id]=true; done=true; showFloat('🏆 '+a.name, true); beep(1200); }
      var d=document.createElement('div'); d.className='upg'+(done?' afford':'');
      d.innerHTML='<div style="flex:1"><div style="font-weight:700;font-size:13px">'+(done?'✅ ':'🔒 ')+a.name+'</div><div style="font-size:11px;opacity:.7">'+a.desc+'</div></div>';
      el.appendChild(d);
    });
  }
  function renderStats(){
    var el=$('#statList'); if(!el) return;
    var totalGens=0; for(var k in S.gens) totalGens+=S.gens[k];
    var upgCount=0; for(var k in S.upgs) if(S.upgs[k]) upgCount++;
    var achCount=0; for(var k in S.achs) if(S.achs[k]) achCount++;
    el.innerHTML='<div><b>Coins:</b> '+fmt(S.coins)+'</div><div><b>Total earned:</b> '+fmt(S.totalCoins)+'</div><div><b>Clicks:</b> '+S.totalClicks.toLocaleString()+'</div><div><b>Generators:</b> '+totalGens+'</div><div><b>Upgrades:</b> '+upgCount+'/'+UPGS.length+'</div><div><b>Achievements:</b> '+achCount+'/'+ACHS.length+'</div><div><b>CPS:</b> '+fmt(getCps())+'</div><div><b>Shards bonus:</b> +'+((S.shards||0)*10)+'%</div><div><b>Offline CPS:</b> earns while away</div>';
  }
  function renderAll(){ renderTop(); renderGens(); renderUpgs(); renderAchs(); renderStats(); }
  // golden
  function spawnGolden(){
    var c=$('#goldenCard'); if(!c) return;
    c.style.display=''; setTimeout(function(){ c.style.display='none'; },10000);
  }
  setInterval(function(){ if(Math.random()<0.18) spawnGolden(); }, 8000);
  document.addEventListener('DOMContentLoaded', function(){
    // themes
    var THEMES=['aurora','sunset','neon','forest'];
    var ti=load('clicker_theme',0); document.documentElement.setAttribute('data-theme', THEMES[ti]||'aurora');
    var dots=$('#themes'); THEMES.forEach(function(th,i){ var d=document.createElement('span'); d.className='dot'; d.style.background=({aurora:'#f59e0b',sunset:'#fb923c',neon:'#22d3ee',forest:'#34d399'})[th]; d.addEventListener('click', function(){ document.documentElement.setAttribute('data-theme', th); save('clicker_theme', i); document.querySelectorAll('#themes .dot').forEach(function(x,y){ x.classList.toggle('on', y===i); }); }); dots.appendChild(d); });
    document.querySelectorAll('#themes .dot').forEach(function(x,y){ x.classList.toggle('on', y===ti); });
    // live time
    (function(){ function tick(){ var el=$('#liveTime'); if(el){ var d=new Date(); el.textContent=d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit',second:'2-digit'})+' • '+d.toLocaleDateString([],{month:'short',day:'numeric'}); }} tick(); setInterval(tick,1000); })();
    // tabs
    document.querySelectorAll('.tab').forEach(function(t){ t.addEventListener('click', function(){ document.querySelectorAll('.tab').forEach(function(x){x.classList.remove('on');}); document.querySelectorAll('.tabPane').forEach(function(x){x.classList.remove('on');}); t.classList.add('on'); var p=document.getElementById('pane-'+t.dataset.tab); if(p) p.classList.add('on'); }); });
    // click
    var btn=$('#clickBtn');
    function doClick(e){
      var p=getClickPower(); var crit=Math.random()<getCritChance();
      var add=crit? p*10 : p;
      S.coins+=add; S.totalCoins+=add; S.totalClicks++; S.last=Date.now();
      var txt='+'+fmt(add)+(crit?' CRIT!':'');
      var d=document.createElement('div'); d.className='float'; d.textContent=txt; d.style.color=crit?'#f59e0b':''; d.style.left=(e? e.clientX+'px' : '50%'); d.style.top=(e? e.clientY+'px' : '50%'); d.style.position='fixed'; document.body.appendChild(d); setTimeout(function(){d.remove();},700);
      beep(crit?1100:700);
      renderAll(); save('clicker_save', S);
    }
    btn.addEventListener('click', doClick);
    btn.addEventListener('touchstart', function(e){ e.preventDefault(); doClick(e.touches[0]); }, {passive:false});
    // prestige
    $('#prestigeBtn').addEventListener('click', function(){
      var p=Math.floor(Math.sqrt((S.totalCoins||0)/1e6));
      var gain=p - (S.shards||0);
      if(gain<=0) return;
      if(!confirm('Prestige for +'+gain+' shards? This resets coins and generators but keeps shards bonus (+10% per shard).')) return;
      S.shards=p; S.prestiges=(S.prestiges||0)+1;
      S.coins=0; for(var k in S.gens) S.gens[k]=0;
      S.upgs={}; // keep shards
      save('clicker_save', S); renderAll();
    });
    $('#goldenBtn').addEventListener('click', function(){
      var bonus=Math.floor(S.coins*0.1)+100;
      S.coins+=bonus; S.totalCoins+=bonus; S.goldenCaught=(S.goldenCaught||0)+1;
      $('#goldenCard').style.display='none'; showFloat('+'+fmt(bonus)+' golden!', true); beep(1300); renderAll(); save('clicker_save', S);
    });
    $('#saveBtn').addEventListener('click', function(){ S.last=Date.now(); save('clicker_save', S); showFloat('Saved', true); });
    $('#resetBtn').addEventListener('click', function(){ if(confirm('Reset everything?')){ localStorage.removeItem('clicker_save'); S=defaultState(); renderAll(); }});
    // loop
    setInterval(function(){
      var now=Date.now(), dt=Math.max(0,(now-(S.last||now))/1000);
      // use 100ms tick for smoothness
      var add=getCps()*0.1;
      if(add>0){ S.coins+=add; S.totalCoins+=add; }
      S.last=now;
      renderTop(); renderStats();
      // afford refresh every 300ms
      if(Date.now()%300<120){ renderGens(); renderUpgs(); renderAchs(); }
      save('clicker_save', S);
    },100);
    renderAll();
  });
})();
