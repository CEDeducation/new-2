'use client';
import { useMemo, useState, type DragEvent } from 'react';
import type { LabProps } from './junior-labs';
type AtomSpec = {
  symbol: string;
  name: string;
  protons: number;
  valence: number;
};
type IonicMission = {
  id: string;
  name: string;
  formula: string;
  metal: AtomSpec;
  nonmetals: AtomSpec[];
  description: string;
  lesson: string;
};
const MISSIONS: IonicMission[] = [
  { id: 'nacl', name: 'Sodium chloride', formula: 'NaCl', metal: { symbol: 'Na', name: 'Sodium', protons: 11, valence: 1 }, nonmetals: [{ symbol: 'Cl', name: 'Chlorine', protons: 17, valence: 7 }], description: 'Transfer the single valence electron from sodium to chlorine.', lesson: 'Na loses 1 electron and becomes Na⁺. Cl gains 1 and becomes Cl⁻. Solid NaCl forms a three-dimensional ionic lattice; it is not a separate NaCl molecule.' },
  { id: 'mgo', name: 'Magnesium oxide', formula: 'MgO', metal: { symbol: 'Mg', name: 'Magnesium', protons: 12, valence: 2 }, nonmetals: [{ symbol: 'O', name: 'Oxygen', protons: 8, valence: 6 }], description: 'Oxygen needs two electrons. Transfer both valence electrons from magnesium.', lesson: 'Mg loses 2 electrons to form Mg²⁺, while O gains 2 to form O²⁻. The simplest integer formula ratio is 1 Mg : 1 O.' },
  { id: 'cacl2', name: 'Calcium chloride', formula: 'CaCl₂', metal: { symbol: 'Ca', name: 'Calcium', protons: 20, valence: 2 }, nonmetals: [{ symbol: 'Cl', name: 'Chlorine', protons: 17, valence: 7 }, { symbol: 'Cl', name: 'Chlorine', protons: 17, valence: 7 }], description: 'Calcium has two outer electrons. Give one electron to each chlorine atom.', lesson: 'Ca becomes Ca²⁺ and each Cl becomes Cl⁻. Charge neutrality requires a 1:2 ratio of Ca²⁺ to Cl⁻ in CaCl₂.' },
];
function outerFill(total: number) {
  const n: number[] = []; for (const cap of [2, 8, 8, 2]) {
    if (total <= 0)
      break;
    const f = Math.min(cap, total);
    n.push(f);
    total -= f;
  } return n;
}
function IonOrbital({ protons, electrons, symbol }: {
  protons: number;
  electrons: number;
  symbol: string;
}) { const shells = outerFill(electrons); const charge = protons - electrons; return <svg className="studio-ionicOrbital" viewBox="0 0 220 220" role="img" aria-label={`${symbol}, ${protons} protons, ${electrons} electrons. Charge ${charge}`}><defs><radialGradient id="ionicNucleus"><stop stopColor="#b4adff" /><stop offset="1" stopColor="#4c4a9c" /></radialGradient></defs>{shells.map((n, i) => { const r = 35 + i * 24; return <g key={i}><circle cx="110" cy="110" r={r} fill="none" stroke={i === shells.length - 1 ? '#6be5d0' : '#4b5b84'} strokeWidth="1.5" strokeDasharray={i === shells.length - 1 ? '0' : '4 6'} />{Array.from({ length: n }, (_, j) => { const a = 2 * Math.PI * j / n - Math.PI / 2; return <circle key={j} cx={110 + r * Math.cos(a)} cy={110 + r * Math.sin(a)} r={i === shells.length - 1 ? 5 : 3.7} fill={i === shells.length - 1 ? '#83ffe1' : '#8ba6ea'} stroke="#14213a" strokeWidth="1.5" />; })}</g>; })}<circle cx="110" cy="110" r="24" fill="url(#ionicNucleus)" /><text x="110" y="114" textAnchor="middle" fontSize="15" fontWeight="950" fill="white">{symbol}</text><text x="110" y="212" textAnchor="middle" fill="#a6bcda" fontSize="10">{shells.join(' · ')} e⁻ / shell</text></svg>; }
function chargeLabel(z: number, e: number) { const n = z - e; return n === 0 ? 'neutral' : n > 0 ? `${n === 1 ? '' : n}+` : `${Math.abs(n) === 1 ? '' : Math.abs(n)}−`; }
export function IonicStudio({ complete, addObservation }: LabProps) {
  const [id, setId] = useState('nacl');
  const [received, setReceived] = useState<number[]>([0]);
  const [error, setError] = useState('');
  const [checked, setChecked] = useState(false);
  const mission = MISSIONS.find(m => m.id === id)!;
  const transferred = received.reduce((a, b) => a + b, 0), remaining = mission.metal.valence - transferred;
  const completeMission = remaining === 0 && mission.nonmetals.every((x, i) => received[i] === 8 - x.valence);
  const choose = (target: IonicMission) => { setId(target.id); setReceived(target.nonmetals.map(() => 0)); setError(''); setChecked(false); };
  const transfer = (index: number) => {
    if (remaining <= 0) {
      setError('The metal has no valence electrons left to give.');
      return;
    } const nonmetal = mission.nonmetals[index]; if (received[index] >= 8 - nonmetal.valence) {
      setError('This nonmetal has gained the electrons needed in this simple octet model.');
      return;
    } setReceived(r => r.map((v, i) => i === index ? v + 1 : v)); setError('Electron transferred — inspect how both ion charges changed.'); setChecked(false); complete();
  };
  const drag = (e: DragEvent<HTMLButtonElement>) => { e.dataTransfer.setData('text/plain', 'ionic-electron'); e.dataTransfer.effectAllowed = 'move'; };
  const donorElectrons = mission.metal.protons - transferred;
  const inspect = () => {
    setChecked(true); setError(completeMission ? `Correct! ${mission.formula} is electrically neutral in the shown simplest ion ratio.` : `Not yet. ${remaining} electron${remaining === 1 ? '' : 's'} still need${remaining === 1 ? 's' : ''} to be transferred.`); if (completeMission)
      complete();
  };
  const sumCharge = mission.metal.protons - donorElectrons + mission.nonmetals.reduce((s, m, i) => s + m.protons - (m.protons + received[i]), 0);
  const facts = useMemo(() => [`${mission.metal.symbol}: ${mission.metal.protons} protons`, ...mission.nonmetals.map((a, i) => `${a.symbol}${i + 1}: ${a.protons} protons`)], [mission]);
  return <div className="studio-content studio-ionicNewRoot"><div className="studio-bondingIntro"><div><span className="studio-eyebrow">CHEMISTRY / ELECTRON TRANSFER</span><h2>Make an ion. Build an ionic compound.</h2><p>Drag or tap real valence-electron tokens from a metal to nonmetals. Watch electron counts, charge and formula ratios change.</p></div><span className="studio-bondingVersion">BOHR SHELL TEACHING MODEL</span></div><div className="studio-ionicMissionPicker">{MISSIONS.map(m => <button key={m.id} className={id === m.id ? 'active' : ''} onClick={() => choose(m)}><b>{m.formula}</b><span>{m.name}</span></button>)}</div><div className="studio-ionicNewGrid"><div className="studio-ionicNewBoard"><div className="studio-bondingCanvasHead"><span><i /> ELECTRON TRANSFER ARENA</span><span>{transferred} / {mission.metal.valence} ELECTRONS TRANSFERRED</span></div><div className="studio-ionicNewChallenge"><strong>{mission.description}</strong><span>Charge always comes from protons − electrons</span></div><div className="studio-ionicNewAtoms"><div className="studio-ionicNewDonor"><div className="studio-ionicNewAtomTop">METAL · ELECTRON DONOR</div><IonOrbital protons={mission.metal.protons} electrons={donorElectrons} symbol={mission.metal.symbol} /><div className="studio-ionicNewCaption"><b>{mission.metal.symbol}<sup>{chargeLabel(mission.metal.protons, donorElectrons) === 'neutral' ? '' : chargeLabel(mission.metal.protons, donorElectrons)}</sup></b><span>{donorElectrons} electrons</span></div><div className="studio-ionicNewTokens">{Array.from({ length: remaining }, (_, i) => <button key={i} draggable onDragStart={drag} onClick={() => {
    const j = mission.nonmetals.findIndex((a, k) => received[k] < 8 - a.valence); if (j >= 0)
      transfer(j);
  }} aria-label="Transfer one metal valence electron to an available nonmetal" title="Drag to a receiver, or tap to transfer">e⁻ <small>drag / tap</small></button>)}{!remaining && <span className="studio-ionicNewEmpty">✓ All outer electrons donated</span>}</div></div><div className="studio-ionicNewArrow">⟶<span>TRANSFER</span></div><div className="studio-ionicNewAcceptors">{mission.nonmetals.map((a, i) => <div key={i} className="studio-ionicNewAcceptor" onDragOver={e => e.preventDefault()} onDrop={e => {
    e.preventDefault(); if (e.dataTransfer.getData('text/plain') === 'ionic-electron')
      transfer(i);
  }}><div className="studio-ionicNewAtomTop">NONMETAL · RECEIVER {mission.nonmetals.length > 1 ? i + 1 : ''}</div><IonOrbital protons={a.protons} electrons={a.protons + received[i]} symbol={a.symbol} /><div className="studio-ionicNewCaption"><b>{a.symbol}<sup>{chargeLabel(a.protons, a.protons + received[i]) === 'neutral' ? '' : chargeLabel(a.protons, a.protons + received[i])}</sup></b><span>{a.protons + received[i]} electrons</span></div><button type="button" className="studio-ionicNewReceive" onClick={() => transfer(i)} disabled={remaining === 0 || received[i] >= 8 - a.valence}>{received[i] === 8 - a.valence ? '✓ Outer shell filled' : '＋ Accept one electron'}</button></div>)}</div></div><div className="studio-bondingStageFoot"><div><span className="studio-keyLegend"><b className="green" /> Outermost shell highlighted</span></div><span>Shell positions are schematic, not physical electron orbits.</span></div></div><aside className="studio-bondingInspector studio-ionicNewInspector"><div className="studio-bondingInspectorTop"><span className="studio-eyebrow">IONIC BONDING INSPECTOR</span><h3>{mission.formula}</h3><p>{mission.name}</p></div><div className="studio-bondingMiniStats"><div><span>TRANSFERRED</span><b>{transferred}</b></div><div><span>REMAINING</span><b>{remaining}</b></div><div><span>TOTAL CHARGE</span><b>{sumCharge > 0 ? '+' : ''}{sumCharge}</b></div></div><div className="studio-bondingGoal"><span>MAKE THE IONS</span><p>{mission.metal.symbol} loses {mission.metal.valence} electron{mission.metal.valence > 1 ? 's' : ''}; {mission.nonmetals.length} {mission.nonmetals[0].symbol} atom{mission.nonmetals.length > 1 ? 's' : ''} gain electrons to complete their outer shells.</p></div><button className="studio-bondingCheck" onClick={inspect}>✓ Check ionic charges <span>→</span></button><div className={`studio-bondingMessage ${checked && completeMission ? 'success' : ''}`} role="status"><span>{checked && completeMission ? '✓' : '✦'}</span><p>{error || 'Choose a receiver to move one electron. Dragging is optional.'}</p></div><div className="studio-bondingHint"><span className="studio-eyebrow">THE SCIENCE</span><p>{mission.lesson}</p>{facts.map(f => <p key={f}>• {f}</p>)}</div>{completeMission && <div className="studio-ionicNewResult"><span>STOICHIOMETRIC RATIO</span><b>{mission.formula}</b><p>Ions attract in an extended solid lattice. This ratio illustration is not a unit-cell diagram.</p><div className="studio-ionicNewLattice">{Array.from({ length: 6 }, (_, j) => <span key={j}><em>{mission.metal.symbol}<sup>{mission.metal.valence}+</sup></em>{mission.nonmetals.map((a, k) => <em key={k} className="negative">{a.symbol}⁻</em>)}</span>)}</div></div>}<button className="studio-bondingSave" onClick={() => addObservation(`Ionic lab ${mission.formula}: ${transferred}/${mission.metal.valence} valence electron transfers completed. Donor ${mission.metal.symbol} charge +${transferred}, receiver charges ${received.map(v => '-' + v).join(', ')}; total charge ${sumCharge}.`)}>＋ Save experiment to learning journal</button><button className="studio-ionicReset" onClick={() => choose(mission)}>↺ Start this mission again</button></aside></div></div>;
}
