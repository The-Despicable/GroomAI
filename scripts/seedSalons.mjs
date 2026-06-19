import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import dotenv from 'dotenv'
dotenv.config({ path: '../.env.local' })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const raw = JSON.parse(fs.readFileSync('./hyderabad_salons.json', 'utf8'))
const elements = raw.elements

const salons = elements
  .filter(el => el.tags && (el.tags.shop || el.tags.amenity))
  .map(el => {
    const tags = el.tags
    const name = tags.name || 'Unnamed Salon'
    const address = [tags['addr:street'], tags['addr:housenumber']].filter(Boolean).join(' ') || 'Hyderabad'
    const city = 'Hyderabad'
    const services = []
    if (tags.shop === 'beauty') services.push('Spa', 'Nails')
    if (tags.shop === 'barber') services.push('Hair', 'Beard')
    if (tags.amenity === 'spa') services.push('Spa')
    if (services.length === 0) services.push('Hair')
    const lat = el.lat || el.center?.lat
    const lon = el.lon || el.center?.lon
    if (!lat || !lon) return null
    return {
      name,
      address,
      city,
      rating: (3 + Math.random() * 1.5).toFixed(1),
      services,
      price_range: ['$', '$$', '$$$'][Math.floor(Math.random() * 3)],
      image_url: `https://picsum.photos/seed/${el.id}/400/300`,
      description: `A professional grooming salon in ${city}.`,
      lat,
      lon,
      geom: `SRID=4326;POINT(${lon} ${lat})`,
    }
  })
  .filter(Boolean)

const batchSize = 20
for (let i = 0; i < salons.length; i += batchSize) {
  const batch = salons.slice(i, i + batchSize)
  const { error } = await supabase.from('salons').upsert(batch, { onConflict: 'id' })
  if (error) console.error('Error inserting batch:', error)
}
console.log(`Inserted ${salons.length} salons.`)
