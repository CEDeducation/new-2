"""Type-check the new lab components in isolation when npm/React packages are unavailable.
These stubs deliberately validate internal TypeScript but DO NOT replace a Next.js production build.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
import subprocess, shutil
root=Path(__file__).resolve().parent.parent/'components/junior'
source=['MixtureStudio.tsx','AufbauStudio.tsx','MicroscopeStudio.tsx','ElectrochemStudio.tsx','MasterRoadmap.tsx','LabConceptCard.tsx','AdvancedWorkbench.tsx','advanced-engines.ts','mixture-engine.ts','aufbau-engine.ts','electrochem-engine.ts','master-roadmap.ts','lab-concept-content.ts','skeleton-engine.ts','cardiac-engine.ts','CardiacWorkbench.tsx','gene-expression-engine.ts','GeneExpressionWorkbench.tsx']
with TemporaryDirectory(prefix='junior-typecheck-') as temp:
    tmp=Path(temp)
    for name in source:
        content=(root/name).read_text()
        content=content.replace("from './junior-labs'", "from './qa-props'")
        (tmp/name).write_text(content)
    (tmp/'qa-props.ts').write_text("export type StudioLab=string;export type LabProps={t:(en:string,zh:string)=>string;complete:()=>void;addObservation:(text:string)=>void};")
    (tmp/'react-stub.d.ts').write_text('''declare module 'react' {
export type ReactNode=any;
export type SetStateAction<S>=S|((prev:S)=>S);
export type Dispatch<S>=(value:SetStateAction<S>)=>void;
export function useState<S>(init:S|(()=>S)):[S,Dispatch<S>];
export function useRef<T>(init:T):{current:T};
export function useEffect(effect:()=>void|(()=>void),deps?:unknown[]):void;
export type RefObject<T>={current:T};
export function useRef<T>(value:T):RefObject<T>;
export function useEffect(effect:()=>void|(()=>void),deps?:unknown[]):void;
export function useMemo<T>(calculate:()=>T,deps:unknown[]):T;
export type PointerEvent<T>=globalThis.PointerEvent & {currentTarget:T};
export type DragEvent<T>=Omit<globalThis.DragEvent,'dataTransfer'> & {currentTarget:T;dataTransfer:DataTransfer};
}
declare namespace JSX { interface ElementChildrenAttribute { children:{} } interface IntrinsicAttributes {key?:any} interface IntrinsicElements {[elemName:string]:any} }
''')
    (tmp/'tsconfig.json').write_text('{"compilerOptions":{"strict":true,"noImplicitAny":false,"target":"ES2022","lib":["ES2022","DOM"],"jsx":"preserve","skipLibCheck":true,"module":"ESNext","moduleResolution":"node","noEmit":true,"allowSyntheticDefaultImports":true},"include":["./**/*.ts","./**/*.tsx"]}')
    res=subprocess.run(['tsc','--project',str(tmp/'tsconfig.json')],capture_output=True,text=True,timeout=30)
    if res.returncode:
        print(res.stdout,res.stderr)
        raise SystemExit(res.returncode)
    print('PASS: isolated TypeScript type check of new components and engines (stubbed React declarations).')
