/**
 * Educational cardiac-cycle engine (not a patient-specific cardiovascular model).
 * The controls are clinically recognizable but use deliberately simplified
 * timings, volumes, and flow pathways suitable for a school laboratory.
 */
export type HeartPhase = 'atrial-systole' | 'ventricular-systole' | 'isovolumetric-relaxation' | 'ventricular-filling';
export type Chamber = 'right-atrium' | 'right-ventricle' | 'left-atrium' | 'left-ventricle';
export type Valve = 'tricuspid' | 'pulmonary' | 'mitral' | 'aortic';
export type HeartInputs = {
  heartRate: number;
  endDiastolicVolume: number;
  ejectionFraction: number;
  mitralRegurgitation: number;
};
export const DEFAULT_HEART_INPUTS: HeartInputs = {
  heartRate: 72, endDiastolicVolume: 120, ejectionFraction: 0.6, mitralRegurgitation: 0,
};
export function limit(value: number, min: number, max: number) {
  if (!Number.isFinite(value)) throw new Error('Model inputs must be finite');
  return Math.min(max, Math.max(min, value));
}
export function heartMeasurements(raw: HeartInputs) {
  const bpm = limit(raw.heartRate, 35, 180);
  const endDiastolicVolume = limit(raw.endDiastolicVolume, 50, 200);
  const ejectionFraction = limit(raw.ejectionFraction, 0.25, 0.8);
  const leakageFraction = limit(raw.mitralRegurgitation, 0, 0.6);
  const ventricularStrokeVolumeMl = endDiastolicVolume * ejectionFraction;
  const forwardStrokeVolumeMl = ventricularStrokeVolumeMl * (1 - leakageFraction);
  const regurgitantVolumeMl = ventricularStrokeVolumeMl - forwardStrokeVolumeMl;
  const endSystolicVolumeMl = endDiastolicVolume - ventricularStrokeVolumeMl;
  const forwardOutputLMin = bpm * forwardStrokeVolumeMl / 1000;
  const beatDurationSeconds = 60 / bpm;
  return {
    bpm, beatDurationSeconds, endDiastolicVolume, endSystolicVolumeMl,
    ejectionFraction, ventricularStrokeVolumeMl, forwardStrokeVolumeMl,
    regurgitantVolumeMl, forwardOutputLMin, leakageFraction,
  };
}
export function heartPhase(fraction: number): HeartPhase {
  const t = ((fraction % 1) + 1) % 1;
  if (t < 0.15) return 'atrial-systole';
  if (t < 0.53) return 'ventricular-systole';
  if (t < 0.64) return 'isovolumetric-relaxation';
  return 'ventricular-filling';
}
export function heartValves(phase: HeartPhase): Record<Valve, boolean> {
  const filling = phase === 'atrial-systole' || phase === 'ventricular-filling';
  const ejecting = phase === 'ventricular-systole';
  return { tricuspid: filling, mitral: filling, pulmonary: ejecting, aortic: ejecting };
}
export function electricalSignal(t: number): number {
  // Schematic P-QRS-T trace: not a clinical ECG or electrophysiology solver.
  const x = ((t % 1) + 1) % 1;
  const gaussian = (center: number, sigma: number, magnitude: number) =>
    magnitude * Math.exp(-0.5 * ((x - center) / sigma) ** 2);
  return gaussian(0.09, 0.025, 0.23) - gaussian(0.20, 0.009, 0.16) +
    gaussian(0.225, 0.008, 1.2) - gaussian(0.255, 0.012, 0.34) +
    gaussian(0.51, 0.07, 0.34);
}
export const BLOOD_ROUTE = [
  { key: 'body', name: 'Body tissues', oxygenated: false, explanation: 'Systemic tissues extract oxygen and return blood through the venae cavae.' },
  { key: 'right-atrium', name: 'Right atrium', oxygenated: false, explanation: 'Receives systemic venous blood via superior and inferior venae cavae.' },
  { key: 'right-ventricle', name: 'Right ventricle', oxygenated: false, explanation: 'Ejects blood through the pulmonary valve toward the lungs.' },
  { key: 'lungs', name: 'Lungs', oxygenated: true, explanation: 'Pulmonary capillaries exchange oxygen and carbon dioxide with alveoli.' },
  { key: 'left-atrium', name: 'Left atrium', oxygenated: true, explanation: 'Receives oxygen-rich blood returning through pulmonary veins.' },
  { key: 'left-ventricle', name: 'Left ventricle', oxygenated: true, explanation: 'Ejects blood through the aortic valve into the systemic circulation.' },
  { key: 'body-return', name: 'Aorta → body', oxygenated: true, explanation: 'The aorta distributes oxygen-rich blood to systemic arteries.' },
] as const;
export function makeEcgPoints(start = 0, samples = 100) {
  return Array.from({ length: samples }, (_, i) => ({
    x: 10 + i * 520 / (samples - 1),
    y: 67 - electricalSignal(start + i / (samples - 1)) * 42,
  }));
}
