'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { haversineDistance } from '@/lib/distance'

interface Salon {
  id: string
  name: string
  lat: number
  lon: number
  location: string
  rating: number
  services: { name: string; price: number; duration: number }[]
}

export default function SalonMap({ salons }: { salons: Salon[] }) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null)
  const [nearestSalonId, setNearestSalonId] = useState<string | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      (err) => console.warn('Geolocation error:', err)
    )
  }, [])

  useEffect(() => {
    if (!userLocation || salons.length === 0) return
    let minDist = Infinity
    let nearest: string | null = null
    for (const salon of salons) {
      const d = haversineDistance(userLocation.lat, userLocation.lon, salon.lat, salon.lon)
      if (d < minDist) {
        minDist = d
        nearest = salon.id
      }
    }
    setNearestSalonId(nearest)
  }, [userLocation, salons])

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current).setView([17.415, 78.428], 13)
    mapInstanceRef.current = map

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    })

    const highlightIcon = L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
    })

    salons.forEach((salon) => {
      const isNearest = salon.id === nearestSalonId
      L.marker([salon.lat, salon.lon], { icon: isNearest ? highlightIcon : defaultIcon })
        .addTo(map)
        .bindPopup(`
          <b>${salon.name}</b><br>
          ${salon.location}<br>
          Rating: ⭐ ${salon.rating}
          ${isNearest ? '<br><b>📍 Nearest to you!</b>' : ''}
        `)
    })

    if (userLocation) {
      L.circle([userLocation.lat, userLocation.lon], {
        radius: 200,
        color: '#C9A84C',
        fillColor: '#C9A84C',
        fillOpacity: 0.3,
      }).addTo(map)
      L.marker([userLocation.lat, userLocation.lon], {
        icon: L.divIcon({ className: 'user-marker', html: '📍', iconSize: [20, 20] }),
      }).addTo(map)
    }

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [salons, nearestSalonId, userLocation])

  return <div ref={mapRef} className="w-full h-80 rounded-xl overflow-hidden border border-[#1a1a1a]" />
}
