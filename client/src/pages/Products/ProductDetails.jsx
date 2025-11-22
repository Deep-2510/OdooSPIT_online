import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Package, AlertTriangle } from 'lucide-react'
import { useQuery } from '../../hooks/useApi'
import LoadingSpinner from '../../components/common/UI/LoadingSpinner'
import StockLevelIndicator from '../../components/products/StockLevelIndicator'

const ProductDetails = () => {
  const { id } = useParams()
  const { data: productData, loading, error } = useQuery(`/api/products/${id}`)

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-8">
        <LoadingSpinner size="lg" />
        <p className="text-center text-gray-600 mt-4">Loading product details...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="text-center text-red-600">
          <p>Error loading product: {error}</p>
          <Link to="/products" className="text-blue-600 hover:text-blue-800 mt-2 inline-block">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const product = productData?.data
  const totalStock = Array.isArray(product?.stock) 
    ? product.stock.reduce((sum, s) => sum + s.quantity, 0)
    : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/products"
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product?.name}</h1>
            <p className="text-gray-600">SKU: {product?.sku}</p>
          </div>
        </div>
        <Link
          to={`/products/${id}/edit`}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700"
        >
          <Edit className="h-4 w-4" />
          <span>Edit Product</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Product Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                <p className="text-gray-900 font-medium">{product?.sku}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <p className="text-gray-900 font-medium">{product?.category}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit of Measure</label>
                <p className="text-gray-900 font-medium">{product?.uom}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Minimum Stock</label>
                <p className="text-gray-900 font-medium">{product?.minStock?.toLocaleString()}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <p className="text-gray-900">{product?.description || 'No description provided'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Stock Levels by Warehouse</h2>
            {product?.stock?.length > 0 ? (
              <div className="space-y-4">
                {product.stock.map((stockItem) => (
                  <div key={stockItem.warehouseId} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{stockItem.warehouse?.name}</p>
                      <p className="text-sm text-gray-600">Current stock: {stockItem.quantity.toLocaleString()}</p>
                    </div>
                    <div className="w-48">
                      <StockLevelIndicator
                        current={stockItem.quantity}
                        min={product.minStock}
                        max={product.minStock * 3}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No stock information available</p>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Stock Summary</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Stock:</span>
                <span className="text-2xl font-bold text-gray-900">{totalStock.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Minimum Required:</span>
                <span className="text-lg font-medium text-gray-900">{product?.minStock?.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`flex items-center space-x-1 ${
                  totalStock <= product?.minStock ? 'text-red-600' : 'text-green-600'
                }`}>
                  {totalStock <= product?.minStock && <AlertTriangle className="h-4 w-4" />}
                  <span className="font-medium">
                    {totalStock <= product?.minStock ? 'Low Stock' : 'In Stock'}
                  </span>
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to={`/receipts/create?product=${id}`}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg text-center block hover:bg-green-700"
              >
                Receive Stock
              </Link>
              <Link
                to={`/deliveries/create?product=${id}`}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-center block hover:bg-blue-700"
              >
                Deliver Stock
              </Link>
              <Link
                to={`/transfers/create?product=${id}`}
                className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg text-center block hover:bg-purple-700"
              >
                Transfer Stock
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails