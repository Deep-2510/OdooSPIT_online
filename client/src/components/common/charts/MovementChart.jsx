import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MovementChart = () => {
  // Mock data
  const data = [
    { name: 'Mon', receipts: 12, deliveries: 8, transfers: 4 },
    { name: 'Tue', receipts: 15, deliveries: 10, transfers: 6 },
    { name: 'Wed', receipts: 8, deliveries: 12, transfers: 3 },
    { name: 'Thu', receipts: 18, deliveries: 7, transfers: 5 },
    { name: 'Fri', receipts: 11, deliveries: 9, transfers: 7 },
    { name: 'Sat', receipts: 6, deliveries: 4, transfers: 2 },
    { name: 'Sun', receipts: 3, deliveries: 2, transfers: 1 },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Movements</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="receipts" fill="#10b981" name="Receipts" />
            <Bar dataKey="deliveries" fill="#ef4444" name="Deliveries" />
            <Bar dataKey="transfers" fill="#8b5cf6" name="Transfers" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default MovementChart