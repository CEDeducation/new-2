/**
 * Deterministic, small-scope educational models for Junior's experiment benches.
 * Do not treat these as a general chemistry simulator, medical model or laboratory measurement.
 * All public functions are pure to make assumptions and numerical behaviour testable.
 */
export const round = (value: number, decimals = 2) => Number(value.toFixed(decimals));
export const clamp = (value: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, value));

export function conservationOfMass(initialGrams: number, reacted: boolean, sealed: boolean) {
  const start = clamp(initialGrams, 5, 500);
  // The educational closed-vessel reaction keeps all products in the system.
  return { massBefore: start, massAfter: start, precipitateVisible: reacted,
    message: !sealed ? 'Close the vessel to model a closed-system mass balance.' : reacted ? 'A precipitate appears, but the mass of the sealed apparatus remains constant.' : 'Reactants remain separate in the sealed vessel.' };
}

export type Sample = 'lemon' | 'water' | 'soap';
export const PH_SAMPLES: Record<Sample, { label: string; ph: number; description: string }> = {
  lemon: { label: 'Lemon juice', ph: 2.4, description: 'Acidic sample (illustrative pH)' },
  water: { label: 'Pure water', ph: 7, description: 'Neutral at 25 °C' },
  soap: { label: 'Soap solution', ph: 10.2, description: 'Alkaline sample (illustrative pH)' },
};
export function indicatorModel(sample: Sample, dilutionFactor = 1) {
  const starting = PH_SAMPLES[sample].ph;
  // Educational dilution assumes ideal fully-dissociated acid/base and ignores buffering.
  const ph = clamp(starting < 7 ? starting + Math.log10(dilutionFactor) : starting > 7 ? starting - Math.log10(dilutionFactor) : 7, 0, 14);
  const h = 10 ** -ph, oh = 1e-14 / h;
  const color = ph < 3 ? '#e55267' : ph < 5 ? '#ff9259' : ph < 6.5 ? '#efc859' : ph < 7.5 ? '#6ed0a2' : ph < 9 ? '#56afc9' : ph < 11 ? '#648ae0' : '#a979dc';
  return { ph, hydrogen: h, hydroxide: oh, color, sample: PH_SAMPLES[sample] };
}

export function solutionModel(massGrams: number, molarMass: number, finalVolumeMl: number) {
  const mass = clamp(massGrams, 0, 100);
  const volumeL = clamp(finalVolumeMl, 1, 2000) / 1000;
  const moles = mass / molarMass;
  return { molarity: moles / volumeL, moles, mass, volumeL, targetMassAtOneM: molarMass * volumeL };
}

export function neutralizationCalorimetry(acidMl: number, baseMl: number, concentrationM: number, efficiency = 1) {
  // Ideal, strong acid + strong base, 25 °C, 1 g/mL density, 4.184 J/g/K.
  const reactedMoles = Math.min(acidMl, baseMl) / 1000 * concentrationM;
  const heatJ = reactedMoles * 57300 * clamp(efficiency, 0, 1);
  const solutionMass = acidMl + baseMl;
  return { heatJ, temperatureRiseC: heatJ / (solutionMass * 4.184), reactedMoles, enthalpyKjMol: -57.3 };
}

export function complexEquilibrium(feM: number, scnM: number, k = 138) {
  // Fe3+ + SCN- <=> FeSCN2+. Solve K = x / ((a-x)*(b-x)).
  const a = Math.max(0, feM), b = Math.max(0, scnM);
  let low = 0, high = Math.min(a, b);
  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2;
    const quotient = mid / Math.max(1e-30, (a-mid) * (b-mid));
    if (quotient > k) high = mid; else low = mid;
  }
  const complexM = (low + high)/2;
  return { complexM, freeFeM: a-complexM, freeScnM: b-complexM, fractionScnBound: b ? complexM/b : 0 };
}

export function freezingPoint(massSoluteG: number, molarMassG: number, massSolventKg: number, vanTHoff = 1) {
  const molality = (massSoluteG/molarMassG) / massSolventKg;
  const depression = 1.86 * molality * vanTHoff; // water's Kf (°C kg mol-1)
  return { molality, depression, freezingC: -depression };
}

export function cardiacOutput(bpm: number, strokeVolumeMl: number) {
  return { beatsPerMinute: bpm, secondsPerBeat: 60/bpm, outputLitresPerMinute: bpm*strokeVolumeMl/1000,
    beatFraction: .32 /* approximate systolic fraction for illustration only */ };
}

export function respiratoryModel(tidalVolumeMl: number, breathsPerMinute: number, deadSpaceMl = 150) {
  const alveolarMlPerMin = Math.max(0, tidalVolumeMl-deadSpaceMl)*breathsPerMinute;
  return { minuteVentilationL: tidalVolumeMl*breathsPerMinute/1000, alveolarVentilationL: alveolarMlPerMin/1000, deadSpaceMl };
}

export function nephronModel(netFiltrationPressureMmHg: number, adh: number) {
  // Kf = 12.5 mL/min/mmHg, stylized healthy adult baseline.
  const gfrMlMin = Math.max(0, netFiltrationPressureMmHg)*12.5;
  // Simple illustration of ADH-dependent water reabsorption, NOT a renal prediction.
  const urineMlMin = gfrMlMin * (0.02-0.017*clamp(adh,0,1));
  return { gfrMlMin, urineMlMin, reabsorptionFraction: gfrMlMin ? 1-urineMlMin/gfrMlMin : 0 };
}

export function hardyWeinberg(p: number) {
  const P = clamp(p,0,1), q = 1-P;
  return { p:P, q, AA:P*P, Aa:2*P*q, aa:q*q, sum:P*P+2*P*q+q*q };
}
export function selectedPopulation(initialP: number, selection: number, generations: number) {
  let p=clamp(initialP,0,1);
  const series=[{ generation:0, p }];
  for(let g=1;g<=generations;g++){
    const q=1-p;
    const wAA=1, wAa=1-selection/2, waa=1-selection;
    const mean = p*p*wAA+2*p*q*wAa+q*q*waa;
    p = mean <= 0 ? p : (p*p*wAA + p*q*wAa)/mean;
    series.push({generation:g,p});
  }
  return series;
}
export function linkageMap(parentalA: number, parentalB: number, recombinantA: number, recombinantB: number) {
  const total=parentalA+parentalB+recombinantA+recombinantB;
  const frequency=total ? (recombinantA+recombinantB)/total : 0;
  return { total, recombinantFrequency:frequency, distanceCm: Math.min(50,frequency*100) };
}
export function trophicIllustration(startPpm: number, factor: number, levels = 5) {
  // Transfer/magnification factor is student-assumed; varies enormously in real ecosystems.
  return Array.from({length:levels},(_,i)=>({level:i, ppm:startPpm*factor**i}));
}
export function reflexTime(distanceMetres: number, nerveSpeedMs: number, synapses = 1) {
  return { conductionMs: distanceMetres / nerveSpeedMs * 1000, totalMs: distanceMetres/nerveSpeedMs*1000 + synapses*.75 };
}

export function permanganateEndpoint(oxalicM: number, oxalicMl: number, permanganateM: number, addedMl: number) {
  // In acidic medium: 2 MnO4- + 5 C2O4^2- +16 H+ -> 2 Mn2+ +10 CO2 +8 H2O.
  const oxMoles=oxalicM*oxalicMl/1000;
  const neededPermanganateMoles=oxMoles*2/5;
  const added=permanganateM*addedMl/1000;
  return {equivalenceMl:neededPermanganateMoles/permanganateM*1000, excessMoles:Math.max(0,added-neededPermanganateMoles), fractionToEndpoint:added/neededPermanganateMoles};
}
export function stomatalWaterFlux(lightFraction:number, humidityFraction:number, temperatureC:number) {
  // A deliberately dimensionless index based on stomatal openness and vapour-pressure demand.
  const openness=clamp(.1 + .9*lightFraction,0,1);
  const temperatureFactor= Math.exp((temperatureC-25)*.055);
  const deficit=clamp(1-humidityFraction,0,1);
  return {openness,deficit,relativeFlux:openness*temperatureFactor*deficit};
}
export function enzymeRate(substrateMm:number, kmMm:number, vmax:number, ph:number, optimumPh:number, temperatureC:number){
  // Michaelis–Menten with a Gaussian pH activity modifier and symmetric classroom temperature curve.
  const saturation=substrateMm/(kmMm+substrateMm);
  const phFactor=Math.exp(-.5*((ph-optimumPh)/1.5)**2);
  const tempFactor=Math.exp(-.5*((temperatureC-37)/15)**2);
  return {relativeRate:vmax*saturation*phFactor*tempFactor, saturation,phFactor,tempFactor};
}
export function diffusionStep(leftParticles:number,rightParticles:number,permeability:number,atp:boolean,transport:'passive'|'active'){
  const transfer=Math.min(leftParticles, Math.max(0,Math.floor((leftParticles-rightParticles)*permeability*.12)));
  // Active transporter delivers one particle uphill at the cost of one classroom ATP token.
  if(transport==='active'){const pumped=atp && rightParticles>0 ? 1 : 0;return {left:leftParticles+pumped,right:rightParticles-pumped,atpUsed:pumped};}
  return {left:leftParticles-transfer,right:rightParticles+transfer,atpUsed:0};
}
