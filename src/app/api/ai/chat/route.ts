import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { message, history } = await request.json();
  const reply = `You said: "${message}". I'm your GroomAI assistant! I can help you find salons, book appointments, or suggest grooming styles in Hyderabad. How can I assist?`;
  return NextResponse.json({ reply });
}