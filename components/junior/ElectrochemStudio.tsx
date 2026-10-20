'use client';
import {useState,type DragEvent} from 'react';
import {cellSummary} from './electrochem-engine';
import type {LabProps} from './junior-labs';
import LabConceptCard from './LabConceptCard';
export default function ElectrochemStudio({complete,addObservation}:LabProps){
 const [zinc,setZinc]=useState(.1),[copper,setCopper]=useState(1),[temp,setTemp]=useState(298.15);
 const [bridge,setBridge]=useState(false),[wire,setWire]=useState(true),[rLoad,setRLoad]=useState(30);
 const [log,setLog]=useState<{time:string;zinc:number;copper:number;emf:number}[]>([]);
 const [message,setMessage]=useState('Drag the salt bridge onto the two beakers to complete the ionic circuit.');
 const data=cellSummary(zinc,copper,temp),running=bridge&&wire&&data.spontaneous;
 // Not a kinetic/current-prediction engine. Load display is a labelled simplified E/R estimate.
 const current=running?data.potential/rLoad:0;
 const drop=(e:DragEvent<HTMLElement>)=>{e.preventDefault();if(e.dataTransfer.getData('text/plain')==='salt-bridge'){setBridge(true);setMessage('Salt bridge installed. Ions compensate charge as electrons travel from Zn to Cu.');complete();}};
 const save=()=>{setLog(rows=>[...rows.slice(-29),{time:new Date().toISOString(),zinc,copper,emf:data.potential}]);complete();};
 const exportCsv=()=>{
  const rows=[['timestamp','Zn2+_activity_approx_M','Cu2+_activity_approx_M','E_V'],...log.map(v=>[v.time,v.zinc,v.copper,v.emf.toFixed(6)])];
  const blob=new Blob([rows.map(r=>r.join(',')).join('\n')],{type:'text/csv'});const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='openlab-daniell-cell.csv';a.click();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
 };
 return <div className="studio-content hands-root"><div className="hands-banner"><span>CLASS 12 · ELECTROCHEMISTRY</span><h2>Build a Daniell cell. Measure its Nernst potential.</h2><p>Connect a zinc–copper galvanic cell using the salt bridge and external wire. Change ion activities and temperature to calculate the corresponding open-circuit electromotive force.</p></div><div className="hands-grid"><section className="hands-panel"><div className="hands-panelHead"><b>Electrochemical workbench</b><small>Zn │ Zn²⁺ ║ Cu²⁺ │ Cu</small></div>
  <div className="hands-cellDrop" onDragOver={e=>e.preventDefault()} onDrop={drop}>
   <svg viewBox="0 0 820 410" role="img" aria-label={`Zinc copper Daniell cell diagram, bridge ${bridge?'installed':'missing'}, EMF ${data.potential.toFixed(3)} volts`}>
    <defs><linearGradient id="cellZn" x1="0" x2="1"><stop stopColor="#a6b8c4"/><stop offset="1" stopColor="#495f6f"/></linearGradient><linearGradient id="cellCu" x1="0" x2="1"><stop stopColor="#e7a477"/><stop offset="1" stopColor="#ae5e31"/></linearGradient></defs>
    <rect width="820" height="410" fill="#10233b"/>
    {[[72,150],[478,150]].map(([x,y],i)=><g key={i}><rect x={x} y={y} width="264" height="200" rx="20" fill="#91bfd3" fillOpacity=".18" stroke="#9dc3df" strokeWidth="4"/><rect x={x+12} y={y+100} width="240" height="86" fill={i===0?'#b4cbdf':'#53a2ce'} opacity=".35"/><text x={x+132} y={y+240} fill="#b8dcec" fontSize="14" textAnchor="middle">{i===0?'ZnSO₄ (aq)':'CuSO₄ (aq)'}</text></g>)}
    <rect x="160" y="80" width="32" height="200" rx="5" fill="url(#cellZn)" stroke="#d4e2ed"/><rect x="622" y="80" width="32" height="200" rx="5" fill="url(#cellCu)" stroke="#ffd3b0"/>
    <text x="176" y="68" fontSize="16" fill="#dce6ee" textAnchor="middle">Zn anode (−)</text><text x="638" y="68" fontSize="16" fill="#ffbc8e" textAnchor="middle">Cu cathode (+)</text>
    {wire?<><path d="M176 80 V22 H636 V80" fill="none" stroke="#f6d8a0" strokeWidth="6" strokeLinecap="round"/><rect x="355" y="7" width="105" height="37" rx="8" fill="#132a42" stroke="#87ecd7" strokeWidth="2"/><text x="409" y="32" textAnchor="middle" fill="#98eedd" fontSize="16">V {data.potential.toFixed(2)}</text></>:<text x="409" y="35" fill="#f3b3b5" fontSize="15" textAnchor="middle">Open external circuit</text>}
    {bridge?<><path d="M288 230 V112 Q290 92 318 92 H504 Q531 92 531 112 V230" fill="none" stroke="#9dd4dc" strokeWidth="34"/><path d="M288 230 V112 Q290 92 318 92 H504 Q531 92 531 112 V230" fill="none" stroke="#a6f3d1" strokeWidth="17" strokeDasharray="8 12" className={running?'hands-currentFlow':''}/><text x="409" y="75" fill="#a2eadf" fontSize="13" textAnchor="middle">Salt bridge · ionic migration</text></>:<><rect x="332" y="81" width="160" height="46" rx="12" fill="#744c55" stroke="#fbb9a2" strokeDasharray="6 4"/><text x="412" y="110" fill="#fff" fontSize="16" textAnchor="middle">MISSING BRIDGE</text></>}
    {running&&<g className="hands-electronFlow"><circle cx="210" cy="22" r="8" fill="#75f2cd"/><circle cx="270" cy="22" r="8" fill="#75f2cd"/><circle cx="330" cy="22" r="8" fill="#75f2cd"/></g>}
    <text x="176" y="385" fill="#b5d2de" fontSize="16" textAnchor="middle">Zn → Zn²⁺ + 2 e⁻</text><text x="638" y="385" fill="#b5d2de" fontSize="16" textAnchor="middle">Cu²⁺ + 2 e⁻ → Cu</text>
   </svg>
   {!bridge?<button className="hands-saltBridge" draggable onDragStart={e=>{e.dataTransfer.setData('text/plain','salt-bridge');e.dataTransfer.effectAllowed='copy';}} onClick={()=>{setBridge(true);setMessage('Salt bridge installed.');complete();}}>⤴ Drag salt bridge onto beakers · or click to install</button>:<button className="hands-saltBridge removed" onClick={()=>setBridge(false)}>Remove salt bridge ↶</button>}
   <p role="status">{message}</p></div>
   <div className="hands-readouts hands-cellReadouts"><div><span>Open-circuit EMF</span><b>{data.potential.toFixed(3)} V</b></div><div><span>Reaction quotient Q</span><b>{data.quotient.toFixed(3)}</b></div><div><span>ΔG (per mol)</span><b>{data.gibbsKJ.toFixed(1)} kJ</b></div><div><span>Teaching I≈E/R</span><b>{(current*1000).toFixed(1)} mA</b></div></div>
  </section><aside className="hands-panel hands-inspector"><div className="hands-panelHead"><b>Concentration and measurements</b><small>IDEAL SOLUTION APPROX.</small></div><div className="hands-rangeGrid" style={{marginTop:20}}><label>Zn²⁺ activity proxy <b>{zinc.toFixed(2)} M</b><input type="range" min="0.05" max="2" step="0.05" value={zinc} onChange={e=>setZinc(Number(e.target.value))}/></label><label>Cu²⁺ activity proxy <b>{copper.toFixed(2)} M</b><input type="range" min="0.05" max="2" step="0.05" value={copper} onChange={e=>setCopper(Number(e.target.value))}/></label><label>Temperature <b>{temp.toFixed(0)} K</b><input type="range" min="283.15" max="333.15" step="5" value={temp} onChange={e=>setTemp(Number(e.target.value))}/></label><label>Resistance <b>{rLoad} Ω</b><input type="range" min="10" max="100" step="5" value={rLoad} onChange={e=>setRLoad(Number(e.target.value))}/></label></div>
   <div className="hands-actions"><button onClick={()=>{setWire(v=>!v);setMessage(!wire?'Wire reconnected.':'Wire disconnected.');}}>{wire?'Disconnect wire':'Connect wire'}</button><button className="secondary" onClick={()=>{setZinc(1);setCopper(1);setTemp(298.15);setWire(true);setBridge(false);setMessage('Standard conditions restored.');}}>Reset conditions</button></div>
   <div className="hands-equation"><small>NERNST EQUATION</small><b style={{fontSize:19}}>E = E° − RT/(2F) ln Q</b><p>Q ≈ a(Zn²⁺) / a(Cu²⁺). Standard E° = 1.10 V in this teaching reference model.</p></div>
   <div className="hands-actions"><button onClick={save}>+ Capture reading</button><button className="secondary" disabled={!log.length} onClick={exportCsv}>↓ Export {log.length} readings CSV</button></div><p style={{padding:'0 20px',color:'#bed6e4',fontSize:12}}>This is a thermodynamic EMF model, not a predictive kinetic, electrode-polarization or real current simulator. I≈E/R ignores internal resistance and overpotentials.</p>
   <button className="hands-save" onClick={()=>addObservation(`Daniell cell: E ${data.potential.toFixed(4)} V; Q ${data.quotient.toFixed(3)}; [Zn2+] ${zinc} M, [Cu2+] ${copper} M, bridge=${bridge}.`)}>+ Save observation</button>
  </aside></div><LabConceptCard topic="electrochem" /></div>;
}
