import { NextResponse } from 'next/server'
import realSalons from '@/data/real_salons.json'

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

const mockSalons: Record<string, any> = Object.fromEntries(
  (realSalons as any[]).map(s => [s.id, { ...s, services: s.services?.map((sv: any) => sv.name) || [] }])
)

function findSalons(query: string): any[] {
  const q = query.toLowerCase()
  return Object.values(mockSalons).filter(s => {
    const inName = s.name.toLowerCase().includes(q)
    const inLocation = s.location.toLowerCase().includes(q)
    const inServices = s.services.some((sv: string) => sv.toLowerCase().includes(q))
    const priceMatch = q.includes('under') || q.includes('budget')
    return inName || inLocation || inServices || priceMatch
  })
}

interface IntentResult {
  type: 'find' | 'rebook' | 'general'
  response: string
}

function detectIntent(message: string, history: any[]): IntentResult | null {
  const m = message.toLowerCase()

  // Detect rebook intent
  if ((m.includes('rebook') || m.includes('book my usual') || m.includes('book again') || (m.includes('book') && m.includes('again'))) ||
      (m.includes('usual') && m.includes('appointment'))) {
    return {
      type: 'rebook',
      response: `I found your last appointment! Let me rebook it for you.

**Previous booking:**
- Salon: The Groom Room
- Service: Haircut
- Stylist: Rajesh Kumar
- Price: ₹399

I'll book the same service for tomorrow at your usual time. Ready to confirm?`,
    }
  }

  // Detect find/near me intent
  if (m.includes('find') || m.includes('near me') || m.includes('search') || m.includes('looking for') ||
      m.includes('recommend') || m.includes('suggest') || m.includes('best')) {
    const results = findSalons(message)
    if (results.length > 0) {
      const list = results.map(s =>
        `• **${s.name}** — ${s.location} — ⭐ ${s.rating} — Starts at ₹${s.priceFrom}\n  Services: ${s.services.join(', ')}`
      ).join('\n')
      return {
        type: 'find',
        response: `Here are the top salons matching your search:\n\n${list}\n\nTap one to view details and book instantly! 📍`,
      }
    }
    return {
      type: 'find',
      response: `I couldn't find specific salons for "${message}". Try searching by area (Banjara Hills, Jubilee Hills) or service (haircut, spa, beard). You can also use the **Explore** tab to browse all salons with the map.`,
    }
  }

  return null
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    const intent = detectIntent(message, history || [])
    if (intent) {
      return NextResponse.json({ reply: intent.response, intent: intent.type })
    }

    if (!process.env.OLLAMA_API_KEY) {
      const results = findSalons(message)
      if (results.length > 0) {
        const list = results.map(s =>
          `• **${s.name}** — ${s.location} — ⭐ ${s.rating} — Starts at ₹${s.priceFrom}`
        ).join('\n')
        return NextResponse.json({ reply: `Here's what I found in Hyderabad:\n\n${list}\n\nTap any salon to book! 💈` })
      }
      return NextResponse.json({
        reply: `I can help you find salons, book appointments, or rebook your favorite services. Just ask! Try:\n- "Find a haircut under ₹500"\n- "Book my usual appointment"\n- "Best spa in Jubilee Hills"`,
      })
    }

    const systemPrompt = `You are GroomBot, an AI assistant for GroomAI – a salon booking app in Hyderabad, India.

CAPABILITIES:
- Finding salons by name, location (Banjara Hills, Jubilee Hills), service, or price range
- Booking appointments
- Rebooking previous appointments
- Answering grooming questions

SALONS AVAILABLE:
- The Groom Room (Banjara Hills): Haircuts, Beard Trims from ₹399
- Spa & Blade (Jubilee Hills): Massages, Facials from ₹599
- Gentleman's Quarter (Banjara Hills): Premium cuts from ₹550
- Luxe Rituals (Jubilee Hills): Spa packages from ₹800

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
