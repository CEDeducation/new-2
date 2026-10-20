'use strict'
/** Handler-level mock tests. Not a substitute for Stripe/Supabase sandbox testing. */
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');const ts=require('typescript');
class NextResponse extends Response { static json(data,opts={}) { return new Response(JSON.stringify(data),{status:opts.status||200,headers:{'Content-Type':'application/json',...(opts.headers||{})}}) } }
function loadRoute(relative, billing){
  const content=fs.readFileSync(path.resolve(__dirname,'..',relative),'utf8');
  const js=ts.transpileModule(content,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
  const exports={};new Function('exports','require',js)(exports, name=> name==='next/server'?{NextResponse}:name==='@/lib/server-billing'?billing:require(name));return exports;
}
async function run(){
let tests=0;const check=(title,actual,expected)=>{assert.equal(actual,expected,title);tests++};
const user={id:'8d021ee2-7e41-4a45-af16-8f31f548a231',email:'student@example.org'};
const getAuthorizedUser=async()=>user;
const getBillingAccount=async()=>null;
const hasPremiumAccess=record=>record?.status==='active'&&record?.plan==='junior';
const report=loadRoute('app/api/premium/lab-report/route.ts',{getAuthorizedUser,getBillingAccount,hasPremiumAccess});
const request=()=>new Request('https://example.org/api/premium/lab-report',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({title:'<script>alert(1)</script>',question:'<img src=x onerror=alert(1)>',method:'Safe',observations:'Measured 3.5 mL',conclusion:'Results'})});
const denied=await report.POST(request());check('Report denied without active subscription',denied.status,403);
const paid=loadRoute('app/api/premium/lab-report/route.ts',{getAuthorizedUser,getBillingAccount:async()=>({plan:'junior',status:'active'}),hasPremiumAccess});
const allowed=await paid.POST(request());check('Paid report allowed',allowed.status,200);
const html=await allowed.text();check('User-provided script is HTML escaped',html.includes('<script>alert(1)</script>'),false);check('User-provided markup cannot create IMG',html.includes('<img src=x'),false);check('Original observations preserved',html.includes('Measured 3.5 mL'),true);
const checkout=loadRoute('app/api/billing/checkout/route.ts',{getAuthorizedUser,isBillingEnabled:()=>true,getBillingAccount,hasPremiumAccess,billingHeaders:{}});
const badAdult=await checkout.POST(new Request('https://example.org/api/billing/checkout',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({plan:'junior',payerAdult:false})}));check('Checkout requires adult payer confirmation',badAdult.status,400);
const badPlan=await checkout.POST(new Request('https://example.org/api/billing/checkout',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({plan:'unlimited',payerAdult:true})}));check('Checkout rejects arbitrary plan IDs',badPlan.status,400);
const disabled=loadRoute('app/api/billing/checkout/route.ts',{isBillingEnabled:()=>false,billingHeaders:{}});
const noPayment=await disabled.POST(new Request('https://example.org/api/billing/checkout',{method:'POST'}));check('Checkout disabled without configuration',noPayment.status,503);
const status=loadRoute('app/api/billing/status/route.ts',{isBillingEnabled:()=>true,getAuthorizedUser,getBillingAccount,hasPremiumAccess,billingHeaders:{}});
const free=await status.GET(new Request('https://example.org/api/billing/status'));check('Status does not invent payment entitlement',(await free.json()).active,false);
console.log(`PASS: ${tests} commercial API handler assertions`);
}
run().catch(err=>{console.error(err);process.exitCode=1});
