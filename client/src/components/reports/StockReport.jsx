import { useState } from 'react'
import { Download, Filter, BarChart3, TrendingUp, TrendingDown } from 'lucide-react'
import DataTable from '../common/UI/DataTable'
import { useQuery } from '../../hooks/useApi'

const StockReport = () => {
  const [filters, setFilters] = useState({
    category: '',
    warehouse: '',
    lowStockOnly: false,
    outOfStockOnly: false
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
      key: 'maxStock',
      title: 'Max Stock',
      sortable: true,
      render: (value) => value?.toLocaleString() || '-'
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value, row) => {
        if (row.currentStock === 0) {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Out of Stock
            </span>
          )
        } else if (row.currentStock <= row.minStock) {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Low Stock
            </span>
          )
        } else if (row.maxStock && row.currentStock >= row.maxStock) {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Overstocked
            </span>
          )
        } else {
          return (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              In Stock
            </span>
          )
        }
      }
    },
    {
      key: 'warehouse',
      title: 'Warehouse',
      sortable: true,
      render: (value, row) => row.warehouse?.name || 'All Warehouses'
    },
    {
      key: 'value',
      title: 'Stock Value',
      sortable: true,
      render: (value) => value ? `$${value.toFixed(2)}` : '-'
    }
  ]

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting stock report...')
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Stock Level Report</h1>
          <p className="text-gray-600">Comprehensive view of stock levels across all warehouses</p>
        </div>
        <button
          onClick={handleExport}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-700"
        >
          <Download className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2" />
            Report Filters
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Tools">Tools</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Safety Equipment">Safety Equipment</option>
              <option value="Raw Materials">Raw Materials</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Warehouse</label>
            <select
              value={filters.warehouse}
              onChange={(e) => handleFilterChange('warehouse', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Warehouses</option>
              <option value="1">Main Warehouse</option>
              <option value="2">North Distribution</option>
              <option value="3">South Storage</option>
            </select>
          </div>
          
          <div className="flex items-end space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.lowStockOnly}
                onChange={(e) => handleFilterChange('lowStockOnly', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Low Stock Only</span>
            </label>
            
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.outOfStockOnly}
                onChange={(e) => handleFilterChange('outOfStockOnly', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Out of Stock Only</span>
            </label>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setFilters({
                category: '',
                warehouse: '',
                lowStockOnly: false,
                outOfStockOnly: false
              })}
              className="w-full bg-gray-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-gray-700"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Report Data */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <DataTable
          columns={columns}
          data={reportData?.data || []}
          loading={loading}
        />

        {reportData?.summary && (
          <div className="mt-6 space-y-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-2">Report Summary</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Total Products:</span>
                  <span className="font-medium ml-2">{reportData.summary.totalProducts}</span>
                </div>
                <div>
                  <span className="text-gray-600">Total Value:</span>
                  <span className="font-medium ml-2">${reportData.summary.totalValue?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Low Stock Items:</span>
                  <span className="font-medium text-red-600 ml-2">{reportData.summary.lowStockItems}</span>
                </div>
                <div>
                  <span className="text-gray-600">Out of Stock:</span>
                  <span className="font-medium text-red-600 ml-2">{reportData.summary.outOfStock}</span>
                </div>
              </div>
            </div>

            {/* Stock Status Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-800 font-medium">In Stock</p>
                    <p className="text-green-600 text-2xl font-bold">
                      {reportData.summary.inStockItems || 0}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-800 font-medium">Low Stock</p>
                    <p className="text-yellow-600 text-2xl font-bold">
                      {reportData.summary.lowStockItems || 0}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-yellow-600" />
                </div>
              </div>
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-800 font-medium">Out of Stock</p>
                    <p className="text-red-600 text-2xl font-bold">
                      {reportData.summary.outOfStock || 0}
                    </p>
                  </div>
                  <TrendingDown className="h-8 w-8 text-red-600" />
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-800 font-medium">Overstocked</p>
                    <p className="text-blue-600 text-2xl font-bold">
                      {reportData.summary.overstockedItems || 0}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StockReport