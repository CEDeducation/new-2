/** Transparent, deterministic school-level chemistry models. No arbitrary chemical mixing claims. */
export type TitrationPoint = { addedMl: number; ph: number; excessMmol: number };
const positive = (value: number, name: string) => { if (!Number.isFinite(value) || value <= 0) throw new Error(`${name} must be positive`); return value; };
export function titrationPh(acidM: number, acidMl: number, baseM: number, baseMl: number): TitrationPoint {
  [acidM, acidMl, baseM].forEach((v, i) => positive(v, ['Acid molarity', 'Acid volume', 'Base molarity'][i]));
  if (!Number.isFinite(baseMl) || baseMl < 0) throw new Error('Added volume cannot be negative');
  const excessMmol = baseM * baseMl - acidM * acidMl;
  const volumeLitres = (acidMl + baseMl) / 1000;
  // Strong monoprotic acid–strong base, ideal dilute solution at 25 °C; neglect activities.
  const ph = Math.abs(excessMmol) < 1e-9 ? 7 : excessMmol < 0
    ? -Math.log10((-excessMmol / 1000) / volumeLitres)
    : 14 + Math.log10((excessMmol / 1000) / volumeLitres);
  return { addedMl: baseMl, ph: Math.max(0, Math.min(14, ph)), excessMmol };
}
export function titrationCurve(acidM: number, acidMl: number, baseM: number, maxAdded: number, increment = 0.25): TitrationPoint[] {
  if (!Number.isFinite(maxAdded) || maxAdded < 0 || maxAdded > 250) throw new Error('Unsupported volume');
  const result: TitrationPoint[] = [];
  for (let v = 0; v <= maxAdded + 1e-9; v += increment) result.push(titrationPh(acidM, acidMl, baseM, Math.min(maxAdded, v)));
  return result;
}
export const GAS_CONSTANT = 8.314462618;
export type GasState = { pressureKPa: number; volumeLitres: number; tempKelvin: number; moles: number; rmsSpeed: number };
export function idealGas(volumeLitres: number, tempKelvin: number, moles: number, molarMassGrams: number): GasState {
  [volumeLitres, tempKelvin, moles, molarMassGrams].forEach((v, i) => positive(v, ['Volume', 'Temperature', 'Moles', 'Molar mass'][i]));
  const pressureKPa = moles * GAS_CONSTANT * tempKelvin / volumeLitres;
  const rmsSpeed = Math.sqrt(3 * GAS_CONSTANT * tempKelvin / (molarMassGrams / 1000));
  return { pressureKPa, volumeLitres, tempKelvin, moles, rmsSpeed };
}
export function downloadCsv(points: TitrationPoint[]): string {
  return ['volume_mL,pH,excess_base_mmol', ...points.map(x => `${x.addedMl.toFixed(2)},${x.ph.toFixed(4)},${x.excessMmol.toFixed(5)}`)].join('\n');
}
