'use client';
import { useCallback, useRef, useState, type PointerEvent } from 'react';
import './teacher.css';

type Point = { x: number; y: number };
type Stroke = { kind: 'stroke'; points: Point[]; color: string; size: number; id: number };
type Stamp = { kind: 'stamp'; x: number; y: number; name: StampName; color: string; id: number };
type Label = { kind: 'label'; x: number; y: number; text: string; color: string; id: number };
type Mark = Stroke | Stamp | Label;
type StampName = 'atom' | 'benzene' | 'water' | 'cell' | 'heart' | 'dna' | 'arrow';
type Tool = 'pen' | 'stamp' | 'text' | 'erase';
const names: { name: StampName; label: string; group: string }[] = [
  {name:'atom',label:'Atom + electron shells',group:'Chemistry'}, {name:'benzene',label:'Benzene ring',group:'Chemistry'},
  {name:'water',label:'Water / Lewis diagram',group:'Chemistry'}, {name:'arrow',label:'Reaction arrow',group:'Chemistry'},
  {name:'cell',label:'Plant cell',group:'Biology'}, {name:'heart',label:'Heart pathways',group:'Biology'}, {name:'dna',label:'DNA double helix',group:'Biology'}
];
const palettes = ['#e4f1ff','#8ce8d1','#fabf84','#caaaff','#f4819e','#ffe483','#60b6ff'];
const clamp = (x:number,lo:number,hi:number)=>Math.min(hi,Math.max(lo,x));
function Drawing({name,color}:{name:StampName;color:string}) {
  if(name==='atom')return <g stroke={color} fill="none" strokeWidth="2"><circle r="13" fill="#8b76ee"/><ellipse rx="63" ry="24" transform="rotate(-33)"/><ellipse rx="63" ry="24" transform="rotate(33)"/><ellipse rx="63" ry="24" transform="rotate(90)"/><circle cx="53" cy="-28" r="5" fill="#7fe6dc"/><circle cx="-20" cy="-54" r="5" fill="#7fe6dc"/></g>;
  if(name==='benzene')return <g stroke={color} fill="none" strokeWidth="3"><polygon points="0,-57 49,-28 49,28 0,57 -49,28 -49,-28"/><circle r="34" strokeDasharray="5 4"/><text y="85" fill={color} stroke="none" fontSize="14" textAnchor="middle">C₆H₆</text></g>;
  if(name==='water')return <g><path d="M0 3L-53 45 M0 3L53 45" stroke={color} strokeWidth="7" strokeLinecap="round"/><circle r="24" fill="#ef7e85"/><circle cx="-56" cy="48" r="17" fill="#e6efff"/><circle cx="56" cy="48" r="17" fill="#e6efff"/><text y="6" textAnchor="middle" fill="#1b263b" fontSize="15" fontWeight="700">O</text><text x="-56" y="54" textAnchor="middle" fill="#1b263b" fontSize="13">H</text><text x="56" y="54" textAnchor="middle" fill="#1b263b" fontSize="13">H</text><text x="-19" y="-25" fill={color}>••</text><text x="18" y="-25" fill={color}>••</text></g>;
  if(name==='arrow')return <g stroke={color} strokeWidth="4" fill="none"><path d="M-67 0H67l-20-18m20 18-20 18"/></g>;
  if(name==='cell')return <g strokeWidth="2"><rect x="-70" y="-63" width="140" height="126" rx="16" stroke="#86d3b3" fill="#193f43"/><rect x="-59" y="-52" width="118" height="104" rx="24" stroke="#9be6e0" fill="#22615b"/><ellipse cx="0" cy="0" rx="33" ry="22" fill="#6ba9d9" stroke="#c2e4ff"/><circle cx="-6" cy="-4" r="11" fill="#a8b5ee"/><g fill="#b1dd87" stroke="#dcf4c6"><ellipse cx="-41" cy="-28" rx="13" ry="7"/><ellipse cx="42" cy="-27" rx="13" ry="7"/><ellipse cx="-43" cy="28" rx="13" ry="7"/><ellipse cx="45" cy="30" rx="13" ry="7"/></g><text x="0" y="85" fontSize="14" textAnchor="middle" fill={color}>Plant cell · schematic</text></g>;
  if(name==='heart')return <g><path d="M0 62C-48 28-75-3-59-33C-45-64-12-53 0-33C25-64 62-59 69-29C77 6 37 40 0 62Z" fill="#e87f9a" stroke="#ffd0d8" strokeWidth="3"/><path d="M0-32V48 M-53-12H57" fill="none" stroke="#643e69" strokeWidth="3" strokeDasharray="5 5"/><path d="M-15-36V-78M-15-78H-45 M30-39V-73M30-73H55" stroke="#9de5fd" strokeWidth="9" fill="none"/><path d="M-6 42V-31" stroke="#b8eafb" strokeWidth="3"/><text x="-33" y="5" fill="#2c2742" fontSize="14">RA</text><text x="22" y="4" fill="#2c2742" fontSize="14">LA</text><text x="-33" y="37" fill="#2c2742" fontSize="14">RV</text><text x="19" y="37" fill="#2c2742" fontSize="14">LV</text><text x="0" y="90" fontSize="13" textAnchor="middle" fill={color}>Four chamber schematic</text></g>;
  return <g fill="none" strokeWidth="3">{Array.from({length:8},(_,i)=>{const y=-73+i*20,x=30*Math.sin(i*.75), x2=-x;return <g key={i}><path d={`M${x} ${y} L${x2} ${y}`} stroke="#9baaf9"/><circle cx={x} cy={y} r="4" fill="#8adfd5" stroke="none"/><circle cx={x2} cy={y} r="4" fill="#f3a5b0" stroke="none"/></g>})}<path d="M0-73Q70-32 0 8T0 67" stroke="#8adfd5"/><path d="M0-73Q-70-32 0 8T0 67" stroke="#f3a5b0"/><text x="0" y="94" fontSize="14" textAnchor="middle" fill={color} stroke="none">DNA · teaching schematic</text></g>;
}
function MarkView({mark}:{mark:Mark}){
  if(mark.kind==='stroke')return <polyline points={mark.points.map(p=>`${p.x},${p.y}`).join(' ')} fill="none" stroke={mark.color} strokeWidth={mark.size} strokeLinecap="round" strokeLinejoin="round"/>;
  if(mark.kind==='label')return <text x={mark.x} y={mark.y} fill={mark.color} fontSize="25" fontWeight="600">{mark.text}</text>;
  return <g transform={`translate(${mark.x} ${mark.y})`}><Drawing name={mark.name} color={mark.color}/></g>;
}
export default function TeacherBoard() {
  const [marks,setMarks] = useState<Mark[]>([]), [redo,setRedo] = useState<Mark[]>([]);
  const [tool,setTool] = useState<Tool>('pen'),[stamp,setStamp] = useState<StampName>('cell'),[color,setColor] = useState(palettes[0]),[size,setSize] = useState(4);
  const [label,setLabel] = useState('Label'),[title,setTitle] = useState('Science · classroom board');
  const surface = useRef<SVGSVGElement|null>(null),active = useRef(false), nextId = useRef(1), currentId=useRef<number|null>(null);
  const point = (e:PointerEvent<SVGSVGElement>):Point=>{const rect=surface.current!.getBoundingClientRect();return {x:clamp((e.clientX-rect.left)/rect.width*1200,0,1200),y:clamp((e.clientY-rect.top)/rect.height*690,0,690)};};
  const add=(mark:Mark)=>{setMarks(prev=>[...prev.slice(-499),mark]);setRedo([])};
  const start=(e:PointerEvent<SVGSVGElement>)=>{
    if(e.button!==0 && e.pointerType==='mouse')return;
    e.currentTarget.setPointerCapture(e.pointerId);active.current=true;
    const p=point(e),id=nextId.current++;
    if(tool==='pen'){currentId.current=id;add({kind:'stroke',id,color,size,points:[p]});}
    else if(tool==='stamp'){add({kind:'stamp',id,name:stamp,color,...p});}
    else if(tool==='text'){if(label.trim())add({kind:'label',id,text:label.trim().slice(0,90),color,...p});}
    else {setMarks(prev=>{if(!prev.length)return prev;const nearest=prev.map((m,i)=>({i,dist:m.kind==='stroke'?Math.min(...m.points.map(q=>Math.hypot(q.x-p.x,q.y-p.y))):Math.hypot(m.x-p.x,m.y-p.y)})).sort((a,b)=>a.dist-b.dist)[0];if(nearest.dist>85)return prev;return prev.filter((_,i)=>i!==nearest.i)});setRedo([]);}
  };
  const move=(e:PointerEvent<SVGSVGElement>)=>{if(!active.current||tool!=='pen'||currentId.current===null)return;const p=point(e);setMarks(prev=>prev.map(m=>m.kind==='stroke'&&m.id===currentId.current?{...m,points:m.points.length<2500?[...m.points,p]:m.points}:m));};
  const finish=()=>{active.current=false;currentId.current=null};
  const undo=()=>{if(!marks.length)return;setRedo(v=>[marks[marks.length-1],...v]);setMarks(marks.slice(0,-1));};
  const redoOne=()=>{if(!redo.length)return;setMarks(v=>[...v,redo[0]]);setRedo(v=>v.slice(1));};
  const exportSvg=useCallback(()=>{
    const svg=surface.current;if(!svg)return;
    const clone=svg.cloneNode(true) as SVGSVGElement;clone.setAttribute('xmlns','http://www.w3.org/2000/svg');clone.setAttribute('width','1200');clone.setAttribute('height','690');
    // Export deliberately contains only self-contained SVG geometry and text nodes.
    return new XMLSerializer().serializeToString(clone);
  },[]);
  const saveSvg=()=>{const data=exportSvg();if(!data)return;const uri=URL.createObjectURL(new Blob([data],{type:'image/svg+xml;charset=utf-8'}));const link=document.createElement('a');link.href=uri;link.download='openlab-teacher-board.svg';link.click();setTimeout(()=>URL.revokeObjectURL(uri),1000)};
  const savePng=()=>{const data=exportSvg();if(!data)return;const image=new Image();const uri=URL.createObjectURL(new Blob([data],{type:'image/svg+xml;charset=utf-8'}));image.onload=()=>{const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=690;const context=canvas.getContext('2d');if(context){context.drawImage(image,0,0);canvas.toBlob(blob=>{if(!blob)return;const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='openlab-teacher-board.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)},'image/png')}URL.revokeObjectURL(uri)};image.onerror=()=>URL.revokeObjectURL(uri);image.src=uri;};
  return <div className="teacher-root"><header className="teacher-header"><div><span>CLASSROOM WORKSPACE / CHEMISTRY + BIOLOGY</span><h1>Teacher drawing studio</h1><p>Freehand annotation, labelled scientific shapes and exportable teaching diagrams.</p></div><div className="teacher-actions"><button onClick={undo} disabled={!marks.length} title="Undo">↶ Undo</button><button onClick={redoOne} disabled={!redo.length}>↷ Redo</button><button onClick={saveSvg}>Export SVG ↓</button><button onClick={savePng}>Export PNG ↓</button></div></header>
    <div className="teacher-grid"><aside className="teacher-tools"><label>Slide title<input value={title} maxLength={80} onChange={e=>setTitle(e.target.value)}/></label><strong>DRAWING TOOL</strong><div className="teacher-toolsGrid">{(['pen','stamp','text','erase'] as Tool[]).map(t=><button key={t} className={tool===t?'active':''} onClick={()=>setTool(t)}>{t==='pen'?'✎':t==='stamp'?'⬡':t==='text'?'T':'⌫'} {t}</button>)}</div><strong>INK COLOURS</strong><div className="teacher-colors">{palettes.map(c=><button key={c} aria-label={`Select ink ${c}`} aria-pressed={color===c} onClick={()=>setColor(c)} style={{background:c,borderColor:color===c?'white':c}}/>)}</div><label>Pen width {size}px<input type="range" min="1" max="15" value={size} onChange={e=>setSize(Number(e.target.value))}/></label>
      {tool==='stamp' && <><strong>SCIENCE STENCILS</strong>{names.map(o=><button key={o.name} className={`teacher-stampChoice ${stamp===o.name?'active':''}`} onClick={()=>setStamp(o.name)}><small>{o.group}</small>{o.label}</button>)}</>}
      {tool==='text'&&<label>Annotation text<input value={label} maxLength={90} onChange={e=>setLabel(e.target.value)}/></label>}
      <p>Use mouse or stylus to draw. Choose a stencil, then click the board to place it. Select eraser and click a mark to remove it.</p><button className="teacher-clear" onClick={()=>{if(window.confirm('Clear this classroom board?')){setMarks([]);setRedo([])}}}>Clear board</button>
    </aside><section className="teacher-canvas"><div className="teacher-canvasBar"><span>01 / WHITEBOARD</span><strong>{marks.length} objects</strong></div><svg ref={surface} className="teacher-surface" viewBox="0 0 1200 690" role="img" aria-label="Interactive science whiteboard. Draw and place scientific stencils." onPointerDown={start} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish}>
        <rect x="0" y="0" width="1200" height="690" fill="#101d31"/>{Array.from({length:24},(_,i)=><line key={`v${i}`} x1={i*50} y1="0" x2={i*50} y2="690" stroke="#25384f" strokeWidth=".7"/>)}{Array.from({length:14},(_,i)=><line key={`h${i}`} x1="0" y1={i*50} x2="1200" y2={i*50} stroke="#25384f" strokeWidth=".7"/>)}<text x="48" y="70" fontSize="31" fontWeight="800" fill="#d8e6f7">{title}</text>
        {marks.map(m=><MarkView key={m.id} mark={m}/>)}
      </svg><div className="teacher-canvasBar"><span>✳ Scientific stencils are original simplified teaching illustrations, not anatomical scans.</span><span>{tool.toUpperCase()} ACTIVE</span></div></section></div><p className="teacher-notice">Open drawing tools do not establish teacher identity or permission. For schools, authentication, assignment sharing, student progress and protected classrooms still require backend implementation.</p>
  </div>;
}
