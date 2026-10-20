'use strict'
/** Offline tests for the billing rules. These DO NOT simulate actual Stripe/Supabase. */
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const { createHmac } = require('node:crypto')
const ts = require('typescript')

function loadTS(file, dependencies = {}) {
  const source = fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8')
  const js = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2021, module: ts.ModuleKind.CommonJS } }).outputText
  const exports = {}
  new Function('exports', 'require', 'process', 'Buffer', 'fetch', 'AbortSignal', js)(exports, name => dependencies[name] || require(name), process, Buffer, fetch, AbortSignal)
  return exports
}

const policy = loadTS('lib/billing-policy.ts')
const server = loadTS('lib/server-billing.ts', { './billing-policy': policy })
const checks = []
function test(title, cb) { cb(); checks.push(title) }
const now = new Date(Date.now() + 86400_000).toISOString()
test('Never grant when record absent', () => assert.equal(policy.hasPremiumAccess(null), false))
test('Free plan cannot grant access', () => assert.equal(policy.hasPremiumAccess({ plan: 'free', status: 'active', current_period_end: now }), false))
test('Active paid plan grants access', () => assert.equal(policy.hasPremiumAccess({ plan: 'junior', status: 'active', current_period_end: now }), true))
test('Trial grants access', () => assert.equal(policy.hasPremiumAccess({ plan: 'junior', status: 'trialing', current_period_end: now }), true))
for (const status of ['none','canceled','unpaid','past_due','incomplete','paused']) {
  test(`${status} does not grant access`, () => assert.equal(policy.hasPremiumAccess({ plan: 'junior', status, current_period_end: now }), false))
}
test('An expired paid subscription does not grant access', () => assert.equal(policy.hasPremiumAccess({ plan: 'junior', status: 'active', current_period_end: '2020-01-01T00:00:00.000Z' }), false))
test('Malicious plan strings cannot grant access', () => assert.equal(policy.normalizePaidPlan('admin'), 'free'))
test('Known Stripe states normalized', () => assert.equal(policy.normalizeSubscriptionStatus('past_due'), 'past_due'))
test('Unknown Stripe states are rejected', () => assert.equal(policy.normalizeSubscriptionStatus('paywall_bypass'), 'none'))
test('Invalid user UUID is rejected', () => assert.equal(policy.isSafeUuid('anyone; drop table'), false))
test('Valid user UUID accepted', () => assert.equal(policy.isSafeUuid('8d021ee2-7e41-4a45-af16-8f31f548a231'), true))
test('Subscription timestamp interpreted in seconds', () => assert.equal(policy.unixPeriodEnd(1000), '1970-01-01T00:16:40.000Z'))
test('Subscription fields use only supported plan IDs', () => {
  const result = server.subscriptionFields({id:'sub_one',status:'active',metadata:{openlab_plan:'junior'},current_period_end:1000})
  assert.equal(result.plan, 'junior'); assert.equal(result.status, 'active'); assert.equal(result.stripe_subscription_id, 'sub_one')
})
const payload = JSON.stringify({id:'evt_test123', type:'customer.subscription.updated', data:{object:{}}})
const secret = 'whsec_example_only'
const t = Math.floor(Date.now()/1000)
const sign = (raw, timestamp) => `t=${timestamp},v1=${createHmac('sha256',secret).update(`${timestamp}.${raw}`).digest('hex')}`
test('Authentic webhook accepted', () => assert.equal(server.verifyStripeWebhook(payload,sign(payload,t),secret,t),true))
test('Altered webhook rejected', () => assert.equal(server.verifyStripeWebhook(payload + ' ',sign(payload,t),secret,t),false))
test('Missing signature rejected', () => assert.equal(server.verifyStripeWebhook(payload,null,secret,t),false))
test('Incorrect webhook secret rejected', () => assert.equal(server.verifyStripeWebhook(payload,sign(payload,t),'whsec_other',t),false))
test('Old replay rejected', () => assert.equal(server.verifyStripeWebhook(payload,sign(payload,t-600),secret,t),false))
test('Future replay rejected', () => assert.equal(server.verifyStripeWebhook(payload,sign(payload,t+600),secret,t),false))
test('Malformed webhook signature rejected', () => assert.equal(server.verifyStripeWebhook(payload,'t=abc,v1=garbage',secret,t),false))
test('Empty webhook secret rejected', () => assert.equal(server.verifyStripeWebhook(payload,sign(payload,t),'',t),false))
test('Payload size limit enforced', () => assert.equal(server.verifyStripeWebhook('x'.repeat(262145),sign('x'.repeat(262145),t),secret,t),false))
console.log(`PASS: ${checks.length} commercial security policy assertions`)
