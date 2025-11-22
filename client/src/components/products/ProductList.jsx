import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Edit, Trash2, Eye, Plus } from 'lucide-react'
import DataTable from '../common/UI/DataTable'
import SearchBar from '../common/UI/SearchBar'
import LoadingSpinner from '../common/UI/LoadingSpinner'
import { useQuery } from '../../hooks/useApi'

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  
  const { data: productsData, loading, error } = useQuery('/api/products', {
    params: { search: searchTerm, page: currentPage, limit: 10 }
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
      key: 'uom',
      title: 'Unit',
      sortable: true
    },
    {
      key: 'minStock',
      title: 'Min Stock',
      sortable: true,
      render: (value) => value.toLocaleString()
    },
    {
      key: 'stock',
      title: 'Current Stock',
      sortable: true,
      render: (value, row) => {
        const totalStock = Array.isArray(value) 
          ? value.reduce((sum, s) => sum + s.quantity, 0)
          : 0
        const isLowStock = totalStock <= row.minStock
        
        return (
          <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
            {totalStock.toLocaleString()}
            {isLowStock && ' ⚠️'}
          </span>
        )
      }
    }
  ]

  const actions = (product) => (
    <div className="flex space-x-2 justify-end">
      <Link
        to={`/products/${product.id}`}
        className="text-blue-600 hover:text-blue-900 p-1 rounded"
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Link>
      <Link
        to={`/products/${product.id}/edit`}
        className="text-green-600 hover:text-green-900 p-1 rounded"
        title="Edit"
      >
        <Edit className="h-4 w-4" />
      </Link>
      <button
        onClick={() => handleDelete(product.id)}
        className="text-red-600 hover:text-red-900 p-1 rounded"
        title="Delete"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      // Delete logic would go here
      console.log('Delete product:', productId)
    }
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center text-red-600">
          <p>Error loading products: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-600">Manage your product inventory</p>
        </div>
        <Link
          to="/products/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" />
          <span>Add Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="mb-6">
          <SearchBar
            placeholder="Search products..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        <DataTable
          columns={columns}
          data={productsData?.data || []}
          loading={loading}
          actions={actions}
          pagination={productsData?.pagination && {
            currentPage: productsData.pagination.page,
            totalPages: productsData.pagination.pages
          }}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

export default ProductList