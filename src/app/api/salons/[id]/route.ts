import { NextRequest, NextResponse } from 'next/server';

const salons = [
  { id: '1', name: 'The Groom Room', location: '123 Main St, Banjara Hills, Hyderabad', rating: 4.8, priceFrom: 399, imageUrl: '', services: [{ name: 'Haircut', price: 399, duration: 30 }, { name: 'Beard Trim', price: 199, duration: 15 }, { name: 'Hair + Beard Combo', price: 499, duration: 45 }] },
  { id: '2', name: 'Spa & Blade', location: '456 Oak Ave, Jubilee Hills, Hyderabad', rating: 4.5, priceFrom: 599, imageUrl: '', services: [{ name: 'Full Body Massage', price: 999, duration: 60 }, { name: 'Facial', price: 599, duration: 30 }, { name: 'Manicure', price: 399, duration: 25 }] },
  { id: '3', name: 'The Gentry Hub', location: 'Koramangala, Bangalore', rating: 4.9, priceFrom: 550, imageUrl: '', services: [{ name: 'Premium Haircut', price: 550, duration: 45 }, { name: 'Beard Sculpt', price: 299, duration: 20 }, { name: 'Hair Color', price: 1499, duration: 90 }] },
  { id: '4', name: 'Luxe Rituals', location: 'Indiranagar, Bangalore', rating: 4.8, priceFrom: 800, imageUrl: '', services: [{ name: 'Spa Pedicure', price: 899, duration: 45 }, { name: 'Head Massage', price: 499, duration: 30 }, { name: 'Grooming Package', price: 1499, duration: 90 }] },
  { id: '5', name: 'Urban Oasis', location: 'HSR Layout, Bangalore', rating: 4.7, priceFrom: 1200, imageUrl: '', services: [{ name: 'Detox Facial', price: 1299, duration: 50 }, { name: 'Hair Styling', price: 699, duration: 40 }, { name: 'Wedding Package', price: 4999, duration: 180 }] },
];

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const salon = salons.find(s => s.id === id);
  if (!salon) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(salon);
}