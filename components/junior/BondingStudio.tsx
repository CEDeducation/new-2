'use client';
import { useMemo, useRef, useState, type DragEvent, type PointerEvent } from 'react';
import { ATOM_INFO, TARGETS, addBond, atomStatus, bondSum, changeBond, connectDroppedAtoms, dropPaletteAtom, formulaFor, graphFor, identifyGraph, matchesTarget, validateGraph, type AtomNode, type BondEdge, type Graph, type SymbolKey, type Target } from './bond-engine';
import type { LabProps } from './junior-labs';
const EMPTY: Graph = { atoms: [], bonds: [] };
const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));
const randomSeed = (target: Target): Graph => ({ atoms: [{ id: 1, symbol: target.atoms[0], x: 450, y: 255 }], bonds: [] });
const sub = (n: string | number) => String(n).replace(/[0-9]/g, d => '₀₁₂₃₄₅₆₇₈₉'[Number(d)]);
const displayFormula = (s: string) => sub(s);
const atomOptions: SymbolKey[] = ['H', 'C', 'N', 'O', 'F', 'Cl'];
function GeometryView({ target }: {
  target: Target;
}) {
  const [yaw, setYaw] = useState(23), [pitch, setPitch] = useState(-17);
  const drag = useRef<{
    x: number;
    y: number;
    yaw: number;
    pitch: number;
  } | null>(null);
  const points = target.xyz.map(([x, y, z]) => { const ry = yaw * Math.PI / 180, rx = pitch * Math.PI / 180; const X = x * Math.cos(ry) + z * Math.sin(ry), Z = -x * Math.sin(ry) + z * Math.cos(ry), Y = y * Math.cos(rx) - Z * Math.sin(rx), depth = y * Math.sin(rx) + Z * Math.cos(rx); return { x: 205 + X * 102, y: 150 - Y * 95, depth }; });
  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    if (!drag.current)
      return; setYaw(drag.current.yaw + (e.clientX - drag.current.x) * .6); setPitch(clamp(drag.current.pitch + (e.clientY - drag.current.y) * .5, -83, 83));
  };
  return <div className="studio-geometry"><div className="studio-geometryHeader"><div><span className="studio-eyebrow">MOLECULAR SHAPE</span><h3>{target.geometry}</h3></div><span className="studio-geometryAngle">{target.angle}</span></div><svg viewBox="0 0 410 300" role="img" aria-label={`Rotatable educational ball-and-stick diagram of ${target.name}. Drag to rotate.`} onPointerDown={e => { drag.current = { x: e.clientX, y: e.clientY, yaw, pitch }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={onMove} onPointerUp={() => { drag.current = null; }} onPointerCancel={() => { drag.current = null; }} className="studio-geometrySvg"><defs><radialGradient id="bondingBallLight" cx="30%" cy="26%" r="75%"><stop offset="0" stopColor="white" stopOpacity=".8" /><stop offset=".38" stopColor="white" stopOpacity=".16" /><stop offset="1" stopColor="#040a1d" stopOpacity=".24" /></radialGradient></defs><circle cx="205" cy="150" r="119" fill="none" stroke="#ffffff16" strokeDasharray="3 9" /><ellipse cx="205" cy="150" rx="137" ry="42" fill="none" stroke="#5e8eca40" transform="rotate(-20 205 150)" />{target.connections.map(([a, b, order], i) => { const p = points[a], q = points[b]; const dx = q.x - p.x, dy = q.y - p.y, len = Math.hypot(dx, dy) || 1, px = -dy / len, py = dx / len; return Array.from({ length: order }, (_, j) => { const offset = (j - (order - 1) / 2) * 8; return <line key={`${i}-${j}`} x1={p.x + px * offset} y1={p.y + py * offset} x2={q.x + px * offset} y2={q.y + py * offset} stroke="#c6d9f4" strokeWidth="7" strokeLinecap="round" />; }); })}{points.map((p, i) => ({ p, i })).sort((a, b) => a.p.depth - b.p.depth).map(({ p, i }) => <g key={i}><circle cx={p.x} cy={p.y} r={target.atoms[i] === 'H' ? 21 : 27} fill={ATOM_INFO[target.atoms[i]].color} /><circle cx={p.x} cy={p.y} r={target.atoms[i] === 'H' ? 21 : 27} fill="url(#bondingBallLight)" /><text x={p.x} y={p.y + 5} fill="#091425" fontWeight="900" textAnchor="middle" fontSize="15">{target.atoms[i]}</text></g>)}</svg><div className="studio-geometryControls"><span>Drag the model to rotate</span><div><button type="button" onClick={() => setYaw(v => v - 30)} aria-label="Rotate molecule left">↶</button><button type="button" onClick={() => { setYaw(23); setPitch(-17); }} aria-label="Reset molecular rotation">⌖</button><button type="button" onClick={() => setYaw(v => v + 30)} aria-label="Rotate molecule right">↷</button></div></div><p>VSEPR teaching geometry, not an energy-minimized or molecular-dynamics calculation.</p></div>;
}
export function BondingStudio({ complete, addObservation }: LabProps) {
  const [targetId, setTargetId] = useState('water');
  const target = TARGETS.find(m => m.id === targetId)!;
  const [graph, setGraph] = useState<Graph>(() => randomSeed(TARGETS[0]));
  const [history, setHistory] = useState<Graph[]>([]);
  const [palette, setPalette] = useState<SymbolKey | null>('H');
  const [selected, setSelected] = useState<number | null>(null);
  const [focusedBond, setFocusedBond] = useState<[
    number,
    number
  ] | null>(null);
  const [message, setMessage] = useState('Drag an element from the palette onto the grid. Drop near an atom to snap a bond.');
  const [success, setSuccess] = useState(false);
  const [dots, setDots] = useState(true);
  const [hints, setHints] = useState(true);
  const [showGeometry, setShowGeometry] = useState(false);
  const [mode, setMode] = useState<'challenge' | 'sandbox'>('challenge');
  const svg = useRef<SVGSVGElement | null>(null);
  const moving = useRef<{
    id: number;
    clientX: number;
    clientY: number;
    moved: boolean;
    start: Graph;
  } | null>(null);
  const nextId = useRef(2);
  const accepted = useMemo(() => identifyGraph(graph), [graph]);
  const validity = useMemo(() => validateGraph(graph), [graph]);
  const used = graph.atoms.filter(a => atomStatus(graph, a).satisfied).length;
  const commit = (after: Graph) => { setHistory(prev => [...prev.slice(-49), graph]); setGraph(after); setSuccess(false); setShowGeometry(false); };
  const chooseTarget = (id: string) => { const t = TARGETS.find(m => m.id === id)!; setTargetId(id); setGraph(randomSeed(t)); nextId.current = 2; setHistory([]); setPalette(t.atoms.find((s, i) => i > 0) || 'H'); setSelected(null); setFocusedBond(null); setSuccess(false); setShowGeometry(false); setMessage(`Build ${t.formula}: place atoms and connect the correct bonds.`); };
  const unpackAtomKit = () => {
    const kit = graphFor(target);
    commit({ atoms: kit.atoms, bonds: [] });
    nextId.current = kit.atoms.length + 1;
    setSelected(null);
    setFocusedBond(null);
    setPalette(null);
    setMessage('Atom kit ready. Drag one atom onto another to form a bond, or click two atoms in sequence.');
  };
  const reset = () => {
    if (mode === 'challenge')
      chooseTarget(targetId);
    else {
      setGraph(EMPTY);
      nextId.current = 1;
      setHistory([]);
      setSuccess(false);
      setSelected(null);
      setFocusedBond(null);
      setMessage('Canvas cleared. Choose any element to begin.');
    }
  };
  const addAtom = (x: number, y: number) => {
    if (!palette)
      return; if (graph.atoms.length >= 12) {
        setMessage('This classroom builder supports up to 12 atoms at a time.');
        return;
      } const a: AtomNode = { id: nextId.current++, symbol: palette, x: clamp(x, 45, 855), y: clamp(y, 47, 453) }; commit({ ...graph, atoms: [...graph.atoms, a] }); setSelected(null); setFocusedBond(null); setMessage(`${ATOM_INFO[palette].name} placed. Select two atoms in sequence to connect them.`);
  };
  const onPaletteDrop = (e: DragEvent<SVGSVGElement>) => {
    e.preventDefault();
    const value = e.dataTransfer.getData('application/x-openlab-atom');
    if (!atomOptions.includes(value as SymbolKey)) return;
    const symbol = value as SymbolKey;
    const result = dropPaletteAtom(graph, symbol, nextId.current, locate(e.clientX, e.clientY));
    if (result.error) {
      setMessage(`Cannot place ${symbol}: ${result.error}`);
      return;
    }
    nextId.current += 1;
    commit(result.graph);
    setSelected(null);
    setPalette(null);
    setFocusedBond(result.bondedTo === null ? null : [nextId.current - 1, result.bondedTo]);
    setMessage(result.bondedTo === null ? `${symbol} placed. Drag another atom beside it to bond.` : `${symbol} placed and bonded automatically. Change bond order or keep building.`);
  };
  const locate = (clientX: number, clientY: number) => {
    const box = svg.current?.getBoundingClientRect(); if (!box)
      return { x: 450, y: 255 }; return { x: (clientX - box.left) * 900 / box.width, y: (clientY - box.top) * 500 / box.height };
  };
  const clickAtom = (id: number) => {
    setPalette(null); setFocusedBond(null); if (selected === id) {
      setSelected(null);
      return;
    } if (selected !== null) {
      const res = addBond(graph, selected, id);
      if (res.error) {
        setMessage(res.error);
        setSelected(id);
        return;
      }
      commit(res.graph);
      setMessage('Bond created! Click the bond to switch to a double or triple bond.');
      setSelected(null);
      return;
    } setSelected(id); const atom = graph.atoms.find(a => a.id === id)!; setMessage(`${atom.symbol} selected. Click another atom to share a pair of electrons.`);
  };
  const changeSelectedBond = (order: 1 | 2 | 3) => {
    if (!focusedBond)
      return; const res = changeBond(graph, focusedBond[0], focusedBond[1], order); if (res.error) {
        setMessage(res.error);
        return;
      } commit(res.graph); setMessage(`${['', 'Single', 'Double', 'Triple'][order]} bond selected.`);
  };
  const onBondClick = (edge: BondEdge) => {
    setSelected(null); setPalette(null); setFocusedBond([edge.a, edge.b]); const newOrder = ((edge.order % 3) + 1) as 1 | 2 | 3; const res = changeBond(graph, edge.a, edge.b, newOrder); if (res.error) {
      setMessage(`${res.error} Use the bond-order toolbar to choose a different order.`);
    }
    else {
      commit(res.graph);
      setMessage(`Changed to ${['', 'single', 'double', 'triple'][newOrder]} bond.`);
    }
  };
  const removeSelected = () => {
    if (selected !== null) {
      const after = { atoms: graph.atoms.filter(a => a.id !== selected), bonds: graph.bonds.filter(b => b.a !== selected && b.b !== selected) };
      commit(after);
      setSelected(null);
      setMessage('Atom removed.');
    }
    else if (focusedBond) {
      const after = { ...graph, bonds: graph.bonds.filter(b => !(b.a === focusedBond[0] && b.b === focusedBond[1] || b.b === focusedBond[0] && b.a === focusedBond[1])) };
      commit(after);
      setFocusedBond(null);
      setMessage('Bond removed.');
    }
    else
      setMessage('Select an atom or bond to remove it.');
  };
  const undo = () => {
    if (history.length < 1)
      return; setGraph(history[history.length - 1]); setHistory(p => p.slice(0, -1)); setSelected(null); setFocusedBond(null); setSuccess(false); setShowGeometry(false); setMessage('Last action undone.');
  };
  const check = () => {
    if (validity) {
      setMessage(`Keep building: ${validity}`);
      setSuccess(false);
      return;
    } if (mode === 'challenge' && !matchesTarget(graph, target)) {
      setMessage(`The atoms have valid introductory valences, but connectivity does not match ${target.formula}. Look at the target formula and bond hints.`);
      setSuccess(false);
      return;
    } const actual = accepted; setSuccess(true); setShowGeometry(Boolean(actual)); setMessage(mode === 'challenge' ? `Excellent! You built ${target.formula} with the correct connectivity and bond order.` : actual ? `Structure recognized: ${actual.name}. Try rotating its VSEPR geometry.` : 'All atoms meet common valences and form one connected graph. This is not a full chemical validity check.'); complete();
  };
  const helper = target.atoms.reduce<Record<string, number>>((acc, s) => ({ ...acc, [s]: (acc[s] || 0) + 1 }), {});
  return <div className="studio-content studio-bondingRoot">
    <div className="studio-bondingIntro"><div><span className="studio-eyebrow">CHEMISTRY / HANDS-ON BOND ENGINE</span><h2>Build matter. One electron pair at a time.</h2><p>Place atoms, join them with shared pairs, reveal lone electrons and explore molecular shape. Start with guided challenges or experiment freely.</p></div><span className="studio-bondingVersion">LIVE · LEWIS + VSEPR</span></div>
    <div className="studio-bondingModes"><button className={mode === 'challenge' ? 'active' : ''} onClick={() => { setMode('challenge'); chooseTarget(targetId); }}>◎ Guided missions</button><button className={mode === 'sandbox' ? 'active' : ''} onClick={() => { setMode('sandbox'); setGraph(EMPTY); setHistory([]); setSelected(null); setFocusedBond(null); setPalette('C'); setSuccess(false); setShowGeometry(false); nextId.current = 1; setMessage('Free builder: choose an atom, click the stage, and make bonds.'); }}>✦ Free-build lab</button></div>
    {mode === 'challenge' && <div className="studio-missionDeck"><div className="studio-missionTop"><span>YOUR NEXT DISCOVERY</span><strong>Choose a molecule to construct</strong></div><div className="studio-missionChoices">{TARGETS.map(m => <button type="button" key={m.id} title={m.name} className={targetId === m.id ? 'active' : ''} onClick={() => chooseTarget(m.id)}><b>{m.formula}</b><small>{m.name}</small></button>)}</div><button type="button" className="studio-atomKit" onClick={unpackAtomKit}>◈ Load atom kit — arrange and join atoms yourself →</button></div>}
    <div className="studio-bondingGrid"><div className="studio-bondingMain"><div className="studio-bondingToolbar"><div><span className="studio-eyebrow">01 / ATOM PALETTE</span><span className="studio-bondingToolHint">Drag an atom onto the stage, or select it and click to place</span></div><div className="studio-bondingAtomPalette">{atomOptions.map(symbol => <button type="button" key={symbol} aria-pressed={palette === symbol} draggable onDragStart={e => { e.dataTransfer.setData('application/x-openlab-atom', symbol); e.dataTransfer.effectAllowed='copy'; }} className={palette === symbol ? 'active' : ''} onClick={() => { setPalette(symbol); setSelected(null); setFocusedBond(null); setMessage(`${ATOM_INFO[symbol].name} selected. Tap the empty stage to place it.`); }}><span style={{ background: ATOM_INFO[symbol].color }}>{symbol}</span><small>{ATOM_INFO[symbol].name}</small></button>)}</div></div>
      <div className="studio-bondingCanvasShell"><div className="studio-bondingCanvasHead"><span><i /> MOLECULAR WORKSPACE</span><span>{graph.atoms.length} ATOMS · {graph.bonds.length} BONDS · {displayFormula(formulaFor(graph))}</span></div><svg ref={svg} className={`studio-bondingCanvas ${palette ? 'placing' : ''}`} onDragOver={e => e.preventDefault()} onDrop={onPaletteDrop} viewBox="0 0 900 500" role="group" aria-label="Molecule building canvas. Choose an atom, click a location to place it, then select two atoms to make a bond." onClick={e => {
        if (e.target === e.currentTarget || e.target instanceof SVGElement && (e.target as SVGElement).getAttribute('data-grid') === 'true') {
          if (palette) {
            const p = locate(e.clientX, e.clientY);
            addAtom(p.x, p.y);
          }
          else {
            setSelected(null);
            setFocusedBond(null);
          }
        }
      }}><defs><pattern id="studioMoleculeGrid" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1.1" fill="#a7bcdc" opacity=".27" /></pattern><radialGradient id="studioCanvasHalo"><stop stopColor="#263e72" stopOpacity=".52" /><stop offset="1" stopColor="#101a30" stopOpacity="0" /></radialGradient></defs><rect data-grid="true" width="900" height="500" fill="#101a30" /><rect data-grid="true" width="900" height="500" fill="url(#studioMoleculeGrid)" /><ellipse data-grid="true" cx="450" cy="245" rx="325" ry="205" fill="url(#studioCanvasHalo)" />
        {graph.bonds.map((bond, i) => {
          const a = graph.atoms.find(a => a.id === bond.a)!, b = graph.atoms.find(a => a.id === bond.b)!; const len = Math.hypot(b.x - a.x, b.y - a.y) || 1, perp = { x: -(b.y - a.y) / len, y: (b.x - a.x) / len }; return <g key={`${bond.a}-${bond.b}`} className={`studio-bondGroup ${focusedBond?.includes(bond.a) && focusedBond?.includes(bond.b) ? 'focused' : ''}`} role="button" tabIndex={0} aria-label={`${['', 'Single', 'Double', 'Triple'][bond.order]} bond between ${a.symbol} and ${b.symbol}. Activate to increase bond order.`} onClick={e => { e.stopPropagation(); setFocusedBond([bond.a, bond.b]); setSelected(null); setPalette(null); setMessage('Bond selected. Choose its order in the toolbar.'); }} onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setFocusedBond([bond.a, bond.b]);
            }
          }}>{Array.from({ length: bond.order }, (_, j) => { const offset = (j - (bond.order - 1) / 2) * 10; return <line key={j} x1={a.x + perp.x * offset} y1={a.y + perp.y * offset} x2={b.x + perp.x * offset} y2={b.y + perp.y * offset} stroke={focusedBond?.includes(bond.a) && focusedBond?.includes(bond.b) ? '#fff2a1' : '#71ebda'} strokeWidth="5" strokeLinecap="round" />; })}<line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="transparent" strokeWidth="27" /></g>;
        })}
        {graph.atoms.map(atom => {
          const info = ATOM_INFO[atom.symbol], st = atomStatus(graph, atom), dotCount = st.remaining; const ring = 40; return <g key={atom.id} role="button" tabIndex={0} className={`studio-bondAtom ${selected === atom.id ? 'selected' : ''} ${st.satisfied ? 'satisfied' : ''}`} aria-label={`${info.name}. ${st.used} shared electron pairs counted toward valency of ${info.targetBonds}. Select to connect.`} onPointerDown={e => { e.stopPropagation(); moving.current = { id: atom.id, clientX: e.clientX, clientY: e.clientY, moved: false, start: graph }; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => {
            if (moving.current?.id !== atom.id)
              return; const d = moving.current; if (Math.hypot(e.clientX - d.clientX, e.clientY - d.clientY) < 5 && !d.moved)
              return; d.moved = true; const p = locate(e.clientX, e.clientY); setGraph(prev => ({ ...prev, atoms: prev.atoms.map(a => a.id === atom.id ? { ...a, x: clamp(p.x, 43, 857), y: clamp(p.y, 43, 457) } : a) }));
          }} onPointerUp={e => {
            e.stopPropagation();
            const dragging = moving.current;
            moving.current = null;
            if (dragging?.moved) {
              const position = locate(e.clientX, e.clientY);
              const neighbour = dragging.start.atoms.find(other => other.id !== atom.id && Math.hypot(other.x - position.x, other.y - position.y) < 58);
              if (neighbour) {
                const result = connectDroppedAtoms(dragging.start, atom.id, neighbour.id, position);
                setGraph(result.graph);
                if (result.error) {
                  setMessage(`${result.error} Try another atom or bond order.`);
                } else {
                  setHistory(previous => [...previous.slice(-49), dragging.start]);
                  setSelected(null);
                  setFocusedBond([atom.id, neighbour.id]);
                  setPalette(null);
                  setMessage(`Bond created: ${atom.symbol}–${neighbour.symbol}. Use the bond-order controls for a double or triple bond.`);
                }
              } else {
                setHistory(previous => [...previous.slice(-49), dragging.start]);
                setMessage(`${atom.symbol} repositioned. Any existing bonds follow it.`);
              }
              setSuccess(false);
              setShowGeometry(false);
            } else clickAtom(atom.id);
          }} onPointerCancel={() => { moving.current = null; }} onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              clickAtom(atom.id);
            }
          }}><circle cx={atom.x} cy={atom.y} r="44" fill={selected === atom.id ? '#d8fbe5' : '#bcd7ff'} opacity={selected === atom.id ? .19 : .06} /><circle cx={atom.x} cy={atom.y} r="30" fill="#182844" stroke={selected === atom.id ? '#f6df9e' : st.satisfied ? '#54d9b7' : '#7994bd'} strokeWidth={selected === atom.id ? 3 : 2} /><circle cx={atom.x - 8} cy={atom.y - 9} r="17" fill={info.color} opacity=".14" /><text x={atom.x} y={atom.y + 7} textAnchor="middle" fontSize="23" fontWeight="900" fill={info.color}>{atom.symbol}</text>{dots && Array.from({ length: dotCount }, (_, i) => { const angle = -Math.PI / 2 + 2 * Math.PI * i / Math.max(dotCount, 4); return <circle key={i} cx={atom.x + ring * Math.cos(angle)} cy={atom.y + ring * Math.sin(angle)} r="3.5" fill="#ffda8e" stroke="#1d284a" strokeWidth="1" />; })}{st.satisfied && <circle cx={atom.x + 27} cy={atom.y - 26} r="7" fill="#65f1cf" stroke="#101a30" strokeWidth="3" />}</g>;
        })}
        {!graph.atoms.length && <text x="450" y="250" fill="#8296b7" fontSize="22" textAnchor="middle" pointerEvents="none">Select an element above, then click to add an atom</text>}</svg>
        <div className="studio-bondingStageFoot"><div><span className="studio-keyLegend"><b className="green" /> Bonds: shared pairs</span><span className="studio-keyLegend"><b className="yellow" /> Dots: nonbonding electrons</span></div><span>Drag an atom onto another to bond • Or click two atoms • Select a bond to set its order</span></div></div>
      <div className="studio-bondingEditBar"><div className="studio-bondingBondTools"><span>{focusedBond ? `BOND ${focusedBond.join('–')}` : selected ? `ATOM ${selected} SELECTED` : 'EDIT BOND'}</span>{([1, 2, 3] as const).map(order => <button key={order} disabled={!focusedBond} onClick={() => changeSelectedBond(order)} title={`${['', 'Single', 'Double', 'Triple'][order]} bond`}>{order === 1 ? '—' : order === 2 ? '=' : '≡'}</button>)}<button onClick={removeSelected} disabled={selected === null && !focusedBond} aria-label="Remove selected atom or bond">✕ Remove</button></div><div className="studio-bondingHistory"><button onClick={undo} disabled={!history.length}>↶ Undo</button><button onClick={reset}>↺ Reset</button></div></div>
      <div className={`studio-bondingMessage ${success ? 'success' : ''}`} role="status"><span>{success ? '✓' : '✦'}</span><p>{message}</p></div>
    </div>
      <aside className="studio-bondingInspector"><div className="studio-bondingInspectorTop"><span className="studio-eyebrow">02 / LIVE SCIENCE INSPECTOR</span><h3>{mode === 'challenge' ? target.formula : displayFormula(formulaFor(graph))}</h3><p>{mode === 'challenge' ? target.name : 'Your molecule'}</p></div><div className="studio-bondingProgress"><div><span>Atoms with a satisfied common valence</span><b>{used} / {graph.atoms.length}</b></div><div className="studio-progressTrack"><span style={{ width: `${graph.atoms.length ? 100 * used / graph.atoms.length : 0}%` }} /></div></div><div className="studio-bondingMiniStats"><div><span>ATOMS</span><b>{graph.atoms.length}</b></div><div><span>BONDS</span><b>{graph.bonds.length}</b></div><div><span>CHECK</span><b className={!validity && graph.atoms.length ? 'good' : ''}>{validity ? 'Building' : 'Ready'}</b></div></div>
        {mode === 'challenge' && <div className="studio-bondingGoal"><span>YOUR MISSION</span><p>Build <strong>{target.formula}</strong> using {Object.entries(helper).map(([s, n]) => `${n} ${s}`).join(' + ')} with the right bond order.</p></div>}
        <button className="studio-bondingCheck" onClick={check}>✓ Check my molecule <span>→</span></button>
        <div className="studio-bondingToggle"><label><input type="checkbox" checked={dots} onChange={e => setDots(e.target.checked)} /> Show valence-electron dots</label><label><input type="checkbox" checked={hints} onChange={e => setHints(e.target.checked)} /> Show learning hints</label></div>
        {hints && <div className="studio-bondingHint"><span className="studio-eyebrow">WHAT IS VALENCY?</span><p>A hydrogen atom usually forms <b>1</b> bond; oxygen <b>2</b>; nitrogen <b>3</b>; carbon <b>4</b>. Each bond order counts as that many shared electron pairs.</p><div className="studio-bondingValency">{(['H', 'O', 'N', 'C'] as SymbolKey[]).map(s => <div key={s}><strong>{s}</strong><small>{ATOM_INFO[s].targetBonds} bond{ATOM_INFO[s].targetBonds > 1 ? 's' : ''}</small></div>)}</div></div>}
        {mode === 'challenge' && <div className="studio-bondingTeaching"><span className="studio-eyebrow">THE SCIENCE BEHIND IT</span><p>{target.note}</p><button onClick={() => { setGraph(graphFor(target)); nextId.current = target.atoms.length + 1; setHistory(prev => [...prev, graph]); setSelected(null); setFocusedBond(null); setShowGeometry(false); setSuccess(false); setMessage('Example structure loaded. Inspect the electron dots, then run Check.'); }}>Show worked example ↗</button></div>}
        {accepted && showGeometry && <GeometryView target={accepted} />}{accepted && !showGeometry && <button className="studio-bondingShapeButton" onClick={() => setShowGeometry(true)}>◉ Explore {accepted.name} in rotatable 3D ↗</button>}
        <button className="studio-bondingSave" onClick={() => addObservation(`${mode === 'challenge' ? 'Mission: ' + target.name : 'Free build'} · ${displayFormula(formulaFor(graph))}, ${graph.atoms.length} atoms, ${graph.bonds.length} bonds; common-valence check: ${validity || 'passed'}${accepted ? ', recognized as ' + accepted.name : ''}.`)}>＋ Save this experiment to learning journal</button>
        <div className="studio-bondingCaveat">LEARNING MODEL · Neutral, introductory covalent structures only. Ionic solids, formal charge, resonance, radicals, expanded octets, stereochemistry and reaction dynamics are not simulated here.</div>
      </aside></div>
    <div className="studio-bondingHow"><div><b>01</b><span>Choose</span><small>Pick atoms from the palette</small></div><div><b>02</b><span>Place</span><small>Tap stage; drag to arrange</small></div><div><b>03</b><span>Bond</span><small>Drag together, or select two atoms</small></div><div><b>04</b><span>Discover</span><small>Check valence and rotate shapes</small></div></div>
  </div>;
}
