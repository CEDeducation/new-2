"use client"

/** Hand-drawn, labelled conceptual diagrams. These are educational schematics, not micrographs. */
import type { ReactNode } from "react"

type Props = { kind: string; compact?: boolean; topic?: string }
const label = (x: number, y: number, value: string, color = "#b7c7e6") => <text x={x} y={y} fill={color} fontSize="12" fontFamily="Arial,sans-serif">{value}</text>
const dot = (x: number, y: number, r: number, fill: string) => <circle cx={x} cy={y} r={r} fill={fill} />
const atom = <>
  {[43, 80, 113].map(r => <circle key={r} cx="180" cy="118" r={r} fill="none" stroke="#9f9cf4" strokeWidth="1.5" opacity={r === 113 ? .35 : .7} />)}
  {dot(180, 118, 19, "#aa9bf8")}{dot(172, 115, 6, "#faf5ff")}{dot(190, 123, 5, "#f2a1b2")}
  {[[223, 118], [137, 118], [180, 38], [180, 198], [293, 118], [67, 118]].map(([x, y], i) => <g key={i}>{dot(x, y, 6, "#71e2d1")}{dot(x - 1, y - 1, 2, "#edfffa")}</g>)}
  {label(198, 109, "Nucleus")}{label(244, 65, "Electron shell")}{label(20, 246, "Simplified energy-level diagram · not a literal orbit")}
</>
const dna = <>
  {Array.from({ length: 9 }, (_, i) => { const y = 23 + i * 22; const a = 180 + 58 * Math.sin(i * .72); const b = 180 - 58 * Math.sin(i * .72); return <g key={i}><line x1={a} y1={y} x2={b} y2={y} stroke={i % 2 ? "#71e2d1" : "#efbd8e"} strokeWidth="8" strokeLinecap="round" opacity=".82" />{dot(a, y, 7, "#9c9ff8")}{dot(b, y, 7, "#f6a8bf")}</g> })}
  <path d={Array.from({ length: 55 }, (_, i) => `${i ? 'L' : 'M'}${180 + 58 * Math.sin(i * .72 * 8 / 20)},${23 + i * 8 / 2.5}`).join(' ')} fill="none" stroke="#9c9ff8" strokeWidth="3" opacity=".65" />
  {label(20, 22, "DNA backbone")}{label(245, 226, "Complementary bases")}
</>
const cell = <>
  <ellipse cx="180" cy="116" rx="124" ry="94" fill="#234a53" stroke="#7be3cb" strokeWidth="4" />
  <ellipse cx="180" cy="116" rx="102" ry="76" fill="#2c5961" opacity=".65" />
  <circle cx="165" cy="112" r="38" fill="#61548c" stroke="#c6a8ed" strokeWidth="3" />
  <circle cx="165" cy="112" r="13" fill="#e3b6ed" />
  {[[236, 75], [232, 149], [104, 140], [114, 67]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y} rx="20" ry="10" transform={`rotate(${i * 45} ${x} ${y})`} fill="#eaa16f" stroke="#ffd7a1" strokeWidth="1.5" /><path d={`M${x - 12} ${y}q5-7 11 0t11 0`} fill="none" stroke="#794b60" strokeWidth="2" /></g>)}
  {label(197, 117, "Nucleus")}{label(247, 47, "Membrane")}{label(20, 246, "Schematic eukaryotic cell")}
</>
const molecule = <>
  <line x1="145" y1="112" x2="213" y2="70" stroke="#f1e7f7" strokeWidth="11" strokeLinecap="round" />
  <line x1="145" y1="112" x2="217" y2="161" stroke="#f1e7f7" strokeWidth="11" strokeLinecap="round" />
  {dot(145, 112, 33, "#f19c9e")}{dot(220, 68, 24, "#d8e4fb")}{dot(221, 166, 24, "#d8e4fb")}
  {label(128, 116, "O", "#4e1e31")}{label(216, 72, "H", "#293a53")}{label(216, 170, "H", "#293a53")}{label(235, 224, "Bent geometry: H₂O")}
</>
const plant = <>
  <path d="M174 225 Q160 134 177 44" stroke="#89e0a7" strokeWidth="10" fill="none" strokeLinecap="round" />
  <path d="M177 150 Q101 60 45 105 Q110 179 177 150Z" fill="#58bb8c" stroke="#b5e8af" strokeWidth="2" />
  <path d="M176 123 Q244 23 311 75 Q259 146 176 123Z" fill="#76d8a4" stroke="#bcf3c7" strokeWidth="2" />
  <path d="M176 214 Q127 205 98 246 M176 215 Q205 213 232 246" stroke="#c7a178" strokeWidth="6" fill="none" strokeLinecap="round" />
  {label(232, 51, "Leaves")}{label(192, 179, "Stem")}{label(42, 243, "Roots")}
</>
const ecology = <>
  {[{ y: 195, w: 272, c: '#70c6a4', t: 'PRODUCERS' }, { y: 143, w: 209, c: '#e4bb78', t: 'PRIMARY CONSUMERS' }, { y: 91, w: 137, c: '#bd9dec', t: 'PREDATORS' }].map(row => <g key={row.y}><path d={`M${180 - row.w / 2} ${row.y}h${row.w}l-22 -45h-${row.w - 44}z`} fill={row.c} opacity=".82" />{label(180 - row.w / 2 + 20, row.y - 18, row.t, '#162b37')}</g>)}
  <path d="M310 225V54" stroke="#e7effb" strokeWidth="2" strokeDasharray="4 6" /><path d="M304 62l6-13 6 13" fill="none" stroke="#e7effb" strokeWidth="2" />{label(16, 248, "Energy generally decreases upwards")}
</>
const mixture = <>
  {[100, 235].map((x, i) => <g key={x}><path d={`M${x - 40} 45v131q0 44 40 44t40-44V45`} fill="#273f69" stroke="#c2cef1" strokeWidth="3" /><path d={`M${x - 37} 136h74v42q0 39-37 39t-37-39z`} fill={i ? "#79d9b9" : "#83b3f3"} opacity=".65" />{[0, 1, 2, 3, 4, 5, 6].map(n => <circle key={n} cx={x - 23 + (n % 4) * 14} cy={145 + Math.floor(n / 4) * 20} r={i ? 4 : 6} fill={n % 2 ? "#dcd1fd" : "#ffe0a3"} />)}</g>)}
  <path d="M155 125h25l-6-6m6 6-6 6" fill="none" stroke="#eae6ff" strokeWidth="3" />{label(70, 31, "Mixture")}{label(218, 31, "Separated")}
</>
const periodic = <>
  {Array.from({ length: 5 }, (_, r) => Array.from({ length: 9 }, (_, c) => { const x = 24 + c * 36, y = 35 + r * 37; return <g key={`${r}-${c}`}><rect x={x} y={y} width="29" height="29" rx="4" fill={c < 2 ? "#6f87e5" : c > 6 ? "#67c2a5" : "#9d83cb"} opacity={r === 0 && c > 1 && c < 7 ? .2 : .8} stroke="#d2dbff" strokeOpacity=".3" /><text x={x + 5} y={y + 19} fontSize="10" fill="#142b3e">{r * 9 + c + 1}</text></g> }))}
  {label(23, 246, "Periodic trends reflect electronic structure")}
</>
const reaction = <>
  {[[80, "A"], [135, "B"], [255, "AB"]].map(([x, t]) => <g key={x}>{dot(Number(x), 115, 24, x === 255 ? "#72d5bc" : "#b69ef2")}{label(Number(x) - 9, 120, String(t), '#1c2840')}</g>)}
  {label(102, 120, "+", "#f6f2ff")}{label(177, 119, "→", "#f6f2ff")}{label(51, 185, "Reactants")}{label(226, 185, "Product")}
  {label(31, 238, "Atoms conserved in balanced reactions")}
</>
const energy = <>
  <path d="M45 220V43 M45 220h284" stroke="#acc0de" strokeWidth="2" /><path d="M50 178 Q92 175 121 95 Q151 30 190 89 Q228 140 308 113" fill="none" stroke="#f0b781" strokeWidth="4" /><path d="M50 178 Q105 165 121 146 Q145 112 171 144 Q228 140 308 113" fill="none" stroke="#84dbc8" strokeWidth="3" strokeDasharray="7 6" />{label(124, 43, "Energy barrier")}{label(235, 230, "Reaction progress")}{label(3, 31, "Energy")}
</>
const neuron = <>
  {dot(164, 126, 35, "#af99ef")}{dot(164, 126, 14, "#f3d4ef")}
  {Array.from({ length: 6 }, (_, i) => { const a = i * Math.PI / 3; return <path key={i} d={`M${164 + 31 * Math.cos(a)} ${126 + 31 * Math.sin(a)} l${30 * Math.cos(a)} ${30 * Math.sin(a)} l${14 * Math.cos(a + .3)} ${14 * Math.sin(a + .3)}`} stroke="#9ebdf6" strokeWidth="5" fill="none" strokeLinecap="round" /> })}
  <path d="M199 126H322" stroke="#84d7c4" strokeWidth="7" /><path d="M322 126l-12-8v16z" fill="#e0f8f2" />{label(215, 105, "Axon")}{label(21, 242, "Signals travel along specialised cells")}
</>
const organ = <>
  <path d="M175 30V99 M175 99L115 137 M175 99L235 137" stroke="#b6c4ee" strokeWidth="14" fill="none" strokeLinecap="round" /><path d="M110 89Q64 105 70 161Q75 221 145 208L155 124Z" fill="#d99daa" opacity=".88" stroke="#fbd1d5" strokeWidth="2" /><path d="M240 89Q287 105 283 161Q280 220 204 208L193 124Z" fill="#d99daa" opacity=".88" stroke="#fbd1d5" strokeWidth="2" />{label(192, 43, "Airway")}{label(41, 244, "Simplified respiratory anatomy")}
</>
const ph = <>
  {Array.from({ length: 14 }, (_, i) => <rect key={i} x={25 + i * 22} y="96" width="20" height="41" rx="4" fill={`hsl(${3 + i * 20},68%,${i < 4 ? 62 : 55}%)`} />)}
  {[0, 7, 14].map(n => label(22 + n * 20.4, 157, String(n)))}{label(28, 65, "Acidic")}{label(150, 65, "Near neutral")}{label(261, 65, "Basic")}{label(60, 223, "pH is related to hydrogen-ion activity")}
</>

// Organ-specific schematics avoid suggesting that an unrelated organ represents a topic.
const heart = <>
  <path d="M181 213 C127 178 78 130 93 85 C104 45 154 45 181 81 C211 37 265 49 276 89 C287 129 232 183 181 213Z" fill="#c86e83" stroke="#f5c1c8" strokeWidth="4" />
  <path d="M182 82V205 M105 119H261" stroke="#f4c8d4" strokeWidth="5" opacity=".85" />
  <path d="M143 49V18 M217 58V22" stroke="#8bcbf5" strokeWidth="13" />
  {label(96,111,"RA", "#fff")}{label(215,111,"LA", "#fff")}{label(96,166,"RV", "#fff")}{label(215,166,"LV", "#fff")}{label(34,244,"Four-chamber heart · simplified layout")}
</>
const kidney = <>
  <path d="M160 55C106 24 61 85 73 146C82 191 129 216 159 193C171 179 164 156 141 143C119 128 126 105 153 106C177 101 177 71 160 55Z" fill="#cf879e" stroke="#f8c6d0" strokeWidth="4" />
  <path d="M200 55C254 24 300 85 287 146C277 191 231 216 201 193C188 178 196 154 219 143C241 128 234 105 207 106C183 101 183 71 200 55Z" fill="#cf879e" stroke="#f8c6d0" strokeWidth="4" />
  <path d="M149 160Q155 204 176 222 M213 160Q205 204 186 222" stroke="#f4df9c" strokeWidth="6" fill="none" />
  {label(18,239,"Paired kidneys → ureters")}
</>
const muscle = <>
  {[58,91,124,157,190].map((y,i)=><g key={y}><rect x="37" y={y} width="286" height="23" rx="10" fill={i%2?"#ad7dc8":"#d6969d"} stroke="#f5c7d4" strokeWidth="1.5" />{Array.from({length:15},(_,j)=><path key={j} d={`M${55+j*17} ${y+2}v19`} stroke="#7c426f" opacity=".7" strokeWidth="3" />)}</g>)}
  {label(55,34,"Striated skeletal muscle fibres")}{label(101,245,"Contractile protein arrangement")}
</>
const chloroplast = <>
  <ellipse cx="179" cy="123" rx="140" ry="91" fill="#246e65" stroke="#a3e9c5" strokeWidth="5" />
  <ellipse cx="179" cy="123" rx="121" ry="74" fill="#3a8f69" stroke="#7bd5ad" strokeWidth="2" />
  {[108,171,231].map(x=><g key={x}>{[83,97,111,125,139,153].map(y=><ellipse key={y} cx={x} cy={y} rx="23" ry="5" fill="#b8e58e" stroke="#2b7351" strokeWidth="1" />)}</g>)}
  {label(28,242,"Chloroplast · thylakoid stacks (grana)")}
</>
const flower = <>
  {[0,72,144,216,288].map(angle=><ellipse key={angle} cx="180" cy="69" rx="33" ry="58" transform={`rotate(${angle} 180 126)`} fill="#f4a2be" stroke="#ffd2e0" strokeWidth="2" />)}
  {dot(180,126,28,"#f6d894")}{dot(180,126,9,"#8a6038")}
  <path d="M180 157V237 M180 199Q137 178 120 198 M180 205Q221 184 249 205" stroke="#80d5a7" strokeWidth="7" fill="none" />
  {label(23,38,"Petals")}{label(227,136,"Reproductive centre")}
</>
const reproduction = <>
  <circle cx="243" cy="119" r="59" stroke="#d4b5ec" strokeWidth="9" fill="#764b8f" /><circle cx="243" cy="119" r="25" fill="#eac4e6" />
  {[48,88,130].map((x,i)=><g key={x}><ellipse cx={x} cy={96+i*18} rx="17" ry="11" transform={`rotate(${i*23} ${x} ${96+i*18})`} fill="#a9d6fa"/><path d={`M${x-16} ${100+i*18}Q${x-46} ${64+i*20} ${x-52} ${106+i*20}`} fill="none" stroke="#a9d6fa" strokeWidth="3" /></g>)}
  {label(34,222,"Gametes · concept schematic only")}
</>
const health = <>
  <path d="M181 28L273 61v74q0 76-92 107q-92-31-92-107V61Z" fill="#225b65" stroke="#82e4cc" strokeWidth="5" />
  <path d="M136 137l30 30 63-73" fill="none" stroke="#a5f9da" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round" />
  {label(19,245,"Prevention, informed care and wellbeing")}
</>
const endocrine = <>
  {dot(89,115,32,"#bba2ef")}{dot(260,115,32,"#81dec4")}
  <path d="M124 115H221" stroke="#e6ddff" strokeWidth="3" strokeDasharray="9 9" /><path d="M207 106l15 9-15 9" stroke="#e6ddff" strokeWidth="3" fill="none" />
  {label(37,62,"Endocrine cell")}{label(240,62,"Target cell")}{label(139,104,"Hormone")}{label(19,235,"Signal binds a target-cell receptor")}
</>
const microbe = <>
  <rect x="89" y="62" width="182" height="116" rx="58" transform="rotate(-14 180 120)" fill="#71b8a8" stroke="#a9f7d3" strokeWidth="5" />
  {[105,153,210,263].map(x=><g key={x}><path d={`M${x} 74l-11-25 M${x} 170l12 24`} stroke="#a9f7d3" strokeWidth="3" /></g>)}
  {[123,167,217,239].map((x,i)=>dot(x,111+(i%2)*15,9,"#e7d6a7"))}
  <path d="M267 170Q328 190 311 234" fill="none" stroke="#b9efdd" strokeWidth="4" />
  {label(16,32,"Microorganism · schematic")}
</>
const electrochem = <>
  {[65,220].map((x,i)=><g key={x}><path d={`M${x} 62V205h78V62`} fill="#234668" stroke="#adceee" strokeWidth="3"/><rect x={x+3} y="133" width="72" height="69" fill={i?"#70cdd3":"#99a5e8"} opacity=".5" /><rect x={x+16} y="78" width="14" height="99" fill={i?"#dda882":"#9ba4ba"} /></g>)}
  <path d="M88 78V32H245v46" fill="none" stroke="#d4ddf5" strokeWidth="4" />{label(160,24,"e⁻ →")}{label(84,232,"Zn")}{label(244,232,"Cu")}
</>
const organic = <>
  <path d="M92 144L150 102 205 144 261 102" fill="none" stroke="#cbd7f3" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
  {[92,150,205,261].map((x,i)=>dot(x,i%2?102:144,13,"#a7a0ec"))}
  {label(83,178,"C")}{label(143,82,"C")}{label(197,178,"C")}{label(256,82,"C")}{label(29,240,"Carbon skeleton · schematic")}
</>
const protein = <>
  {Array.from({length:13},(_,i)=>{const x=46+i*22,y=128+48*Math.sin(i*.56);return <g key={i}>{i>0&&<line x1={x-22} y1={128+48*Math.sin((i-1)*.56)} x2={x} y2={y} stroke="#e2e7f6" strokeWidth="6" />}{dot(x,y,13,i%3===0?"#b69bf5":i%3===1?"#82dbc5":"#f5bd8c")}</g>})}
  {label(45,228,"Amino-acid chain · conceptual")}
</>

// Topic-specific original schematics: the reader uses a concept-matched diagram
// rather than repeating a chapter thumbnail for every lesson.
const digestion = <>
  <path d="M174 24Q144 41 153 82Q163 99 174 101L176 139Q177 154 208 158" stroke="#e8b5b5" strokeWidth="14" fill="none" strokeLinecap="round" />
  <path d="M207 145Q247 128 257 164Q262 196 224 207Q197 202 207 175Z" fill="#dc8b99" stroke="#ffced0" strokeWidth="3" />
  <path d="M215 208C163 196 153 238 191 240Q230 239 216 222Q202 211 186 221" fill="none" stroke="#f7c6a8" strokeWidth="12"/>
  <path d="M122 197Q103 200 105 220L112 247H269V206L240 198" stroke="#c98583" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
  {label(15,49,"Esophagus")}{label(261,151,"Stomach")}{label(16,183,"Intestine")}{label(17,255,"Digestive tract · educational schematic")}
</>;
const villi = <>
  <path d="M20 189H340" stroke="#ca8592" strokeWidth="13" />
  {[60,117,174,231,288].map(x=><g key={x}><path d={`M${x-22} 183Q${x-24} 149 ${x-17} 102Q${x-5} 63 ${x+4} 104Q${x+10} 145 ${x+13} 184`} fill="#dd9c9e" stroke="#ffc8bb" strokeWidth="3" /><path d={`M${x} 107V169`} stroke="#78e5d0" strokeWidth="4" /><circle cx={x} cy="96" r="5" fill="#c4fff0" /></g>)}
  {label(20,34,"Intestinal villi increase surface area")}{label(20,238,"Absorbed products → blood / lymph")}
</>;
const ionicDiagram = <>
  {dot(99,121,37,"#ad9ef2")}{dot(267,121,37,"#8dd8c0")}{label(82,125,"Na⁺","#162a40")}{label(250,125,"Cl⁻","#123a33")}
  <path d="M146 121H213" stroke="#fee7ab" strokeWidth="3" strokeDasharray="6 7" />{label(146,103,"Attraction")}{label(23,220,"Oppositely charged ions attract")}
</>;
const lewis = <>
  {dot(174,111,36,"#d886a5")}{dot(85,111,23,"#e2e7fa")}{dot(263,111,23,"#e2e7fa")}
  {label(159,117,"O","#fff")}{label(78,115,"H","#243b4f")}{label(256,115,"H","#243b4f")}
  <path d="M112 111H140 M210 111H239" stroke="#96e9d7" strokeWidth="6" strokeLinecap="round" />
  {dot(158,62,5,"#ffdd99")}{dot(173,62,5,"#ffdd99")}{dot(158,163,5,"#ffdd99")}{dot(173,163,5,"#ffdd99")}{label(18,221,"Bond lines = shared electron pairs")}
</>;
const vsepr = <>
  {dot(174,129,28,"#da91a4")}{[[94,67],[254,67],[174,216]].map(([x,y])=><g key={x+y}><path d={`M174 129L${x} ${y}`} stroke="#dcf3fa" strokeWidth="7"/>{dot(x,y,20,"#c8d9fd")}</g>)}
  <path d="M119 93Q176 18 228 95" fill="none" stroke="#7ee6cd" strokeWidth="3" strokeDasharray="5 5" />{label(144,57,"Bond angles")}{label(14,245,"3D electron-region geometry is idealized")}
</>;
const chromatography = <>
  <rect x="102" y="35" width="156" height="190" rx="8" fill="#c3af90" fillOpacity=".32" stroke="#ddc5a3" strokeWidth="2"/>
  <path d="M117 184H243" stroke="#d4eafa" strokeWidth="2" strokeDasharray="5 6"/>
  {[138,180,220].map((x,i)=><g key={x}>{[0,1,2].map(j=><circle key={j} cx={x} cy={174-(j*35)-(i*7)} r="9" fill={['#dc9bca','#7ec8d9','#d4b870'][(i+j)%3]} opacity=".85"/>)}</g>)}
  {label(16,28,"Paper chromatography")}{label(16,252,"Different pigments travel different distances")}
</>;
const respiration = <>
  <path d="M174 32V100M174 100Q144 113 125 132M174 100Q218 113 235 132" fill="none" stroke="#c9e4ef" strokeWidth="13" strokeLinecap="round"/>
  <path d="M130 90Q72 115 74 171Q78 220 159 212L160 116Z" fill="#d7a0ab" stroke="#ffd3d5" strokeWidth="3"/>
  <path d="M225 90Q281 114 282 171Q278 220 196 212L193 116Z" fill="#d7a0ab" stroke="#ffd3d5" strokeWidth="3"/>
  {[117,138,159,180].map((y,i)=><path key={y} d={`M158 ${y}h-14M194 ${y}h14`} stroke="#f6cad4" strokeWidth="2"/>)}
  {label(16,37,"Trachea")}{label(271,242,"Lungs")}
</>;

// Specific scientific illustrations for senior-secondary concept cards.
const punnett = <>
  {['AB','Ab','aB','ab'].map((g,i)=><g key={g}>{label(59+i*66,39,g)}{label(16,77+i*40,g)}</g>)}
  {['AABB','AABb','AaBB','AaBb','AABb','AAbb','AaBb','Aabb','AaBB','AaBb','aaBB','aaBb','AaBb','Aabb','aaBb','aabb'].map((g,i)=><g key={i}><rect x={43+(i%4)*66} y={49+Math.floor(i/4)*40} width="61" height="36" rx="4" fill={g==='aabb'?'#926a8b':g.includes('aa')||g.includes('bb')?'#527c91':'#386e65'} stroke="#96bfb9"/><text x={73+(i%4)*66} y={72+Math.floor(i/4)*40} fontSize="10" textAnchor="middle" fill="#effffd">{g}</text></g>)}
  {label(20,244,'AaBb × AaBb · gamete combinations')}
</>;
const nephronDetail = <>
  <circle cx="91" cy="87" r="37" fill="#ca8497" stroke="#f1c3ce" strokeWidth="5"/>
  <circle cx="91" cy="87" r="19" fill="none" stroke="#782a57" strokeWidth="5" strokeDasharray="5 4"/>
  <path d="M129 87Q193 44 223 87Q251 123 223 141L191 170Q174 194 195 207Q215 218 233 194Q266 155 269 112L315 117V212" fill="none" stroke="#f3c3b0" strokeWidth="13" strokeLinecap="round"/>
  <path d="M193 171Q174 194 195 207Q215 218 233 194" fill="none" stroke="#88c7f3" strokeWidth="6"/>
  {label(15,29,'Glomerulus')}{label(155,64,'PCT')}{label(205,244,'Loop of Henle')}{label(276,96,'DCT')}{label(287,238,'Collecting duct')}
</>;
const alveolusDetail = <>
  {[[130,112],[183,96],[232,121],[172,156]].map(([x,y],i)=><circle key={i} cx={x} cy={y} r="45" fill="#ba7086" fillOpacity=".72" stroke="#f0a7bb" strokeWidth="4"/>)}
  <path d="M37 185Q73 235 128 222T220 220Q290 224 333 155" fill="none" stroke="#7db6e4" strokeWidth="14" strokeLinecap="round"/>
  <path d="M110 176L110 205" stroke="#b3edd8" strokeWidth="5"/><path d="M219 190L219 217" stroke="#b3edd8" strokeWidth="5"/>
  {label(14,37,'Alveolar air')}{label(14,252,'Pulmonary capillary')}{label(75,191,'O₂ → blood','#b6ffe0')}{label(214,178,'CO₂ → air','#ffd3b3')}
</>;
const transcriptionDetail = <>
  {Array.from({length:8},(_,i)=>{const x=45+i*38;return <g key={i}><line x1={x} y1="85" x2={x} y2="127" stroke="#a7a0ed" strokeWidth="4"/><text x={x} y="78" fill="#c9bbff" textAnchor="middle" fontSize="14">{['A','T','G','C','C','A','T','G'][i]}</text><text x={x} y="143" fill="#8ce6d7" textAnchor="middle" fontSize="14">{['T','A','C','G','G','T','A','C'][i]}</text></g>})}
  <path d="M22 104H340" stroke="#d2e5ff" strokeWidth="2" strokeDasharray="4 6"/><rect x="137" y="88" width="95" height="36" rx="13" fill="#b484ca" fillOpacity=".85" stroke="#efd7ff"/>
  <path d="M190 126L231 200H325" fill="none" stroke="#f0ce94" strokeWidth="4"/>
  {['A','U','G','C'].map((c,i)=><text key={i} x={237+i*29} y="192" fontSize="15" fill="#f0d39d">{c}</text>)}
  {label(19,34,'DNA template · 3′ → 5′')}{label(32,234,'RNA polymerase produces RNA 5′ → 3′')}
</>;
const enthalpyDetail = <>
  <path d="M53 27V231H337" fill="none" stroke="#ccdeef" strokeWidth="3"/><path d="M58 92H178" stroke="#f6b482" strokeWidth="7"/><path d="M219 171H326" stroke="#8be2bf" strokeWidth="7"/>
  <path d="M179 95V168" stroke="#dbe7f5" strokeWidth="4" strokeDasharray="6 6"/><path d="M170 161l9 12 9-12" fill="none" stroke="#dbe7f5" strokeWidth="3"/>
  {label(63,79,'Reactants')}{label(235,158,'Products')}{label(187,131,'ΔH < 0')}{label(7,24,'H')}{label(200,249,'Reaction progress')}
</>;
const equilibriumDetail = <>
  <rect x="47" y="42" width="266" height="76" rx="16" fill="#173d52" stroke="#8ec6bf"/>
  {label(67,79,'A + B','#ffd0aa')}{label(260,79,'C','#9ef9dd')}
  <path d="M135 69H233M233 89H135" stroke="#d3e3f6" strokeWidth="4"/><path d="M225 60l9 9-9 9M143 81l-9 8 9 8" fill="none" stroke="#d3e3f6" strokeWidth="3"/>
  <path d="M44 220H334M44 220V143" stroke="#bbd4e5" strokeWidth="2"/>
  <path d="M47 158Q85 184 135 187T240 192H329" stroke="#f3ba95" strokeWidth="4" fill="none"/>
  <path d="M47 211Q87 194 135 190T240 192H329" stroke="#86e5c5" strokeWidth="4" fill="none"/>
  {label(16,253,'Rates equal at equilibrium, not concentrations')}
</>;
const activationDetail = <>
  <path d="M42 29V223H336" stroke="#d2d9ef" strokeWidth="2" fill="none"/>
  <path d="M44 175Q100 173 132 78Q164 30 197 80Q245 150 324 139" fill="none" stroke="#eda578" strokeWidth="4"/>
  <path d="M44 175Q95 173 131 129Q161 105 196 128Q249 150 324 139" fill="none" stroke="#87ebcc" strokeWidth="4"/>
  {label(200,53,'Uncatalysed')}{label(192,109,'Catalysed')}{label(70,231,'Reaction coordinate')}{label(7,26,'E')}
</>;
const nernstDetail = <>
  <path d="M58 87V208h89V87M211 87V208h91V87" fill="#1e4867" stroke="#acd4e4" strokeWidth="4"/>
  <rect x="62" y="145" width="81" height="58" fill="#b5b7f8" opacity=".5"/><rect x="215" y="145" width="83" height="58" fill="#78e7ca" opacity=".55"/>
  <path d="M88 123V33H272V123" fill="none" stroke="#d3e0f4" strokeWidth="4"/>
  <path d="M140 122V72H218V122" fill="none" stroke="#e6ca93" strokeWidth="8"/>
  {label(78,24,'e⁻ →')}{label(70,232,'Zn / Zn²⁺')}{label(217,232,'Cu²⁺ / Cu')}{label(111,66,'Salt bridge')}
</>;

/** Deterministic topic-to-visual mapping: no network images, tracking or textbook artwork. */
export function topicDiagramKind(topic: string, fallback: string): string {
  const t = topic.toLowerCase();
  if (/independent assortment|punnett|mendel's segregation|linkage/.test(t)) return 'punnett';
  if (/nephron/.test(t)) return 'nephron-detail';
  if (/alveol/.test(t)) return 'alveolus-detail';
  if (/transcription/.test(t)) return 'transcription-detail';
  if (/enthalpy/.test(t)) return 'enthalpy-detail';
  if (/equilibrium constant|dynamic equilibrium|reaction quotient/.test(t)) return 'equilibrium-detail';
  if (/activation energy|arrhenius/.test(t)) return 'activation-detail';
  if (/nernst/.test(t)) return 'nernst-detail';
  if (/digest|nutrition|stomach|intestin|peristalsis/.test(t)) return 'digestion';
  if (/absorp|villi|microvilli/.test(t)) return 'villi';
  if (/respirat|alveol|breath|ventilat|haemoglobin/.test(t)) return 'respiration';
  if (/kidney|nephron|excret|urea|adh|reabsorp|secretio/.test(t)) return 'kidney';
  if (/heart|cardiac|blood|plasma|circulat/.test(t)) return 'heart';
  if (/muscl|sarcomere|tendon|joint/.test(t)) return 'muscle';
  if (/chloroplast|photosynth|calvin|photoresp|light reaction/.test(t)) return 'chloroplast';
  if (/flower|petal|pollen|pollinat|fertilis|seed/.test(t)) return 'flower';
  if (/lewis|formal charge|valence electron/.test(t)) return 'lewis';
  if (/ionic|cation|anion|electronegativ/.test(t)) return 'ionic';
  if (/vsepr|hybridis|sigma|pi bond|bond angle/.test(t)) return 'vsepr';
  if (/chromatogra|pigment|distill|separat|mixture/.test(t)) return 'chromatography';
  if (/microorgan|virus|antibiotic|vaccin|pathogen|ferment/.test(t)) return 'microbe';
  if (/genet|allele|dna|rna|transcri|translat|inherit|codon|mendeli/.test(t)) return 'dna';
  if (/acid|base|neutralis|pH|indicator|buffer/.test(t)) return 'ph';
  if (/electrochem|electrode|anode|cathode|nernst|galvanic/.test(t)) return 'electrochem';
  if (/organic|carbon|alkane|alkene|alkyne|functional|ester|amine/.test(t)) return 'organic';
  if (/neuron|synaps|nerv|reflex|senso|action potential/.test(t)) return 'neuron';
  if (/ribosome|cell|membrane|osmosis|mitochondr/.test(t)) return 'cell';
  if (/proteins|enzyme|peptide|amino/.test(t)) return 'protein';
  if (/leaf|root|stem|xylem|phloem|plant|tropism/.test(t)) return 'plant';
  if (/oxid|reduc|reaction|balanc|stoichiometr|decompos/.test(t)) return 'reaction';
  if (/activation|entropy|enthalpy|energy|thermo/.test(t)) return 'energy';
  if (/atom|orbital|isotope|quantum|electron|proton/.test(t)) return 'atom';
  return fallback;
}

const designs: Record<string, ReactNode> = { punnett, "nephron-detail":nephronDetail, "alveolus-detail":alveolusDetail, "transcription-detail":transcriptionDetail, "enthalpy-detail":enthalpyDetail, "equilibrium-detail":equilibriumDetail, "activation-detail":activationDetail, "nernst-detail":nernstDetail, atom, dna, cell, molecule, plant, ecology, mixture, periodic, reaction, energy, neuron, organ, ph, equilibrium: energy, transport: cell, heart, kidney, muscle, chloroplast, flower, reproduction, health, endocrine, microbe, electrochem, organic, protein, digestion, villi, ionic: ionicDiagram, lewis, vsepr, chromatography, respiration }
export default function TheoryIllustration({ kind, compact = false, topic }: Props) {
  const diagramKind = topic ? topicDiagramKind(topic, kind) : kind;
  return <svg className={`theory-illustration ${compact ? "compact" : ""}`} viewBox="0 0 360 265" role="img" aria-label={`Original schematic science diagram: ${diagramKind}${topic ? ` for ${topic}` : ""}`}>
    <defs><radialGradient id="theoryGlow"><stop stopColor="#2f466d" /><stop offset="1" stopColor="#101e38" /></radialGradient></defs>
    <rect width="360" height="265" rx="22" fill="url(#theoryGlow)" />
    <path d="M0 220H360 M0 175H360 M0 130H360 M0 85H360 M70 0V265 M140 0V265 M210 0V265 M280 0V265" stroke="#adbeec" opacity=".07" />
    {designs[diagramKind] || molecule}
  </svg>
}
