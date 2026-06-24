'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, Sparkles, MapPin, Scissors } from 'lucide-react'
import { getSalons } from '@/lib/api'

interface Suggestion {
  type: 'salon' | 'service' | 'location'
  label: string
  sublabel?: string
  icon?: any
}

export default function SearchAutocomplete({ onSearch }: { onSearch?: (query: string) => void }) {
  const [query, setQuery] = useState('')
  const [salons, setSalons] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [show, setShow] = useState(false)
  const [idx, setIdx] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    getSalons().then(setSalons)
  }, [])

  const buildSuggestions = useCallback((q: string) => {
    if (!q.trim()) { setSuggestions([]); return }
    const lower = q.toLowerCase()
    const results: Suggestion[] = []
    const seen = new Set<string>()

    for (const s of salons) {
      if (s.name?.toLowerCase().includes(lower) && !seen.has(`s-${s.id}`)) {
        seen.add(`s-${s.id}`)
        results.push({ type: 'salon', label: s.name, sublabel: s.location })
      }
      if (s.location?.toLowerCase().includes(lower) && !seen.has(`l-${s.location}`)) {
        seen.add(`l-${s.location}`)
        results.push({ type: 'location', label: s.location })
      }
      for (const sv of (s.services || [])) {
        if (sv.name?.toLowerCase().includes(lower) && !seen.has(`sv-${sv.name}`)) {
          seen.add(`sv-${sv.name}`)
          results.push({ type: 'service', label: sv.name, sublabel: `from ₹${sv.price}` })
        }
      }
    }

    if (results.length === 0 && lower.length > 0) {
      results.push({ type: 'service', label: `Search "${q}"` })
    }
    setSuggestions(results.slice(0, 8))
  }, [salons])

  useEffect(() => {
    const t = setTimeout(() => buildSuggestions(query), 150)
    return () => clearTimeout(t)
  }, [query, buildSuggestions])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setShow(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function select(s: Suggestion) {
    setQuery(s.label)
    setShow(false)
    onSearch?.(s.label)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (idx >= 0 && suggestions[idx]) {
      select(suggestions[idx])
    } else if (query.trim()) {
      onSearch?.(query)
    }
    setShow(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIdx(i => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIdx(i => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setShow(false)
    }
  }

  const icons: Record<string, any> = { salon: MapPin, service: Scissors, location: MapPin }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="w-full bg-[#111] border border-gray-800 rounded-2xl p-1.5 flex items-center gap-2 focus-within:border-[#C9A84C]/50 focus-within:ring-1 focus-within:ring-[#C9A84C]/20 transition-all shadow-lg">
        <div className="pl-4 text-gray-500">
          <Search size={20} />
        </div>
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setShow(true); setIdx(-1) }}
          onFocus={() => suggestions.length > 0 && setShow(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none focus:outline-none text-white py-3 text-sm placeholder:text-gray-600"
          placeholder="Search salons, styles, or locations..."
          type="text"
          autoComplete="off"
          role="combobox"
          aria-expanded={show}
          aria-autocomplete="list"
        />
        <button type="submit" className="p-2.5 bg-[#C9A84C] text-black rounded-xl hover:bg-[#b8963e] hover:scale-105 transition-all active:scale-95">
          <Sparkles size={18} />
        </button>
      </form>

      {show && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-2 bg-[#1A1A1A] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl z-50" role="listbox">
          {suggestions.map((s, i) => {
            const Icon = icons[s.type] || Search
            return (
              <li
                key={`${s.type}-${s.label}-${i}`}
                role="option"
                aria-selected={i === idx}
                onClick={() => select(s)}
                onMouseEnter={() => setIdx(i)}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  i === idx ? 'bg-[#C9A84C]/10 text-white' : 'text-gray-300 hover:bg-[#222]'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                  s.type === 'salon' ? 'bg-blue-500/10' : s.type === 'service' ? 'bg-[#C9A84C]/10' : 'bg-green-500/10'
                }`}>
                  <Icon size={14} className={
                    s.type === 'salon' ? 'text-blue-400' : s.type === 'service' ? 'text-[#C9A84C]' : 'text-green-400'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{s.label}</p>
                  {s.sublabel && <p className="text-xs text-gray-500 truncate">{s.sublabel}</p>}
                </div>
                <span className={`text-[10px] uppercase tracking-wider ${
                  s.type === 'salon' ? 'text-blue-400' : s.type === 'service' ? 'text-[#C9A84C]' : 'text-green-400'
                }`}>{s.type}</span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
