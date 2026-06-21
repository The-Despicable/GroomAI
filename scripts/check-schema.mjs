import { config } from 'dotenv'
config({ path: '/home/yaser/groomai-app/.env.local' })
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const tables = ['salons', 'services', 'bookings', 'users', 'reviews', 'stylists', 'payments']
for (const t of tables) {
  const { data, error } = await supabase.from(t).select('*').limit(3)
  if (error) {
    console.log(`${t}: ❌ ${error.message}`)
  } else {
    console.log(`${t}: ✓ ${data.length} rows`)
    if (data.length > 0) {
      console.log(`  Columns: ${Object.keys(data[0]).join(', ')}`)
    }
  }
}
