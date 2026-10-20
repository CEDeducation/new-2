"""Offline TypeScript JSX check for new billing page with minimal React/Next stubs."""
from pathlib import Path
from tempfile import TemporaryDirectory
import subprocess
root=Path(__file__).resolve().parent.parent
with TemporaryDirectory(prefix='openlab-billing-ui-') as folder:
    tmp=Path(folder)
    content=(root/'app/billing/page.tsx').read_text().replace('"@/lib/cloud"','"./mock-cloud"')
    (tmp/'page.tsx').write_text(content)
    (tmp/'mock-cloud.ts').write_text('export async function getCurrentCloudAccessToken():Promise<string|null>{return null}')
    (tmp/'stub.d.ts').write_text('''declare module 'react' {
export function useState<T>(init:T):[T,(updater:T|((prev:T)=>T))=>void];
export function useEffect(fn:()=>void|(()=>void),deps?:unknown[]):void;
}
declare module 'next/link' {const Link:(props:any)=>any;export default Link;}
declare module '*.css' {}
declare namespace JSX { interface IntrinsicAttributes{key?:any};interface ElementChildrenAttribute{children:{}};interface IntrinsicElements{[name:string]:any};}
''')
    (tmp/'tsconfig.json').write_text('{"compilerOptions":{"target":"ES2022","lib":["DOM","ES2022"],"strict":true,"noImplicitAny":false,"jsx":"preserve","module":"ESNext","moduleResolution":"bundler","noEmit":true,"skipLibCheck":true,"allowSyntheticDefaultImports":true},"include":["./*.ts","./*.tsx"]}')
    proc=subprocess.run(['tsc','--project',str(tmp/'tsconfig.json')],capture_output=True,text=True,timeout=35)
    if proc.returncode:
        print(proc.stdout,proc.stderr)
        raise SystemExit(proc.returncode)
    print('PASS: isolated billing client TypeScript check (stubbed React/Next declarations).')
