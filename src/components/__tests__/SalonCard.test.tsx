import { render, screen } from '@testing-library/react'
import SalonCard from '../SalonCard'

const mockSalon = {
  id: '1',
  name: 'Test Salon',
  location: '123 Test St',
  rating: 4.5,
  priceFrom: 399,
  services: [{ name: 'Haircut', price: 399, duration: 30 }],
}

test('renders salon name', () => {
  render(<SalonCard salon={mockSalon} />)
  expect(screen.getByText('Test Salon')).toBeInTheDocument()
})

test('renders location', () => {
  render(<SalonCard salon={mockSalon} />)
  expect(screen.getByText('123 Test St')).toBeInTheDocument()
})

test('renders rating', () => {
  render(<SalonCard salon={mockSalon} />)
  expect(screen.getByText('4.5')).toBeInTheDocument()
})

test('renders price', () => {
  render(<SalonCard salon={mockSalon} />)
  expect(screen.getByText(/from ₹399/)).toBeInTheDocument()
})