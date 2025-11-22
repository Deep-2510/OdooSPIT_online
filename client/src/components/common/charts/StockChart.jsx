import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const StockChart = () => {
  // Mock data - in real app, this would come from API
  const data = [
    { name: 'Jan', stock: 4000, incoming: 2400, outgoing: 1400 },
    { name: 'Feb', stock: 3000, incoming: 1398, outgoing: 1800 },
    { name: 'Mar', stock: 2000, incoming: 9800, outgoing: 2000 },
    { name: 'Apr', stock: 2780, incoming: 3908, outgoing: 2500 },
    { name: 'May', stock: 1890, incoming: 4800, outgoing: 1800 },
    { name: 'Jun', stock: 2390, incoming: 3800, outgoing: 2000 },
  ]

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Movement Trends</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="stock" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="incoming" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="outgoing" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center space-x-6 mt-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Total Stock</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Incoming</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-600">Outgoing</span>
        </div>
      </div>
    </div>
  )
}

export default StockChart