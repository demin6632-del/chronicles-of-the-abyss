/* Точечная интеграция победы над боссом с исследованием этажей. */
(function(){
'use strict';
const BRIDGE_KEY='chronicles_tower_boss_bridge_v1';
const EX_KEY='chronicles_tower_exploration_v4';
let pending=Number(localStorage.getItem(BRIDGE_KEY)||0);
function readData(){try{const x=JSON.parse(localStorage.getItem(EX_KEY));if(x&&x.floors)return x}catch(e){}return null}
function writeData(x){try{localStorage.setItem(EX_KEY,JSON.stringify(x))}catch(e){}}
function finishBoss(f){
  const x=readData(); if(!x||!x.floors||!x.floors[f]) return false;
  const d=x.floors[f];
  d.bossDefeated=true;
  d.exitFound=true;
  d.completed=true;
  const boss=d.rooms&&d.rooms.find(r=>r.boss);
  if(boss){boss.done=true;boss.reward='Босс побеждён';}
  writeData(x);
  pending=0;
  localStorage.removeItem(BRIDGE_KEY);
  if(typeof save==='function')save();
  return true;
}
function clearPending(){pending=0;localStorage.removeItem(BRIDGE_KEY)}
const oldSearch=window.searchTowerRoom;
if(typeof oldSearch==='function'){
  window.searchTowerRoom=function(i){
    try{
      if(state&&state.screen==='explore'){
        const x=readData(),d=x&&x.floors&&x.floors[state.floor],r=d&&d.rooms&&d.rooms[i];
        if(r&&r.boss&&!r.done){
          pending=state.floor;
          localStorage.setItem(BRIDGE_KEY,String(pending));
        }
      }
    }catch(e){}
    return oldSearch.apply(this,arguments);
  };
}
const oldRender=window.render;
window.render=function(){
  try{
    if(pending&&state&&state.hero){
      const pf=pending;
      if(state.floor>pf){
        finishBoss(pf);
      }else if(state.screen==='tower'&&state.floor===pf&&!state.enemy&&state.hero.hp>0){
        finishBoss(pf);
      }else if(state.screen==='tower'&&state.floor<pf){
        clearPending();
      }
    }
  }catch(e){}
  return oldRender.apply(this,arguments);
};
})();
