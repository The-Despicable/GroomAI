import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const nimClient = new OpenAI({
  apiKey: process.env.NIM_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
})

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    const systemPrompt = `
You are GroomBot, an AI assistant for GroomAI – a salon booking app.
Your users are in Hyderabad, India, especially Banjara Hills and Jubilee Hills.
You help users find salons, recommend services (hair, beard, spa, nails), and answer grooming questions.
Be friendly, concise, and suggest the app's map/search for finding nearby salons.
If they ask for a specific salon, tell them to search in the app.
`

    const messages = [
      { role: 'system', content: systemPrompt },
      ...(history || []),
      { role: 'user', content: message },
    ]

    const completion = await nimClient.chat.completions.create({
      model: 'deepseek-ai/deepseek-r1',
      messages,
      temperature: 0.7,
      max_tokens: 500,
    })

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that."

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('NVIDIA NIM error:', error)
    return NextResponse.json(
      { error: 'AI service temporarily unavailable.' },
      { status: 500 }
    )
  }
}
