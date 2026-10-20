/** Narrow, explicit nomenclature helper for unbranched C1–C8 hydrocarbons and three terminal functional groups. */
export type FunctionalGroup = 'none'|'alcohol'|'aldehyde'|'acid';
const stems = ['', 'meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct'];
const sub=(v:number)=>String(v).replace(/\d/g,x=>'₀₁₂₃₄₅₆₇₈₉'[Number(x)]);
export function carbonChain(length:number, bonds:number[], group:FunctionalGroup='none') {
  if(!Number.isInteger(length)||length<1||length>8||bonds.length!==length-1||bonds.some(v=>!Number.isInteger(v)||v<1||v>3))throw new Error('Unsupported chain geometry');
  if(group!=='none' && bonds.some(v=>v!==1))throw new Error('This introduction combines terminal functional groups with saturated chains only');
  if(group==='aldehyde' && length===0)throw new Error('An aldehyde needs a carbonyl carbon');
  const enriched=bonds.map((v,i)=>({v,pos:Math.min(i+1,length-i)})).filter(e=>e.v!==1);
  if(enriched.length>1||enriched.some(e=>e.v!==enriched[0].v))throw new Error('This exercise supports one double or triple C–C bond');
  let hydrogens=0;
  const carbonHydrogens:number[]=[];
  for(let i=0;i<length;i++){
    const total=(i>0?bonds[i-1]:0)+(i<length-1?bonds[i]:0)+(i===length-1?(group==='none'?0:group==='alcohol'?1:group==='aldehyde'?2:3):0);
    if(total>4)throw new Error('Carbon valence exceeded');
    carbonHydrogens.push(4-total);
    hydrogens+=4-total;
  }
  if(group==='alcohol'||group==='acid')hydrogens+=1; // OH hydrogen
  const oxygen=group==='none'?0:group==='acid'?2:1;
  const name=group==='none'
    ? (!enriched.length?`${stems[length]}ane`: length===2?`${stems[length]}${enriched[0].v===2?'ene':'yne'}`:`${stems[length]}-${enriched[0].pos}-${enriched[0].v===2?'ene':'yne'}`)
    : group==='alcohol'?(length===1?'methanol':`${stems[length]}an-1-ol`)
    : group==='aldehyde'?`${stems[length]}anal`:`${stems[length]}anoic acid`;
  return {name,formula:`C${sub(length)}H${sub(hydrogens)}${oxygen?`O${oxygen>1?sub(oxygen):''}`:''}`,carbonHydrogens,length,oxygen,group};
}
