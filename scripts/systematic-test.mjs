import { chromium } from '@playwright/test'

const BASE = 'https://frontend-one-amber-82.vercel.app'
const MAX_ITERATIONS = 10
const resultsByIteration = []

// Each test case: { category, question, checks[], required: boolean }
const TEST_MATRIX = [
  // ── GREETINGS ──
  { category: 'greeting', q: 'Hi', checks: [c => c.length > 20], required: true },
  { category: 'greeting', q: 'Hello', checks: [c => c.length > 20], required: true },
  { category: 'greeting', q: 'Hey there', checks: [c => c.length > 20], required: true },
  { category: 'greeting', q: 'Good morning', checks: [c => c.length > 20], required: false },

  // ── HELP ──
  { category: 'help', q: 'What can you do?', checks: ['help', 'find', 'book'], required: true },
  { category: 'help', q: 'Help', checks: ['help', 'find', 'book'], required: true },
  { category: 'help', q: 'How can you help me?', checks: ['help', 'find', 'salons'], required: true },

  // ── FAQ / KNOWLEDGE ──
  { category: 'faq', q: 'What is a fade haircut?', checks: ['fade', 'taper'], required: true },
  { category: 'faq', q: 'How often should I trim my beard?', checks: ['trim', 'week'], required: true },
  { category: 'faq', q: 'What happens during a facial?', checks: ['facial', 'cleansing', 'exfoliation'], required: false },
  { category: 'faq', q: 'How often should I get a haircut?', checks: ['week'], required: false },

  // ── FIND — direct trigger words ──
  { category: 'find', q: 'Find me a good barber near Banjara Hills', checks: ['Banjara', 'salons'], required: true },
  { category: 'find', q: 'Search for salons in Jubilee Hills', checks: ['Jubilee', 'salons'], required: true },
  { category: 'find', q: 'Looking for a facial in Banjara Hills', checks: ['Banjara', 'salons'], required: true },
  { category: 'find', q: 'Recommend a good salon', checks: ['salons'], required: true },
  { category: 'find', q: 'Suggest a spa near me', checks: ['salons'], required: true },
  { category: 'find', q: 'Best salon in Jubilee Hills', checks: ['Jubilee', 'salons'], required: true },

  // ── FIND — natural language (no explicit trigger) ──
  { category: 'find-natural', q: 'I need a haircut', checks: ['salons'], required: true },
  { category: 'find-natural', q: 'Haircut in Banjara Hills', checks: ['Banjara', 'salons'], required: true },
  { category: 'find-natural', q: 'Where can I get a beard trim?', checks: ['beard', 'trim'], required: true },
  { category: 'find-natural', q: 'Is there a good salon near me?', checks: ['salons'], required: true },
  { category: 'find-natural', q: 'Any salons open right now?', checks: ['salons'], required: false },
  { category: 'find-natural', q: 'Show me options for massage', checks: ['salons'], required: true },
  { category: 'find-natural', q: 'Know any good barbers?', checks: ['salons'], required: true },

  // ── FIND — price-aware ──
  { category: 'find-price', q: 'Cheapest haircut under 300', checks: ['salons'], required: true },
  { category: 'find-price', q: 'Affordable salon in Banjara Hills', checks: ['Banjara', 'salons'], required: true },
  { category: 'find-price', q: 'Budget facial under 1000', checks: ['salons'], required: true },
  { category: 'find-price', q: 'Best value barber near me', checks: ['salons'], required: false },

  // ── FIND — multi-condition ──
  { category: 'find-multi', q: 'Find a salon in Jubilee Hills that does haircut and facial', checks: ['Jubilee', 'salons'], required: true },
  { category: 'find-multi', q: 'Unisex salon in Banjara Hills under 600', checks: ['Banjara', 'salons'], required: true },
  { category: 'find-multi', q: 'Premium spa with massage in Banjara Hills', checks: ['spa', 'Banjara'], required: true },
  { category: 'find-multi', q: 'Cheap but high rated salon in Hitech City', checks: ['Hitech', 'salons'], required: false },
  { category: 'find-multi', q: 'Haircut and beard both under 500 total', checks: ['salons'], required: false },

  // ── BOOK ──
  { category: 'book', q: 'Book a haircut', checks: ['Confirm'], required: true },
  { category: 'book', q: 'I want to schedule a facial', checks: ['Confirm'], required: true },
  { category: 'book', q: 'Book an appointment for tomorrow at 2pm', checks: ['Confirm'], required: true },
  { category: 'book', q: 'I need a massage appointment this Friday', checks: ['Confirm'], required: true },

  // ── REBOOK ──
  { category: 'rebook', q: 'Rebook my last appointment', checks: ['Confirm'], required: true },
  { category: 'rebook', q: 'Book my usual appointment', checks: ['Confirm'], required: true },
  { category: 'rebook', q: 'Book again', checks: ['Confirm'], required: true },

  // ── SALON INFO ──
  { category: 'info', q: 'Tell me about The Groom Room', checks: ['Groom Room'], required: true },
  { category: 'info', q: 'What services does Naturals Unisex Salon offer?', checks: ['Naturals'], required: false },

  // ── COMPARISON ──
  { category: 'compare', q: 'Whats the cheapest haircut available?', checks: ['salons'], required: true },
  { category: 'compare', q: 'Compare salons in Banjara Hills with prices', checks: ['Banjara', 'salons'], required: false },

  // ── EDGE CASES ──
  { category: 'edge', q: 'Just looking around', checks: [c => c.length > 20], required: false },
  { category: 'edge', q: 'Thanks!', checks: [c => c.length > 0], required: false },
  { category: 'edge', q: 'Bye', checks: [c => c.length > 0], required: false },
]

async function askAPI(question) {
  const res = await fetch(`${BASE}/api/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: question, history: [] }),
  })
  if (!res.ok) return ''
  const json = await res.json()
  const reply = json.reply || ''
  const intent = json.intent || ''
  const data = json.data || {}
  const salons = data.salons || []
  const booking = data.booking || data.rebook || null
  const salonInfo = data.salon || null
  return { reply, intent, data, salons, booking, salonInfo }
}

function check(result, checks) {
  const reply = typeof result === 'string' ? result : result.reply
  const { salons, booking, salonInfo } = typeof result === 'object' ? result : { salons: [], booking: null, salonInfo: null }
  return checks.every(c => {
    if (typeof c === 'string') {
      const cl = c.toLowerCase()
      // Check reply text
      if (reply.toLowerCase().includes(cl)) return true
      // Check salons data
      if (salons && salons.length > 0) {
        if (c === 'salons' || c === '₹') return true
        if (salons.some(s =>
          (s.name && s.name.toLowerCase().includes(cl)) ||
          (s.location && s.location.toLowerCase().includes(cl))
        )) return true
      }
      // Check booking data
      if (booking && (booking.service || '').toLowerCase().includes(cl)) return true
      if (booking && (booking.salon || '').toLowerCase().includes(cl)) return true
      // Check salon info
      if (salonInfo && (salonInfo.name || '').toLowerCase().includes(cl)) return true
      if (salonInfo && (salonInfo.location || '').toLowerCase().includes(cl)) return true
      return false
    }
    if (c instanceof RegExp) return c.test(reply)
    if (typeof c === 'function') return c(reply)
    return false
  })
}

async function runIteration() {
  const iteration = { pass: 0, total: 0, failures: [] }

  for (const tc of TEST_MATRIX) {
    iteration.total++
    const reply = await askAPI(tc.q)
    const passed = check(reply, tc.checks)
    if (passed) {
      iteration.pass++
    } else {
      const replyText = typeof reply === 'string' ? reply : reply.reply || ''
      iteration.failures.push({ ...tc, reply: replyText.slice(0, 200) })
    }
  }
  return iteration
}

function printResults(iteration, iterNum) {
  console.log(`\n── Iteration ${iterNum} ─────────────────`)
  console.log(`  Passed: ${iteration.pass}/${iteration.total}  (${(iteration.pass/iteration.total*100).toFixed(0)}%)`)
  
  // Show all failures (not just required ones)
  const allFailed = iteration.failures
  if (allFailed.length > 0) {
    // Group by category
    const byCat = {}
    allFailed.forEach(f => {
      if (!byCat[f.category]) byCat[f.category] = []
      byCat[f.category].push(f)
    })
    for (const [cat, fails] of Object.entries(byCat)) {
      console.log(`  [${cat}] ${fails.length} failed:`)
      fails.forEach(f => console.log(`    • ${f.q} → ${(f.reply || '(empty)').slice(0, 150)}`))
    }
  }
}

async function run() {
  console.log('========== SYSTEMATIC AI ASSISTANT TEST ==========')
  console.log(`Test Matrix: ${TEST_MATRIX.length} questions across ${[...new Set(TEST_MATRIX.map(t => t.category))].length} categories`)
  console.log(`Max iterations: ${MAX_ITERATIONS}\n`)

  for (let iter = 0; iter < MAX_ITERATIONS; iter++) {
    // First iteration: run full test
    const iteration = await runIteration()
    resultsByIteration.push(iteration)
    printResults(iteration, iter + 1)

    // Check if all required tests pass
    const requiredTests = TEST_MATRIX.filter(t => t.required)
    const requiredFailures = iteration.failures.filter(f => f.required)
    
    if (requiredFailures.length === 0) {
      console.log(`\n🎉 ALL REQUIRED TESTS PASSED in iteration ${iter + 1}!`)
      console.log(`\nTotal: ${iteration.pass}/${iteration.total} (${(iteration.pass/iteration.total*100).toFixed(0)}%)\n`)
      break
    }

    if (iter < MAX_ITERATIONS - 1) {
      console.log(`\n${requiredFailures.length} required tests still failing. Will fix and redeploy...\n`)
      // Here we'd fix the code and redeploy
      // For now, break to show results
      break
    }
  }

  // Final summary
  const last = resultsByIteration[resultsByIteration.length - 1]
  console.log('\n========== FINAL SUMMARY ==========')
  console.log(`  Passed: ${last.pass}/${last.total}`)
  console.log(`  Failed: ${last.failures.length}`)

  // Summary by category
  const cats = [...new Set(TEST_MATRIX.map(t => t.category))]
  for (const cat of cats) {
    const catTests = TEST_MATRIX.filter(t => t.category === cat)
    const catFails = last.failures.filter(f => f.category === cat)
    console.log(`  [${cat}] ${catTests.length - catFails.length}/${catTests.length}`)
  }

  // List all failures for potential fixes
  if (last.failures.length > 0) {
    console.log('\n❌ FAILURES THAT NEED FIXING:')
    last.failures.forEach(f => {
      console.log(`  [${f.category}] ${f.q}`)
      if (f.reply) console.log(`    → ${String(f.reply).slice(0, 150)}`)
    })
  }
}

run().catch(e => { console.error('FATAL:', e); process.exit(1) })
