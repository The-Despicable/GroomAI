// Seed script — populates Supabase with 42 Hyderabad salons, services, stylists
// Run: node scripts/seed-supabase.mjs

import { createHash } from 'node:crypto'
import { config } from 'dotenv'
config({ path: '/home/yaser/groomai-app/.env.local' })

import { createAdminClient } from '@supabase/server/core'
import salons from '../src/data/real_salons.json' with { type: 'json' }

function uuid(seed) {
  const hash = createHash('md5').update('groomai-' + seed).digest('hex')
  return hash.slice(0,8) + '-' + hash.slice(8,12) + '-4' + hash.slice(12,15) + '-8' + hash.slice(15,18) + '-' + hash.slice(18,30)
}

async function seed() {
  const supabase = createAdminClient()

  // Clear existing data
  for (const table of ['reviews', 'bookings', 'services', 'stylists', 'users', 'salons']) {
    await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000')
  }

  // 1. Salons
  const salonRows = salons.map(s => ({
    id: s.id,
    name: s.name,
    location: s.location,
    city: 'Hyderabad',
    area: s.area || null,
    lat: s.lat,
    lng: s.lon,
    rating: s.rating,
    review_count: Math.floor(Math.random() * 200 + 20),
    images: [s.imageUrl],
    phone: s.phone || null,
    description: s.description || null,
    open_time: s.openTime || '09:00:00',
    close_time: s.closeTime || '21:00:00',
  }))

  const { error: salonErr } = await supabase.from('salons').upsert(salonRows)
  if (salonErr) { console.error('Salons error:', salonErr.message); process.exit(1) }
  console.log(`✓ ${salonRows.length} salons`)

  // 2. Services
  const serviceRows = []
  for (const s of salons) {
    for (const svc of s.services) {
      serviceRows.push({
        id: uuid('svc_' + s.id + '_' + svc.name),
        salon_id: s.id,
        name: svc.name,
        price: Math.round(svc.price * 100),
        duration_minutes: svc.duration || 30,
        description: svc.description || null,
        category: svc.name.toLowerCase().includes('hair') || svc.name.toLowerCase().includes('cut') ? 'hair' :
                  svc.name.toLowerCase().includes('beard') || svc.name.toLowerCase().includes('shave') ? 'beard' :
                  svc.name.toLowerCase().includes('facial') || svc.name.toLowerCase().includes('spa') ? 'spa' :
                  svc.name.toLowerCase().includes('nails') || svc.name.toLowerCase().includes('manicure') || svc.name.toLowerCase().includes('pedicure') ? 'nails' : 'general',
      })
    }
  }

  for (let i = 0; i < serviceRows.length; i += 100) {
    const { error } = await supabase.from('services').upsert(serviceRows.slice(i, i + 100))
    if (error) { console.error('Services error:', error.message); process.exit(1) }
  }
  console.log(`✓ ${serviceRows.length} services`)

  // 3. Stylists (3 per salon)
  const names = ['Ravi Kumar', 'Arun Reddy', 'Priya Sharma', 'Vikram Singh', 'Anita Patel', 'Raj Verma', 'Sneha Gupta', 'Kiran Rao', 'Deepak Joshi', 'Meera Nair']
  const specs = ['Classic Cuts', 'Beard Sculpting', 'Fade Cuts', 'Hot Towel Shave', 'Styling', 'Color', 'Spa', 'Facial']
  const stylistRows = []

  for (const s of salons) {
    for (let i = 0; i < 3; i++) {
      const idx = (parseInt(s.id.split('-')[0], 16) + i) % names.length
      stylistRows.push({
        id: uuid('sty_' + s.id + '_' + i),
        salon_id: s.id,
        name: names[idx],
        rating: parseFloat((4.2 + Math.random() * 0.7).toFixed(1)),
        review_count: Math.floor(Math.random() * 50 + 5),
        specializations: [specs[(idx + i) % specs.length], specs[(idx + i + 1) % specs.length]],
        is_freelance: false,
        experience_years: Math.floor(Math.random() * 10 + 2),
      })
    }
  }

  const { error: styErr } = await supabase.from('stylists').upsert(stylistRows)
  if (styErr) { console.error('Stylists error:', styErr.message); process.exit(1) }
  console.log(`✓ ${stylistRows.length} stylists`)

  console.log('\n✅ Seed complete!')
}

seed().catch(e => { console.error('Failed:', e); process.exit(1) })
