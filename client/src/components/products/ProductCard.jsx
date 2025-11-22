import { Link } from 'react-router-dom'
import { Package, AlertTriangle } from 'lucide-react'

const ProductCard = ({ product }) => {
  const totalStock = Array.isArray(product.stock) 
    ? product.stock.reduce((sum, s) => sum + s.quantity, 0)
    : 0
  
  const isLowStock = totalStock <= product.minStock

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{product.name}</h3>
            <p className="text-sm text-gray-600">SKU: {product.sku}</p>
          </div>
        </div>
        {isLowStock && (
          <AlertTriangle className="h-5 w-5 text-red-500" title="Low Stock" />
        )}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Category:</span>
          <span className="font-medium">{product.category}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Unit:</span>
          <span className="font-medium">{product.uom}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Current Stock:</span>
          <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
            {totalStock.toLocaleString()}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Min Stock:</span>
          <span className="font-medium">{product.minStock.toLocaleString()}</span>
        </div>
      </div>

      <div className="flex space-x-2">
        <Link
          to={`/products/${product.id}`}
          className="flex-1 bg-blue-600 text-white text-center py-2 px-3 rounded-lg text-sm hover:bg-blue-700"
        >
          View Details
        </Link>
        <Link
          to={`/products/${product.id}/edit`}
          className="flex-1 border border-gray-300 text-gray-700 text-center py-2 px-3 rounded-lg text-sm hover:bg-gray-50"
        >
          Edit
        </Link>
      </div>
    </div>
  )
}

export default ProductCard