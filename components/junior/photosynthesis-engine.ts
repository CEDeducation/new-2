/** Relative educational photosynthesis response model, not a biochemical rate law or crop-yield predictor. */
export type PhotosynthesisConditions = { light: number; co2: number; water: number; temperature: number; wavelength: number };
const between=(x:number,lo:number,hi:number)=>Number.isFinite(x)&&x>=lo&&x<=hi;
export function photosynthesis(c:PhotosynthesisConditions) {
  if(!between(c.light,0,100)||!between(c.co2,0,1500)||!between(c.water,0,100)||!between(c.temperature,0,50)||!between(c.wavelength,400,700))throw new Error('Photosynthesis input outside classroom range');
  const lightFactor=c.light/(c.light+22); // illustrative saturating light response
  const co2Factor=c.co2/(c.co2+200);
  const waterFactor=Math.min(1,c.water/65);
  const temperatureFactor=Math.exp(-Math.pow((c.temperature-28)/14,2));
  const spectrumFactor=.18+.54*Math.exp(-Math.pow((c.wavelength-445)/32,2))+.54*Math.exp(-Math.pow((c.wavelength-665)/35,2));
  const relativeRate=Math.min(100,100*lightFactor*co2Factor*waterFactor*temperatureFactor*spectrumFactor/0.68);
  const factors={light:lightFactor,co2:co2Factor,water:waterFactor,temperature:temperatureFactor,spectrum:spectrumFactor};
  return {relativeRate,oxygenIndex:relativeRate/10,sugarIndex:relativeRate/100,factors};
}
export function photosynthesisCsv(c:PhotosynthesisConditions):string {
  const data=photosynthesis(c);
  return `light_pct,co2_ppm,water_pct,temperature_C,wavelength_nm,relative_rate_pct\n${c.light},${c.co2},${c.water},${c.temperature},${c.wavelength},${data.relativeRate.toFixed(4)}`;
}
