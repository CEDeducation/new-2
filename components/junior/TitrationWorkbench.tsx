'use client';

import { useMemo, useState, type DragEvent, type KeyboardEvent, type WheelEvent } from 'react';
import type { LabProps } from './junior-labs';
import { titrationCurve, titrationPh, type TitrationPoint } from './quantitative-engine';
import './titration-workbench.css';

type Tool = 'flask' | 'burette' | 'indicator' | 'probe';
const tools: { id: Tool; title: string; description: string; icon: string }[] = [
  { id: 'flask', title: 'HCl sample', description: '25 mL conical flask', icon: '⚗' },
  { id: 'burette', title: 'NaOH burette', description: 'Titrant and stopcock', icon: '♧' },
  { id: 'indicator', title: 'Indicator', description: 'Phenolphthalein', icon: '◉' },
  { id: 'probe', title: 'pH electrode', description: 'Digital measurement', icon: '⌁' }
];
const round = (n: number, digits = 2) => Number(n.toFixed(digits));
function saveCsv(filename: string, rows: TitrationPoint[]) {
  const csv = ['added_volume_mL,pH,excess_base_mmol', ...rows.map(row => `${row.addedMl.toFixed(2)},${row.ph.toFixed(4)},${row.excessMmol.toFixed(5)}`)].join('\n');
  const url = URL.createObjectURL(new Blob([csv], {type: 'text/csv;charset=utf-8'}));
  const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
}

/** The chemistry is calculated rather than keyed to a preset endpoint animation.
 *  Boundary: strong HCl/NaOH ideal dilute solutions, 25 °C; activity corrections excluded.
 */
export function TitrationWorkbench({ complete, addObservation }: LabProps) {
  const [installed, setInstalled] = useState<Tool[]>([]);
  const [acidM, setAcidM] = useState(.1);
  const [baseM, setBaseM] = useState(.1);
  const [acidMl, setAcidMl] = useState(25);
  const [delivered, setDelivered] = useState(0);
  const [data, setData] = useState<TitrationPoint[]>([]);
  const [showTheory, setShowTheory] = useState(false);
  const [feedback, setFeedback] = useState('Assemble the apparatus by dragging tools onto the bench, or select “Install”.');
  const [valve, setValve] = useState(1);
  const [hypothesis, setHypothesis] = useState('');
  const endpoint = acidM * acidMl / baseM;
  const apparatusReady = installed.length === tools.length;
  const endpointInRange = endpoint <= 120;
  const active = apparatusReady && endpointInRange;
  const canEdit = data.length === 0;
  const reading = titrationPh(acidM, acidMl, baseM, delivered);
  const pink = installed.includes('indicator') && reading.ph >= 8.2;
  const graphMax = Math.min(120, Math.max(40, Math.ceil(Math.max(endpoint * 1.5, delivered + 5) / 5) * 5));
  const theory = useMemo(() => titrationCurve(acidM, acidMl, baseM, graphMax, .25), [acidM, acidMl, baseM, graphMax]);
  const install = (item: string) => {
    if (!tools.some(t => t.id === item)) return;
    const tool = item as Tool;
    setInstalled(previous => previous.includes(tool) ? previous : [...previous, tool]);
    setFeedback(`${tools.find(t => t.id === tool)?.title} installed. ${installed.length >= 3 ? 'Ready to run!' : 'Install the remaining apparatus.'}`);
  };
  const reset = () => { setInstalled([]); setDelivered(0); setData([]); setValve(1); setFeedback('Bench reset. Assemble your apparatus and start a new trial.'); };
  const dispense = (quantity: number) => {
    if (!active) { setFeedback(!apparatusReady ? 'Pre-flight incomplete: install all four tools before adding titrant.' : 'Expected equivalence exceeds 120 mL. Increase NaOH molarity or decrease acid sample strength/volume.'); return; }
    if (delivered >= 120) { setFeedback('Burette capacity reached. Reset to begin another trial.'); return; }
    const next = round(Math.min(120, delivered + quantity), 2);
    setDelivered(next);
    const point = titrationPh(acidM, acidMl, baseM, next);
    setData(previous => [...previous, point]);
    const near = Math.abs(next - endpoint) <= .05;
    setFeedback(near ? 'Stoichiometric point reached. Examine the sudden rise in pH.' : next > endpoint ? 'Excess hydroxide remains. Watch the indicator and the graph.' : 'Record the pH. Reduce the drop size near the equivalence volume.');
    complete();
  };
  const handleKey = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLButtonElement) return;
    if (e.key.toLowerCase() === 'd') { e.preventDefault(); dispense(round(.05 * valve, 2)); }
    if (e.key.toLowerCase() === 'r') { e.preventDefault(); reset(); }
  };
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (!active) return;
    // Wheel down delivers a controlled drop; wheel up selects a finer valve.
    if (e.deltaY > 0) dispense(round(.05 * valve, 2));
    else setValve(previous => previous === 1 ? .5 : .2);
  };
  const onDrop = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); install(e.dataTransfer.getData('application/x-openlab-tool') || e.dataTransfer.getData('text/plain')); };
  const checklist = tools.map(t => ({ ...t, ok: installed.includes(t.id) }));
  const graphPoints = (showTheory ? theory : [{ ...titrationPh(acidM, acidMl, baseM, 0) }, ...data]).map(p => `${60 + p.addedMl / graphMax * 630},${305 - p.ph / 14 * 260}`).join(' ');
  const markerX = 60 + delivered / graphMax * 630;
  const markerY = 305 - reading.ph / 14 * 260;
  return <div className="twork" tabIndex={0} onKeyDown={handleKey}>
    <header className="twork-hero"><div><span className="twork-overline">CLASS 12 · VOLUMETRIC ANALYSIS · EXPERIMENT 18</span><h2>Build your titration experiment.</h2><p>Assemble your apparatus, titrate HCl with NaOH, then infer concentration from the pH curve. There are no pre-recorded endpoints.</p></div><span className="twork-status">{active ? '● READY / LIVE' : apparatusReady && !endpointInRange ? '⚠ ENDPOINT OUT OF RANGE' : `○ ${installed.length}/4 INSTALLED`}</span></header>
    <div className="twork-workspace"><section className="twork-main">
      <div className="twork-sectionTitle"><b>01 · Laboratory bench</b><small>Drag tools into the bench · click to install · scroll over the valve to dispense</small></div>
      <div className="twork-palette" aria-label="Laboratory apparatus palette">{tools.map(tool => <button key={tool.id} type="button" draggable onDragStart={e => { e.dataTransfer.effectAllowed = 'copy'; e.dataTransfer.setData('application/x-openlab-tool', tool.id); e.dataTransfer.setData('text/plain', tool.id); }} onClick={() => install(tool.id)} className={installed.includes(tool.id) ? 'is-installed' : ''}><span>{tool.icon}</span><strong>{tool.title}</strong><small>{installed.includes(tool.id) ? '✓ Installed' : tool.description}</small></button>)}</div>
      <div className="twork-bench" role="region" aria-label="Drop laboratory tools here" onDrop={onDrop} onDragOver={e => { e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; }}>
        <svg viewBox="0 0 760 475" role="img" aria-label={`Titration bench: ${delivered.toFixed(2)} mL NaOH delivered, pH ${reading.ph.toFixed(2)}`}>
          <defs><linearGradient id="tw-glass" x1="0" x2="1"><stop stopColor="#d5edff" stopOpacity=".33"/><stop offset=".5" stopColor="#7299bd" stopOpacity=".08"/><stop offset="1" stopColor="#bfeaff" stopOpacity=".33"/></linearGradient><linearGradient id="tw-liquid" x1="0" x2="0" y1="0" y2="1"><stop stopColor={pink ? '#ffd4e8' : '#b6ebf8'}/><stop offset="1" stopColor={pink ? '#ec78bb' : '#38adcb'}/></linearGradient></defs>
          <rect x="24" y="397" width="710" height="22" rx="11" fill="#47627b"/><rect x="55" y="420" width="17" height="46" fill="#47627b"/><rect x="687" y="420" width="17" height="46" fill="#47627b"/>
          {installed.includes('burette') ? <g><path d="M145 406V42H297" fill="none" stroke="#91a3b6" strokeWidth="11"/><rect x="294" y="25" width="54" height="294" rx="11" fill="url(#tw-glass)" stroke="#9dcce4" strokeWidth="4"/><rect x="302" y={40 + delivered / 120 * 262} width="38" height={Math.max(0,262 - delivered / 120 * 262)} fill="#4bb7ea" fillOpacity=".57"/>{Array.from({length:17},(_,i)=><path key={i} d={`M294 ${50 + i * 15}h${i%2 ? -8 : -16}`} stroke="#b0ddef" strokeWidth="1.5"/>)}<path d="M321 318V358" stroke="#c2e5f5" strokeWidth="6"/><path d="M295 340h50" stroke="#91a3b6" strokeWidth="7"/><text x="369" y="49" fill="#c7e5fb" fontSize="16">NaOH burette · {baseM.toFixed(2)} M</text><text x="365" y="74" fill="#9ac0d9" fontSize="15">{delivered.toFixed(2)} mL delivered</text></g> : <text x="165" y="174" fill="#9bb0c9" fontSize="17">Drop the burette here</text>}
          {installed.includes('flask') ? <g><path d="M274 335H314V364L261 396H397L348 364V335H382" fill="url(#tw-glass)" stroke="#b8ddef" strokeWidth="4"/><path d="M277 373Q323 362 383 373L390 390H268Z" fill="url(#tw-liquid)" opacity=".82"/><text x="416" y="357" fill="#d4e9fa" fontSize="15">HCl sample · {acidMl} mL</text><text x="416" y="381" fill={pink ? '#ffbadd' : '#a6ddea'} fontSize="15">{pink ? 'Indicator pink' : 'Colorless solution'}</text></g> : <text x="245" y="373" fill="#9bb0c9" fontSize="17">Drop the flask here</text>}
          {installed.includes('probe') && <g><path d="M383 90V372" stroke="#8df3cf" strokeWidth="5"/><rect x="369" y="75" width="29" height="49" rx="8" fill="#335e69" stroke="#8df3cf" strokeWidth="3"/><text x="410" y="113" fill="#8df3cf" fontSize="19">pH {reading.ph.toFixed(2)}</text></g>}
          {installed.includes('indicator') && <g><path d="M245 115l25-49 20 14-31 46z" fill="#e77ab0" stroke="#ffe3f0" strokeWidth="2"/><circle className="twork-droplet" cx="261" cy="137" r="8" fill="#f5a1cb"/><text x="120" y="62" fill="#eaa8d0" fontSize="15">Indicator added</text></g>}
          {installed.includes('burette') && delivered>0 && <g className="twork-droplet"><circle cx="321" cy="370" r="6" fill="#8fe2fc"/></g>}
          <text x="22" y="455" fill="#8faac2" fontSize="13">Educational apparatus schematic · not laboratory equipment certification</text>
        </svg>
        <div className="twork-benchOverlay"><span>DROP ZONE</span><strong>{active ? 'Apparatus assembled' : `${4 - installed.length} instruments remaining`}</strong></div>
      </div>
      <div className="twork-valve" onWheel={onWheel} title="Scroll over this control to deliver drops"><div><span className="twork-overline">BURETTE STOPCOCK</span><strong>Mouse wheel / D key / buttons</strong></div><button type="button" onClick={() => dispense(.05 * valve)} disabled={!active}>+ ONE DROP <small>{(.05 * valve).toFixed(2)} mL</small></button><button type="button" onClick={() => dispense(.5 * valve)} disabled={!active}>+ 0.5 mL</button><label>Fine valve ×<select value={valve} onChange={e => setValve(Number(e.target.value))}><option value="1">1.0</option><option value=".5">0.5</option><option value=".2">0.2</option></select></label></div>
      <div className="twork-readout" aria-live="polite"><div><small>DELIVERED</small><strong>{delivered.toFixed(2)} <i>mL</i></strong></div><div><small>LIVE pH</small><strong>{reading.ph.toFixed(2)}</strong></div><div><small>CALCULATED EQUIVALENCE</small><strong>{endpoint.toFixed(2)} <i>mL</i></strong></div><div><small>MEASUREMENTS</small><strong>{data.length}</strong></div></div>
      <div className="twork-sectionTitle"><b>02 · Plot the observations</b><button type="button" onClick={() => setShowTheory(v => !v)}>{showTheory ? 'Show my actual readings' : 'Overlay the theoretical curve'}</button></div>
      <svg className="twork-chart" viewBox="0 0 750 355" role="img" aria-label="Dynamic pH titration graph with measured points"><rect x="60" y="35" width="630" height="270" rx="9" fill="#0b1b2e"/>{[0,3.5,7,10.5,14].map(n=><g key={n}><line x1="60" x2="690" y1={305-n/14*260} y2={305-n/14*260} stroke="#31516c" strokeDasharray="4 7"/><text x="47" y={310-n/14*260} fill="#a0c6db" fontSize="14" textAnchor="end">{n}</text></g>)}<path d={`M60 305H690`} stroke="#c3d9ee" opacity=".8"/><polyline points={graphPoints} fill="none" stroke="#78e8c9" strokeWidth="4" strokeLinejoin="round"/>{data.map((p,i)=><circle key={i} cx={60+p.addedMl/graphMax*630} cy={305-p.ph/14*260} r="3.1" fill="#f1f6ff"/>)}<circle cx={markerX} cy={markerY} r="7" fill="#ffc293" stroke="white" strokeWidth="2"/><text x="375" y="347" fill="#bfd8eb" textAnchor="middle" fontSize="16">Volume NaOH added (mL) · 0–{graphMax}</text><text x="16" y="27" fill="#bfd8eb" fontSize="16">pH</text></svg>
    </section><aside className="twork-sidebar"><div className="twork-asideTitle"><span>PRE-FLIGHT</span><b>Set up the experiment</b></div><ul className="twork-checklist">{checklist.map(c=><li key={c.id}><span className={c.ok?'ok':''}>{c.ok?'✓':'○'}</span><div><b>{c.title}</b><small>{c.ok?'Ready':'Missing · drag onto bench'}</small></div><button type="button" onClick={() => install(c.id)} disabled={c.ok}>Install</button></li>)}</ul><div className="twork-settings"><h3>Prepare your sample</h3>{!endpointInRange && <p className="twork-invalid" role="alert">Pre-flight error: {endpoint.toFixed(1)} mL required, but the burette has a 120 mL trial limit. Adjust concentrations or sample size.</p>}<p>Concentrations are fixed after your first drop to preserve the integrity of recorded measurements.</p><label>HCl molarity <b>{acidM.toFixed(2)} M</b><input type="range" min=".02" max=".25" step=".01" value={acidM} disabled={!canEdit} onChange={e => setAcidM(Number(e.target.value))}/></label><label>HCl volume <b>{acidMl} mL</b><input type="range" min="10" max="50" step="5" value={acidMl} disabled={!canEdit} onChange={e => setAcidMl(Number(e.target.value))}/></label><label>NaOH molarity <b>{baseM.toFixed(2)} M</b><input type="range" min=".02" max=".25" step=".01" value={baseM} disabled={!canEdit} onChange={e => setBaseM(Number(e.target.value))}/></label></div>
      <div className="twork-micro"><h3>ATOMIC INSPECTOR</h3><p>{reading.excessMmol < -0.001 ? 'H₃O⁺ remains in excess after neutralization.' : reading.excessMmol > 0.001 ? 'OH⁻ remains in excess after neutralization.' : 'Acid and base have been supplied in equivalent amounts.'}</p><div className="twork-microfield">{Array.from({length:25},(_,i)=><span key={i} className={reading.excessMmol<-.001?'acid':reading.excessMmol>.001?'base':'balanced'} style={{left:`${10+(i*41)%79}%`,top:`${9+(i*33)%78}%`,animationDelay:`-${i*.13}s`}}/>)}</div><small>Conceptual species markers, not computed particle trajectories.</small></div>
      <div className="twork-hypothesis"><h3>Predict → observe → explain</h3><label htmlFor="twork-hypothesis">Your hypothesis</label><textarea id="twork-hypothesis" value={hypothesis} onChange={e=>setHypothesis(e.target.value.slice(0,800))} maxLength={800} placeholder="What should happen at the equivalence volume?" rows={3}/><p aria-live="polite">{feedback}</p></div>
      <div className="twork-buttons"><button type="button" onClick={() => saveCsv('openlab-jr-titration-readings.csv', [{...titrationPh(acidM, acidMl, baseM, 0)}, ...data])}>↓ Export measured CSV</button><button type="button" onClick={() => addObservation(`Titration: HCl ${acidM.toFixed(2)} M, ${acidMl} mL; NaOH ${baseM.toFixed(2)} M; added ${delivered.toFixed(2)} mL; pH ${reading.ph.toFixed(2)}; calculated equivalence ${endpoint.toFixed(2)} mL. Student hypothesis: ${hypothesis || 'none'}.`)}>＋ Save to lab notebook</button><button type="button" onClick={reset}>↺ Reset experiment (R)</button></div><small className="twork-boundary">Science boundary: ideal strong monoprotic acid/strong base at 25°C with complete neutralization. No activity coefficients, buffer chemistry, heat of mixing, or real laboratory hazard prediction. Students should not reproduce this without laboratory supervision.</small></aside></div>
  </div>;
}
