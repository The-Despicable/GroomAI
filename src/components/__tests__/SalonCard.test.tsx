import { render, screen } from '@testing-library/react'
import SalonCard from '../SalonCard'

const mockSalon = {
  id: '1',
  name: 'Test Salon',
  location: '123 Test St',
  rating: 4.5,
  priceFrom: 399,
  imageUrl: '',
}

test('renders salon name', () => {
  render(<SalonCard id={mockSalon.id} name={mockSalon.name} location={mockSalon.location} rating={mockSalon.rating} priceFrom={mockSalon.priceFrom} />)
  expect(screen.getByText('Test Salon')).toBeInTheDocument()
})

test('renders location', () => {
  render(<SalonCard id={mockSalon.id} name={mockSalon.name} location={mockSalon.location} rating={mockSalon.rating} priceFrom={mockSalon.priceFrom} />)
  expect(screen.getByText('123 Test St')).toBeInTheDocument()
})

test('renders rating', () => {
  render(<SalonCard id={mockSalon.id} name={mockSalon.name} location={mockSalon.location} rating={mockSalon.rating} priceFrom={mockSalon.priceFrom} />)
  expect(screen.getByText('4.5')).toBeInTheDocument()
})

test('renders price', () => {
  render(<SalonCard id={mockSalon.id} name={mockSalon.name} location={mockSalon.location} rating={mockSalon.rating} priceFrom={mockSalon.priceFrom} />)
  expect(screen.getByText(/₹399/)).toBeInTheDocument()
})