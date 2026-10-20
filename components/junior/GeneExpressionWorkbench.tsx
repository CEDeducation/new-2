'use client';
import { useState, type DragEvent } from 'react';
import {
  AMINO_ACIDS, EXAMPLE_GENE, REFERENCE_MRNA, complementaryTemplate,
  mutationEffect, processedRNA, transcribeCodingStrand, translateRNA,
} from './gene-expression-engine';
import './gene-expression.css';

const BASES=['A','U','G','C'] as const;
const EXAMPLE_DNA=EXAMPLE_GENE.map(x=>x.dnaCoding).join('');
export default function GeneExpressionWorkbench({ mode }: {mode:'splicing'|'translation'}) {
  const [removed,setRemoved]=useState<string[]>([]);
  const [rna,setRna]=useState(REFERENCE_MRNA);
  const [codonIndex,setCodonIndex]=useState(0);
  const [playing,setPlaying]=useState(false);
  const [feedback,setFeedback]=useState('Start by removing the intron; exons remain in the mature mRNA.');
  const [focus,setFocus]=useState<'template'|'rna'>('template');
  const finished=removed.includes('I1');
  const nascent=processedRNA(EXAMPLE_GENE,removed);
  const translation=translateRNA(rna);
  const effect=mutationEffect(REFERENCE_MRNA,rna);
  const done=codonIndex>=translation.codons.length;
  const mutation=(index:number) => {
    if(!finished){setFeedback('First remove the intron before editing the mature RNA.');return;}
    const current=rna[index];const next=BASES[(BASES.indexOf(current as typeof BASES[number])+1)%BASES.length];
    setRna(rna.slice(0,index)+next+rna.slice(index+1));setCodonIndex(0);setPlaying(false);
    setFeedback(`RNA position ${index+1}: ${current}→${next}. The ribosome now reads the altered codon sequence.`);
  };
  const removeIntron=(id:string)=>{
    if(id!=='I1') {setFeedback('Exons encode the mature message. Remove only the intron.');return;}
    if(!removed.includes(id))setRemoved(['I1']);
    setFeedback('Intron removed. The two exons join to form a mature mRNA; now explore translation.');
  };
  const drop=(event:DragEvent<HTMLDivElement>)=>{event.preventDefault();removeIntron(event.dataTransfer.getData('text/gene-region'));};
  const record=()=>{const text=[`Gene expression experiment`, `Coding DNA: ${EXAMPLE_DNA}`,`Template (3′→5′): ${complementaryTemplate(EXAMPLE_DNA)}`,`Processed mRNA (5′→3′): ${rna}`,`Protein: ${translation.protein}`,`Mutation category: ${effect}`].join('\n');const u=URL.createObjectURL(new Blob([text],{type:'text/plain'}));const a=document.createElement('a');a.href=u;a.download='openlab-gene-expression.txt';a.click();setTimeout(()=>URL.revokeObjectURL(u),500);};
  return <section className="gene-lab"><header><span>CLASS 12 · MOLECULAR GENETICS · EXPERIMENT {mode==='splicing'?'44':'45'}</span><h2>DNA → pre-mRNA → mature mRNA → protein</h2><p>Manipulate a simplified eukaryotic gene. Physically remove an intron, change individual RNA bases, and step a ribosome through the genetic code. Each change is translated using the complete standard codon table.</p></header>
    <div className="gene-layout"><main><div className="gene-section"><div className="gene-sectionHead"><b>01 / TRANSCRIPTION</b><span>Click for strand orientation</span></div><div className="gene-strandToggle"><button className={focus==='template'?'active':''} onClick={()=>setFocus('template')}>DNA template</button><button className={focus==='rna'?'active':''} onClick={()=>setFocus('rna')}>RNA transcript</button></div>
        <div className="gene-dnaDiagram"><div><label>Coding DNA · 5′ → 3′</label><span>{EXAMPLE_DNA}</span></div><div className="gene-baseLinks">|||||| |||||||| ||||||||||||</div><div><label>Template DNA · 3′ → 5′</label><span>{complementaryTemplate(EXAMPLE_DNA)}</span></div><div className="gene-polymerase">RNA POLYMERASE ↓</div><div><label>Pre-mRNA · 5′ → 3′</label><span>{transcribeCodingStrand(EXAMPLE_DNA)}</span></div></div><p className="gene-note">RNA matches the coding strand except uracil (U) replaces thymine (T). Polymerase actually reads the complementary template strand in the 3′ → 5′ direction.</p></div>
      <div className="gene-section"><div className="gene-sectionHead"><b>02 / RNA PROCESSING</b><span>Drag the purple intron into the discard zone</span></div><div className="gene-regionRow">{EXAMPLE_GENE.filter(r=>!removed.includes(r.id)).map(region=><button key={region.id} type="button" className={`gene-region ${region.type}`} draggable={region.type==='intron'} onDragStart={e=>e.dataTransfer.setData('text/gene-region',region.id)} onClick={()=>region.type==='intron'?removeIntron(region.id):setFeedback('Exon retained. Exons must remain in the correct order.')}><strong>{region.id} · {region.type}</strong><span>{transcribeCodingStrand(region.dnaCoding)}</span></button>)}</div><div className="gene-trash" role="group" aria-label="Intron removal zone" onDragOver={e=>e.preventDefault()} onDrop={drop}><b>✂ Spliceosome</b><span>{finished?'Intron removed ✓':'Drop intron here (or click its purple block)'}</span></div><p className="gene-note">{finished?'The two exon sequences are joined without altering their order.':'Exons and introns coexist in the nascent transcript.'}</p><div className="gene-output"><small>{finished?'MATURE mRNA':'UNPROCESSED pre-mRNA'}</small><strong>{nascent}</strong></div></div>
      <div className="gene-section"><div className="gene-sectionHead"><b>03 / TRANSLATION & MUTATION</b><span>Click individual bases to substitute A → U → G → C</span></div><div className="gene-letters">{rna.split('').map((base,i)=><button disabled={!finished} key={i} className={base!==REFERENCE_MRNA[i]?'mutated':''} type="button" aria-label={`Nucleotide ${i+1} is ${base}; click to substitute`} onClick={()=>mutation(i)} title={`Base ${i+1}: ${base}`}>{base}</button>)}</div><div className="gene-codons">{translation.codons.map((codon,i)=><button type="button" key={i} className={i===codonIndex?'reading':''} onClick={()=>setCodonIndex(i)}><b>{codon}</b><span>{translation.aminoAcids[i] ? AMINO_ACIDS[translation.aminoAcids[i]] : 'STOP'}</span></button>)}</div><div className="gene-ribosome"><div className="gene-ribosomeTop">RIBOSOME · 5′ → 3′</div><div className="gene-ribosomeTunnel"><span>mRNA</span><div>{translation.codons[codonIndex] || 'END'}</div><span>tRNA</span></div><div className="gene-chain">{translation.aminoAcids.slice(0, Math.min(codonIndex+1,translation.aminoAcids.length)).map((aa,i)=><span key={i} title={AMINO_ACIDS[aa]}>{aa}</span>)}</div></div><div className="gene-actions"><button type="button" disabled={!finished} onClick={()=>setCodonIndex(v=>Math.min(v+1,translation.codons.length))}>Advance ribosome →</button><button type="button" onClick={()=>{setRna(REFERENCE_MRNA);setCodonIndex(0);setPlaying(false);setFeedback('Original mRNA restored.')}}>Restore wild-type RNA</button><button type="button" onClick={()=>{setRemoved([]);setRna(REFERENCE_MRNA);setCodonIndex(0);setPlaying(false);setFeedback('Experiment reset. Remove the intron again.')}}>Reset all</button></div></div>
    </main><aside><div className="gene-info"><span>LIVE OBSERVATIONS</span><h3>{finished?'Processed transcript ready':'Pre-mRNA processing'}</h3><div><small>Exons retained</small><b>2</b></div><div><small>Intron removed</small><b>{finished?'YES':'NO'}</b></div><div><small>mRNA length</small><b>{rna.length} bases</b></div><div><small>Open reading frame</small><b>{translation.aminoAcids.length} amino acids</b></div><div><small>RNA alteration</small><b>{effect.replaceAll('-',' ')}</b></div><div><small>Translation stop</small><b>{translation.stopped?'STOP codon found':'No stop'}</b></div></div><div className="gene-info"><h3>Feedback</h3><p role="status">{feedback}</p><button type="button" onClick={record}>↓ Export observation note</button></div><div className="gene-info"><h3>Science limitations</h3><p>This model uses a short fictional protein-coding sequence with one intron. Real gene expression includes promoters, transcriptional regulation, splice-site recognition, RNA processing, ribosome initiation, and protein folding. Clicking a base illustrates a substitution; it does not depict CRISPR or actual mutation chemistry.</p></div></aside></div>
  </section>;
}
