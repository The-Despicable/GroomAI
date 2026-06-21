import { chromium } from '@playwright/test'
import fs from 'fs'

const BASE = 'https://frontend-one-amber-82.vercel.app'
const SEARCH_QUERY = 'hitech'
const BUDGET = 400

const results = { success: [], fail: [], warnings: [] }

function ok(msg) { results.success.push(msg); console.log(`  ✅ ${msg}`) }
function fail(msg) { results.fail.push(msg); console.log(`  ❌ ${msg}`) }
function warn(msg) { results.warnings.push(msg); console.log(`  ⚠️  ${msg}`) }

const SCREENSHOT_DIR = '/tmp/groomai-sim'

async function run() {
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
  const page = await context.newPage()

  // Ensure screenshot directory
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true })

  async function snap(name) {
    try {
      await page.screenshot({ path: `${SCREENSHOT_DIR}/${name}.png`, fullPage: true })
      console.log(`  📸 ${SCREENSHOT_DIR}/${name}.png`)
    } catch (e) {
      console.log(`  📸 (screenshot failed: ${e.message})`)
    }
  }

  console.log('\n========== CUSTOMER SIMULATION ==========\n')
  console.log(`Search: "${SEARCH_QUERY}" | Budget: ₹${BUDGET}`)

  // ── Step 1: Landing Page (public) ──
  console.log(`\n--- Step 1: Landing page ---`)
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await snap('01-landing')
  const headline = await page.textContent('h2')
  if (headline?.includes('Grooming') || headline?.includes('Salon') || headline?.includes('Find')) {
    ok('Landing page loads with headline: "' + headline.trim().slice(0, 60) + '"')
  } else {
    const curUrl = page.url()
    if (curUrl.includes('/sign-in')) {
      ok('Landing page redirects unauthed users to /sign-in (protected)')
    } else {
      fail('Landing page headline missing, URL: ' + curUrl)
    }
  }

  // ── Step 2: Protected page redirect test ──
  console.log(`\n--- Step 2: Auth redirect ---`)
  await page.goto(`${BASE}/explore?q=${encodeURIComponent(SEARCH_QUERY)}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await snap('02-explore-redirect')
  if (page.url().includes('/sign-in')) {
    ok('Protected /explore redirects to /sign-in')
  } else {
    fail('Protected /explore did not redirect to /sign-in, URL: ' + page.url())
  }

  // ── Step 3: Sign-in page ──
  console.log(`\n--- Step 3: Sign-in page ---`)
  await page.goto(`${BASE}/sign-in`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await snap('03-sign-in')
  if (await page.getByRole('heading', { name: /welcome back/i }).isVisible()) {
    ok('/sign-in page renders custom Stitch design with "Welcome Back"')
  } else {
    const content = await page.content()
    if (content.includes('GroomAI') && content.includes('Sign In')) {
      ok('/sign-in page renders with GroomAI branding')
    } else {
      fail('/sign-in page not rendering properly')
    }
  }

  // ── Step 4: Sign-up page ──
  console.log(`\n--- Step 4: Sign-up page ---`)
  await page.goto(`${BASE}/sign-up`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)
  await snap('04-sign-up')
  const signUpContent = await page.content()
  if (signUpContent.includes('clerk') || signUpContent.includes('Sign Up')) {
    ok('/sign-up page loads with Clerk')
  } else {
    fail('/sign-up page not loading')
  }

  // ── Step 5: Static pages (public) ──
  console.log(`\n--- Step 5: Public static pages ---`)
  for (const path of ['/about', '/help', '/terms']) {
    await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
    await page.waitForTimeout(1000)
    await snap('05-' + path.replace(/\//g, ''))
    const title = await page.title()
    if (title && !title.includes('404')) ok(`${path} — "${title}"`)
    else fail(`${path} — failed to load`)
  }

  // Protected static page (should redirect to sign-in)
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  await snap('06-admin-redirect')
  if (page.url().includes('/sign-in')) {
    ok('/admin (protected) redirects to sign-in')
  } else {
    warn('/admin did not redirect (may need auth)')
  }

  // ── Step 6: AI Assistant (protected, should redirect) ──
  console.log(`\n--- Step 6: AI Assistant redirect ---`)
  await page.goto(`${BASE}/assistant`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  await snap('07-assistant-redirect')
  if (page.url().includes('/sign-in')) {
    ok('/assistant (protected) redirects to /sign-in')
  } else {
    warn('/assistant loaded without auth — check proxy')
  }

  // ── Step 7: Mobile nav on landing page ──
  console.log(`\n--- Step 7: Mobile nav ---`)
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto(BASE, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)
  await snap('08-mobile-landing')
  const mobileNavLinks = await page.locator('nav:below(main) a, nav:below(main) button').count()
  if (mobileNavLinks >= 3) ok(`Mobile nav has ${mobileNavLinks} items`)
  else warn(`Mobile nav has only ${mobileNavLinks} items`)

  const moreBtn = page.locator('nav:below(main) button:has-text("More")')
  if (await moreBtn.isVisible()) {
    await moreBtn.click()
    await page.waitForTimeout(500)
    const moreLinks = await page.locator('text=Dashboard, text=About, text=Help, text=Terms, text=Admin').count()
    if (moreLinks >= 3) ok('Mobile "More" sheet opens with links')
    else warn('Mobile More sheet has fewer links than expected')
  } else {
    warn('Mobile "More" button not found')
  }

  await browser.close()

  // ── Summary ──
  console.log('\n========== RESULTS ==========')
  console.log(`  ✅ Success: ${results.success.length}`)
  console.log(`  ❌ Failed:  ${results.fail.length}`)
  console.log(`  ⚠️  Warnings: ${results.warnings.length}`)
  if (results.fail.length > 0) {
    console.log('\nFailures:')
    results.fail.forEach(r => console.log(`  • ${r}`))
  }
  if (results.warnings.length > 0) {
    console.log('\nWarnings:')
    results.warnings.forEach(r => console.log(`  • ${r}`))
  }
}

run().catch(e => { console.error('FATAL:', e); process.exit(1) })
