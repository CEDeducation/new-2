'use client';
import { useState, type DragEvent } from 'react';
import { SUBSHELLS, addSpin, blank, count, electronConfiguration, groundState, removeLast, type Spin, type State } from './aufbau-engine';
import type { LabProps } from './junior-labs';
import LabConceptCard from './LabConceptCard';
const targets=[{symbol:'C',name:'Carbon',z:6},{symbol:'N',name:'Nitrogen',z:7},{symbol:'O',name:'Oxygen',z:8},{symbol:'Ne',name:'Neon',z:10},{symbol:'Na',name:'Sodium',z:11},{symbol:'Cl',name:'Chlorine',z:17},{symbol:'Ca',name:'Calcium',z:20}];
export default function AufbauStudio({complete,addObservation}:LabProps){
 const [target,setTarget]=useState(targets[0]),[state,setState]=useState<State>(blank),[spin,setSpin]=useState<Spin>('up'),[notice,setNotice]=useState('Drag ↑ or ↓ into an orbital box. You can also select a spin and click a box.'),[flash,setFlash]=useState<string|null>(null);
 const electrons=count(state), goal=groundState(target.z);
 const correct=JSON.stringify(goal)===JSON.stringify(state);
 const insert=(shell:number,box:number,what:Spin)=>{
  if(electrons>=target.z){setNotice('The target atom already has all its electrons. Check the configuration or remove an electron.');return;}
  const result=addSpin(state,shell,box,what);
  if(result.error){setNotice(result.error);setFlash(`${shell}-${box}`);window.setTimeout(()=>setFlash(null),600);return;}
  setState(result.state);setNotice(`Placed ${what==='up'?'↑':'↓'} in ${SUBSHELLS[shell].name}. ${electrons+1}/${target.z} electrons.`);
  if(electrons+1===target.z&&JSON.stringify(result.state)===JSON.stringify(goal)){setNotice(`Correct! ${target.name} has ${electronConfiguration(result.state)}.`);complete();}
 };
 const drag=(e:DragEvent<HTMLButtonElement>,what:Spin)=>{e.dataTransfer.setData('application/x-openlab-spin',what);e.dataTransfer.setData('text/plain',what);e.dataTransfer.effectAllowed='copy';};
 return <div className="studio-content hands-root"><div className="hands-banner"><span>CLASS 11 · QUANTUM NUMBERS</span><h2>Aufbau orbital energy laboratory</h2><p>Construct real ground-state orbital occupancy for the first 20 elements. Every electron placement is checked against Aufbau ordering, Hund&apos;s rule and Pauli exclusion.</p></div>
  <div className="hands-orbitalLayout"><section className="hands-panel"><div className="hands-panelHead"><b>Orbital energy ladder</b><span>ENERGY ↑</span></div><div className="hands-orbitalChoices">{targets.map(el=><button key={el.symbol} className={target.z===el.z?'active':''} onClick={()=>{setTarget(el);setState(blank());setNotice(`Build ${el.name} from ${el.z} electrons.`);}}>{el.symbol} <small>{el.z}e⁻</small></button>)}</div>
     <div className="hands-spinRack"><span>DRAG ELECTRONS</span><button className={spin==='up'?'active':''} draggable onDragStart={e=>drag(e,'up')} onClick={()=>setSpin('up')}>↑ <small>Spin +½</small></button><button className={spin==='down'?'active':''} draggable onDragStart={e=>drag(e,'down')} onClick={()=>setSpin('down')}>↓ <small>Spin −½</small></button><small>Click a token to select, then click an orbital box. Keyboard accessible.</small></div>
     <div className="hands-energyLadder">{SUBSHELLS.map((sub,s)=> <div className="hands-orbitalRow" key={sub.name}>
       <span className="hands-energyIndex">{sub.name}<small>{sub.capacity} e⁻ max</small></span><div className="hands-orbitalBoxes">{state[s].map((cell,b)=> <button key={`${s}-${b}`} className={`hands-orbitalBox ${flash===`${s}-${b}`?'invalid':''} ${cell.length?'filled':''}`} aria-label={`${sub.name} orbital ${b+1}: ${cell.join(', ')||'empty'}`} onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect='copy';}} onDrop={e=>{e.preventDefault();const payload=e.dataTransfer.getData('application/x-openlab-spin');if(payload==='up'||payload==='down')insert(s,b,payload);}} onClick={()=>insert(s,b,spin)}>{cell.map((arrow,i)=><span key={i} className={arrow==='up'?'spinUp':'spinDown'}>{arrow==='up'?'↑':'↓'}</span>)}</button>)}</div><span className="hands-energyLevel">{state[s].flat().length}/{sub.capacity}</span>
     </div>)}</div>
     <div className="hands-bottom"><span role="status" className="hands-status">{notice}</span></div>
   </section><aside className="hands-panel hands-inspector"><div className="hands-panelHead"><b>Quantum inspector</b><small>{target.name} ({target.symbol})</small></div>
   <div className="hands-electronCount"><b>{electrons}</b><span>/ {target.z} electrons placed</span></div><div className="hands-progress"><span style={{width:`${electrons/target.z*100}%`}}/></div>
   <div className="hands-config"><small>YOUR CONFIGURATION</small><code>{electronConfiguration(state)||'No electrons yet'}</code><small>Target element: {target.name}, atomic number {target.z}</small></div>
   <div className="hands-rules"><h3>Three rules</h3><p><b>Aufbau</b> — fill lower-energy subshells before higher ones.</p><p><b>Hund</b> — occupy equal-energy orbitals singly before pairing.</p><p><b>Pauli</b> — maximum two electrons per orbital, with opposite spins.</p></div>
   <div className="hands-actions"><button onClick={()=>{if(correct){complete();setNotice('Validated. Ground-state configuration completed.');}else setNotice(`Not yet complete. ${electrons}/${target.z} electrons placed. Correct the orbital occupancy.`);}}>{correct?'✓ Validate configuration':'Check configuration'}</button><button className="secondary" onClick={()=>{setState(removeLast(state));setNotice('Last electron removed.');}}>↶ Remove last</button><button className="secondary" onClick={()=>{setState(blank());setNotice('Orbital boxes cleared.');}}>↺ Reset</button></div>
   {correct&&<p className="hands-success">✓ Electron configuration matches the ground-state model.</p>}
   <button className="hands-save" onClick={()=>addObservation(`${target.name} (${target.symbol}): ${electronConfiguration(state)}; ${electrons}/${target.z} electrons; correct=${correct}.`)}>+ Save configuration</button>
   </aside></div><div className="hands-explainer"><b>Scientific scope</b><p>This guided electron-box model illustrates ground-state configurations for atomic numbers 1–20. An orbital box represents an atomic orbital, not an electron&apos;s physical trajectory. Higher-Z exceptions and advanced electron correlation require models beyond this classroom exercise.</p></div>
 <LabConceptCard topic="aufbau" />
 </div>;
}
