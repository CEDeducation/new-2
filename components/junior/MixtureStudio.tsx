'use client';
import { useEffect, useRef, useState, type PointerEvent } from 'react';
import { dragMagnet, inventory, makeIronSulfide, makeMixture } from './mixture-engine';
import type { LabProps } from './junior-labs';
import LabConceptCard from './LabConceptCard';

type Phase = 'unheated' | 'heating' | 'reacted';
export default function MixtureStudio({complete,addObservation}:LabProps){
 const [particles,setParticles]=useState(()=>makeMixture());
 const [magnet,setMagnet]=useState({x:365,y:76});
 const [phase,setPhase]=useState<Phase>('unheated');
  const [strength,setStrength]=useState(60);
 const [message,setMessage]=useState('Drag the magnet across the mixture. Iron moves toward it; sulfur does not.');
 const [layer,setLayer]=useState<'macro'|'micro'>('macro');
 const surface=useRef<SVGSVGElement|null>(null), dragging=useRef(false),previous=useRef({x:365,y:76});
 const reactionTimer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>()=>{if(reactionTimer.current!==null)clearTimeout(reactionTimer.current);},[]);
 const counts=inventory(particles);
 const update=(p:{x:number;y:number})=>{
  const pos={x:Math.max(50,Math.min(795,p.x)),y:Math.max(64,Math.min(420,p.y))};
  if(phase==='unheated')setParticles(cur=>dragMagnet(cur,pos.x,pos.y,previous.current,strength));
  previous.current=pos;setMagnet(pos);
  if(pos.x>695&&phase==='unheated')setMessage('Separator tray: magnetic iron can be collected here. Sulfur remains on the plate.');
 };
 const locate=(e:PointerEvent<SVGSVGElement>)=>{
  const box=surface.current!.getBoundingClientRect();return {x:(e.clientX-box.left)*840/box.width,y:(e.clientY-box.top)*470/box.height};
 };
 const onPointerDown=(e:PointerEvent<SVGSVGElement>)=>{
  if(phase!=='unheated')return;
  const p=locate(e);
  if(Math.hypot(p.x-magnet.x,p.y-magnet.y)>85)return;
  dragging.current=true;e.currentTarget.setPointerCapture(e.pointerId);update(p);
 };
 const heat=()=>{
  if(phase==='reacted')return;
  setPhase('heating');setMessage('Heating simulation: the remaining iron and sulfur combine in a 1:1 atomic ratio.');
  reactionTimer.current=window.setTimeout(()=>{reactionTimer.current=null;setParticles(old=>makeIronSulfide(old));setPhase('reacted');setMessage('Reaction completed: Fe + S → FeS. This is a particle-accounting teaching model.');complete();},1400);
 };
 const restart=()=>{if(reactionTimer.current!==null){clearTimeout(reactionTimer.current);reactionTimer.current=null;}setParticles(makeMixture());setMagnet({x:365,y:76});previous.current={x:365,y:76};setPhase('unheated');setMessage('New mixture loaded. Drag the magnet, or heat the mixture before separating it.');};
 return <div className="studio-content hands-root">
  <div className="hands-banner"><span>CLASS 9 · MATTER & SEPARATION</span><h2>Mixture or compound? Run the experiment.</h2><p>Move the magnet with your mouse. Observe which particles respond. Heat an unseparated portion to produce iron sulfide and compare its behavior.</p></div>
  <div className="hands-grid"><section className="hands-panel hands-visual">
   <div className="hands-panelHead"><b>Virtual separation bench</b><div className="hands-tabs"><button className={layer==='macro'?'active':''} onClick={()=>setLayer('macro')}>Macro</button><button className={layer==='micro'?'active':''} onClick={()=>setLayer('micro')}>Atomic view</button></div></div>
   <svg ref={surface} viewBox="0 0 840 470" className="hands-mixtureCanvas" role="img" aria-label="Magnetic iron and nonmagnetic sulfur powder in a tray. Drag the virtual magnet."
    onPointerDown={onPointerDown} onPointerMove={e=>{if(dragging.current)update(locate(e));}} onPointerUp={()=>{dragging.current=false;}} onPointerCancel={()=>{dragging.current=false;}}>
    <defs><pattern id="mix-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" stroke="#233953" strokeWidth="1" fill="none"/></pattern><radialGradient id="mix-iron"><stop stopColor="#d8e6f6"/><stop offset="1" stopColor="#5e7288"/></radialGradient></defs>
    <rect width="840" height="470" fill="#0d2034"/><rect width="840" height="470" fill="url(#mix-grid)" opacity=".7"/>
    <rect x="68" y="95" width="580" height="330" rx="35" fill="#1d3040" stroke="#6784a2" strokeWidth="4"/>
    <rect x="690" y="95" width="122" height="330" rx="18" fill="#172f3a" stroke="#69d9bf" strokeWidth="3" strokeDasharray="7 7"/>
    <text x="128" y="128" fill="#b0d0df" fontSize="16">MIXTURE TRAY</text><text x="705" y="128" fontSize="14" fill="#81e6cc">COLLECTOR</text>
    {particles.map(p=><g key={p.id} transform={`translate(${p.x} ${p.y})`} className="hands-mixParticle">
      {p.type==='FeS' ? <g><rect x="-11" y="-10" width="22" height="20" rx="4" fill="#474e63" stroke="#b4b4c8"/><circle cx="-4" cy="0" r="4" fill="#c4daef"/><circle cx="4" cy="0" r="4" fill="#e9c37e"/></g>
       : <circle r={layer==='micro'?10:5.7} fill={p.type==='Fe'?'url(#mix-iron)':'#e6bf64'} stroke={p.type==='Fe'?'#ebf2fa':'#ffdb91'} strokeWidth="1.7"/>}
      {layer==='micro'&&<text y="-13" textAnchor="middle" fontSize="10" fill="#fff">{p.type}</text>}
    </g>)}
    {phase==='unheated'&&<g transform={`translate(${magnet.x} ${magnet.y})`} className="hands-magnet"><rect x="-28" y="-27" width="56" height="43" rx="8" fill="#e3edf6" stroke="#0b1623" strokeWidth="3"/><rect x="-25" y="-21" width="25" height="31" rx="4" fill="#ed736f"/><rect x="0" y="-21" width="25" height="31" rx="4" fill="#63bbff"/><text y="-37" textAnchor="middle" fontSize="15" fill="#f2faff">DRAG MAGNET</text></g>}
    {phase!=='unheated'&&<g className={phase==='heating'?'hands-heatGlow':''}><rect x="170" y="414" width="380" height="18" rx="8" fill="#dd8a45"/><path d="M205 410Q225 367 246 410 M310 410Q337 357 366 410 M460 410Q481 365 505 410" fill="none" stroke="#ffc37c" strokeWidth="5"/></g>}
    {phase==='reacted'&&<text x="350" y="68" fill="#aee7da" textAnchor="middle" fontSize="22">Fe + S → FeS</text>}
   </svg>
   <div className="hands-bottom"><span className="hands-status" role="status">{message}</span><button onClick={()=>setLayer(v=>v==='macro'?'micro':'macro')}>Toggle scale ↗</button></div>
  </section><aside className="hands-panel hands-inspector"><div className="hands-panelHead"><b>Experimental controls</b><small>MODEL · FIXED COUNTS</small></div>
    <div className="hands-actions"><button onClick={heat} disabled={phase!=='unheated'||counts.freeIron===0||counts.freeSulfur===0}>🔥 Heat remaining mixture</button><button className="secondary" onClick={restart}>↺ New mixture</button></div>
    <label className="hands-range">Magnet strength <span>{strength}% · attraction reach</span><input type="range" value={strength} min="30" max="100" onChange={e=>setStrength(Number(e.target.value))}/></label>
    <div className="hands-readouts">{[
      ['Fe atoms',counts.ironAtoms],['S atoms',counts.sulfurAtoms],['Free Fe',counts.freeIron],['Free S',counts.freeSulfur],['FeS units',counts.compound],['Collected Fe',counts.separated],
    ].map(([label,v])=><div key={label}><span>{label}</span><b>{v}</b></div>)}</div>
    <div className="hands-equation"><small>ATOM ACCOUNTING</small><b>Fe + S → FeS</b><p>Each FeS unit consumes one iron and one sulfur atom. Collected iron is excluded from the heated mixture.</p><div className="hands-massBar"><span style={{width:`${counts.ironAtoms/(counts.ironAtoms+counts.sulfurAtoms)*100}%`}}/></div><span>Total Fe and S nuclei remain unchanged.</span></div>
    <button className="hands-save" onClick={()=>addObservation(`Mixtures and compounds: separated ${counts.separated} iron particles; ${counts.compound} FeS units formed; Fe atoms ${counts.ironAtoms}, S atoms ${counts.sulfurAtoms}.`)}>+ Save observation</button>
  </aside></div><div className="hands-explainer"><b>Why this matters</b><p>An ordinary iron–sulfur mixture contains two distinct substances. A magnet can separate the iron. Heating can produce iron(II) sulfide under suitable conditions; the new compound has different properties. The particles shown are an idealized atomic-accounting model, not a simulation of electronic bonding or realistic reaction kinetics. The slider shows a control concept and does not predict a measured magnetic force.</p></div>
 <LabConceptCard topic="mixtures" />
 </div>;
}
