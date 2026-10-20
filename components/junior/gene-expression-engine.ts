/** Eukaryotic gene expression teaching model: RNA processing and translation. */
export type Region = { id: string; type: 'exon' | 'intron'; dnaCoding: string };
export const EXAMPLE_GENE: readonly Region[] = [
  { id: 'E1', type: 'exon', dnaCoding: 'ATGGCT' },
  { id: 'I1', type: 'intron', dnaCoding: 'GTACCTAG' },
  { id: 'E2', type: 'exon', dnaCoding: 'AAAGGTTTTTGA' },
];
const CODONS: Record<string,string> = {
  UUU:'F',UUC:'F',UUA:'L',UUG:'L',UCU:'S',UCC:'S',UCA:'S',UCG:'S',UAU:'Y',UAC:'Y',UAA:'*',UAG:'*',UGU:'C',UGC:'C',UGA:'*',UGG:'W',
  CUU:'L',CUC:'L',CUA:'L',CUG:'L',CCU:'P',CCC:'P',CCA:'P',CCG:'P',CAU:'H',CAC:'H',CAA:'Q',CAG:'Q',CGU:'R',CGC:'R',CGA:'R',CGG:'R',
  AUU:'I',AUC:'I',AUA:'I',AUG:'M',ACU:'T',ACC:'T',ACA:'T',ACG:'T',AAU:'N',AAC:'N',AAA:'K',AAG:'K',AGU:'S',AGC:'S',AGA:'R',AGG:'R',
  GUU:'V',GUC:'V',GUA:'V',GUG:'V',GCU:'A',GCC:'A',GCA:'A',GCG:'A',GAU:'D',GAC:'D',GAA:'E',GAG:'E',GGU:'G',GGC:'G',GGA:'G',GGG:'G',
};
export const AMINO_ACIDS:Record<string,string>={M:'Methionine',A:'Alanine',K:'Lysine',G:'Glycine',F:'Phenylalanine',R:'Arginine',S:'Serine',L:'Leucine',I:'Isoleucine',T:'Threonine',N:'Asparagine',Q:'Glutamine',H:'Histidine',D:'Aspartate',E:'Glutamate',V:'Valine',P:'Proline',Y:'Tyrosine',C:'Cysteine',W:'Tryptophan','*':'Stop'};
const assertDNA=(s:string) => {if (!/^[ACGT]*$/i.test(s)) throw new Error('Only DNA bases A,C,G,T are supported');};
export function transcribeCodingStrand(codingDNA: string) {
  assertDNA(codingDNA);
  return codingDNA.toUpperCase().replaceAll('T','U');
}
export function complementaryTemplate(codingDNA: string) {
  assertDNA(codingDNA);
  const complement:Record<string,string>={A:'T',T:'A',C:'G',G:'C'};
  return [...codingDNA.toUpperCase()].map(base=>complement[base]).join('');
}
export function processedRNA(regions: readonly Region[], removedIntrons: readonly string[]) {
  return regions.filter(region=>region.type==='exon' || !removedIntrons.includes(region.id))
    .map(region=>transcribeCodingStrand(region.dnaCoding)).join('');
}
export function translateRNA(raw: string, startIndex=0) {
  const rna = raw.toUpperCase();
  if (!/^[ACGU]*$/.test(rna)) throw new Error('An RNA sequence may contain only A,C,G,U');
  const codons:string[]=[];
  const aminoAcids:string[]=[];
  let stopped = false;
  for(let i=startIndex;i+2<rna.length;i+=3) {
    const codon=rna.slice(i,i+3);const aa=CODONS[codon];
    if(!aa) throw new Error(`Unknown codon ${codon}`);
    codons.push(codon);
    if(aa==='*'){stopped=true;break;}
    aminoAcids.push(aa);
  }
  return {codons,aminoAcids,protein:aminoAcids.join('-'),stopped,translatedBases:codons.length*3};
}
export type MutationKind='silent'|'missense'|'nonsense'|'start-loss'|'stop-loss'|'no-change'|'other';
export function mutationEffect(referenceRNA:string, changedRNA:string):MutationKind {
  if(referenceRNA===changedRNA)return 'no-change';
  if(referenceRNA.length!==changedRNA.length)return 'other';
  const standard=translateRNA(referenceRNA);
  const variant=translateRNA(changedRNA);
  if(standard.codons[0]==='AUG'&&variant.codons[0]!=='AUG')return 'start-loss';
  if(standard.stopped&&!variant.stopped)return 'stop-loss';
  if(!standard.stopped&&variant.stopped)return 'nonsense';
  if(variant.aminoAcids.length<standard.aminoAcids.length&&variant.stopped)return 'nonsense';
  return standard.protein===variant.protein?'silent':'missense';
}
export const REFERENCE_MRNA=processedRNA(EXAMPLE_GENE,['I1']);
export const BASE_PAIRING: Record<string,string>={A:'U',T:'A',G:'C',C:'G'};
