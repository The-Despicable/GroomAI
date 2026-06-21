// Use the Supabase REST API directly
const SUPABASE_URL = "https://tvwkgbcfkstojmbfsegy.supabase.co"
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR2d2tnYmNma3N0b2ptYmZzZWd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NzIxMDUsImV4cCI6MjA2NTU0ODEwNX0.o16N-LVNy39ExLp4BNf_FFH1z8IJyE2dYIGtO0ZyrZA"

const tables = ['salons', 'services', 'bookings', 'users', 'reviews', 'stylists']
for (const t of tables) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${t}?limit=2`, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` }
  })
  if (!res.ok) {
    console.log(`${t}: ❌ ${res.status} ${res.statusText}`)
    continue
  }
  const data = await res.json()
  console.log(`${t}: ✓ ${data.length > 0 ? data.length + ' samples' : 'empty'}`)
  if (data.length > 0) {
    console.log(`  Columns: ${Object.keys(data[0]).join(', ')}`)
  }
}
