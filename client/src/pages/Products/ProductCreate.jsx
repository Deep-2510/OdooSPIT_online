import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import ProductForm from '../../components/products/ProductForm'
import { useMutation } from '../../hooks/useApi'
import { productsAPI } from '../../services/api/products'

const ProductCreate = () => {
  const navigate = useNavigate()
  
  const { mutate: createProduct, loading } = useMutation(
    productsAPI.create,
    {
      onSuccess: () => {
        navigate('/products')
      }
    }
  )

  const handleSubmit = async (formData) => {
    await createProduct(formData)
  }

  const handleCancel = () => {
    navigate('/products')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/products"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create New Product</h1>
          <p className="text-gray-600">Add a new product to your inventory</p>
        </div>
      </div>

      <ProductForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  )
}

export default ProductCreate