'use client';

import { useEffect, useMemo, useState, type DragEvent } from 'react';
import type { LabProps } from './junior-labs';
import { DEFAULT_SETTINGS, FOODS, STAGES, digestFood, type FoodKey, type NutrientKey } from './digestion-engine';
import './digestion.css';

const NUTRIENTS: { key: NutrientKey; name: string; color: string }[] = [
  { key: 'carbohydrate', name: 'Carbohydrate', color: '#f6b56c' },
  { key: 'protein', name: 'Protein', color: '#a4a4f9' },
  { key: 'fat', name: 'Fat', color: '#73dcc2' },
];
const round = (n: number) => n.toFixed(1);
type Secretion = 'amylase' | 'pepsin' | 'pancreatic' | 'bile';
const SECRETIONS: {id: Secretion; name: string; compartment: string; target: number; note: string}[] = [
  {id:'amylase',name:'Salivary amylase',compartment:'Mouth',target:0,note:'Hydrolyses starch; it is not a protease.'},
  {id:'pepsin',name:'Pepsin',compartment:'Stomach',target:2,note:'A gastric protease that functions best in strongly acidic conditions.'},
  {id:'pancreatic',name:'Pancreatic enzymes',compartment:'Duodenum',target:3,note:'Amylase, lipase and proteases act in the lumen of the small intestine.'},
  {id:'bile',name:'Bile',compartment:'Duodenum',target:3,note:'Emulsifies fats; bile is not an enzyme.'}
];

/** Original teaching diagram: proportions and organ positions are illustrative, not diagnostic anatomy. */
function AnatomyDiagram({ active, labelled, onSelect, onSecretionDrop }: { active: number; labelled: boolean; onSelect: (value: number) => void; onSecretionDrop: (tool: string, index: number) => void }) {
  return (
    <svg viewBox="0 0 620 695" className="digest-anatomy" role="group" aria-label="Interactive human digestive anatomy, showing the mouth, esophagus, stomach, small intestine, colon, rectum and accessory glands">
      <defs>
        <linearGradient id="digest-skin" x2="1" y2="1"><stop stopColor="#e6b7a7"/><stop offset="1" stopColor="#b88289"/></linearGradient>
        <linearGradient id="digest-gut" x2="1" y2="1"><stop stopColor="#e9a8ab"/><stop offset="1" stopColor="#b86a88"/></linearGradient>
        <filter id="digest-shadow"><feDropShadow dx="0" dy="4" stdDeviation="8" floodOpacity=".25"/></filter>
      </defs>
      <path d="M253 30 Q187 31 185 97Q184 153 225 182L219 208 Q175 211 138 241Q105 277 91 346L80 460Q79 480 104 488Q128 493 138 471L163 381L166 648Q213 678 309 676Q402 673 452 643L455 380L486 472Q496 497 520 488Q543 476 530 448L510 331Q493 251 425 220L367 199L369 181Q413 143 417 99Q419 30 352 27Q308 0 253 30Z" fill="url(#digest-skin)" fillOpacity=".23" stroke="#b2bccc" strokeWidth="2.5"/>
      <path d="M224 98Q241 61 298 66Q362 58 380 101Q371 164 306 164Q241 165 224 98Z" fill="#ce9d8e" opacity=".38" />
      <path d="M274 119Q305 130 332 115" stroke="#fdd9ce" strokeWidth="9" fill="none" strokeLinecap="round"/>
      {/* Pharynx and esophagus are behind the liver and stomach. */}
      <path d="M298 137C292 164 293 190 296 224L303 265Q311 282 325 291" stroke="#8f506d" strokeWidth="27" strokeLinecap="round" fill="none" />
      <path d="M298 139C294 179 297 240 321 278" stroke="#f6b7b1" strokeWidth="15" strokeLinecap="round" fill="none" />
      {/* Liver is accessory: food never passes through it. */}
      <path d="M173 281Q242 238 329 286Q334 318 299 342Q231 352 184 325Z" fill="#874b57" stroke="#e4a2a2" strokeWidth="3" filter="url(#digest-shadow)"/>
      <path d="M275 328Q295 319 293 349Q286 366 278 350Z" fill="#7e9f60" stroke="#badc95" strokeWidth="2" />
      {/* Stomach and duodenum */}
      <path d="M332 262Q365 248 393 291Q419 343 386 368Q358 383 328 357Q305 338 329 310Q340 290 332 262Z" fill="url(#digest-gut)" stroke="#ffc6bd" strokeWidth="4"/>
      <path d="M370 352Q397 365 385 393Q370 411 346 408" stroke="#e8a0a2" strokeWidth="19" fill="none" strokeLinecap="round" />
      <path d="M291 368Q332 346 377 373Q362 390 312 389Z" fill="#e8bd76" stroke="#f8deb2" strokeWidth="3"/>
      {/* Large bowel with a visible ileocecal junction and descending colon. */}
      <path d="M214 424Q186 423 186 462L188 563Q189 600 223 599L395 600Q424 592 422 556L424 464Q420 432 393 432L254 430" stroke="#b26b70" strokeWidth="39" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      <path d="M214 424Q186 423 186 462L188 563Q189 600 223 599L395 600Q424 592 422 556L424 464Q420 432 393 432L254 430" stroke="#e6a3a3" strokeWidth="27" strokeLinejoin="round" strokeLinecap="round" fill="none" />
      {/* Small intestine is a continuous looping tube, not a row of circles. */}
      <path d="M349 408C306 408 248 414 242 457Q243 482 310 477Q375 472 376 498Q380 520 293 515Q239 512 236 540Q238 563 316 554Q380 545 370 570Q356 584 303 579Q267 576 262 591" stroke="#b96f78" strokeWidth="29" strokeLinecap="round" fill="none" />
      <path d="M349 408C306 408 248 414 242 457Q243 482 310 477Q375 472 376 498Q380 520 293 515Q239 512 236 540Q238 563 316 554Q380 545 370 570Q356 584 303 579Q267 576 262 591" stroke="#f3c5ae" strokeWidth="17" strokeLinecap="round" fill="none" />
      <path d="M303 588Q307 621 303 644" stroke="#b26b70" strokeWidth="24" strokeLinecap="round" />
      <path d="M303 588Q307 621 303 644" stroke="#f4c3b7" strokeWidth="13" strokeLinecap="round" />
      {/* Clickable organs and a moving food-bolus marker for selected stage. */}
      {STAGES.map((part, index) => (
        <g key={part.id} className={`digest-organ ${active === index ? 'active' : ''}`} role="button" tabIndex={0}
          aria-label={`Inspect ${part.name}`}
          onClick={() => onSelect(index)}
          onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; }}
          onDrop={event => { event.preventDefault(); onSecretionDrop(event.dataTransfer.getData('application/x-jr-secretion') || event.dataTransfer.getData('text/plain'), index); }}
          onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(index); } }}>
          {active === index && <circle cx={part.x} cy={part.y} r="28" fill="#7cebd1" fillOpacity=".13" stroke="#7cebd1" strokeWidth="2" className="digest-pulse" />}
          <circle cx={part.x} cy={part.y} r="17" fill={active === index ? '#7cebd1' : '#263c57'} stroke={active === index ? '#f0fff9' : '#b0c0d5'} strokeWidth="2.5" />
          <text x={part.x} y={part.y + 5} textAnchor="middle" fontSize="13" fontWeight="800" fill={active === index ? '#123442' : '#eff8ff'}>{index + 1}</text>
          {labelled && <g className="digest-label"><path d={`M${part.x + 17} ${part.y}H${index % 2 ? 495 : 462}`} stroke="#b6cad8" strokeWidth="1.3" strokeDasharray="3 4"/><text x={index % 2 ? 499 : 466} y={part.y - 6} fontSize="15" fill="#e8f1ff">{part.name}</text></g>}
        </g>
      ))}
      <g><circle cx={STAGES[active].x} cy={STAGES[active].y} r="6" fill="#fce19c" className="digest-bolus" pointerEvents="none"/></g>
      <text x="20" y="680" fill="#a9bcd3" fontSize="12">Educational schematic • accessory organs shown for context</text>
      <g className="digest-accessoryLabels" fill="#e2d7b8" fontSize="13"><text x="94" y="290">Liver</text><text x="94" y="306">(bile production)</text><text x="404" y="387">Pancreas</text><text x="404" y="403">(enzymes)</text></g>
    </svg>
  );
}

export function DigestionStudio({ complete, addObservation }: LabProps) {
  const [food, setFood] = useState<FoodKey>('meal');
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [labelled, setLabelled] = useState(true);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [mode, setMode] = useState<'anatomy' | 'experiment'>('anatomy');
  const [secretionFeedback, setSecretionFeedback] = useState('Put each secretion in the compartment where it normally acts.');
  const [secretionSteps, setSecretionSteps] = useState<Secretion[]>([]);
  const snapshot = useMemo(() => digestFood(FOODS[food], active, settings), [food, active, settings]);
  const stage = STAGES[active];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive(previous => Math.min(previous + 1, STAGES.length - 1)), 1800);
    return () => window.clearInterval(timer);
  }, [playing]);
  useEffect(() => { if (playing && active >= STAGES.length - 1) { setPlaying(false); complete(); } }, [active, playing, complete]);

  const choose = (index: number) => { setActive(index); setPlaying(false); complete(); };
  const update = (key: keyof typeof settings, value: number | boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    complete();
  };
  const placeSecretion = (item: string, index: number) => {
    const tool = SECRETIONS.find(x => x.id === item);
    if (!tool) return;
    if (tool.target !== index) {
      setSecretionFeedback(`${tool.name} does not normally enter the ${STAGES[index].name.toLowerCase()} as its site of action. Try ${tool.compartment}.`);
      return;
    }
    setActive(index); setPlaying(false);
    if (tool.id === 'amylase') update('salivaAmylase', true);
    if (tool.id === 'pepsin') update('pepsinAvailable', true);
    if (tool.id === 'pancreatic') update('pancreaticEnzymes', 100);
    if (tool.id === 'bile') update('bileAvailable', true);
    setSecretionSteps(v => v.includes(tool.id) ? v : [...v, tool.id]);
    setSecretionFeedback(`${tool.name} placed in ${tool.compartment}. ${tool.note}`);
  };
  const startEnzymeMission = () => {
    setMode('experiment'); setActive(0); setPlaying(false);
    setSettings({...DEFAULT_SETTINGS, salivaAmylase:false, pepsinAvailable:false, pancreaticEnzymes:0, bileAvailable:false});
    setSecretionSteps([]);
    setSecretionFeedback('Challenge started. Drag each secretion onto the correct organ compartment.');
  };
  const dropSecretion = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    placeSecretion(e.dataTransfer.getData('application/x-jr-secretion') || e.dataTransfer.getData('text/plain'),index);
  };
  return <div className="studio-content digest-root">
    <header className="digest-intro"><div><span className="studio-eyebrow">BIOLOGY / HUMAN BODY INTERACTIVE</span><h2>Inside the digestive system</h2><p>Trace a meal through your body, inspect organ anatomy, and change digestion conditions to see how illustrative nutrient processing responds.</p></div><span className="digest-live">● INTERACTIVE ANATOMY</span></header>
    <div className="digest-tabs"><button className={mode === 'anatomy' ? 'active' : ''} onClick={() => setMode('anatomy')}>◉ Explore anatomy</button><button className={mode === 'experiment' ? 'active' : ''} onClick={() => setMode('experiment')}>⚗ Enzyme experiment</button></div>
    <section className="digest-enzymeMission" aria-label="Hands-on enzyme placement challenge">
      <div className="digest-missionHeading"><div><span className="studio-eyebrow">HANDS-ON PHYSIOLOGY · CLASS 10–11</span><h3>Where do secretions actually work?</h3><p>Move an enzyme or bile from the tray to its normal site of action, including the numbered organ hotspot on the anatomical diagram. The nutrient-balance calculation changes immediately.</p></div><button type="button" onClick={startEnzymeMission}>↺ Begin enzyme challenge</button></div>
      <div className="digest-enzymePalette">{SECRETIONS.map(tool => <button type="button" key={tool.id} draggable onDragStart={e => {e.dataTransfer.effectAllowed='copy';e.dataTransfer.setData('application/x-jr-secretion',tool.id);e.dataTransfer.setData('text/plain',tool.id);}} onClick={() => placeSecretion(tool.id,tool.target)} className={secretionSteps.includes(tool.id)?'placed':''}><span>{secretionSteps.includes(tool.id)?'✓':'⠿'}</span><b>{tool.name}</b><small>{secretionSteps.includes(tool.id)?'Placed':'Drag to correct organ · click as alternative'}</small></button>)}</div>
      <div className="digest-enzymeTargets">{[0,2,3].map(index => <div key={index} role="group" aria-label={`Drop enzyme on ${STAGES[index].name}`} onDragOver={e => e.preventDefault()} onDrop={e => dropSecretion(e,index)}><strong>{STAGES[index].name}</strong><span>{index===0?'Salivary glands':index===2?'Gastric glands':'Pancreatic duct + bile duct'}</span><small>DROP HERE</small></div>)}</div>
      <p className="digest-enzymeFeedback" role="status">{secretionFeedback}</p>
    </section>
    <div className="digest-layout">
      <section className="digest-stage"><div className="digest-stageTop"><span>HUMAN DIGESTIVE TRACT</span><span>STAGE {active + 1} / {STAGES.length}</span></div>
        <AnatomyDiagram active={active} labelled={labelled} onSelect={choose} onSecretionDrop={placeSecretion} />
        <div className="digest-stageBottom"><label><input type="checkbox" checked={labelled} onChange={e => setLabelled(e.target.checked)}/> Show labels</label><span>Tap any numbered organ to inspect it</span></div>
      </section>
      <aside className="digest-panel">
        <div className="digest-panelHead"><span className="studio-eyebrow">{mode === 'anatomy' ? 'STRUCTURE + FUNCTION' : 'CHANGE THE CONDITIONS'}</span><h3>{mode === 'anatomy' ? stage.name : 'Digestion variables'}</h3><p>{mode === 'anatomy' ? stage.description : 'Adjust these parameters. The graph updates immediately; coefficients are intentionally illustrative, not measured absorption rates.'}</p></div>
        {mode === 'experiment' ? <div className="digest-controls">
          <label>Food example<select value={food} onChange={e => { setFood(e.target.value as FoodKey); choose(0); }}>{Object.entries(FOODS).map(([key, item]) => <option key={key} value={key}>{item.name}</option>)}</select></label>
          <label>Stomach pH <strong>{settings.stomachPH.toFixed(1)}</strong><input type="range" min="1" max="6" step="0.5" value={settings.stomachPH} onChange={e => update('stomachPH', Number(e.target.value))}/></label>
          <label>Pancreatic enzyme activity <strong>{settings.pancreaticEnzymes}%</strong><input type="range" min="0" max="100" step="10" value={settings.pancreaticEnzymes} onChange={e => update('pancreaticEnzymes', Number(e.target.value))}/></label>
          <label className="digest-toggle"><input type="checkbox" checked={settings.pepsinAvailable !== false} onChange={e => update('pepsinAvailable', e.target.checked)}/> Gastric pepsin available</label>
          <label className="digest-toggle"><input type="checkbox" checked={settings.bileAvailable} onChange={e => update('bileAvailable', e.target.checked)}/> Bile available for fat emulsification</label>
          <label className="digest-toggle"><input type="checkbox" checked={settings.salivaAmylase} onChange={e => update('salivaAmylase', e.target.checked)}/> Salivary amylase present</label>
          <button type="button" className="digest-reset" onClick={() => { setSettings(DEFAULT_SETTINGS); setSecretionSteps([]); setSecretionFeedback('Enzyme conditions reset.'); setFood('meal'); choose(0); }}>↺ Reset experiment</button>
        </div> : <><div className="digest-fact"><span>MAIN PROCESS</span><strong>{stage.short}</strong></div><div className="digest-fact"><span>RELATED STRUCTURE</span><strong>{stage.organ}</strong></div><label className="digest-foodChoice">Follow a food<select value={food} onChange={e => { setFood(e.target.value as FoodKey); choose(0); }}>{Object.entries(FOODS).map(([key, item]) => <option key={key} value={key}>{item.name}</option>)}</select></label></>}
        <div className="digest-path"><span>FOLLOW THE FOOD</span><div>{STAGES.map((part, index) => <button key={part.id} type="button" className={index === active ? 'active' : index < active ? 'done' : ''} onClick={() => choose(index)} title={part.name}>{index + 1}</button>)}</div></div>
        <div className="digest-playbar"><button onClick={() => choose(Math.max(0, active - 1))} disabled={active === 0}>← Back</button><button className="primary" onClick={() => { if (active === STAGES.length - 1) choose(0); else setPlaying(v => !v); }}>{playing ? 'Ⅱ Pause' : active === STAGES.length - 1 ? '↺ Restart' : '▶ Play passage'}</button><button onClick={() => choose(Math.min(active + 1, STAGES.length - 1))} disabled={active === STAGES.length - 1}>Next →</button></div>
        <button type="button" className="digest-save" onClick={() => addObservation(`${FOODS[food].name} at ${stage.name}. Illustrative absorbed nutrient mass ${round(snapshot.absorbed)} of ${snapshot.total} units. Stomach pH ${settings.stomachPH}; pancreatic activity ${settings.pancreaticEnzymes}%.`)}>＋ Send observation to notebook</button>
      </aside>
    </div>
    <section className="digest-results"><div className="digest-resultsHead"><div><span className="studio-eyebrow">LIVE DATA / EDUCATIONAL MODEL</span><h3>Where do nutrients go?</h3></div><div className="digest-total"><b>{round(snapshot.absorbed)}</b> / {snapshot.total} units absorbed in model</div></div>
      <div className="digest-nutrients">{NUTRIENTS.map(({ key, name, color }) => {
        const n = snapshot.nutrients[key];
        const base = FOODS[food][key] || 1;
        return <div className="digest-nutrient" key={key}><div className="digest-nutrientName"><b>{name}</b><span>{round(n.absorbed)} absorbed / {FOODS[food][key]} initial</span></div><div className="digest-bar" aria-label={`${name}: ${round(n.undigested)} undigested, ${round(n.absorbable)} absorbable, ${round(n.absorbed)} absorbed`}>
          <span style={{ width: `${n.undigested / base * 100}%`, background: '#647893' }} title="Undigested"/><span style={{ width: `${n.absorbable / base * 100}%`, background: color, opacity: .5 }} title="Absorbable"/><span style={{ width: `${n.absorbed / base * 100}%`, background: color }} title="Absorbed"/>
        </div></div>;
      })}</div><div className="digest-legend"><span><i style={{ background: '#647893' }}/> Undigested</span><span><i style={{ background: '#91c9d6', opacity: .5 }}/> Products not yet absorbed</span><span><i style={{ background: '#74dec5' }}/> Absorbed</span></div>
      <div className="digest-microLens"><div className="digest-microHeader"><b>MICRO VIEW · HYDROLYSIS AND ABSORPTION</b><small>{stage.name} · nutrient model</small></div><div className="digest-microScene" role="img" aria-label="Animated conceptual macronutrient breakdown and absorption markers">
        {Array.from({length:28},(_,i)=>{const nutrient=NUTRIENTS[i%3];const pool=snapshot.nutrients[nutrient.key];const fraction=pool.absorbed/Math.max(1,FOODS[food][nutrient.key]);return <span key={i} className={`digest-microParticle ${i/28 < fraction?'absorbed':'floating'}`} style={{left:`${(i*37+11)%94}%`,top:`${(i*19+14)%79}%`,background:nutrient.color,animationDelay:`-${i*.11}s`}}/>})}
        <div className="digest-microMembrane"><span>Intestinal epithelium</span></div>
      </div><p>This inset depicts hydrolysis/uptake conceptually, not molecular dynamics or measured absorption rates. The exact bars above are governed by the illustrative mass-conserving model.</p></div>
      <p className="digest-caveat"><strong>Scientific boundary:</strong> This is a mass-conserving conceptual model with illustrative reaction fractions. It does not model digestion timing, microbiome fermentation, individual metabolism, medical disease or clinical absorption percentages. Food never passes through the liver, gallbladder or pancreas.</p>
    </section>
  </div>;
}
