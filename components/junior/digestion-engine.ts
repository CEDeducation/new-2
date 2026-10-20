/**
 * Classroom digestion model (not a clinical or physiological prediction).
 * The quantities are illustrative food-mass units, not human absorption rates.
 * This engine preserves nutrient mass across digestion and absorption stages.
 */
export type FoodKey = 'rice' | 'egg' | 'nuts' | 'meal';
export type NutrientKey = 'carbohydrate' | 'protein' | 'fat';
export type DigestiveStage = 'mouth' | 'esophagus' | 'stomach' | 'duodenum' | 'small-intestine' | 'large-intestine' | 'rectum';

export interface FoodSpec {
  name: string;
  description: string;
  carbohydrate: number;
  protein: number;
  fat: number;
}
export interface DigestiveSettings {
  stomachPH: number;
  pancreaticEnzymes: number;
  bileAvailable: boolean;
  salivaAmylase: boolean;
  /** Optional for older saved sessions: default is physiologically present. */
  pepsinAvailable?: boolean;
}
export interface NutrientBalance {
  undigested: number;
  absorbable: number;
  absorbed: number;
}
export interface DigestiveSnapshot {
  stage: DigestiveStage;
  nutrients: Record<NutrientKey, NutrientBalance>;
  total: number;
  absorbed: number;
  remaining: number;
  activity: string;
  acidity: string;
}

export const FOODS: Record<FoodKey, FoodSpec> = {
  rice: { name: 'Cooked rice', description: 'Carbohydrate-rich example', carbohydrate: 78, protein: 7, fat: 2 },
  egg: { name: 'Boiled egg', description: 'Protein- and fat-rich example', carbohydrate: 2, protein: 48, fat: 34 },
  nuts: { name: 'Nuts', description: 'Fat- and protein-rich example', carbohydrate: 18, protein: 24, fat: 51 },
  meal: { name: 'Mixed meal', description: 'A blend of nutrients', carbohydrate: 54, protein: 24, fat: 22 },
};

export const STAGES: { id: DigestiveStage; name: string; organ: string; short: string; description: string; x: number; y: number }[] = [
  { id: 'mouth', name: 'Mouth', organ: 'Salivary glands', short: 'Chewing + saliva', description: 'Teeth fragment food, while saliva moistens the bolus. Salivary amylase begins starch hydrolysis; chewing is mechanical digestion, not absorption.', x: 254, y: 98 },
  { id: 'esophagus', name: 'Esophagus', organ: 'Muscular tube', short: 'Peristalsis', description: 'Coordinated contractions propel a swallowed bolus into the stomach. It does not normally secrete digestive enzymes or carry out significant nutrient absorption.', x: 260, y: 199 },
  { id: 'stomach', name: 'Stomach', organ: 'Gastric glands', short: 'Acid + pepsin', description: 'Gastric acid denatures proteins and helps pepsin function. Churning forms chyme. Most nutrient absorption still lies ahead.', x: 299, y: 297 },
  { id: 'duodenum', name: 'Duodenum', organ: 'Pancreas, liver + gallbladder', short: 'Enzymes + bile', description: 'Pancreatic amylase, proteases and lipase enter the duodenum. Bile, produced in the liver and stored in the gallbladder, emulsifies fats but is not itself an enzyme.', x: 274, y: 390 },
  { id: 'small-intestine', name: 'Small intestine', organ: 'Villi + microvilli', short: 'Absorption', description: 'Digested nutrients cross the intestinal lining. Glucose and amino acids mainly enter blood, while many dietary lipids enter intestinal lymph after processing.', x: 262, y: 476 },
  { id: 'large-intestine', name: 'Large intestine', organ: 'Colon', short: 'Water balance', description: 'The colon absorbs water and electrolytes, and microorganisms ferment some remaining material. It is not the principal site for nutrient absorption.', x: 340, y: 509 },
  { id: 'rectum', name: 'Rectum / anus', organ: 'Elimination', short: 'Storage + exit', description: 'The rectum stores feces until elimination. The model records unabsorbed macronutrient material; it does not include microbiome metabolism or water content.', x: 267, y: 619 },
];
export const DEFAULT_SETTINGS: DigestiveSettings = { stomachPH: 2.0, pancreaticEnzymes: 100, bileAvailable: true, salivaAmylase: true, pepsinAvailable: true };
const KEYS: NutrientKey[] = ['carbohydrate', 'protein', 'fat'];
const clamp = (x: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, x));

/** Fraction of currently undigested substrate hydrolysed at this step.
 *  Values are illustrative, deliberately not empirical human coefficients.
 */
export function digestFood(food: FoodSpec, stageIndex: number, settings: DigestiveSettings): DigestiveSnapshot {
  const stage = STAGES[clamp(Math.round(stageIndex), 0, STAGES.length - 1)];
  const nutrients = Object.fromEntries(KEYS.map(k => [k, {
    undigested: food[k], absorbable: 0, absorbed: 0,
  }])) as Record<NutrientKey, NutrientBalance>;
  const hydrolyse = (key: NutrientKey, fraction: number) => {
    const pool = nutrients[key];
    const amount = pool.undigested * clamp(fraction, 0, 1);
    pool.undigested -= amount;
    pool.absorbable += amount;
  };
  const absorb = (fraction: number) => {
    for (const key of KEYS) {
      const pool = nutrients[key];
      const amount = pool.absorbable * clamp(fraction, 0, 1);
      pool.absorbable -= amount;
      pool.absorbed += amount;
    }
  };
  const enzyme = clamp(settings.pancreaticEnzymes / 100, 0, 1);
  const acid = clamp(1 - Math.abs(settings.stomachPH - 2) / 4.5, 0, 1);
  if (stageIndex >= 0 && settings.salivaAmylase) hydrolyse('carbohydrate', 0.11);
  if (stageIndex >= 2 && settings.pepsinAvailable !== false) hydrolyse('protein', 0.26 * acid);
  if (stageIndex >= 3) {
    hydrolyse('carbohydrate', 0.78 * enzyme);
    hydrolyse('protein', 0.77 * enzyme);
    hydrolyse('fat', 0.79 * enzyme * (settings.bileAvailable ? 1 : 0.28));
  }
  if (stageIndex >= 4) {
    // Brush-border completion and absorption of available products.
    hydrolyse('carbohydrate', 0.64 * enzyme);
    hydrolyse('protein', 0.62 * enzyme);
    hydrolyse('fat', 0.48 * enzyme * (settings.bileAvailable ? 1 : 0.3));
    absorb(0.91);
  }
  if (stageIndex >= 5) absorb(0.04);
  const total = KEYS.reduce((sum, k) => sum + food[k], 0);
  const absorbed = KEYS.reduce((sum, k) => sum + nutrients[k].absorbed, 0);
  return {
    stage: stage.id,
    nutrients,
    total,
    absorbed,
    remaining: total - absorbed,
    activity: stage.description,
    acidity: stageIndex < 2 ? 'Near-neutral' : stageIndex === 2 ? `pH ${settings.stomachPH.toFixed(1)}` : 'Neutralized in intestine',
  };
}

export function checkDigestionBalance(snapshot: DigestiveSnapshot): boolean {
  const total = KEYS.reduce((sum, key) => {
    const n = snapshot.nutrients[key];
    return sum + n.undigested + n.absorbable + n.absorbed;
  }, 0);
  return Math.abs(total - snapshot.total) < 1e-8 && Math.abs(snapshot.remaining + snapshot.absorbed - snapshot.total) < 1e-8;
}
