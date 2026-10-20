/** Limited ground-state Aufbau/Hund/Pauli exercise for Z=1–20, not an ab initio solver. */
export type Spin = 'up' | 'down';
export type Subshell = { name:string; boxes:number; capacity:number };
export const SUBSHELLS:Subshell[] = [
  {name:'1s',boxes:1,capacity:2}, {name:'2s',boxes:1,capacity:2}, {name:'2p',boxes:3,capacity:6},
  {name:'3s',boxes:1,capacity:2}, {name:'3p',boxes:3,capacity:6}, {name:'4s',boxes:1,capacity:2}
];
export type State = Spin[][][];
export function blank():State{return SUBSHELLS.map(s=>Array.from({length:s.boxes},()=>[] as Spin[]));}
export function count(state:State){return state.flat(2).length;}
export function electronConfiguration(state:State){return state.map((boxes,i)=>{
 const n=boxes.reduce((total,box)=>total+box.length,0);return n?`${SUBSHELLS[i].name}${n}`:'';
}).filter(Boolean).join(' ');}
export function addSpin(state:State, shell:number, box:number,spin:Spin):{state:State;error?:string}{
 const subshell=SUBSHELLS[shell];
 if(!subshell || box<0 || box>=subshell.boxes)return {state,error:'Choose an available orbital box.'};
 const slots=state[shell][box];
 if(slots.length>=2)return {state,error:'Pauli exclusion: an orbital holds at most two electrons.'};
 if(slots.includes(spin))return {state,error:'Pauli exclusion: two electrons in one orbital must have opposite spins.'};
 if(state.slice(0,shell).some((boxes,i)=>boxes.flat().length<SUBSHELLS[i].capacity))return {state,error:'Aufbau principle: fill lower-energy subshells first.'};
 if(spin==='down' && state[shell].some(other=>other.length===0))return {state,error:'Hund’s rule: singly occupy equivalent orbitals before pairing.'};
 if(spin==='down' && slots.length!==1)return {state,error:'Place a spin-up electron first for this guided ground-state model.'};
 if(spin==='up' && slots.length!==0)return {state,error:'Choose an empty orbital for the first electron.'};
 // Align spins in degenerate p orbitals before any pairing.
 if(spin==='up' && state[shell].some((other,i)=>i<box&&other.length===0))return {state,error:'Place electrons into orbitals from left to right in this guided model.'};
 const next=state.map((s,i)=>s.map((b,j)=>i===shell&&j===box?[...b,spin]:[...b]));
 return {state:next};
}
export function groundState(z:number):State{
 let result=blank();
 for(let electron=0;electron<z;electron++){
  let placed=false;
  for(let shell=0;shell<SUBSHELLS.length&&!placed;shell++)for(let box=0;box<SUBSHELLS[shell].boxes&&!placed;box++){
   const spin:Spin=result[shell][box].length?'down':'up';
   const r=addSpin(result,shell,box,spin);
   if(!r.error){result=r.state;placed=true;}
  }
  if(!placed)throw new Error('Unable to fill electron state');
 }
 return result;
}
export function removeLast(state:State):State{
 const next=state.map(s=>s.map(b=>[...b]));
 for(let shell=next.length-1;shell>=0;shell--)for(let box=next[shell].length-1;box>=0;box--)if(next[shell][box].length){
  next[shell][box].pop();return next;
 }
 return next;
}
