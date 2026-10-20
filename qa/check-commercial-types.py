"""Offline type validation of server-only billing code without Next/npm dependencies.
This is a stub check, NOT a production Next typecheck.
"""
from pathlib import Path
from tempfile import TemporaryDirectory
import subprocess
root=Path(__file__).resolve().parent.parent
sources=[root/'lib/billing-policy.ts',root/'lib/server-billing.ts']+list((root/'app/api/billing').glob('*/route.ts'))+[root/'app/api/premium/lab-report/route.ts',root/'app/api/health/route.ts']
with TemporaryDirectory(prefix='openlab-billing-ts-') as tmpdir:
    tmp=Path(tmpdir)
    for source in sources:
        name='route_'+source.parent.name+'.ts' if source.name=='route.ts' else source.name
        data=source.read_text().replace('"@/lib/server-billing"','"./server-billing"')
        (tmp/name).write_text(data)
    (tmp/'stubs.d.ts').write_text('''
declare const process:{env:Record<string,string|undefined>};
declare const Buffer:{from(value:string,encoding?:string):{length:number}; byteLength(input:string,encoding?:string):number};
declare module "node:crypto" {
export function createHmac(algorithm:string,key:string):{update(value:string):{digest(format:string):string}};
export function timingSafeEqual(a:{length:number},b:{length:number}):boolean;
}
declare module "next/server" {
  export class NextRequest extends Request {}
  export class NextResponse extends Response {
    static json(value:unknown,init?:ResponseInit):NextResponse;
  }
}
''')
    (tmp/'tsconfig.json').write_text('{"compilerOptions":{"target":"ES2022","lib":["ES2022","DOM"],"strict":true,"module":"ESNext","moduleResolution":"bundler","noEmit":true,"skipLibCheck":true,"esModuleInterop":true},"include":["./*.ts"]}')
    result=subprocess.run(['tsc','--project',str(tmp/'tsconfig.json')],capture_output=True,text=True,timeout=35)
    if result.returncode:
        print(result.stdout,result.stderr)
        raise SystemExit(result.returncode)
    print(f'PASS: isolated TypeScript check for {len(sources)} server/billing modules (stubbed Next types).')
