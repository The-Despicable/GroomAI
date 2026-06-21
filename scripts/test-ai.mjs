import { chromium } from '@playwright/test'

const BASE = 'https://frontend-one-amber-82.vercel.app'
const results = { pass: [], fail: [] }

async function ask(page, question) {
  const input = page.locator('input[placeholder*="Ask about salons"]')
  await input.fill(question)
  await input.press('Enter')
  // Wait for AI response to appear
  await page.waitForTimeout(2000)
  // Wait until no more loading dots
  await page.locator('.animate-bounce').first().waitFor({ state: 'hidden', timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(500)

  // Get all message text blocks
  const texts = await page.locator('.text-sm.leading-relaxed').allTextContents()
  // Return the last one (which should be the AI response)
  return texts[texts.length - 1] || ''
}

async function run() {
  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage()
  const resultsList = []

  await page.goto(`${BASE}/assistant`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  const questions = [
    { q: 'Find me a unisex salon in Jubilee Hills under ₹600 that does beard trim', checks: ['Jubilee'], tag: 'multi-condition' },
    { q: 'Which salon in Banjara Hills has the cheapest haircut?', checks: ['Banjara', /₹\d+/], tag: 'price comparison' },
    { q: 'I want a salon that offers both haircut and facial — show me options', checks: ['haircut', 'facial'], tag: 'multi-service' },
    { q: 'I need a fresh look for a wedding next weekend', checks: [c => c.length > 60], tag: 'vague intent' },
    { q: 'Book a haircut at The Groom Room for tomorrow at 2pm', checks: ['Groom Room', 'haircut', /tomorrow|today/], tag: 'booking flow' },
    { q: 'Rebook my last appointment', checks: ['rebook', 'last'], tag: 'rebook' },
    { q: 'Cheap but high rated salon in Hitech City — max ₹400', checks: ['Hitech', /₹\d+/], tag: 'budget vs rating' },
    { q: 'Find a salon that does hair, beard, and facial all under ₹1000', checks: ['hair', 'beard'], tag: '3 services combined budget' },
    { q: 'Which salons near me are open right now?', checks: [c => c.toLowerCase().includes('open') || c.toLowerCase().includes('explore')], tag: 'real-time' },
    { q: 'Suggest a premium spa with massage in Banjara Hills', checks: ['spa', 'massage', 'Banjara'], tag: 'premium + spa + area' },
  ]

  console.log('\n========== AI ASSISTANT STRESS TEST ==========\n')

  for (const { q, checks, tag } of questions) {
    const reply = await ask(page, q)
    const truncated = reply.length > 250 ? reply.slice(0, 250) + '...' : reply
    console.log(`\nQ: ${q}`)
    console.log(`A: ${truncated}`)

    const passed = checks.every(c => {
      if (typeof c === 'string') return reply.toLowerCase().includes(c.toLowerCase())
      if (c instanceof RegExp) return c.test(reply)
      if (typeof c === 'function') return c(reply)
      return false
    })

    if (passed) { results.pass.push(q); console.log(`  ✅ ${tag}`) }
    else { results.fail.push({ q, tag, reply }); console.log(`  ❌ ${tag}`) }
  }

  await browser.close()

  console.log(`\n========== RESULTS ==========`)
  console.log(`  ✅ ${results.pass.length}/${questions.length} passed`)
  console.log(`  ❌ ${results.fail.length}/${questions.length} failed`)
  if (results.fail.length > 0) {
    console.log('\nFailures:')
    results.fail.forEach(f => console.log(`  • ${f.q}`))
  }
}

run().catch(e => { console.error('FATAL:', e); process.exit(1) })
