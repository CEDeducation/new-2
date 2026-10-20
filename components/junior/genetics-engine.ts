/** Standard nuclear genetic code, coding strand shown 5′→3′. Translation starts at first AUG and stops at stop codon. */
export const AMINO_ACIDS: Record<string, string> = {
  UUU: 'Phe', UUC: 'Phe', UUA: 'Leu', UUG: 'Leu', UCU: 'Ser', UCC: 'Ser', UCA: 'Ser', UCG: 'Ser', UAU: 'Tyr', UAC: 'Tyr', UAA: 'STOP', UAG: 'STOP', UGU: 'Cys', UGC: 'Cys', UGA: 'STOP', UGG: 'Trp',
  CUU: 'Leu', CUC: 'Leu', CUA: 'Leu', CUG: 'Leu', CCU: 'Pro', CCC: 'Pro', CCA: 'Pro', CCG: 'Pro', CAU: 'His', CAC: 'His', CAA: 'Gln', CAG: 'Gln', CGU: 'Arg', CGC: 'Arg', CGA: 'Arg', CGG: 'Arg',
  AUU: 'Ile', AUC: 'Ile', AUA: 'Ile', AUG: 'Met', ACU: 'Thr', ACC: 'Thr', ACA: 'Thr', ACG: 'Thr', AAU: 'Asn', AAC: 'Asn', AAA: 'Lys', AAG: 'Lys', AGU: 'Ser', AGC: 'Ser', AGA: 'Arg', AGG: 'Arg',
  GUU: 'Val', GUC: 'Val', GUA: 'Val', GUG: 'Val', GCU: 'Ala', GCC: 'Ala', GCA: 'Ala', GCG: 'Ala', GAU: 'Asp', GAC: 'Asp', GAA: 'Glu', GAG: 'Glu', GGU: 'Gly', GGC: 'Gly', GGA: 'Gly', GGG: 'Gly'
};
const PAIR: Record<string, string> = { A: 'T', T: 'A', G: 'C', C: 'G' };
export const REFERENCE_DNA = 'ATGGCTGAATTTTAA';
export function complement(dna: string): string { validateDNA(dna); return [...dna].map(b => PAIR[b]).join(''); }
export function transcribe(dna: string): string { validateDNA(dna); return dna.replaceAll('T', 'U'); }
export function translate(dna: string): { codons: string[]; amino: string[]; started: boolean; stopped: boolean } {
  const rna = transcribe(dna), first = rna.indexOf('AUG');
  if (first < 0) return { codons: [], amino: [], started: false, stopped: false };
  const codons: string[] = [], amino: string[] = []; let stopped = false;
  for (let i = first; i + 2 < rna.length; i += 3) { const codon = rna.slice(i, i + 3), aa = AMINO_ACIDS[codon]; codons.push(codon); if (aa === 'STOP') { stopped = true; break; } amino.push(aa) }
  return { codons, amino, started: true, stopped };
}
export function validateDNA(dna: string) { if (!/^[ACGT]+$/.test(dna)) throw Error('Use A, C, G, T only'); }
export function mutationType(original: string, changed: string): 'unchanged' | 'silent' | 'missense' | 'nonsense' | 'start lost' | 'other' {
  if (original === changed) return 'unchanged';
  const old = translate(original), next = translate(changed);
  if (old.started && !next.started) return 'start lost';
  if (!old.started || !next.started) return 'other';
  if (old.amino.join(',') === next.amino.join(',') && old.stopped === next.stopped) return 'silent';
  if (!old.amino.includes('STOP') && next.stopped && next.amino.length < old.amino.length) return 'nonsense';
  return 'missense';
}
