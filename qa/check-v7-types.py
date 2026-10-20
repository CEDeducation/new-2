"""Validate new isolated components even when the full Next dependencies cannot be installed.
This is not a substitute for a production build with React's actual type declarations.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
import subprocess
root=Path(__file__).resolve().parent.parent/'components/junior'
source=['TitrationWorkbench.tsx','DigestionStudio.tsx','quantitative-engine.ts','digestion-engine.ts']
with TemporaryDirectory(prefix='openlab-jr-v7-type-') as directory:
    tmp=Path(directory)
    for filename in source:
        code=(root/filename).read_text().replace("from './junior-labs'", "from './qa-props'")
        (tmp/filename).write_text(code)
    (tmp/'qa-props.ts').write_text('export type LabProps={t:(en:string,zh:string)=>string;complete:()=>void;addObservation:(text:string)=>void};')
    (tmp/'react-stub.d.ts').write_text('''declare module 'react' {
export type ReactNode=any;
export type SetStateAction<S>=S|((previous:S)=>S);
export type Dispatch<S>=(value:SetStateAction<S>)=>void;
export function useState<S>(value:S|(()=>S)):[S,Dispatch<S>];
export function useMemo<T>(callback:()=>T, dependencies:unknown[]):T;
export function useEffect(effect:()=>void|(()=>void), dependencies?:unknown[]):void;
export type DragEvent<T>=Omit<globalThis.DragEvent,'dataTransfer'> & {currentTarget:T;dataTransfer:DataTransfer};
export type WheelEvent<T>=globalThis.WheelEvent & {currentTarget:T};
export type KeyboardEvent<T>=globalThis.KeyboardEvent & {currentTarget:T};
}
declare namespace JSX {interface ElementChildrenAttribute{children:{}} interface IntrinsicAttributes{key?:unknown} interface IntrinsicElements{[tag:string]:any}}
''')
    (tmp/'tsconfig.json').write_text('{"compilerOptions":{"strict":true,"noImplicitAny":false,"target":"ES2022","lib":["ES2022","DOM"],"jsx":"preserve","skipLibCheck":true,"module":"ESNext","moduleResolution":"node","noEmit":true,"allowSyntheticDefaultImports":true},"include":["./**/*.ts","./**/*.tsx"]}')
    outcome=subprocess.run(['tsc','--project',str(tmp/'tsconfig.json')],capture_output=True,text=True,timeout=40)
    if outcome.returncode:
        print(outcome.stdout, outcome.stderr)
        raise SystemExit(outcome.returncode)
    print('PASS isolated TypeScript validation for new v7 titration and digestive labs.')
