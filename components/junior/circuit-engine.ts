/** Ideal two-resistor DC series/parallel network with a supply switch. */
export type CircuitTopology = 'series' | 'parallel';
export type CircuitReading = {
  equivalent: number;
  current: number;
  i1: number;
  i2: number;
  power: number;
  energy: number;
};
export function calculateDC(voltage: number, r1: number, r2: number, mode: CircuitTopology, closed: boolean): CircuitReading {
  if (![voltage, r1, r2].every(Number.isFinite) || voltage < 0 || r1 <= 0 || r2 <= 0)
    throw new Error('Expected finite non-negative voltage and positive resistances.');
  const equivalent = mode === 'series' ? r1 + r2 : 1 / (1 / r1 + 1 / r2);
  const current = closed ? voltage / equivalent : 0;
  const i1 = closed ? (mode === 'series' ? current : voltage / r1) : 0;
  const i2 = closed ? (mode === 'series' ? current : voltage / r2) : 0;
  return { equivalent, current, i1, i2, power: voltage * current, energy: voltage * current * 60 };
}
