import { useState } from 'react'
import { Download, Filter, Calendar, ArrowUp, ArrowDown, RefreshCw } from 'lucide-react'
import DataTable from '../common/UI/DataTable'
import { useQuery } from '../../hooks/useApi'

const MovementReport = () => {
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    movementType: '',
    warehouse: '',
    product: ''
  })

  const { data: reportData, loading } = useQuery('/api/reports/movement', {
    params: filters
  })

  const columns = [
    {
      key: 'date',
      title: 'Date',
      sortable: true,
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'type',
      title: 'Type',
      sortable: true,
      render: (value) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'RECEIPT' ? 'bg-green-100 text-green-800' :
          value === 'DELIVERY' ? 'bg-blue-100 text-blue-800' :
          value === 'TRANSFER' ? 'bg-purple-100 text-purple-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'reference',
      title: 'Reference',
      sortable: true
    },
    {
      key: 'product',
      title: 'Product',
      sortable: true,
      render: (value, row) => row.product?.name
    },
    {
      key: 'quantity',
      title: 'Quantity',
      sortable: true,
      render: (value, row) => (
        <span className={value > 0 ? 'text-green-600' : 'text-red-600'}>
          {value > 0 ? '+' : ''}{value}
        </span>
      )
    },
    {
      key: 'warehouse',
      title: 'Warehouse',
      sortable: true,
      render: (value, row) => row.warehouse?.name || '-'
    },
    {
      key: 'user',
      title: 'User',
      sortable: true,
      render: (value, row) => row.user?.email || 'System'
    },
    {
      key: 'notes',
      title: 'Notes',
      sortable: false,
      render: (value) => value || '-'
    }
  ]

  const handleExport = () => {
    // Export functionality would go here
    console.log('Exporting movement report...')
  }

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  // Calculate summary statistics
  const totalReceipts = reportData?.data?.filter(m => m.type === 'RECEIPT').length || 0
  const totalDeliveries = reportData?.data?.filter(m => m.type === 'DELIVERY').length || 0
  const totalTransfers = reportData?.data?.filter(m => m.type === 'TRANSFER').length || 0
  const totalAdjustments = reportData?.data?.filter(m => m.type === 'ADJUSTMENT').length || 0

  const netQuantityChange = reportData?.data?.reduce((sum, m) => sum + m.quantity, 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Movement Report</h1>
          <p className="text-gray-600">Track all stock movements and transactions</p>
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
            <Calendar className="h-5 w-5 mr-2" />
            Report Filters
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Movement Type</label>
            <select
              value={filters.movementType}
              onChange={(e) => handleFilterChange('movementType', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="RECEIPT">Receipts</option>
              <option value="DELIVERY">Deliveries</option>
              <option value="TRANSFER">Transfers</option>
              <option value="ADJUSTMENT">Adjustments</option>
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
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => setFilters({
              startDate: '',
              endDate: '',
              movementType: '',
              warehouse: '',
              product: ''
            })}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg text-sm hover:bg-gray-700 flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Reset Filters</span>
          </button>
        </div>
      </div>

      {/* Summary Statistics */}
      {reportData?.data && reportData.data.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Movements</p>
                <p className="text-2xl font-bold text-gray-900">{reportData.data.length}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-gray-400" />
            </div>
          </div>
          
          <div className="bg-green-50 rounded-lg shadow-sm border border-green-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-600 text-sm">Receipts</p>
                <p className="text-2xl font-bold text-green-800">{totalReceipts}</p>
              </div>
              <ArrowDown className="h-8 w-8 text-green-600" />
            </div>
          </div>
          
          <div className="bg-blue-50 rounded-lg shadow-sm border border-blue-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-600 text-sm">Deliveries</p>
                <p className="text-2xl font-bold text-blue-800">{totalDeliveries}</p>
              </div>
              <ArrowUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-purple-50 rounded-lg shadow-sm border border-purple-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-sm">Transfers</p>
                <p className="text-2xl font-bold text-purple-800">{totalTransfers}</p>
              </div>
              <RefreshCw className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          
          <div className="bg-orange-50 rounded-lg shadow-sm border border-orange-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-600 text-sm">Net Change</p>
                <p className={`text-2xl font-bold ${
                  netQuantityChange > 0 ? 'text-green-600' : 
                  netQuantityChange < 0 ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {netQuantityChange > 0 ? '+' : ''}{netQuantityChange}
                </p>
              </div>
              {netQuantityChange > 0 ? (
                <ArrowUp className="h-8 w-8 text-green-600" />
              ) : netQuantityChange < 0 ? (
                <ArrowDown className="h-8 w-8 text-red-600" />
              ) : (
                <RefreshCw className="h-8 w-8 text-orange-600" />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Report Data */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <DataTable
          columns={columns}
          data={reportData?.data || []}
          loading={loading}
        />

        {reportData?.summary && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Movement Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Movements:</span>
                <span className="font-medium ml-2">{reportData.summary.totalMovements}</span>
              </div>
              <div>
                <span className="text-gray-600">Period:</span>
                <span className="font-medium ml-2">
                  {filters.startDate ? new Date(filters.startDate).toLocaleDateString() : 'Start'} - 
                  {filters.endDate ? new Date(filters.endDate).toLocaleDateString() : 'End'}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Net Quantity Change:</span>
                <span className={`font-medium ml-2 ${
                  reportData.summary.netQuantityChange > 0 ? 'text-green-600' : 
                  reportData.summary.netQuantityChange < 0 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  {reportData.summary.netQuantityChange > 0 ? '+' : ''}{reportData.summary.netQuantityChange}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Unique Products:</span>
                <span className="font-medium ml-2">{reportData.summary.uniqueProducts}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MovementReport