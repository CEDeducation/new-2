'use client';
import {useMemo,useState} from 'react';
import type { LabProps } from './junior-labs';
import { TRAITS, punnett, seededPopulation, phenotype } from './inheritance-engine';
import './inheritance.css';
export function InheritanceStudio({complete, addObservation}:LabProps){
  const [trait,setTrait]=useState(0),[secondTrait,setSecondTrait]=useState(1),[di,setDi]=useState(false);
  const first=TRAITS[trait],second=TRAITS[secondTrait];
  const [cross,setCross]=useState<'pure'|'f1'|'test'>('f1'),[seed,setSeed]=useState(472),[revealed,setRevealed]=useState<Record<number,boolean>>({});
  const pair=(gene:string,mode:'pure'|'f1'|'test')=>mode==='pure'?[`${gene}${gene}`,`${gene.toLowerCase()}${gene.toLowerCase()}`]:mode==='f1'?[`${gene}${gene.toLowerCase()}`,`${gene}${gene.toLowerCase()}`]:[`${gene}${gene.toLowerCase()}`,`${gene.toLowerCase()}${gene.toLowerCase()}`];
  const [p1,p2]=pair(first.gene,cross),[q1,q2]=pair(second.gene,cross);
  const a=p1+(di?q1:''),b=p2+(di?q2:'');
  const result=useMemo(()=>punnett(a,b),[a,b]);
  const population=useMemo(()=>seededPopulation(a,b,100,seed),[a,b,seed]);
  const predict=(g:string)=>{
    const one=phenotype(g,first.dominant,first.recessive);
    const two=di? ` · ${phenotype(g.slice(2),second.dominant,second.recessive)}`:'';
    return `${one}${two}`;
  };
  const dist=population.reduce((counts,geno)=>{const name=predict(geno);counts[name]=(counts[name]||0)+1;return counts;},{} as Record<string,number>);
  const change=()=>{setRevealed({});complete();};
  return <div className="inh-root"><div className="qt-banner"><div><span>BIOLOGY / HEREDITY</span><h2>Mendelian inheritance field</h2><p>Build monohybrid or dihybrid crosses, predict Punnett squares, and compare expected ratios with 100 simulated offspring.</p></div><span>MODEL · UNLINKED MENDELIAN LOCI</span></div>
    <div className="inh-controls"><label>Trait 1<select value={trait} onChange={e=>{setTrait(Number(e.target.value));change();}}>{TRAITS.map((x,i)=><option key={x.gene} value={i}>{x.name}</option>)}</select></label><label>Cross type<select value={cross} onChange={e=>{setCross(e.target.value as typeof cross);change();}}><option value="pure">P generation · true-breeding</option><option value="f1">F₁ self-cross · heterozygous</option><option value="test">Test cross · heterozygous × recessive</option></select></label><label className="inh-checkbox"><input type="checkbox" checked={di} onChange={e=>{setDi(e.target.checked);change();}}/>Dihybrid cross</label>{di&&<label>Trait 2<select value={secondTrait} onChange={e=>{setSecondTrait(Number(e.target.value));change();}}>{TRAITS.map((x,i)=><option disabled={i===trait} key={x.gene} value={i}>{x.name}</option>)}</select></label>}</div>
    <div className="inh-layout"><section className="inh-panel"><div className="qt-panelHead"><strong>PUNNETT MATRIX · PREDICT, THEN REVEAL</strong><span>{a} × {b}</span></div><div className="inh-matrix" style={{gridTemplateColumns:`repeat(${result.columns.length+1}, minmax(0, 1fr))`}}><span>×</span>{result.columns.map((c,i)=><span className="inh-axis" key={`col-${i}`}>{c}</span>)}{result.rows.map((r,row)=>[<span className="inh-axis" key={`row-${row}`}>{r}</span>, ...result.grid[row].map((g,col)=>{const n=row*result.columns.length+col;return <button key={`cell-${n}`} className={revealed[n]?'revealed':''} title={revealed[n]?predict(g):'Click to reveal possible offspring genotype'} onClick={()=>{setRevealed(prev=>({...prev,[n]:true}));complete();}}>{revealed[n]?g:'?'}</button>})])}</div><div className="qt-actions"><button onClick={()=>{setRevealed(Object.fromEntries(result.grid.flat().map((_,i)=>[i,true])));complete();}}>Reveal whole matrix</button><button onClick={()=>setRevealed({})}>Hide answers</button></div><p>Every cell represents an equally likely gamete combination for these independent Mendelian loci. The uppercase allele is assumed completely dominant.</p></section>
    <section className="inh-panel"><div className="qt-panelHead"><strong>VIRTUAL PEA FIELD · 100 OFFSPRING</strong><span>Seed {seed}</span></div><div className="inh-field">{population.map((g,i)=><span title={predict(g)} key={i} className={g[0]===g[0].toUpperCase()?'inh-dominant':'inh-recessive'}>{g[0]===g[0].toUpperCase()?'♣':'♧'}</span>)}</div><div className="inh-statList">{Object.entries(dist).map(([label,count])=><div key={label}><span>{label}</span><strong>{count}/100</strong><div className="inh-track"><i style={{width:`${count}%`}}/></div></div>)}</div><div className="qt-actions"><button onClick={()=>{setSeed(prev=>prev+7919);complete();}}>Breed 100 again ↻</button><button onClick={()=>addObservation(`${a} × ${b}; ${result.total} matrix cells; observed ${Object.entries(dist).map(([x,n])=>`${x} ${n}%`).join('; ')}.`)}>Save observations</button></div><small>Random variation means 100 plants need not exhibit exact theoretical ratios. The dots are offspring genotypes, not a realistic plant growth simulation.</small></section></div>
  </div>;
}
