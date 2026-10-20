/** Fast, dependency-free integration guard for the two OpenLab sections. */
import { readFileSync, existsSync } from 'node:fs'
import assert from 'node:assert/strict'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const exists = (path) => existsSync(new URL(`../${path}`, import.meta.url))

for (const route of ['app/page.tsx','app/junior/page.tsx','app/notebook/page.tsx','app/plasmids/page.tsx','app/chemistry/page.tsx']) {
  assert.ok(exists(route), `Required route missing: ${route}`)
}
const home = read('components/Dashboard.tsx')
const sidebar = read('components/Sidebar.tsx')
const junior = read('components/junior/JuniorStudio.tsx')
const frame = read('components/AppShell.tsx')
const layout = read('app/layout.tsx')

assert.match(home, /href="\/junior"[^>]*className="juniorHeroLaunch"/, 'Homepage open button missing')
assert.match(home, /className="juniorFeatureBanner"/, 'Junior discovery card missing')
assert.match(sidebar, /href="\/junior"[^>]*className="juniorSideLauncher"/, 'Persistent sidebar Junior launcher missing')
assert.match(junior, /href="\/"[^>]*className="studio-researchLink"/, 'Junior return-to-Research link missing')
assert.match(frame, /pathname === "\/junior"/, 'Junior route not selected for full-width navigation')
assert.match(layout, /<AuthGate><AppShell>\{children\}<\/AppShell><\/AuthGate>/, 'Both sections must remain behind the shared account gate')
assert.ok(exists('components/junior/TheoryAcademy.tsx'))
assert.ok(exists('components/junior/BondingStudio.tsx'))
assert.ok(exists('supabase/migrations'), 'Research database migrations missing')
console.log('PASS unified routes, Research and Junior navigation, shared account gate and retained scientific workspaces.')
