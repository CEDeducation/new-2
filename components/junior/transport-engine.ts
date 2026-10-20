/** Educational two-compartment stochastic transport. Particle counts are integer and conserved.
 * This is NOT a calibrated permeability model or molecular dynamics solver. */
export type TransportState = { insideSolute: number; outsideSolute: number; insideWater: number; outsideWater: number; steps: number };
export type TransportSettings = { solutePermeable: boolean; temperature: number };
export function initialTransport(inside = 35, outside = 75): TransportState {
  if (![inside, outside].every(Number.isInteger) || inside < 0 || outside < 0 || inside > 200 || outside > 200) throw Error('Bad starting solute count');
  return { insideSolute: inside, outsideSolute: outside, insideWater: 90, outsideWater: 90, steps: 0 };
}
/** Each compartment represents a well-mixed chamber of comparable size; per-step random particle crossings.
 * Water transfer has a small concentration-gradient bias, bounded to avoid zero-volume compartments. */
export function transportStep(s: TransportState, opts: TransportSettings, random: () => number = Math.random): TransportState {
  if (!Number.isFinite(opts.temperature) || opts.temperature < 0 || opts.temperature > 100) throw Error('Temperature out of range');
  let insideSolute = s.insideSolute, outsideSolute = s.outsideSolute, insideWater = s.insideWater, outsideWater = s.outsideWater;
  const rate = .006 + .00045 * opts.temperature;
  if (opts.solutePermeable) {
    const leave = binomial(insideSolute, rate, random), enter = binomial(outsideSolute, rate, random);
    insideSolute += enter - leave; outsideSolute += leave - enter;
  }
  // Osmotic water flux: the side with higher solute per volume has a higher probability of net water gain.
  const ci = insideSolute / Math.max(insideWater, 1), co = outsideSolute / Math.max(outsideWater, 1);
  const bias = Math.max(-.025, Math.min(.025, (ci - co) * .012));
  const waterRate = .013 + opts.temperature * .00018;
  const inward = binomial(outsideWater, Math.max(0, waterRate + bias), random);
  const outward = binomial(insideWater, Math.max(0, waterRate - bias), random);
  const newInside = Math.max(25, Math.min(155, insideWater + inward - outward));
  insideWater = newInside; outsideWater = 180 - newInside;
  return { insideSolute, outsideSolute, insideWater, outsideWater, steps: s.steps + 1 };
}
function binomial(n: number, p: number, r: () => number) { let count = 0; for (let i = 0; i < n; i++)if (r() < p) count++; return count }
export function totalParticles(s: TransportState) { return { solute: s.insideSolute + s.outsideSolute, water: s.insideWater + s.outsideWater } }
