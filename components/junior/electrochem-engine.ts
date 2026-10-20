/** Nernst activity approximation for Zn(s)|Zn2+(aq)||Cu2+(aq)|Cu(s) at ideal solution activity. */
const R=8.314462618; // J mol−1 K−1
const F=96485.33212; // C mol−1
export function nernst({zinc,copper,temperature=298.15}:{zinc:number;copper:number;temperature?:number}):number{
 if(!Number.isFinite(zinc)||!Number.isFinite(copper)||zinc<=0||copper<=0)throw new Error('Activities must be positive');
 if(!Number.isFinite(temperature)||temperature<=0)throw new Error('Kelvin temperature must be positive');
 const E0=1.10;return E0-R*temperature/(2*F)*Math.log(zinc/copper);
}
export function theoreticalGibbs(e:number):number{return -2*F*e/1000;} // kJ per mole of reaction
export function cellSummary(zinc:number,copper:number,temperature=298.15){
 const potential=nernst({zinc,copper,temperature});
 return {potential,quotient:zinc/copper,gibbsKJ:theoreticalGibbs(potential), spontaneous:potential>0};
}
