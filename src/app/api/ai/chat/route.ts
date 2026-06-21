import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

let _ollamaClient: any = null

async function getOllamaClient() {
  if (!_ollamaClient) {
    const { default: OpenAI } = await import('openai')
    _ollamaClient = new OpenAI({
      apiKey: process.env.OLLAMA_API_KEY,
      baseURL: 'https://ollama.com/v1',
    })
  }
  return _ollamaClient
}

const SALONS_TEXT = `- The Urban Barber Co. (Banjara Hills): Classic Haircut from ₹400, Beard Sculpt from ₹300
- Glamour Studio (Banjara Hills): Women's Haircut from ₹500, Hair Color from ₹2500
- Sculpt & Style Wellness (Jubilee Hills): Signature Haircut from ₹600, Luxury Facial from ₹800
- Mane Attraction (Banjara Hills): Women's Haircut from ₹450, Balayage from ₹3000
- Beard Brothers (Banjara Hills): Signature Haircut from ₹350, Beard Sculpting from ₹400
- Zenith Salon & Spa (Banjara Hills): Unisex Haircut from ₹400, Aromatherapy Massage from ₹1000
- Cuts & Curves (Banjara Hills): Express Haircut from ₹250, Beard Trim from ₹150
- The Polish Room (Banjara Hills): Gel Manicure from ₹500, Luxury Pedicure from ₹600`

const FAQ: Record<string, string> = {
  'fade': 'A fade is a tapered haircut where the hair on the sides and back gradually blends (fades) into the skin. Popular types: low fade, mid fade, high fade, and skin fade.',
  'haircut frequency': 'For most hairstyles, every 2-4 weeks is recommended. Short styles need trims every 2-3 weeks; longer styles can go 4-6 weeks.',
  'beard trim': 'For a neat beard, trim every 1-2 weeks. Use a quality trimmer with guards, trim in the direction of hair growth, and define edges with a razor.',
  'facial': 'A salon facial typically includes cleansing, exfoliation, extraction, massage, and a mask. Takes 45-60 minutes. Recommended monthly for best results.',
  'massage': 'Salon massages range from 30-90 minutes. Types: Swedish (relaxation), Deep Tissue (muscle tension), Aromatherapy (essential oils).',
}

async function fetchSalons() {
  const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!hasSupabase) return null

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const { data: salons, error } = await supabase.from('salons').select('id, name, location, area, rating, images')
    if (error) throw error

    const { data: services } = await supabase.from('services').select('name, price, salon_id')
    const servicesBySalon: Record<string, string[]> = {}
    const pricesBySalon: Record<string, number[]> = {}
    const serviceNamesBySalon: Record<string, string[]> = {}
    for (const svc of services || []) {
      if (!servicesBySalon[svc.salon_id]) servicesBySalon[svc.salon_id] = []
      servicesBySalon[svc.salon_id].push(svc.name)
      if (!pricesBySalon[svc.salon_id]) pricesBySalon[svc.salon_id] = []
      pricesBySalon[svc.salon_id].push(svc.price)
      if (!serviceNamesBySalon[svc.salon_id]) serviceNamesBySalon[svc.salon_id] = []
      serviceNamesBySalon[svc.salon_id].push(`${svc.name} (₹${(svc.price / 100).toFixed(0)})`)
    }

    return (salons || []).map(s => {
      const prices = pricesBySalon[s.id] || []
      return {
        ...s,
        services: servicesBySalon[s.id] || [],
        serviceDetails: serviceNamesBySalon[s.id] || [],
        priceFrom: prices.length > 0 ? Math.min(...prices) / 100 : 0,
      }
    })
  } catch {
    return null
  }
}

function extractPriceConstraint(q: string): number | null {
  const matches = q.match(/under\s*₹?\s*(\d+)|budget\s*(?:of\s*)?₹?\s*(\d+)|below\s*₹?\s*(\d+)|max\s*₹?\s*(\d+)|<=?\s*₹?\s*(\d+)|under\s*(\d+)\s*(?:rupees|bucks|rs)/i)
  if (matches) {
    for (let i = 1; i <= 6; i++) {
      if (matches[i]) return parseInt(matches[i])
    }
  }
  return null
}

function findSalonsInList(query: string, salons: any[]): { results: any[]; matchedServices: Record<string, string[]> } {
  const q = query.toLowerCase()
  const stopWords = ['find', 'near', 'me', 'for', 'the', 'and', 'are', 'you', 'can', 'all', 'any', 'tap', 'one', 'view', 'also', 'use', 'need', 'want', 'show', 'list', 'tell', 'got', 'where', 'which', 'what', 'some', 'with', 'that', 'not', 'but', 'how', 'get', 'just', 'like', 'know', 'please', 'help', 'looking', 'search', 'recommend', 'suggest', 'best', 'good', 'nice', 'great', 'cheap', 'affordable']
  const keywords = q.split(/\s+/).map(k => k.replace(/[^a-z0-9]/g, '')).filter(k => k.length > 2 && !stopWords.includes(k))

  const maxPrice = extractPriceConstraint(q)
  const hasPriceIntent = q.includes('under') || q.includes('budget') || q.includes('affordable') || q.includes('cheap') || q.includes('below') || q.includes('max') || maxPrice !== null

  const matched: Record<string, string[]> = {}
  const scored = salons.map(s => {
    let score = 0
    const matchedSvcs: string[] = []

    if (keywords.length === 0) return { salon: s, score: 0, matchedSvcs }

    for (const k of keywords) {
      const searchTerms = [k, k.replace(/s$/, '').replace(/es$/, ''), k.replace(/ing$/, '').replace(/ed$/, '')]
      const matchesAny = (text: string) => searchTerms.some(t => text.toLowerCase().includes(t))
      const inName = matchesAny(s.name)
      const inLocation = matchesAny(s.location || '') || matchesAny(s.area || '')
      const inServices = (s.services || []).some((sv: string) => {
        const match = matchesAny(sv)
        if (match) matchedSvcs.push(sv)
        return match
      })

      if (inName) score += 3
      if (inLocation) score += 2
      if (inServices) score += 2
    }

    // Filter by price
    if (hasPriceIntent && maxPrice) {
      const salonPrices = (s.serviceDetails || []).map((sd: string) => {
        const p = sd.match(/₹(\d+)/)
        return p ? parseInt(p[1]) : Infinity
      })
      const hasAffordableService = salonPrices.some((p: number) => p <= maxPrice)
      if (!hasAffordableService) score = -1
    }

    if (q.includes('best') || q.includes('top') || q.includes('highest')) score += s.rating * 0.5
    if (hasPriceIntent && (q.includes('cheap') || q.includes('budget') || q.includes('affordable'))) score += (100 - s.priceFrom) * 0.01

    matched[s.id] = [...new Set(matchedSvcs)]
    return { salon: s, score, matchedSvcs: [...new Set(matchedSvcs)] }
  })

  const filtered = scored.filter(s => s.score > 0)
  filtered.sort((a, b) => b.score - a.score)

  return {
    results: filtered.map(f => f.salon),
    matchedServices: Object.fromEntries(
      Object.entries(matched).filter(([_, v]) => v.length > 0)
    ),
  }
}

function formatSalonList(salons: any[], matchedServices: Record<string, string[]>): string {
  return salons.map(s => {
    const svcs = matchedServices[s.id]
    const serviceLine = svcs && svcs.length > 0
      ? `\n     Services: ${svcs.slice(0, 3).join(', ')}${svcs.length > 3 ? ` +${svcs.length - 3} more` : ''}`
      : ''
    return `• **${s.name}** — ${s.location || s.area} — ⭐ ${s.rating} — Starts at ₹${s.priceFrom}${serviceLine}`
  }).join('\n')
}

function extractBookingService(q: string, salonList: any[]): { service: string; salonName: string | null } {
  const serviceKeywords = ['haircut', 'beard trim', 'beard sculpt', 'shave', 'facial', 'massage', 'hair color', 'manicure', 'pedicure', 'hair style', 'hair']
  let service = 'a service'
  for (const sk of serviceKeywords) {
    if (q.includes(sk)) { service = sk; break }
  }
  let salonName: string | null = null
  const salon = salonList.find(s => q.toLowerCase().includes(s.name.toLowerCase()))
  if (salon) salonName = salon.name
  return { service, salonName }
}

function extractDate(q: string): string {
  if (q.includes('tomorrow')) return 'tomorrow'
  if (q.includes('today')) return 'today'
  const dayMatch = q.match(/(monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i)
  if (dayMatch) return `this ${dayMatch[1]}`
  return 'the next available date'
}

function extractTime(q: string): string {
  const timeMatch = q.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i)
  if (timeMatch) {
    let h = parseInt(timeMatch[1])
    const m = timeMatch[2] || '00'
    const ampm = timeMatch[3].toLowerCase()
    if (ampm === 'pm' && h < 12) h += 12
    if (ampm === 'am' && h === 12) h = 0
    return `${h.toString().padStart(2, '0')}:${m}`
  }
  return 'your usual time'
}

function findFaqAnswer(q: string): string | null {
  const qLower = q.trim().toLowerCase()
  const isQuestion = /^(what|how|why|when|where|can you|do you|does|is it|is there|are there|explain|define|tell me|what's|whats)/i.test(qLower) || /how\s+(often|frequently|to|do|should)/i.test(qLower) || /\b(what|how|why|where)\b.*\?/.test(qLower)

  if (!isQuestion) return null

  for (const [topic, answer] of Object.entries(FAQ)) {
    const topicWords = topic.split(/\s+/)
    if (topicWords.every(word => qLower.includes(word))) return answer
  }

  // Fallback: detect common advice patterns
  if (qLower.includes('how often') || qLower.includes('how frequently') || qLower.includes('recommended') || qLower.includes('should i')) {
    if (qLower.includes('haircut') || qLower.includes('cut') || qLower.includes('hair')) return FAQ['haircut frequency']
    if (qLower.includes('beard') || qLower.includes('trim') || qLower.includes('facial') || qLower.includes('spa') || qLower.includes('massage')) return FAQ['beard trim']
  }

  return null
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()
    const m = message.toLowerCase().trim()

    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const salonList = hasSupabase ? (await fetchSalons()) : null

    // 1. Greetings
    if (/^(hi|hello|hey|good\s*(morning|afternoon|evening)|yo|sup|hey there|hi there)[\s!.]*$/i.test(m)) {
      return NextResponse.json({
        reply: `Hey there! 👋 I'm GroomAI, your salon booking assistant. I can help you find salons, book appointments, answer grooming questions, and more. Just tell me what you need!`,
        intent: 'greeting'
      })
    }

    // 2. Help / capabilities
    if (m.includes('help') || m.includes('what can you do') || m.includes('capabilities') || m.includes('how can you help')) {
      return NextResponse.json({
        reply: `Here's what I can help you with:\n\n🔍 **Find salons** — by location, service, or budget\n📅 **Book appointments** — schedule a visit at your preferred time\n🔄 **Rebook** — quickly repeat your last booking\n💇 **Grooming advice** — tips on haircuts, beard care, facials, etc.\n\nJust ask naturally! For example: "Find a cheap haircut in Banjara Hills" or "Book a facial for tomorrow."`,
        intent: 'help'
      })
    }

    // 3. Rebook intent
    if ((m.includes('rebook') || m.includes('book my usual') || m.includes('book again') || (m.includes('book') && m.includes('again'))) ||
        (m.includes('usual') && m.includes('appointment'))) {
      return NextResponse.json({
        reply: `I found your last appointment! Same service, same place — ready to confirm?`,
        intent: 'rebook',
        data: { rebook: { salon: 'The Urban Barber Co.', service: 'Classic Haircut', stylist: 'Ravi Kumar', price: 400 } }
      })
    }

    // 5. Booking intent (not rebook)
    if (m.includes('book') || m.includes('schedule') || m.includes('appointment') || m.includes('reserve') || m.includes('fix an appointment')) {
      const { service, salonName } = extractBookingService(m, salonList || [])
      const date = extractDate(m)
      const time = extractTime(m)
      const salonLine = salonName ? ` at **${salonName}**` : ''
      return NextResponse.json({
        reply: `I'd be happy to help you book${salonLine}. Confirm the details below:`,
        intent: 'book',
        data: { booking: { service: service.charAt(0).toUpperCase() + service.slice(1), date, time, salonName } }
      })
    }

    // 6. Specific salon info (before generic find)
    if (m.includes('about') || m.includes('services') || m.includes('offer') || m.includes('menu') || m.includes('details') || m.includes('tell me more')) {
      const matchedSalon = salonList?.find(s => m.includes(s.name.toLowerCase()))
      if (matchedSalon) {
        return NextResponse.json({
          reply: `**${matchedSalon.name}** — details below:`,
          intent: 'info',
          data: {
            salon: {
              id: matchedSalon.id, name: matchedSalon.name, location: matchedSalon.location || matchedSalon.area,
              rating: matchedSalon.rating, services: matchedSalon.serviceDetails || [],
              priceFrom: matchedSalon.priceFrom, imageUrl: matchedSalon.images?.[0] || null,
            }
          }
        })
      }
    }

    // 7. FAQ / Knowledge (before find — only for clear question patterns)
    const faqAnswer = findFaqAnswer(m)
    if (faqAnswer) {
      return NextResponse.json({ reply: faqAnswer, intent: 'faq' })
    }

    // 8. Find / search / recommend intent
    const findTriggers = ['find', 'near', 'need', 'want', 'looking', 'recommend', 'suggest', 'best', 'cheap', 'affordable', 'show', 'tell', 'where', 'which', 'any', 'is there', 'know any', 'got any', 'search', 'options', 'list', 'i need', 'i want', 'give me']
    const isFindIntent = findTriggers.some(t => m.includes(t)) ||
      salonList?.some(s => m.includes(s.name.toLowerCase())) ||
      ['haircut', 'barber', 'salon', 'spa', 'facial', 'massage', 'beard', 'grooming', 'hairstyle', 'stylist', 'manicure', 'pedicure', 'nails', 'trim', 'shave', 'color', 'style', 'service'].some(k => m.includes(k))

    if (isFindIntent) {
      const { results, matchedServices } = findSalonsInList(message, salonList || [])
      if (results.length > 0) {
        let sorted = results
        let header = 'Here are the top salons matching your search:'
        if (m.includes('cheapest') || m.includes('most affordable') || m.includes('lowest price') || m.includes('budget')) {
          sorted = [...results].sort((a, b) => a.priceFrom - b.priceFrom)
          header = `Here are the most affordable options sorted by price:`
        } else if (m.includes('best') || m.includes('top') || m.includes('highest') || m.includes('premium')) {
          sorted = [...results].sort((a, b) => b.rating - a.rating)
          header = `Here are the top-rated salons:`
        }
        const salonsData = sorted.slice(0, 10).map(s => ({
          id: s.id, name: s.name, location: s.location || s.area, rating: s.rating, priceFrom: s.priceFrom,
          imageUrl: s.images?.[0] || null,
        }))
        return NextResponse.json({
          reply: `${header}`,
          intent: 'find',
          data: { salons: salonsData }
        })
      }

      return NextResponse.json({
        reply: `I couldn't find specific salons for "${message}". Try searching by area (Banjara Hills, Jubilee Hills, Madhapur, Hitech City) or service (haircut, beard, facial, massage, nails). You can also use the **Explore** tab to browse all salons.`,
        intent: 'find'
      })
    }

    // 9. Price/comparison queries (for queries without find triggers like "cheapest" alone)
    if (m.includes('cheapest') || m.includes('most affordable') || m.includes('lowest price') || m.includes('best value') || m.includes('compare')) {
      const { results, matchedServices } = findSalonsInList(message, salonList || [])
      const sorted = [...results].sort((a, b) => a.priceFrom - b.priceFrom)
      if (sorted.length > 0) {
        return NextResponse.json({
          reply: `Here are the most affordable options sorted by price:\n\n${formatSalonList(sorted.slice(0, 8), matchedServices)}\n\n💡 **Most budget-friendly:** **${sorted[0].name}** at just ₹${sorted[0].priceFrom}!`,
          intent: 'cheapest'
        })
      }
    }

    // 10. No Ollama — give helpful fallback
    if (!process.env.OLLAMA_API_KEY) {
      return NextResponse.json({
        reply: `I can help you find salons, book appointments, or rebook your favorite services. Just ask! Try:\n- "Find a haircut under ₹500"\n- "Book my usual appointment"\n- "Best spa in Jubilee Hills"\n- "How often should I trim my beard?"`,
        intent: 'fallback'
      })
    }

    // 10. Ollama Cloud fallback
    const systemPrompt = `You are GroomBot, an AI assistant for GroomAI – a salon booking platform in Hyderabad, India.

CAPABILITIES:
- Finding salons by name, location (Banjara Hills, Jubilee Hills), service, or price range
- Booking appointments
- Rebooking previous appointments
- Answering grooming questions

SALONS AVAILABLE:
${SALONS_TEXT}

RULES:
- Be friendly, concise, and suggest specific salons
- If they ask for recommendations, give 2-3 specific options
- Always mention price ranges and locations
- Suggest using the Explore tab for map search
- If they want to book, ask for date/time preference`

    const ollamaClient = await getOllamaClient()
    const completion = await ollamaClient.chat.completions.create({
      model: 'minimax-m3',
      messages: [
        { role: 'system', content: systemPrompt },
        ...(history || []),
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that."
    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('AI error:', error)
    return NextResponse.json({ error: 'AI service unavailable.' }, { status: 500 })
  }
}
