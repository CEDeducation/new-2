'use strict'
/** Truthful human-readable release blockers; this is intentionally separate from the build gate. */
const fs=require('node:fs'); const path=require('node:path');const root=path.resolve(__dirname,'..');
const matrix=JSON.parse(fs.readFileSync(path.join(root,'qa/launch-matrix.json'),'utf8'));
const fields=['dedicatedExperiment','dragDropOrDirectManipulation','responsiveAnimation','scientificModelReview','browserInteractionTest','classroomUsabilityTest'];
const certified=matrix.filter(l=>fields.every(k=>l[k]===true)).length;
const required=['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','SUPABASE_SERVICE_ROLE_KEY','STRIPE_SECRET_KEY','STRIPE_WEBHOOK_SECRET','STRIPE_JUNIOR_PRICE_ID','OPENLAB_SITE_URL','OPENLAB_LEGAL_ENTITY','OPENLAB_SUPPORT_EMAIL'];
const missing=required.filter(k=>!process.env[k]);
const enabled=process.env.OPENLAB_ENABLE_PAID_CHECKOUT==='true';
console.log(JSON.stringify({catalogueTopics:50,independentlyCertifiedLabs:certified,unverifiedLabs:50-certified,missingConfiguration:missing,paidCheckoutEnabled:enabled,readyForFiftyLabCommercialClaim:certified===50 && missing.length===0 && enabled,requiredHumanChecks:['full Next.js production build','Stripe sandbox end-to-end','Supabase RLS audit','browser drag/drop tests','science teacher review','minor privacy/legal review','refund/tax policy']},null,2));
