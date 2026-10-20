/** Closed library of documented classroom outcomes, not a general chemistry or hazard engine. */
export type Ion = 'Na+' | 'Ca2+' | 'Ba2+' | 'Cu2+' | 'Fe3+' | 'Al3+' | 'CO3_2-' | 'Cl-' | 'SO4_2-';
export type Test = 'flame' | 'naoh' | 'excessNaoh' | 'diluteAcid' | 'silverNitrate' | 'bariumChloride';
export type Observation = { name: string; appearance: string; description: string; precipitate?: string; gas?: string; safe?: string };
export const SAMPLES: { ion: Ion; label: string; family:'cation'|'anion' }[] = [
  {ion:'Na+', label:'Sodium ion', family:'cation'},{ion:'Ca2+',label:'Calcium ion',family:'cation'},{ion:'Ba2+',label:'Barium ion',family:'cation'},
  {ion:'Cu2+',label:'Copper(II) ion',family:'cation'},{ion:'Fe3+',label:'Iron(III) ion',family:'cation'},{ion:'Al3+',label:'Aluminium ion',family:'cation'},
  {ion:'CO3_2-',label:'Carbonate ion',family:'anion'},{ion:'Cl-',label:'Chloride ion',family:'anion'},{ion:'SO4_2-',label:'Sulfate ion',family:'anion'},
];
const empty: Observation = { name:'No diagnostic response',appearance:'#84c5d4',description:'No characteristic positive result in this simplified virtual test. A negative result does not prove absence of every ion.' };
const positive: Partial<Record<Ion, Partial<Record<Test, Observation>>>> = {
  'Na+': { flame: {name:'Strong persistent yellow flame',appearance:'#ffe053',description:'Sodium emission is dominated by bright yellow spectral lines near 589 nm.'}},
  'Ca2+': { flame: {name:'Brick-red / orange-red flame',appearance:'#f1815a',description:'A characteristic flame-test colour consistent with calcium.'}, naoh:{name:'White precipitate (conditional)',appearance:'#f2f4f4',precipitate:'#f0f2f2',description:'Ca(OH)₂ may precipitate in suitable concentrations; dilute samples might not show a strong precipitate.'}},
  'Ba2+': { flame:{name:'Apple-green flame',appearance:'#a2f083',description:'A characteristic barium flame-test emission colour.'}},
  'Cu2+': { flame:{name:'Blue-green flame',appearance:'#5bcfa4',description:'Copper compounds commonly show blue-green flame colours; composition affects appearance.'},naoh:{name:'Pale blue precipitate',appearance:'#8fd4f2',precipitate:'#82c9e9',description:'Cu²⁺ plus OH⁻ gives an insoluble copper(II) hydroxide precipitate.'}},
  'Fe3+': { naoh:{name:'Reddish-brown precipitate',appearance:'#b66e49',precipitate:'#ad5d3a',description:'Fe³⁺ forms reddish-brown hydrated iron(III) hydroxide in alkali.'}},
  'Al3+': { naoh:{name:'White gelatinous precipitate',appearance:'#f2f2eb',precipitate:'#e6eeec',description:'Al(OH)₃ forms a white gelatinous precipitate.'}, excessNaoh:{name:'White precipitate dissolves',appearance:'#84c5d4',description:'Amphoteric Al(OH)₃ dissolves in excess strong NaOH to form soluble aluminate species.'}},
  'CO3_2-':{diluteAcid:{name:'Effervescence — carbon dioxide',appearance:'#a1dce8',gas:'CO₂',description:'Acid–carbonate reaction releases CO₂. A limewater test would be needed to support identification.'}},
  'Cl-':{silverNitrate:{name:'White AgCl precipitate',appearance:'#f3f2e8',precipitate:'#efede3',description:'Chloride gives a white silver chloride precipitate with AgNO₃ under suitable conditions.'}},
  'SO4_2-':{bariumChloride:{name:'White BaSO₄ precipitate',appearance:'#faf7f2',precipitate:'#f1f4ec',description:'Sulfate yields sparingly soluble barium sulfate with Ba²⁺. Standard confirmatory conditions exclude competing ions.'}},
};
export function testIon(ion:Ion,test:Test): Observation { return positive[ion]?.[test] ?? empty; }
export function knownPositive(ion:Ion):Test[]{return Object.keys(positive[ion]||{}) as Test[];}
