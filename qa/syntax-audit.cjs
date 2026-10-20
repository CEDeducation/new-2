'use strict';
/** Offline TypeScript/JSX syntax audit. A successful result is NOT a typecheck or Next.js build. */
const fs=require('node:fs');
const path=require('node:path');
let ts;
try{ts=require('typescript')}catch{ts=require('/opt/nvm/versions/node/v22.16.0/lib/node_modules/typescript')}
const root=path.resolve(__dirname,'..');
const files=[];
function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
  if(['node_modules','.next','.qa-js','.git'].includes(entry.name))continue;
  const target=path.join(dir,entry.name);
  if(entry.isDirectory())walk(target);
  else if(/\.(tsx?|jsx?)$/.test(entry.name))files.push(target);
}}
walk(root);
const errors=[];
for(const file of files){
 const text=fs.readFileSync(file,'utf8');
 const kind = file.endsWith('.tsx') || file.endsWith('.jsx') ? ts.ScriptKind.TSX : file.endsWith('.js') ? ts.ScriptKind.JS : ts.ScriptKind.TS;
 const source=ts.createSourceFile(file,text,ts.ScriptTarget.Latest,true,kind);
 for(const d of source.parseDiagnostics||[]){const pos=d.start!==undefined?source.getLineAndCharacterOfPosition(d.start):null;errors.push(`${path.relative(root,file)}:${pos?pos.line+1:0} ${ts.flattenDiagnosticMessageText(d.messageText,' ')}`)}
}
if(errors.length){console.error(errors.join('\n'));process.exit(1)}
console.log(`PASS: ${files.length} JS/TS/JSX/TSX files parsed successfully. Type correctness, runtime and production build remain unverified.`);
