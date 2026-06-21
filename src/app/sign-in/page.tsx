'use client'
import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="text-[#C9A84C] text-2xl font-bold tracking-tight block mb-6">GroomAI</Link>
        <SignIn
          appearance={{
            elements: {
              rootBox: 'w-full',
              card: 'bg-[#111] shadow-none border border-[#1a1a1a] rounded-2xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-gray-400',
              socialButtonsBlockButton: 'bg-[#1a1a1a] border border-[#333] text-white hover:bg-[#222]',
              formFieldLabel: 'text-gray-400',
              formFieldInput: 'bg-[#0A0A0A] border-[#1a1a1a] text-white',
              formButtonPrimary: 'bg-[#C9A84C] text-black hover:bg-[#b8963e]',
              footerActionLink: 'text-[#C9A84C]',
            },
          }}
        />
      </div>
    </div>
  )
}
