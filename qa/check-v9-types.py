"""Offline isolated TS check for new science UI; not a Next.js production build."""
from pathlib import Path
from tempfile import TemporaryDirectory
import subprocess
source_dir=Path(__file__).resolve().parent.parent/'components/junior'
source=['cardiac-engine.ts','CardiacWorkbench.tsx','gene-expression-engine.ts','GeneExpressionWorkbench.tsx','bond-engine.ts','BondingStudio.tsx']
with TemporaryDirectory(prefix='openlab-v9-ts-') as root:
    tmp=Path(root)
    for name in source:
        code=(source_dir/name).read_text().replace("from './junior-labs'", "from './qa-props'")
        (tmp/name).write_text(code)
    (tmp/'qa-props.ts').write_text('export type LabProps={t:(en:string,zh:string)=>string;complete:()=>void;addObservation:(text:string)=>void};')
    (tmp/'react-stub.d.ts').write_text('''declare module 'react' {
export type ReactNode=any;
export type Dispatch<S>=(value:S|((prev:S)=>S))=>void;
export function useState<S>(value:S|(()=>S)):[S,Dispatch<S>];
export function useMemo<S>(fn:()=>S,deps:unknown[]):S;
export function useRef<S>(initial:S):{current:S};
export function useEffect(fn:()=>void|(()=>void),deps?:unknown[]):void;
export type PointerEvent<T>=globalThis.PointerEvent & {currentTarget:T};
export type DragEvent<T>=Omit<globalThis.DragEvent,'dataTransfer'> & {currentTarget:T;dataTransfer:DataTransfer};
}
declare namespace JSX{interface ElementChildrenAttribute{children:{}} interface IntrinsicAttributes{key?:any} interface IntrinsicElements{[tag:string]:any}}
''')
    (tmp/'tsconfig.json').write_text('{"compilerOptions":{"strict":true,"noImplicitAny":false,"target":"ES2022","lib":["ES2022","DOM"],"jsx":"preserve","skipLibCheck":true,"module":"ESNext","moduleResolution":"node","noEmit":true,"allowSyntheticDefaultImports":true},"include":["./**/*.ts","./**/*.tsx"]}')
    result=subprocess.run(['tsc','--project',str(tmp/'tsconfig.json')],capture_output=True,text=True,timeout=40)
    print(result.stdout,result.stderr)
    if result.returncode:raise SystemExit(result.returncode)
    print('PASS: new v9 components and engines isolated type check (React stub declarations).')
