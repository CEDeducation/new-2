'use client';
import {useState,type DragEvent} from 'react';
import type {LabProps} from './junior-labs';
import LabConceptCard from './LabConceptCard';
type Tool='peel'|'iodine'|'cover'|'slide';
const tools:{id:Tool;symbol:string;name:string;hint:string}[]=[
 {id:'peel',symbol:'▧',name:'Onion epidermis',hint:'Transfer a thin epidermal peel to a clean slide.'},
 {id:'iodine',symbol:'♢',name:'Iodine stain',hint:'Add a drop of stain to improve cellular contrast.'},
 {id:'cover',symbol:'▱',name:'Cover slip',hint:'Lower the cover slip carefully to avoid air bubbles.'},
 {id:'slide',symbol:'▭',name:'Prepared slide',hint:'Transfer the mounted slide onto the microscope stage.'}
];
export default function MicroscopeStudio({complete,addObservation}:LabProps){
 const [prepared,setPrepared]=useState<Tool[]>([]),[selected,setSelected]=useState<Tool>('peel');
 const [objective,setObjective]=useState(10),[focus,setFocus]=useState(40),[fine,setFine]=useState(0),[light,setLight]=useState(72);
 const [feedback,setFeedback]=useState('Start by dragging onion epidermis onto the glass slide.');
 const next=tools[prepared.length];
 const progress=prepared.length;
 const sharp=progress===4 && Math.abs(focus-66)+Math.abs(fine)*.45 < 13;
 const place=(tool:Tool)=>{
   if(progress===4){setFeedback('Your wet mount is prepared. Adjust coarse and fine focus.');return;}
   if(tool!==next.id){setFeedback(`Step ${progress+1}: ${next.hint}`);return;}
   setPrepared(prev=>[...prev,tool]);setFeedback(`${next.name} added. ${tools[progress+1]?.hint||'Move to the microscope and adjust focus.'}`);
 };
 const drag=(e:DragEvent<HTMLButtonElement>,tool:Tool)=>{e.dataTransfer.setData('application/x-openlab-tool',tool);e.dataTransfer.setData('text/plain',tool);e.dataTransfer.effectAllowed='move';};
 const onDrop=(e:DragEvent<HTMLElement>)=>{e.preventDefault();const t=e.dataTransfer.getData('application/x-openlab-tool') as Tool;if(tools.some(x=>x.id===t))place(t);};
 const clarity=progress===4?Math.min(1,Math.abs(focus-66)/38+Math.abs(fine)/80):.85;
 return <div className="studio-content hands-root">
   <div className="hands-banner"><span>CLASS 9 · CELL BIOLOGY & MICROSCOPY</span><h2>Prepare a slide. Focus a real experiment.</h2><p>Use laboratory tools in the correct sequence, place the wet mount on the stage, and adjust coarse and fine focus until cell walls and nuclei are identifiable.</p></div>
   <div className="hands-microscopeLayout"><section className="hands-panel"><div className="hands-panelHead"><b>Wet-mount preparation</b><small>DRAG TO GLASS SLIDE</small></div>
     <div className="hands-toolRack">{tools.map((t,i)=><button key={t.id} draggable onDragStart={e=>drag(e,t.id)} disabled={prepared.includes(t.id)} className={selected===t.id?'active':''} onClick={()=>setSelected(t.id)}><strong>{t.symbol}</strong><span>{t.name}</span><small>{prepared.includes(t.id)?'✓ Added':`Step ${i+1}`}</small></button>)}</div>
     <div className="hands-slideDrop" onDragOver={e=>{e.preventDefault();e.dataTransfer.dropEffect='move';}} onDrop={onDrop} role="group" aria-label="Virtual glass slide drop target">
       <svg viewBox="0 0 580 245" role="img" aria-label="Microscope wet mount slide"><defs><linearGradient id="microglass" x1="0" x2="1"><stop stopColor="#b8e5f8" stopOpacity=".55"/><stop offset="1" stopColor="#e0faff" stopOpacity=".15"/></linearGradient></defs><rect x="54" y="67" width="472" height="112" rx="13" stroke="#b4eaf2" strokeWidth="4" fill="url(#microglass)"/><text x="93" y="94" fill="#c2e9f7" fontSize="17">GLASS SLIDE</text>
        {progress>=1&&<path d="M205 111Q288 88 370 113T363 145Q283 162 200 143Z" fill="#9acda6" opacity=".7" stroke="#a6f6b3" strokeWidth="2"/>}
        {progress>=2&&<ellipse cx="289" cy="126" rx="98" ry="41" fill="#ba9052" opacity=".40"/>}
        {progress>=3&&<rect x="190" y="101" width="196" height="57" rx="4" fill="#a3e8fc" fillOpacity=".28" stroke="#e0faff" strokeWidth="3"/>}
        {progress===4&&<text x="286" y="220" textAnchor="middle" fill="#94eacb" fontSize="18">✓ Slide secured on microscope stage</text>}
       </svg>
       <button onClick={()=>place(selected)} disabled={progress===4}>{progress===4?'Slide prepared ✓':`Place ${tools.find(x=>x.id===selected)?.name} on slide`}</button>
     </div><div className="hands-bottom"><span role="status">{feedback}</span></div>
   </section><section className="hands-panel"><div className="hands-panelHead"><b>Microscope eyepiece</b><small>10× EYEPIECE · {objective}× OBJECTIVE</small></div>
    <div className="hands-eyepiece"><svg viewBox="0 0 520 340" role="img" aria-label={sharp?'Focused stained onion epidermal cells with cell walls and nuclei':'Microscopic specimen, not yet sharply focused'}>
     <defs><clipPath id="microcircle"><circle cx="260" cy="170" r="146"/></clipPath><filter id="microblur"><feGaussianBlur stdDeviation={clarity*13}/></filter></defs>
     <circle cx="260" cy="170" r="151" fill="#2b3850" stroke="#86b4c9" strokeWidth="8"/>
     <g clipPath="url(#microcircle)" filter={clarity>.03?'url(#microblur)':undefined}>
       <rect x="100" y="15" width="320" height="310" fill={progress>=2?'#c6ae81':'#c8dfc0'}/>
       {progress>=1?Array.from({length:48},(_,i)=>{const col=i%8,row=Math.floor(i/8),x=85+col*47+(row%2)*13,y=5+row*54;return <g key={i} opacity={.35+light/160}><rect x={x} y={y} width="48" height="56" rx="8" fill="#c7d9a6" stroke="#607b55" strokeWidth="3"/><ellipse cx={x+22} cy={y+30} rx="8" ry="6" fill={progress>=2?'#71506d':'#8ab49b'}/><path d={`M${x+3} ${y+8} Q${x+35} ${y+21} ${x+30} ${y+50}`} fill="none" stroke="#87a67d" strokeWidth="1.5"/></g>}) :<text x="260" y="160" fill="#425a68" textAnchor="middle" fontSize="17">Prepare the specimen first</text>}
     </g><circle cx="260" cy="170" r="151" fill="none" stroke="#e2e8ec" strokeWidth="9"/>
    </svg></div><div className="hands-magnification">Magnification: <b>{objective*10}×</b> · {sharp?'Focused specimen':progress<4?'Slide incomplete':'Adjust focus to sharpen'}</div>
    <div className="hands-rangeGrid"><label>Coarse focus <b>{focus}</b><input type="range" min="0" max="100" value={focus} onChange={e=>{setFocus(Number(e.target.value));if(prepared.length===4&&Math.abs(Number(e.target.value)-66)<9)complete();}}/></label><label>Fine focus <b>{fine}</b><input type="range" min="-30" max="30" value={fine} onChange={e=>setFine(Number(e.target.value))}/></label><label>Illumination <b>{light}%</b><input type="range" min="10" max="100" value={light} onChange={e=>setLight(Number(e.target.value))}/></label></div><div className="hands-actions"><button onClick={()=>setObjective(v=>v===10?40:10)}>Switch objective {objective===10?'to 40×':'to 10×'}</button><button className="secondary" onClick={()=>{setFocus(66);setFine(0);setLight(72);}}>Auto-focus (hint)</button></div>
   </section></div><div className="hands-explainer"><b>Microscopy notebook</b><p>Onion epidermis consists of densely arranged plant cells with visible cell walls. Iodine improves contrast in a wet mount. This generated microscope illustration is original and stylised, not a photograph or digital optics simulation. Total nominal magnification is the eyepiece magnification multiplied by the objective magnification.</p><button className="hands-save" onClick={()=>addObservation(`Onion epidermis microscopy: prepared ${progress}/4 steps, objective ${objective}×, total ${objective*10}×, focus ${focus}, fine adjustment ${fine}, focused=${sharp}.`)}>+ Save microscope record</button><button className="secondary" onClick={()=>{setPrepared([]);setSelected('peel');setFeedback('Begin with a clean slide and onion epidermis.');setFocus(40);setFine(0);}}>↺ New specimen</button></div>
 <LabConceptCard topic="microscope" />
 </div>;
}
