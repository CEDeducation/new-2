/** Ideal resistive source with two optional branches/components and a switch.
 * Missing series components break the circuit; missing parallel branches are open. */
export type BuiltMode = 'series' | 'parallel';
export function solveBuiltCircuit(v: number, r1: number, r2: number, mode: BuiltMode, closed: boolean, has1: boolean, has2: boolean) {
  if (![v, r1, r2].every(Number.isFinite) || v < 0 || r1 <= 0 || r2 <= 0) throw Error('Invalid source or resistor');
  const conducting = closed && (mode === 'series' ? (has1 && has2) : (has1 || has2));
  const equivalent = mode === 'series' ? (has1 && has2 ? r1 + r2 : Infinity) : (!has1 && !has2 ? Infinity : 1 / ((has1 ? 1 / r1 : 0) + (has2 ? 1 / r2 : 0)));
  const current = conducting ? v / equivalent : 0;
  const i1 = conducting && has1 ? (mode === 'series' ? current : v / r1) : 0;
  const i2 = conducting && has2 ? (mode === 'series' ? current : v / r2) : 0;
  const v1 = i1 * r1, v2 = i2 * r2, power = v * current;
  return { equivalent, current, i1, i2, v1, v2, power, energy: 60 * power, conducting };
}
