'use client';
import { useEffect, useRef, useState, type DragEvent } from 'react';
import {
  BLOOD_ROUTE, DEFAULT_HEART_INPUTS, heartMeasurements, heartPhase,
  heartValves, makeEcgPoints, type HeartInputs,
} from './cardiac-engine';
import './cardiac.css';

const positions: Record<string, { x: number; y: number }> = {
  'right-atrium': { x: 220, y: 164 }, 'right-ventricle': { x: 240, y: 298 },
  'left-atrium': { x: 395, y: 164 }, 'left-ventricle': { x: 385, y: 298 },
  lungs: { x: 495, y: 80 }, body: { x: 105, y: 80 }, 'body-return': { x: 320, y: 52 },
};
const anatomy = [
  { key: 'right-atrium', label: 'Right atrium', fill: '#476fae', path: 'M 178 125 Q 208 108 253 122 L 261 195 Q 233 226 182 198 Z' },
  { key: 'right-ventricle', label: 'Right ventricle', fill: '#446ba2', path: 'M 180 204 Q 222 196 268 220 L 293 370 Q 237 359 203 314 Z' },
  { key: 'left-atrium', label: 'Left atrium', fill: '#bf5e73', path: 'M 355 125 Q 402 107 435 128 L 439 197 Q 393 222 360 196 Z' },
  { key: 'left-ventricle', label: 'Left ventricle', fill: '#ce596a', path: 'M 342 211 Q 387 193 442 206 L 430 315 Q 378 388 318 382 Z' },
] as const;
const descriptions: Record<string, string> = Object.fromEntries(BLOOD_ROUTE.map(p => [p.key, p.explanation]));
descriptions.tricuspid = 'The tricuspid valve prevents backward flow from the right ventricle into the right atrium during ventricular contraction.';
descriptions.mitral = 'The mitral valve separates the left atrium from the left ventricle. In this classroom model, a leak returns some stroke volume to the atrium.';
descriptions.aortic = 'The aortic valve opens during ventricular ejection and closes when the ventricle relaxes.';
descriptions.pulmonary = 'The pulmonary valve opens during right-ventricular systole, directing blood into the pulmonary artery.';

export default function CardiacWorkbench() {
  const [inputs, setInputs] = useState<HeartInputs>(DEFAULT_HEART_INPUTS);
  const [running, setRunning] = useState(true);
  const [time, setTime] = useState(0);
  const [selected, setSelected] = useState('left-ventricle');
  const [stepMode, setStepMode] = useState(false);
  const [observations, setObservations] = useState<string[][]>([]);
  const frame = useRef<number | null>(null);
  const last = useRef<number | null>(null);
  const values = heartMeasurements(inputs);
  const fraction = (time / values.beatDurationSeconds) % 1;
  const phase = heartPhase(fraction);
  const valves = heartValves(phase);
  const openValves = Object.entries(valves).filter(([, open]) => open).map(([valve]) => valve);
  const phaseLabel = phase.replaceAll('-', ' ');
  useEffect(() => {
    if (!running || stepMode) return;
    const tick = (stamp: number) => {
      const elapsed = last.current === null ? 0 : Math.min(0.07, (stamp - last.current) / 1000);
      last.current = stamp;
      setTime(t => t + elapsed);
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => { if (frame.current !== null) cancelAnimationFrame(frame.current); last.current = null; };
  }, [running, stepMode]);
  const set = (key: keyof HeartInputs, value: number) => setInputs(p => ({ ...p, [key]: value }));
  const sample = () => setObservations(rows => [...rows.slice(-199), [
    new Date().toISOString(), String(values.bpm), String(values.endDiastolicVolume),
    values.ejectionFraction.toFixed(2), values.leakageFraction.toFixed(2),
    values.forwardStrokeVolumeMl.toFixed(2), values.forwardOutputLMin.toFixed(3),
  ]]);
  const exportCsv = () => {
    const headers = ['Time', 'HR (bpm)', 'EDV (mL)', 'Ejection fraction', 'Regurgitant fraction', 'Forward SV (mL)', 'Forward CO (L/min)'];
    const content = [headers, ...observations].map(row => row.map(v => `"${v.replaceAll('"', '""')}"`).join(',')).join('\r\n');
    const url = URL.createObjectURL(new Blob(['\ufeff', content], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = 'openlab-cardiac-measurements.csv'; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 500);
  };
  const handleDrop = (event: DragEvent<SVGSVGElement>) => {
    event.preventDefault();
    const key = event.dataTransfer.getData('text/openlab-anatomy');
    if (descriptions[key]) setSelected(key);
  };
  const ecg = makeEcgPoints(0, 160);
  const path = ecg.map(p => `${p.x},${p.y}`).join(' ');
  const inspect = (key: string) => { setSelected(key); setRunning(false); };
  return <section className="cardiac-workbench" aria-label="Interactive cardiac physiology laboratory">
    <header className="cardiac-title"><div><span>CLASS 10–12 · BIOLOGY · PHYSIOLOGY</span><h2>Human Heart & Circulation Laboratory</h2><p>Follow one blood cell through double circulation. Observe cardiac phases, valve states, a schematic ECG, and the effect of changing heart rate or ventricular filling.</p></div><div className="cardiac-live"><span className={running ? 'live' : ''}>● {running ? 'RUNNING' : 'PAUSED'}</span><button type="button" onClick={() => { setTime(0); setInputs(DEFAULT_HEART_INPUTS); setObservations([]); setRunning(false); }}>↺ Reset experiment</button></div></header>
    <div className="cardiac-layout"><div className="cardiac-stage"><div className="cardiac-stageHeading"><b>ANATOMICAL CROSS-SECTION</b><span>Drag a probe from below or click a chamber to inspect</span></div>
      <svg viewBox="0 0 620 440" role="img" aria-label="Schematic of four heart chambers, valves, pulmonary and systemic circulation" onDragOver={e => e.preventDefault()} onDrop={handleDrop}>
        <defs><linearGradient id="cardiac-bg" x2="1" y2="1"><stop stopColor="#192e4c"/><stop offset="1" stopColor="#0c172b"/></linearGradient><marker id="cardiac-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto"><path d="M0 0 L6 3 L0 6" fill="none" stroke="#c7eaf9" strokeWidth="1.3"/></marker></defs>
        <rect width="620" height="440" rx="17" fill="url(#cardiac-bg)"/><path d="M142 136 C140 71 205 67 235 85 C273 38 366 48 396 96 C452 78 488 120 477 177 C498 217 455 343 371 392 Q323 419 295 392 C189 353 151 267 142 136Z" fill="#a65f80" opacity=".15" stroke="#f5c1c4" strokeWidth="4"/>
        <path d="M285 115 L301 380" stroke="#d0c5da" strokeWidth="13" strokeLinecap="round"/><path d="M309 116 L325 380" stroke="#9b8fac" strokeWidth="4" />
        {anatomy.map(c => <g key={c.key} role="button" tabIndex={0} aria-label={`Inspect ${c.label}`} onClick={() => inspect(c.key)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inspect(c.key); } }} className="cardiac-chamber"><path d={c.path} fill={c.fill} stroke={selected === c.key ? '#ffffff' : '#9bc3df'} strokeWidth={selected === c.key ? 5 : 2} fillOpacity=".88"/><text x={positions[c.key].x} y={positions[c.key].y} textAnchor="middle" fill="white" fontSize="15" fontWeight="800">{c.key === 'right-atrium' ? 'RA' : c.key === 'right-ventricle' ? 'RV' : c.key === 'left-atrium' ? 'LA' : 'LV'}</text></g>)}
        <g className="cardiac-vessels" fill="none" strokeWidth="13" strokeLinecap="round">
          <path stroke="#5c99cf" d="M90 50 L90 152 Q90 167 175 161"/>
          <path stroke="#5c99cf" d="M235 313 Q117 321 111 240 Q80 132 486 63"/>
          <path stroke="#f07c86" d="M493 62 Q543 103 468 142 L434 159"/>
          <path stroke="#e77b81" d="M385 305 Q550 337 542 142 Q537 45 340 45 L320 100"/>
        </g>
        <g fill="none" stroke="#eaf6ff" strokeWidth="5" strokeLinecap="round">
          <path d="M213 205 l32 0" opacity={valves.tricuspid ? 1 : .35}/><path d="M382 206 l35 0" opacity={valves.mitral ? 1 : .35}/><path d="M218 274 l33 0" opacity={valves.pulmonary ? 1 : .35}/><path d="M361 270 l33 0" opacity={valves.aortic ? 1 : .35}/>
        </g>
        <g fill="white" fontSize="12" fontWeight="700"><text x="20" y="42">Venae cavae</text><text x="466" y="40">Lungs</text><text x="448" y="390">To aorta</text><text x="16" y="412">Blue: oxygen-poor · Red: oxygen-rich</text></g>
        {[0,1,2,3].map((i) => {
          const t = (fraction + i / 4) % 1;
          const segment = Math.floor(t * 4);
          const pts = [[90, 150, 218, 164], [230, 280, 480, 70], [485, 90, 405, 166], [395, 290, 530, 150]][segment];
          const progress = t * 4 - segment;
          const x = pts[0] + (pts[2] - pts[0]) * progress;
          const y = pts[1] + (pts[3] - pts[1]) * progress;
          return <circle key={i} cx={x} cy={y} r="6" fill={segment < 2 ? '#8dccfa' : '#ffacb6'} stroke="white" strokeWidth="1.5"/>;
        })}
      </svg>
      <div className="cardiac-probes"><b>INSPECTION PROBES</b><div>{['right-atrium','right-ventricle','left-atrium','left-ventricle','tricuspid','mitral','aortic','pulmonary'].map(key => <button type="button" key={key} draggable onDragStart={e=>e.dataTransfer.setData('text/openlab-anatomy',key)} onClick={() => inspect(key)} className={selected === key ? 'active' : ''}>{key.replaceAll('-', ' ')}</button>)}</div></div>
      <div role="status" aria-live="polite" className="cardiac-inspection"><strong>{selected.replaceAll('-', ' ').toUpperCase()}</strong><p>{descriptions[selected]}</p></div>
    </div>
    <div className="cardiac-sidebar"><div className="cardiac-controlPanel"><h3>Experiment controls</h3>{([['heartRate','Heart rate',35,180,1,'bpm'],['endDiastolicVolume','Ventricular filling (EDV)',50,200,5,'mL'],['ejectionFraction','Ejection fraction',0.25,0.8,0.05,''],['mitralRegurgitation','Mitral regurgitant fraction',0,0.6,0.05,'']] as const).map(([key,label,min,max,step,unit])=><label key={key}><span>{label}<strong>{(inputs[key] as number).toFixed(step < 1 ? 2 : 0)} {unit}</strong></span><input type="range" aria-label={label} min={min} max={max} step={step} value={inputs[key]} onChange={e=>set(key,Number(e.target.value))}/></label>)}<div className="cardiac-buttons"><button type="button" onClick={() => { setStepMode(false); setRunning(v => !v); }}>{running ? 'Ⅱ Pause' : '▶ Play'}</button><button type="button" onClick={() => { setRunning(false); setStepMode(true); setTime(t => t + values.beatDurationSeconds * .1); }}>Step +10%</button><button type="button" onClick={() => {setRunning(false);setTime(0);}}>↺ Start beat</button></div><p className="cardiac-limits">The valve timing is schematic. Chamber volume and cardiac output illustrate conservation of volume, not a patient diagnosis.</p></div>
      <div className="cardiac-panel"><div className="cardiac-panelTitle"><span>PHASE OF CARDIAC CYCLE</span><b>{phaseLabel}</b></div><div className="cardiac-phaseMeter"><span style={{width:`${fraction*100}%`}}/></div><p><b>Open valves:</b> {openValves.length ? openValves.join(', ') : 'none (isovolumetric relaxation)'}</p><div className="cardiac-metrics"><div><small>Forward cardiac output</small><strong>{values.forwardOutputLMin.toFixed(2)} <em>L/min</em></strong></div><div><small>Forward stroke volume</small><strong>{values.forwardStrokeVolumeMl.toFixed(1)} <em>mL</em></strong></div><div><small>End-systolic volume</small><strong>{values.endSystolicVolumeMl.toFixed(1)} <em>mL</em></strong></div><div><small>Leakage per beat</small><strong>{values.regurgitantVolumeMl.toFixed(1)} <em>mL</em></strong></div></div></div>
      <div className="cardiac-panel"><div className="cardiac-panelTitle"><span>ECG · P–QRS–T</span><b>schematic</b></div><svg viewBox="0 0 540 125" role="img" aria-label="Schematic P QRS T electrocardiogram with moving cursor"><rect width="540" height="125" rx="12" fill="#0d2130"/>{[30,60,90].map(y=><line key={y} x1="12" y1={y} x2="528" y2={y} stroke="#2c5868" strokeWidth=".8"/>)}<polyline points={path} fill="none" stroke="#8ef0d3" strokeWidth="2.6"/><line x1={10+fraction*520} y1="9" x2={10+fraction*520} y2="113" stroke="#f7d084" strokeWidth="2"/><text x="20" y="115" fill="#c7dfed" fontSize="11">P</text><text x="120" y="115" fill="#c7dfed" fontSize="11">QRS</text><text x="250" y="115" fill="#c7dfed" fontSize="11">T</text></svg><p className="cardiac-limits">Electrical events precede mechanical contraction; this is an illustrative trace, not clinical ECG data.</p></div>
      <div className="cardiac-panel"><h3>Lab observations</h3><div className="cardiac-buttons"><button onClick={sample}>＋ Record measurements</button><button onClick={exportCsv} disabled={!observations.length}>↓ Export CSV ({observations.length})</button></div><p className="cardiac-limits">Try increasing heart rate, then hold it steady while reducing ejection fraction. Record how forward output changes. Introduce a mitral leak and compare effective forward flow.</p></div>
    </div></div>
    <section className="cardiac-explain"><h3>How to interpret your experiment</h3><p>Venous blood enters the right atrium, crosses the tricuspid valve into the right ventricle and is sent through the pulmonary circulation for gas exchange. Oxygen-rich blood returns through pulmonary veins to the left atrium, passes the mitral valve, and is pumped by the left ventricle into the aorta. The two sides work in series, so sustained forward flow must be balanced over time. During ventricular contraction the atrioventricular valves close while the semilunar valves open for ejection. In ventricular filling the pattern reverses. This simulation calculates cardiac output as heart rate multiplied by effective forward stroke volume; it does not simulate pressure–volume loops or myocardial electrophysiology.</p></section>
  </section>;
}
