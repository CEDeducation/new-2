/** Classical Mendelian diploid inheritance with independent assortment (unlinked loci only). */
export const TRAITS = [
  { name: 'Stem height', dominant: 'Tall', recessive: 'Dwarf', gene: 'T' },
  { name: 'Seed shape', dominant: 'Round', recessive: 'Wrinkled', gene: 'R' },
  { name: 'Seed colour', dominant: 'Yellow', recessive: 'Green', gene: 'Y' },
  { name: 'Pod shape', dominant: 'Inflated', recessive: 'Constricted', gene: 'I' },
  { name: 'Pod colour', dominant: 'Green', recessive: 'Yellow', gene: 'G' },
  { name: 'Flower colour', dominant: 'Purple', recessive: 'White', gene: 'P' },
  { name: 'Flower position', dominant: 'Axial', recessive: 'Terminal', gene: 'A' },
] as const;
export function gametes(genotype: string): string[] {
  if (!/^(?:[A-Z][A-Za-z]){1,2}$/.test(genotype) || genotype.length % 2) throw new Error('Expected one or two paired Mendelian loci');
  let result = [''];
  for (let i = 0; i < genotype.length; i += 2) {
    const locus = genotype.slice(i, i + 2);
    if (locus[0].toUpperCase() !== locus[1].toUpperCase()) throw new Error('Each allele pair must share a locus');
    const alleles = [...new Set(locus.split(''))];
    result = result.flatMap(prefix => alleles.map(a => prefix + a));
  }
  return result;
}
function orderPair(a:string,b:string){return [a,b].sort((x,y)=>x===x.toUpperCase()&&y!==y.toUpperCase()?-1:x!==x.toUpperCase()&&y===y.toUpperCase()?1:0).join('');}
export function offspring(a:string,b:string):string {
  if(a.length!==b.length) throw new Error('Both gametes must contain identical loci');
  return [...a].map((allele,i)=>{if(allele.toUpperCase()!==b[i].toUpperCase())throw new Error('Locus mismatch');return orderPair(allele,b[i]);}).join('');
}
export function punnett(first:string, second:string) {
  const rows = gametes(first), columns = gametes(second);
  const grid = rows.map(r=>columns.map(c=>offspring(r,c)));
  const frequencies:Record<string,number>={};
  for(const row of grid)for(const genotype of row)frequencies[genotype]=(frequencies[genotype]||0)+1;
  return {rows,columns,grid,frequencies,total:rows.length*columns.length};
}
export function phenotype(genotype:string, dominant:string, recessive:string):string {
  return genotype.slice(0,2).split('').some(a=>a===a.toUpperCase())?dominant:recessive;
}
export function seededPopulation(first:string,second:string,size=100,seed=123456) {
  const p=punnett(first,second),possible=p.grid.flat();
  let x=seed>>>0;
  return Array.from({length:size},()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return possible[Math.floor(x/4294967296*possible.length)];});
}
