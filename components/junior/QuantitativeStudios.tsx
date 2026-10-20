'use client';
import { useMemo, useState } from 'react';
import { downloadCsv, idealGas, titrationCurve, titrationPh } from './quantitative-engine';
import type { LabProps } from './junior-labs';
import './quantitative.css';

function Range({ label, value, min, max, step = 1, unit = '', update }: { label: string; value: number; min: number; max: number; step?: number; unit?: string; update: (v: number) => void }) {
  return <label className="qt-range"><span>{label}<b>{value.toFixed(step < 1 ? 2 : 0)} {unit}</b></span><input type="range" min={min} max={max} step={step} value={value} onChange={e => update(Number(e.target.value))}/></label>;
}
function downloadFile(name: string, contents: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const a = document.createElement('a'); a.href = url; a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1200);
}
export function TitrationStudio({ complete, addObservation }: LabProps) {
  const [acidM, setAcidM] = useState(.1), [acidMl, setAcidMl] = useState(25), [baseM, setBaseM] = useState(.1);
  const [addedMl, setAddedMl] = useState(0), [graph, setGraph] = useState(true);
  const reading = titrationPh(acidM, acidMl, baseM, addedMl);
  const equivalence = acidM * acidMl / baseM;
  const fullCurve = useMemo(() => titrationCurve(acidM, acidMl, baseM, Math.min(120, Math.max(60, equivalence * 2)), .25), [acidM, acidMl, baseM, equivalence]);
  const revealed = fullCurve.filter(p => p.addedMl <= addedMl + .0001);
  const points = (graph ? fullCurve : revealed).map(p => `${40 + (p.addedMl / fullCurve[fullCurve.length - 1].addedMl) * 510},${285 - p.ph / 14 * 244}`).join(' ');
  const reset = () => { setAddedMl(0); setAcidM(.1); setAcidMl(25); setBaseM(.1); };
  const dispense = (step: number) => { setAddedMl(v => Math.min(120, Math.max(0, Number((v + step).toFixed(2))))); complete(); };
  const pink = reading.ph > 8.2;
  return <div className="qt-root">
    <div className="qt-banner"><div><span>CHEMISTRY / VOLUMETRIC ANALYSIS</span><h2>Acid–base titration bench</h2><p>Operate a digital burette, observe a phenolphthalein endpoint, and measure the live pH curve.</p></div><span>MODEL · STRONG ACID + STRONG BASE</span></div>
    <div className="qt-grid"><section className="qt-panel qt-visual"><div className="qt-panelHead"><strong>MACRO LAB VIEW</strong><small>HCl in flask · NaOH in burette</small></div>
      <svg viewBox="0 0 620 460" role="img" aria-label={`Titration apparatus showing ${addedMl.toFixed(2)} milliliters sodium hydroxide delivered; solution pH ${reading.ph.toFixed(2)}`}>
        <defs><linearGradient id="qtGlass" x1="0" x2="1"><stop stopColor="#b7f0ff" stopOpacity=".4"/><stop offset=".7" stopColor="#a8ccef" stopOpacity=".08"/></linearGradient></defs>
        <path d="M90 391H530" stroke="#556780" strokeWidth="10" strokeLinecap="round"/><path d="M158 380V55H230" stroke="#91a4bc" strokeWidth="8" strokeLinecap="round"/>
        <rect x="290" y="24" width="45" height="280" rx="11" stroke="#96ccdf" strokeWidth="4" fill="url(#qtGlass)" />
        <rect x="299" y={38 + Math.min(1, addedMl / 120) * 245} width="27" height={Math.max(0,245 - Math.min(1, addedMl / 120)*245)} fill="#78bdea" opacity=".6"/>
        {Array.from({length:17},(_,i)=><path key={i} d={`M291 ${44+i*15}h${i%2?-8:-14}`} stroke="#d7eff8" strokeWidth="1"/>)}
        <path d="M312 304V346" stroke="#b1cce1" strokeWidth="5"/><path d="M285 323h54" stroke="#b1cce1" strokeWidth="6"/><path d="M312 346v17" stroke="#91d6f5" strokeWidth="3"/>
        {addedMl>0 && <circle cx="312" cy="369" r="5" fill="#88d0ff" className="qt-drop"/>}
        <path d="M264 358 L264 382 Q265 407 292 416 H363 Q389 406 390 382 L390 358 L348 358 L348 337 H306 L306 358Z" fill="url(#qtGlass)" stroke="#a5c8df" strokeWidth="4"/>
        <path d="M268 381Q325 374 385 381L381 388Q372 408 359 411H297Q282 408 273 391Z" fill={pink?'#f3a7d3':'#9bd5df'} opacity=".7"/>
        <text x="430" y="78" fill="#d9e8fc" fontSize="18">Burette</text><text x="430" y="103" fill="#9db9d4" fontSize="15">NaOH · {baseM.toFixed(2)} M</text>
        <text x="421" y="368" fill="#d9e8fc" fontSize="18">Conical flask</text><text x="421" y="393" fill="#9db9d4" fontSize="14">HCl · {acidMl} mL</text><text x="311" y="442" fill={pink?'#ffb2d9':'#b7e5e8'} fontWeight="700" fontSize="17" textAnchor="middle">{pink?'PINK INDICATOR':'COLOURLESS'}</text>
      </svg>
      <div className="qt-actions"><button onClick={() => dispense(.05)}>+ 1 drop (0.05 mL)</button><button onClick={() => dispense(.5)}>+ 0.5 mL</button><button onClick={() => dispense(2)}>+ 2 mL</button><button onClick={() => setAddedMl(0)}>Empty burette reading</button></div>
      <div className="qt-readouts"><div><small>DELIVERED</small><strong>{addedMl.toFixed(2)} mL</strong></div><div><small>pH</small><strong>{reading.ph.toFixed(2)}</strong></div><div><small>STOICHIOMETRIC POINT</small><strong>{equivalence.toFixed(2)} mL</strong></div></div>
    </section><section className="qt-panel qt-control"><div className="qt-panelHead"><strong>LIVE CONTROLS</strong><small>Change one variable at a time</small></div>
      <Range label="HCl concentration" value={acidM} min={.02} max={.3} step={.01} unit="M" update={setAcidM}/>
      <Range label="HCl volume" value={acidMl} min={10} max={50} unit="mL" update={setAcidMl}/>
      <Range label="NaOH concentration" value={baseM} min={.02} max={.3} step={.01} unit="M" update={setBaseM}/>
      <Range label="Delivered volume" value={addedMl} min={0} max={120} step={.05} unit="mL" update={v => {setAddedMl(v); complete();}}/>
      <div className="qt-micro"><strong>MOLECULAR INSPECTOR</strong><div className="qt-particles">{Array.from({length:24},(_,i)=><span key={i} className={i < Math.min(24,Math.ceil(Math.abs(reading.excessMmol)*5)) ? reading.excessMmol<0?'acid':'base':'water'} style={{left:`${(i*43+19)%91}%`,top:`${(i*31+23)%77}%`}}/>)}</div><p>{reading.excessMmol < -.00001 ? 'Excess H₃O⁺ remains after neutralization.' : reading.excessMmol > .00001 ? 'Excess OH⁻ remains after neutralization.' : 'Equal amounts of acid and base have reacted.'}</p><small>Particle dots indicate relative excess only; not molecular-scale simulation.</small></div>
      <div className="qt-actions"><button onClick={()=>setGraph(v=>!v)}>{graph?'Show collected data':'Show theoretical curve'}</button><button onClick={()=>downloadFile('openlab-titration.csv',downloadCsv(revealed),'text/csv;charset=utf-8')}>Export CSV ↓</button><button onClick={()=>addObservation(`HCl ${acidM}M × ${acidMl} mL titrated with ${baseM}M NaOH: delivered ${addedMl.toFixed(2)}mL; pH ${reading.ph.toFixed(2)}; equivalence ${equivalence.toFixed(2)}mL.`)}>Save notes</button><button onClick={reset}>Reset all</button></div>
    </section></div>
    <section className="qt-panel qt-graph"><div className="qt-panelHead"><strong>LIVE ANALYTICS / pH vs. NaOH added</strong><small>Ideal strong-acid/strong-base at 25°C</small></div><svg viewBox="0 0 620 325" role="img" aria-label="pH versus titrant volume graph"><rect x="40" y="22" width="510" height="263" rx="8" fill="#101d35"/>{[0,3.5,7,10.5,14].map(p=><g key={p}><line x1="40" x2="550" y1={285-p/14*244} y2={285-p/14*244} stroke="#536c8d" strokeDasharray="3 7"/><text x="31" y={290-p/14*244} textAnchor="end" fill="#abc5e2" fontSize="13">{p}</text></g>)}<polyline points={points} fill="none" stroke="#a3ecce" strokeWidth="3.5" strokeLinejoin="round"/><circle cx={40+addedMl/fullCurve[fullCurve.length-1].addedMl*510} cy={285-reading.ph/14*244} r="7" fill="#ffbd89" stroke="#fff" strokeWidth="2"/><text x="290" y="314" textAnchor="middle" fill="#cbdff7" fontSize="14">Added NaOH (mL)</text><text x="10" y="14" fill="#cbdff7" fontSize="14">pH</text></svg><p>Educational model: strong monoprotic acid and strong base, complete neutralization, ideal dilute solutions. Indicator turns pink above approximately pH 8.2; this is not a chemical safety assessment.</p></section>
  </div>;
}

export function GasLawStudio({ complete, addObservation }: LabProps) {
  const [temp, setTemp] = useState(298), [volume, setVolume] = useState(10), [moles, setMoles] = useState(.4);
  const state = idealGas(volume, temp, moles, 28.014);
  const danger = state.pressureKPa > 400;
  const atoms = useMemo(() => Array.from({length:56},(_,i)=>({x:(31+i*67)%280,y:(18+i*47)%250, phase:i*.31})),[]);
  return <div className="qt-root"><div className="qt-banner"><div><span>CHEMISTRY / PHYSICAL CHEMISTRY</span><h2>Gas laws: particle chamber</h2><p>Change volume, temperature and amount of gas to test PV = nRT.</p></div><span>MODEL · IDEAL N₂ GAS</span></div><div className="qt-grid"><section className="qt-panel qt-visual"><div className="qt-panelHead"><strong>VIRTUAL PISTON</strong><small>Particles visualize translational motion</small></div>
    <svg viewBox="0 0 560 385" role="img" aria-label={`Gas in ${volume} litre chamber at ${temp} Kelvin, pressure ${state.pressureKPa.toFixed(1)} kilopascals`}><rect x="70" y="45" width="365" height="285" fill="#0b1d30" stroke="#9ecbe1" strokeWidth="4" rx="12"/><rect x={80+volume*6} y="46" width="25" height="282" fill="#60718b" stroke="#c4d5ef" strokeWidth="3"/><path d={`M${103+volume*6} 180 h60`} stroke="#d9e5f8" strokeWidth="9"/>
    <clipPath id="gasClip"><rect x="77" y="50" width={volume*6} height="275"/></clipPath><g clipPath="url(#gasClip)">{atoms.slice(0,Math.round(25+moles*45)).map((p,i)=><circle className="qt-gasParticle" key={i} cx={77+(p.x/280)*volume*6} cy={55+p.y} r="4.5" fill={temp>400?'#ffd48e':'#8fe8f9'} style={{animationDuration:`${Math.max(.5,3/Math.sqrt(temp/298))}s`, animationDelay:`-${p.phase}s`}} />)}</g><text x="250" y="29" fill="#cee3fa" fontSize="17">{state.pressureKPa.toFixed(1)} kPa</text><text x="250" y="361" fill="#cee3fa" fontSize="15">{volume.toFixed(1)} L · {temp} K</text></svg><div className="qt-readouts"><div><small>PRESSURE</small><strong>{state.pressureKPa.toFixed(1)} kPa</strong></div><div><small>RMS SPEED</small><strong>{state.rmsSpeed.toFixed(0)} m/s</strong></div><div><small>PV / nT</small><strong>8.314</strong></div></div><div className={danger?'qt-warning':'qt-note'}>{danger?'⚠ Pressure exceeds this classroom chamber’s illustrative 400 kPa operating threshold. Pause and investigate.':'✓ Model remains inside the example chamber’s operating range.'}</div></section>
    <section className="qt-panel qt-control"><div className="qt-panelHead"><strong>CHANGE THE CONDITIONS</strong><small>Three variable experiment</small></div><Range label="Temperature" value={temp} min={180} max={650} unit="K" update={v=>{setTemp(v);complete();}}/><Range label="Chamber volume" value={volume} min={2} max={30} step={.5} unit="L" update={v=>{setVolume(v);complete();}}/><Range label="Amount of nitrogen" value={moles} min={.1} max={1.5} step={.05} unit="mol" update={v=>{setMoles(v);complete();}}/><div className="qt-micro"><strong>PARTICLE VIEW</strong><p>At constant n and V, pressure increases directly with absolute temperature. At constant n and T, increasing volume lowers pressure. The animation illustrates motion; pressure and speed are calculated from equations.</p><p>RMS molecular speed = √(3RT/M), with M = 28.014 g/mol for nitrogen.</p></div><div className="qt-actions"><button onClick={()=>downloadFile('openlab-gas-data.csv',`temperature_K,volume_L,moles,pressure_kPa,rms_speed_m_s\n${temp},${volume},${moles},${state.pressureKPa.toFixed(4)},${state.rmsSpeed.toFixed(2)}`,'text/csv;charset=utf-8')}>Export measurement ↓</button><button onClick={()=>addObservation(`Ideal nitrogen gas: T ${temp}K, V ${volume}L, n ${moles} mol, P ${state.pressureKPa.toFixed(2)}kPa.`)}>Save observation</button><button onClick={()=>{setTemp(298);setVolume(10);setMoles(.4);}}>Reset</button></div></section></div><p className="qt-disclaimer">Ideal-gas approximation: no intermolecular forces or real vessel failure is modeled. Temperature must remain above absolute zero; this is not a safe industrial-pressure simulator.</p></div>;
}
