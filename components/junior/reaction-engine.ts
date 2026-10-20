/** Stoichiometric atom-counting model. Coefficients denote numbers of formula units, not kinetic rate or yield. */
export type Species = { formula: string; atoms: Record<string, number>; side: 'reactant' | 'product' };
export type Reaction = { name: string; note: string; species: Species[]; solution: number[] };
export const REACTIONS: Reaction[] = [
  { name: 'Make water', note: 'Hydrogen reacts with oxygen; the same hydrogen and oxygen nuclei are present in the products.', species: [{ formula: 'H₂', atoms: { H: 2 }, side: 'reactant' }, { formula: 'O₂', atoms: { O: 2 }, side: 'reactant' }, { formula: 'H₂O', atoms: { H: 2, O: 1 }, side: 'product' }], solution: [2, 1, 2] },
  { name: 'Synthesize ammonia', note: 'One nitrogen molecule requires three hydrogen molecules to form two ammonia molecules.', species: [{ formula: 'N₂', atoms: { N: 2 }, side: 'reactant' }, { formula: 'H₂', atoms: { H: 2 }, side: 'reactant' }, { formula: 'NH₃', atoms: { N: 1, H: 3 }, side: 'product' }], solution: [1, 3, 2] },
  { name: 'Make magnesium oxide', note: 'Each oxide formula unit contains one magnesium and one oxygen atom.', species: [{ formula: 'Mg', atoms: { Mg: 1 }, side: 'reactant' }, { formula: 'O₂', atoms: { O: 2 }, side: 'reactant' }, { formula: 'MgO', atoms: { Mg: 1, O: 1 }, side: 'product' }], solution: [2, 1, 2] },
  { name: 'Burn methane', note: 'Complete methane combustion produces carbon dioxide and water with conserved atoms.', species: [{ formula: 'CH₄', atoms: { C: 1, H: 4 }, side: 'reactant' }, { formula: 'O₂', atoms: { O: 2 }, side: 'reactant' }, { formula: 'CO₂', atoms: { C: 1, O: 2 }, side: 'product' }, { formula: 'H₂O', atoms: { H: 2, O: 1 }, side: 'product' }], solution: [1, 2, 1, 2] },
  { name: 'Iron oxidation', note: 'This idealized stoichiometric equation balances iron and oxygen to form iron(III) oxide.', species: [{ formula: 'Fe', atoms: { Fe: 1 }, side: 'reactant' }, { formula: 'O₂', atoms: { O: 2 }, side: 'reactant' }, { formula: 'Fe₂O₃', atoms: { Fe: 2, O: 3 }, side: 'product' }], solution: [4, 3, 2] }
];
export function atomCounts(spec: Reaction, coeff: number[], side: 'reactant' | 'product'): Record<string, number> {
  if (coeff.length !== spec.species.length || !coeff.every(c => Number.isInteger(c) && c >= 1 && c <= 20)) throw Error('Invalid coefficients');
  return spec.species.reduce((out, s, i) => { if (s.side === side) for (const [atom, n] of Object.entries(s.atoms)) out[atom] = (out[atom] || 0) + n * coeff[i]; return out }, {} as Record<string, number>);
}
export function isBalanced(spec: Reaction, coeff: number[]) { const a = atomCounts(spec, coeff, 'reactant'), b = atomCounts(spec, coeff, 'product'); return Object.keys({ ...a, ...b }).every(k => a[k] === b[k]); }
