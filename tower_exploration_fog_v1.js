/* Туман войны для исследования этажей. Показывает только уже открытый путь и текущее положение. */
(function(){
'use strict';
const DATA_KEY='chronicles_tower_exploration_v5';
const STYLE_ID='chronicles-tower-fog-style-v1';
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function load(){try{const x=JSON.parse(localStorage.getItem(DATA_KEY));return x&&x.floors?x:null}catch(e){return null}}
function mapHtml(){
 const root=load(); if(!root||!state||!state.hero)return '';
 const d=root.floors[state.floor]; if(!d||!d.nodes)return '';
 const known=d.nodes.filter(n=>n.visited);
 if(!known.length)return '';
 const knownIds=new Set(known.map(n=>n.id));
 const rows=known.map(n=>{
   const isCurrent=n.id===d.current;
   const links=(n.neighbors||[]).filter(e=>knownIds.has(e.to)).map(e=>e.dir).join(' ');
   const label=isCurrent?'📍 Ты здесь':(n.type==='start'?'🚪 Вход':'◉ Исследовано');
   return `<div class="abyss-map-node ${isCurrent?'current':''}"><span>${label}</span><small>${links?esc(links):'•'}</small></div>`;
 }).join('');
 return `<div class="card abyss-fog-card"><h3>🗺️ Твой путь</h3><div class="small muted">Ты видишь только уже исследованные участки. Неизвестная часть этажа скрыта.</div><div class="abyss-fog-map">${rows}</div></div>`;
}
function installStyle(){if(document.getElementById(STYLE_ID))return;const s=document.createElement('style');s.id=STYLE_ID;s.textContent=`.abyss-fog-card{margin-top:12px}.abyss-fog-map{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:6px;margin-top:10px}.abyss-map-node{min-height:46px;border:1px solid rgba(255,255,255,.12);border-radius:8px;padding:6px;background:rgba(255,255,255,.025);font-size:12px;display:flex;flex-direction:column;justify-content:center;gap:3px}.abyss-map-node.current{border-color:rgba(255,190,70,.55);background:rgba(255,190,70,.08)}.abyss-map-node small{opacity:.55;font-size:11px}.abyss-map-node span{font-weight:600}`;document.head.appendChild(s)}
const oldRender=window.render;
window.render=function(){oldRender();if(state&&state.screen==='explore'){installStyle();const screen=document.getElementById('screen');if(screen&&!screen.querySelector('.abyss-fog-card'))screen.insertAdjacentHTML('afterbegin',mapHtml())}};
})();
