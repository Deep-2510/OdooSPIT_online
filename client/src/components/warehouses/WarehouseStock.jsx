import { useState } from 'react'
import { Package, AlertTriangle, Search } from 'lucide-react'
import DataTable from '../common/UI/DataTable'
import { useQuery } from '../../hooks/useApi'
import StockLevelIndicator from '../products/StockLevelIndicator'

const WarehouseStock = ({ warehouseId }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  const { data: stockData, loading } = useQuery(`/api/warehouses/${warehouseId}/stock`, {
    params: { search: searchTerm, page: currentPage, limit: 10 }
  })

  const columns = [
    {
      key: 'sku',
      title: 'SKU',
      sortable: true,
      render: (value, row) => row.product?.sku
    },
    {
      key: 'name',
      title: 'Product Name',
      sortable: true,
      render: (value, row) => row.product?.name
    },
    {
      key: 'category',
      title: 'Category',
      sortable: true,
      render: (value, row) => row.product?.category
    },
    {
      key: 'quantity',
      title: 'Current Stock',
      sortable: true,
      render: (value) => value.toLocaleString()
    },
    {
      key: 'minStock',
      title: 'Min Stock',
      sortable: true,
      render: (value, row) => row.product?.minStock?.toLocaleString() || '0'
    },
    {
      key: 'status',
      title: 'Status',
      sortable: true,
      render: (value, row) => {
        const isLowStock = row.quantity <= (row.product?.minStock || 0)
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            isLowStock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
          }`}>
            {isLowStock ? 'Low Stock' : 'In Stock'}
          </span>
        )
      }
    },
    {
      key: 'stockLevel',
      title: 'Stock Level',
      sortable: false,
      render: (value, row) => (
        <div className="w-32">
          <StockLevelIndicator
            current={row.quantity}
            min={row.product?.minStock || 0}
            max={Math.max(row.quantity * 2, (row.product?.minStock || 0) * 3)}
          />
        </div>
      )
    }
  ]

  const lowStockItems = stockData?.data?.filter(item => 
    item.quantity <= (item.product?.minStock || 0)
  ) || []

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Warehouse Stock</h2>
          <p className="text-gray-600">Current inventory levels in this warehouse</p>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <div>
              <h3 className="text-red-800 font-medium">Low Stock Alert</h3>
              <p className="text-red-700 text-sm">
                {lowStockItems.length} product{lowStockItems.length !== 1 ? 's' : ''} below minimum stock level
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={stockData?.data || []}
          loading={loading}
          pagination={stockData?.pagination && {
            currentPage: stockData.pagination.page,
            totalPages: stockData.pagination.pages
          }}
          onPageChange={setCurrentPage}
        />

        {stockData?.summary && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Stock Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total Products:</span>
                <span className="font-medium ml-2">{stockData.summary.totalProducts}</span>
              </div>
              <div>
                <span className="text-gray-600">Total Quantity:</span>
                <span className="font-medium ml-2">{stockData.summary.totalQuantity?.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-gray-600">Low Stock Items:</span>
                <span className="font-medium text-red-600 ml-2">{stockData.summary.lowStockItems}</span>
              </div>
              <div>
                <span className="text-gray-600">Out of Stock:</span>
                <span className="font-medium text-red-600 ml-2">{stockData.summary.outOfStock}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WarehouseStock