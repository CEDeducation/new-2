/**
 * Jr OpenLab covalent teaching engine.
 * Scope: first-row main-group neutral closed-shell examples, plus H and Cl.
 * This is graph/valence teaching, not quantum chemistry, force-field MD or
 * an unrestricted chemical structure validator.
 */
export type SymbolKey = 'H' | 'C' | 'N' | 'O' | 'F' | 'Cl';
export type AtomNode = {
  id: number;
  symbol: SymbolKey;
  x: number;
  y: number;
};
export type BondEdge = {
  a: number;
  b: number;
  order: 1 | 2 | 3;
};
export type Graph = {
  atoms: AtomNode[];
  bonds: BondEdge[];
};
export type Target = {
  id: string;
  name: string;
  formula: string;
  note: string;
  geometry: string;
  angle: string;
  atoms: SymbolKey[];
  connections: [
    number,
    number,
    1 | 2 | 3
  ][];
  xyz: [
    number,
    number,
    number
  ][];
  positions: [
    number,
    number
  ][];
};
export const ATOM_INFO: Record<SymbolKey, {
  name: string;
  valence: number;
  targetBonds: number;
  color: string;
  number: number;
}> = {
  H: { name: 'Hydrogen', valence: 1, targetBonds: 1, color: '#f9fafc', number: 1 },
  C: { name: 'Carbon', valence: 4, targetBonds: 4, color: '#7f97bd', number: 6 },
  N: { name: 'Nitrogen', valence: 5, targetBonds: 3, color: '#7c98ff', number: 7 },
  O: { name: 'Oxygen', valence: 6, targetBonds: 2, color: '#ff748a', number: 8 },
  F: { name: 'Fluorine', valence: 7, targetBonds: 1, color: '#85e6b1', number: 9 },
  Cl: { name: 'Chlorine', valence: 7, targetBonds: 1, color: '#9be3a2', number: 17 },
};
export const TARGETS: Target[] = [
  { id: 'water', name: 'Water', formula: 'H₂O', note: 'Oxygen shares two pairs (one in each O–H bond) and keeps two lone pairs. Its shape is bent.', geometry: 'Bent (VSEPR)', angle: '104.5°', atoms: ['O', 'H', 'H'], connections: [[0, 1, 1], [0, 2, 1]], xyz: [[0, 0, 0], [-.79, .61, 0], [.79, .61, 0]], positions: [[450, 250], [330, 345], [570, 345]] },
  { id: 'hydrogen', name: 'Hydrogen', formula: 'H₂', note: 'Each hydrogen shares one electron to complete a two-electron duet.', geometry: 'Linear', angle: '180°', atoms: ['H', 'H'], connections: [[0, 1, 1]], xyz: [[-.8, 0, 0], [.8, 0, 0]], positions: [[360, 250], [540, 250]] },
  { id: 'oxygen', name: 'Oxygen', formula: 'O₂', note: 'Two shared pairs form the O=O double bond; each atom retains two lone pairs.', geometry: 'Linear', angle: '180°', atoms: ['O', 'O'], connections: [[0, 1, 2]], xyz: [[-.8, 0, 0], [.8, 0, 0]], positions: [[360, 250], [540, 250]] },
  { id: 'nitrogen', name: 'Nitrogen', formula: 'N₂', note: 'Three shared pairs make a triple bond; each N retains one lone pair.', geometry: 'Linear', angle: '180°', atoms: ['N', 'N'], connections: [[0, 1, 3]], xyz: [[-.8, 0, 0], [.8, 0, 0]], positions: [[360, 250], [540, 250]] },
  { id: 'carbon-dioxide', name: 'Carbon dioxide', formula: 'CO₂', note: 'Carbon forms two double bonds. Two electron regions give a linear molecular shape.', geometry: 'Linear', angle: '180°', atoms: ['C', 'O', 'O'], connections: [[0, 1, 2], [0, 2, 2]], xyz: [[0, 0, 0], [-1.1, 0, 0], [1.1, 0, 0]], positions: [[450, 250], [295, 250], [605, 250]] },
  { id: 'ammonia', name: 'Ammonia', formula: 'NH₃', note: 'Nitrogen forms three single bonds and keeps one lone pair, giving a trigonal-pyramidal shape.', geometry: 'Trigonal pyramidal', angle: '≈107°', atoms: ['N', 'H', 'H', 'H'], connections: [[0, 1, 1], [0, 2, 1], [0, 3, 1]], xyz: [[0, .33, 0], [-.94, -.28, 0], [.47, -.28, .81], [.47, -.28, -.81]], positions: [[450, 215], [350, 335], [550, 335], [450, 385]] },
  { id: 'methane', name: 'Methane', formula: 'CH₄', note: 'Carbon shares four pairs with four H atoms. Four electron regions give a tetrahedral shape.', geometry: 'Tetrahedral', angle: '109.5°', atoms: ['C', 'H', 'H', 'H', 'H'], connections: [[0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]], xyz: [[0, 0, 0], [.75, .75, .75], [-.75, -.75, .75], [-.75, .75, -.75], [.75, -.75, -.75]], positions: [[450, 250], [450, 105], [590, 250], [450, 395], [310, 250]] },
  { id: 'hydrogen-chloride', name: 'Hydrogen chloride', formula: 'HCl', note: 'H and Cl share one pair. The Cl atom retains three lone pairs. The bond is polar covalent.', geometry: 'Linear', angle: '180°', atoms: ['H', 'Cl'], connections: [[0, 1, 1]], xyz: [[-.8, 0, 0], [.8, 0, 0]], positions: [[360, 250], [540, 250]] },
  { id: 'ethene', name: 'Ethene', formula: 'C₂H₄', note: 'The carbon atoms share a double bond; each carbon makes two additional C–H bonds. It is approximately planar.', geometry: 'Trigonal planar around each C', angle: '≈120°', atoms: ['C', 'C', 'H', 'H', 'H', 'H'], connections: [[0, 1, 2], [0, 2, 1], [0, 3, 1], [1, 4, 1], [1, 5, 1]], xyz: [[-.65, 0, 0], [.65, 0, 0], [-1.25, .85, 0], [-1.25, -.85, 0], [1.25, .85, 0], [1.25, -.85, 0]], positions: [[365, 250], [535, 250], [270, 155], [270, 345], [630, 155], [630, 345]] },
  { id: 'ethyne', name: 'Ethyne', formula: 'C₂H₂', note: 'A carbon–carbon triple bond plus one C–H bond on each carbon forms a linear structure.', geometry: 'Linear around each C', angle: '180°', atoms: ['C', 'C', 'H', 'H'], connections: [[0, 1, 3], [0, 2, 1], [1, 3, 1]], xyz: [[-.5, 0, 0], [.5, 0, 0], [-1.35, 0, 0], [1.35, 0, 0]], positions: [[390, 250], [510, 250], [260, 250], [640, 250]] },
];
export function graphFor(target: Target): Graph { return { atoms: target.atoms.map((symbol, i) => ({ id: i + 1, symbol, x: target.positions[i][0], y: target.positions[i][1] })), bonds: target.connections.map(([a, b, order]) => ({ a: a + 1, b: b + 1, order })) }; }
export function bondSum(graph: Graph, id: number) { return graph.bonds.reduce((n, b) => n + (b.a === id || b.b === id ? b.order : 0), 0); }
export function atomStatus(graph: Graph, atom: AtomNode) { const info = ATOM_INFO[atom.symbol]; const used = bondSum(graph, atom.id); return { used, remaining: Math.max(0, info.valence - used), available: Math.max(0, info.targetBonds - used), satisfied: used === info.targetBonds, overBonded: used > info.targetBonds }; }
export function formulaFor(graph: Graph) { const count = new Map<SymbolKey, number>(); graph.atoms.forEach(a => count.set(a.symbol, (count.get(a.symbol) || 0) + 1)); let keys = Array.from(count.keys()); keys = count.has('C') ? (['C', ...(count.has('H') ? ['H'] : []), ...keys.filter(s => s !== 'C' && s !== 'H').sort()] as SymbolKey[]) : keys.sort(); return keys.map(k => k + (count.get(k) === 1 ? '' : count.get(k))).join('') || '—'; }
export function validateGraph(graph: Graph) {
  if (!graph.atoms.length)
    return 'Place an atom onto the canvas to begin.'; for (const b of graph.bonds) {
      if (b.a === b.b || !graph.atoms.some(a => a.id === b.a) || !graph.atoms.some(a => a.id === b.b))
        return 'A bond references an invalid atom.';
    } for (const atom of graph.atoms) {
      const st = atomStatus(graph, atom);
      if (st.overBonded)
        return `${atom.symbol} has too many bonds for this introductory neutral-molecule model.`;
      if (!st.satisfied)
        return `${atom.symbol} needs ${st.available} more shared electron pair${st.available === 1 ? '' : 's'} (counting bond order).`;
    } if (graph.atoms.length > 1) {
      const seen = new Set<number>([graph.atoms[0].id]);
      let modified = true;
      while (modified) {
        modified = false;
        for (const b of graph.bonds) {
          if (seen.has(b.a) && !seen.has(b.b)) {
            seen.add(b.b);
            modified = true;
          }
          if (seen.has(b.b) && !seen.has(b.a)) {
            seen.add(b.a);
            modified = true;
          }
        }
      }
      if (seen.size !== graph.atoms.length)
        return 'Your atoms form separate fragments. Make one connected molecule.';
    } return null;
}
/** Chemical connectivity identity (not the drawing layout), with bond orders. */
export function matchesTarget(graph: Graph, target: Target) {
  if (graph.atoms.length !== target.atoms.length || graph.bonds.length !== target.connections.length)
    return false; const counts = (items: string[]) => items.sort().join('|'); if (counts(graph.atoms.map(a => a.symbol)) !== counts([...target.atoms]))
    return false; const degree = (id: number) => bondSum(graph, id); const tDegree = (i: number) => target.connections.reduce((n, [a, b, k]) => n + (a === i || b === i ? k : 0), 0); const assign = new Map<number, number>(), used = new Set<number>(); const bondOrder = (id1: number, id2: number) => graph.bonds.find(b => b.a === id1 && b.b === id2 || b.a === id2 && b.b === id1)?.order || 0; const targetOrder = (i: number, j: number) => target.connections.find(([a, b]) => a === i && b === j || a === j && b === i)?.[2] || 0; function explore(depth: number): boolean {
      if (depth === graph.atoms.length)
        return true; const atom = graph.atoms[depth]; for (let i = 0; i < target.atoms.length; i++) {
          if (used.has(i) || target.atoms[i] !== atom.symbol || tDegree(i) !== degree(atom.id))
            continue;
          let works = true;
          for (const [mappedId, index] of assign)
            if (bondOrder(atom.id, mappedId) !== targetOrder(i, index)) {
              works = false;
              break;
            }
          if (!works)
            continue;
          assign.set(atom.id, i);
          used.add(i);
          if (explore(depth + 1))
            return true;
          assign.delete(atom.id);
          used.delete(i);
        } return false;
    } return explore(0);
}
export function identifyGraph(graph: Graph) { return TARGETS.find(t => matchesTarget(graph, t)) || null; }
export function addBond(graph: Graph, first: number, second: number, order: 1 | 2 | 3 = 1): {
  graph: Graph;
  error?: string;
} {
  if (first === second)
    return { graph, error: 'Choose two different atoms.' }; const a = graph.atoms.find(x => x.id === first), b = graph.atoms.find(x => x.id === second); if (!a || !b)
    return { graph, error: 'Choose atoms on the canvas.' }; if (graph.bonds.some(e => e.a === first && e.b === second || e.a === second && e.b === first))
    return { graph, error: 'These atoms are already connected; click the bond to change its order.' }; if (bondSum(graph, first) + order > ATOM_INFO[a.symbol].targetBonds || bondSum(graph, second) + order > ATOM_INFO[b.symbol].targetBonds)
    return { graph, error: 'That bond would exceed an atom’s common neutral valency. Try another pair.' }; return { graph: { ...graph, bonds: [...graph.bonds, { a: first, b: second, order }] } };
}
export function changeBond(graph: Graph, first: number, second: number, order: 1 | 2 | 3) {
  const old = graph.bonds.find(e => e.a === first && e.b === second || e.a === second && e.b === first); if (!old)
    return { graph, error: 'No bond selected.' }; const a = graph.atoms.find(x => x.id === first)!, b = graph.atoms.find(x => x.id === second)!; if (bondSum(graph, first) - old.order + order > ATOM_INFO[a.symbol].targetBonds || bondSum(graph, second) - old.order + order > ATOM_INFO[b.symbol].targetBonds)
    return { graph, error: 'This change would exceed a common neutral valency.' }; return { graph: { ...graph, bonds: graph.bonds.map(e => e === old ? { ...e, order } : e) } };
}

/**
 * Complete a desktop drag-to-bond gesture without jumping the dragged atom
 * back to its pre-drag coordinates. The atoms snap to readable bond spacing.
 * This changes a diagram's geometry, NOT a computed chemical bond length.
 */
export function connectDroppedAtoms(
  initial: Graph,
  movedId: number,
  neighbourId: number,
  drop: { x: number; y: number }
): { graph: Graph; error?: string } {
  const moving=initial.atoms.find(a=>a.id===movedId);
  const neighbour=initial.atoms.find(a=>a.id===neighbourId);
  if(!moving||!neighbour)return {graph:initial,error:'Cannot connect atoms that are not on the canvas.'};
  const dx=drop.x-neighbour.x, dy=drop.y-neighbour.y;
  const originalDx=moving.x-neighbour.x, originalDy=moving.y-neighbour.y;
  const distance=Math.hypot(dx,dy);
  const originalDistance=Math.hypot(originalDx,originalDy)||1;
  const direction=distance>4?{x:dx/distance,y:dy/distance}:{x:originalDx/originalDistance,y:originalDy/originalDistance};
  const newX=Math.min(857,Math.max(43,neighbour.x+direction.x*92));
  const newY=Math.min(457,Math.max(43,neighbour.y+direction.y*92));
  const spaced:Graph={...initial,atoms:initial.atoms.map(a=>a.id===movedId?{...a,x:newX,y:newY}:a)};
  return addBond(spaced,movedId,neighbourId);
}

/**
 * Place an element dragged from the palette onto the molecular stage.
 * A drop near another atom creates a single bond only if both neutral
 * classroom-valence limits allow it. This avoids making the visual drag
 * appear successful while silently failing to modify the molecular graph.
 */
export function dropPaletteAtom(
  graph: Graph, symbol: SymbolKey, id: number, target: {x:number;y:number},
): { graph:Graph; bondedTo:number|null; error?:string } {
  if(graph.atoms.length>=12)return {graph,bondedTo:null,error:'Canvas supports at most 12 atoms.'};
  const nearest=graph.atoms.map(atom=>({atom,distance:Math.hypot(atom.x-target.x,atom.y-target.y)}))
    .sort((a,b)=>a.distance-b.distance)[0];
  let x=Math.max(43,Math.min(857,target.x)),y=Math.max(43,Math.min(457,target.y));
  if(nearest&&nearest.distance<104){
    const d=nearest.distance||1;
    x=Math.max(43,Math.min(857,nearest.atom.x+((target.x-nearest.atom.x)/d)*95));
    y=Math.max(43,Math.min(457,nearest.atom.y+((target.y-nearest.atom.y)/d)*95));
  }
  const withAtom:Graph={atoms:[...graph.atoms,{id,symbol,x,y}],bonds:[...graph.bonds]};
  if(nearest&&nearest.distance<104){
    const bonded=addBond(withAtom,id,nearest.atom.id);
    if(bonded.error)return {graph,bondedTo:null,error:bonded.error};
    return {graph:bonded.graph,bondedTo:nearest.atom.id};
  }
  return {graph:withAtom,bondedTo:null};
}
