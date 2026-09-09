/* Дополнение существующей игры: самостоятельное исследование этажей. */
(function(){
'use strict';
const EX_KEY='chronicles_tower_exploration_v4';
const ROOM_TYPES=[
  ['🕯️','Тёмный коридор','Следы на камне ведут в неизвестность.'],
  ['📦','Заброшенная кладовая','Среди обломков может что-то уцелеть.'],
  ['⛩️','Святилище','Древний алтарь всё ещё хранит остаток силы.'],
  ['🕳️','Трещина Бездны','Из разлома доносится холодный шёпот.'],
  ['🗝️','Запечатанная дверь','Старая печать скрывает то, что находится за ней.'],
  ['👁️','Зал стража','Кто-то наблюдает из темноты.'],
  ['🧱','Разрушенный зал','Камни скрывают следы прежних путников.'],
  ['🕸️','Заражённый проход','Воздух здесь пропитан странной порчей.']
];
let data={version:4,floors:{}};
function saveExploration(){try{localStorage.setItem(EX_KEY,JSON.stringify(data))}catch(e){}}
function loadExploration(){try{const x=JSON.parse(localStorage.getItem(EX_KEY));if(x&&x.floors)data=x}catch(e){}}
function shuffle(a){const x=a.slice();for(let i=x.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[x[i],x[j]]=[x[j],x[i]]}return x}
function makeFloor(f){
  const rooms=shuffle(ROOM_TYPES).slice(0,7).map((r,i)=>({id:i,title:r[0]+' '+r[1],desc:r[2],done:false,reward:null}));
  if(BOSSES[f]) rooms.push({id:7,title:'👑 Зал босса',desc:'Здесь находится страж этажа. Победа откроет путь наверх.',done:false,boss:true,reward:null});
  else rooms.push({id:99,title:'🪜 Скрытая лестница',desc:'Ты нашёл путь на следующий этаж.',done:false,exit:true,reward:null});
  return {floor:f,rooms,exitFound:false,completed:false,bossDefeated:false}
}
function floorData(f){if(!data.floors[f]){data.floors[f]=makeFloor(f);saveExploration()}return data.floors[f]}
function exploredCount(f){return floorData(f).rooms.filter(r=>r.done).length}
function rewardRoom(f,r){
  const h=state.hero,roll=Math.random();
  if(roll<.20){const gold=8+Math.floor(Math.random()*18)+f;h.gold+=gold;r.reward='+'+gold+' 🪙';log('Исследование: найден тайник с '+gold+' 🪙.','good')}
  else if(roll<.36){const heal=Math.max(8,Math.floor(maxHp()*.12));h.hp=Math.min(maxHp(),h.hp+heal);r.reward='+'+heal+' HP';log('Исследование: найдено лекарство. +'+heal+' HP.','good')}
  else if(roll<.52){const xp=10+f*2;gainXP(xp);r.reward='+'+xp+' XP';log('Исследование: древняя надпись дала '+xp+' XP.','good')}
  else if(roll<.68){h.potions++;r.reward='+1 🧪';log('Исследование: найдено зелье.','good')}
  else if(roll<.82){const dmg=Math.max(1,4+Math.floor(f/3)-def());h.hp=Math.max(1,h.hp-dmg);r.reward='-'+dmg+' HP';log('Исследование: ловушка нанесла '+dmg+' урона.','combat')}
  else{const xp=6+f;gainXP(xp);r.reward='+'+xp+' XP';log('Исследование: найдено древнее знание. +'+xp+' XP.','good')}
}
function searchRoom(i){
  if(state.screen!=='explore'||!state.hero)return;
  const d=floorData(state.floor),r=d.rooms[i];if(!r||r.done)return;
  if(r.exit){r.done=true;d.exitFound=true;d.completed=true;r.reward='Путь открыт';log('Ты обнаружил скрытую лестницу на следующий этаж.','good')}
  else if(r.boss){log('Ты входишь в зал босса. Победа откроет путь наверх.','combat');saveExploration();save();enterFloor();return}
  else{r.done=true;rewardRoom(state.floor,r)}
  saveExploration();save();render()
}
function startFloorAscent(){
  const f=state.floor,d=floorData(f);
  if(f>=50){log('Ты достиг вершины Башни.','good');saveExploration();save();go('tower');return}
  if(!d.exitFound)return;
  state.floor=f+1;
  state.screen='tower';
  log('⬆️ Ты поднялся на этаж '+state.floor+'.','good');
  saveExploration();save();render()
}
function openExploration(){if(!state.hero||state.floor>50)return;floorData(state.floor);state.screen='explore';save();render()}
function explorationScreen(){
  const f=state.floor,d=floorData(f),count=exploredCount(f),total=d.rooms.length,pct=Math.floor(count/total*100),boss=!!BOSSES[f];
  return `<div class="card"><h2>🗺️ Этаж ${f}: исследование</h2><div class="notice"><b>${boss?'Опасный этаж босса':'Самостоятельная экспедиция'}</b><br><span class="muted">Исследуй этаж, принимай решения и найди путь наверх. Уже найденные места не повторяются.</span></div><div class="small muted">Исследовано: ${count}/${total} • ${pct}%</div><div class="bar" style="margin:7px 0 10px"><i style="width:${pct}%;background:var(--accent)"></i></div>${d.rooms.map((r,i)=>`<button class="choice ${r.done?'active':''}" ${r.done?'disabled':''} onclick="searchTowerRoom(${i})"><b>${r.title}${r.done?' ✅':''}</b><br><span class="small muted">${r.done?(r.reward||'Место исследовано.'):(r.desc)}</span></button>`).join('')}${d.exitFound?`<div class="notice"><b>🪜 Путь наверх найден.</b><br><span class="small muted">Ты можешь покинуть этаж и продолжить восхождение.</span></div>${f<50?`<button class="btn primary" onclick="startTowerAscent()">⬆️ Подняться на этаж ${f+1}</button>`:`<button class="btn primary" onclick="startTowerAscent()">🏆 Завершить покорение Башни</button>`}`:`<div class="notice"><span class="muted">🪜 Лестница пока не найдена. Продолжай исследование.</span></div>`}<button class="btn" onclick="go('tower')">↩️ Вернуться к этажу</button></div>`
}
const originalTower=tower;
window.tower=function(){const html=originalTower();if(!state.hero)return html;return html.replace(/<button class="btn primary" onclick="enterFloor\(\)">⬆️ Покорять этаж [^<]+<\/button>/,'<button class="btn primary" onclick="openExploration()">🗺️ Исследовать этаж '+state.floor+'</button>')}
const originalRender=render;
window.render=function(){if(state.screen==='explore'){document.getElementById('app').innerHTML=header()+`<main id="screen">${explorationScreen()}</main>`+'<footer><div class="grid3"><button class="btn" onclick="go(\'tower\')">🏰 Башня</button><button class="btn" onclick="go(\'character\')">👤 Герой</button><button class="btn" onclick="go(\'inventory\')">🎒 Инвентарь</button></div></footer>';return}return originalRender()}
window.searchTowerRoom=searchRoom;window.startTowerAscent=startFloorAscent;window.openExploration=openExploration;loadExploration()
})();
