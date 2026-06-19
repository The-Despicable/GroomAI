import type { Booking } from '../lib/api'

const statusColors: Record<string, string> = {
  upcoming: 'bg-green-900 text-green-300',
  completed: 'bg-gray-700 text-gray-300',
  cancelled: 'bg-red-900 text-red-300',
}

export default function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-gray-800">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-white font-semibold">{booking.salon_name}</h4>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[booking.status]}`}>
          {booking.status}
        </span>
      </div>
      <p className="text-gray-400 text-sm">{booking.service}</p>
      <div className="flex justify-between items-center mt-3">
        <span className="text-gray-500 text-sm">{booking.date} at {booking.time}</span>
        <span className="text-[#C9A84C] font-bold">₹{booking.price}</span>
      </div>
    </div>
  )
}