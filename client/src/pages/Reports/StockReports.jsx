import { useState } from 'react'
import { Download, Filter, BarChart3 } from 'lucide-react'
import DataTable from '../../components/common/UI/DataTable'
import { useQuery } from '../../hooks/useApi'

const StockReports = () => {
  const [filters, setFilters] = useState({
    category: '',
    warehouse: '',
    lowStock: false
  })

  const { data: reportData, loading } = useQuery('/api/reports/stock', {
    params: filters
  })

  const columns = [
    {
      key: 'sku',
      title: 'SKU',
      sortable: true
    },
    {
      key: 'name',
      title: 'Product Name',
      sortable: true
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true
    },
    {
      key: 'currentStock',
      title: 'Current Stock',
      sortable: true,
      render: (value) => value.toLocaleString()
    },
    {
      key: 'minStock',
      title: 'Min Stock',
      sortable: true,
      render: (value) => value.toLocaleString()
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value, row) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          row.currentStock <= row.minStock ? 'bg-red-100 text-red-800' :
          row.currentStock <= row.minStock * 2 ? 'bg-yellow-100 text-yellow-800' :
          'bg-green-100 text-green-800'
        }`}>
          {row.currentStock <= row.minStock ? 'Low Stock' :
           row.currentStock <= row.minStock * 2 ? 'Medium Stock' : 'Good Stock'}
        </span>
      )
    },
    {
      key: 'warehouse',
      title: 'Warehouse',
      sortable: true,
      render: (value, row) => row.warehouse?.name || 'All'
    }
  ]

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting report...')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Reports</h1>
          <p className="text-gray-600">View and analyze stock levels across warehouses</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Stock Level Report
          </h2>
          
          <div className="flex space-x-4">
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Tools">Tools</option>
              <option value="Office Supplies">Office Supplies</option>
            </select>
            
            <select
              value={filters.warehouse}
              onChange={(e) => setFilters(prev => ({ ...prev, warehouse: e.target.value }))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Warehouses</option>
              <option value="1">Main Warehouse</option>
              <option value="2">North Distribution</option>
            </select>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.lowStock}
                onChange={(e) => setFilters(prev => ({ ...prev, lowStock: e.target.checked }))}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Low Stock Only</span>
            </label>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={reportData?.data || []}
          loading={loading}
        />

        {reportData?.summary && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Report Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Products:</span>
                <span className="font-medium ml-2">{reportData.summary.totalProducts}</span>
              </div>
              <div>
                <span className="text-gray-600">Low Stock Items:</span>
                <span className="font-medium text-red-600 ml-2">{reportData.summary.lowStockItems}</span>
              </div>
              <div>
                <span className="text-gray-600">Out of Stock:</span>
                <span className="font-medium text-red-600 ml-2">{reportData.summary.outOfStock}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Value:</span>
                <span className="font-medium ml-2">${reportData.summary.totalValue?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StockReports