import { NextResponse } from 'next/server'

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

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    if (!process.env.OLLAMA_API_KEY) {
      return NextResponse.json({
        reply: `You said: "${message}". I'm your GroomAI assistant! Connect an OLLAMA_API_KEY to enable AI.`,
      })
    }

    const systemPrompt = `
You are GroomBot, an AI assistant for GroomAI – a salon booking app.
Your users are in Hyderabad, India, especially Banjara Hills and Jubilee Hills.
You help users find salons, recommend grooming services (hair, beard, spa, nails), and answer questions.
Be friendly, concise, and suggest the app's map/search to find nearby salons.
If they ask for a specific salon, tell them to search in the app.
`

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
    console.error('Ollama Cloud API error:', error)
    return NextResponse.json(
      { error: 'AI service temporarily unavailable.' },
      { status: 500 }
    )
  }
}
