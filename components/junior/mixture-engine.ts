/** Classroom particle model: Fe + S -> FeS; not an atomistic force field. */
export type Particle = { id: number; type: 'Fe' | 'S' | 'FeS'; x: number; y: number; collected: boolean; attached?: boolean };
export type Inventory = { ironAtoms: number; sulfurAtoms: number; freeIron: number; freeSulfur: number; compound: number; separated: number };
export function makeMixture(seed=43, amount=22): Particle[] {
  let x = seed >>> 0;
  const random = () => { x = (Math.imul(x, 1664525) + 1013904223) >>> 0; return x/4294967296; };
  const data: Particle[]=[];
  for(let n=0; n<amount*2; n++) data.push({ id:n+1, type:n%2===0?'Fe':'S', x:105+random()*520, y:105+random()*295, collected:false });
  return data;
}
export function inventory(particles:Particle[]): Inventory {
  return particles.reduce((acc,p)=>{
    if(p.type==='Fe' || p.type==='FeS')acc.ironAtoms++;
    if(p.type==='S' || p.type==='FeS')acc.sulfurAtoms++;
    if(p.type==='Fe' && !p.collected)acc.freeIron++;
    if(p.type==='S' && !p.collected)acc.freeSulfur++;
    if(p.type==='FeS')acc.compound++;
    if(p.collected)acc.separated++;
    return acc;
  },{ironAtoms:0,sulfurAtoms:0,freeIron:0,freeSulfur:0,compound:0,separated:0});
}
/** Magnet changes only the position of eligible Fe particles; sulfur and FeS are unaffected. */
export function dragMagnet(particles:Particle[], x:number,y:number, previous?:{x:number;y:number}, strength=60):Particle[]{
  const reach=75+strength*1.1;
  if(x>=695){
    return particles.map(p=>(p.type==='Fe' && !p.collected && (p.attached || Math.hypot(p.x-(previous?.x??x),p.y-(previous?.y??y))<reach*.7))
      ? {...p,attached:false,collected:true,x:724+(p.id%5)*18,y:155+Math.floor(p.id%14)*17} : p);
  }
  return particles.map(p=>{
    if(p.type!=='Fe'||p.collected)return p;
    const distance=Math.hypot(p.x-x,p.y-y);
    if(!p.attached&&distance>reach*.7)return p;
    // Teaching simplification: captured filings move with the magnetic tool.
    return {...p,attached:true,x:x+((p.id%5)-2)*11,y:y+33+(p.id%7)*8};
  });
}
/** Pair as many uncollected Fe and S particles as possible, exactly preserving atoms. */
export function makeIronSulfide(particles:Particle[]):Particle[]{
  const iron=particles.filter(p=>p.type==='Fe'&&!p.collected);
  const sulfur=particles.filter(p=>p.type==='S'&&!p.collected);
  const count=Math.min(iron.length,sulfur.length);
  const used=new Set<number>();
  const compounds:Particle[]=[];
  for(let i=0;i<count;i++){
    used.add(iron[i].id);used.add(sulfur[i].id);
    compounds.push({id:iron[i].id,type:'FeS',x:(iron[i].x+sulfur[i].x)/2,y:(iron[i].y+sulfur[i].y)/2,collected:false});
  }
  return [...particles.filter(p=>!used.has(p.id)),...compounds];
}
