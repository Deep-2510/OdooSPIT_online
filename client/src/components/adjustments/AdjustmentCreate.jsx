import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import AdjustmentForm from '../../components/adjustments/AdjustmentForm'
import { useMutation } from '../../hooks/useApi'
import { adjustmentsAPI } from '../../services/api/adjustments'

const AdjustmentCreate = () => {
  const navigate = useNavigate()
  
  const { mutate: createAdjustment, loading } = useMutation(
    adjustmentsAPI.create,
    {
      onSuccess: () => {
        navigate('/adjustments')
      }
    }
  )

  const handleSubmit = async (formData) => {
    await createAdjustment(formData)
  }

  const handleCancel = () => {
    navigate('/adjustments')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/adjustments"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Stock Adjustment</h1>
          <p className="text-gray-600">Adjust stock quantities for accuracy</p>
        </div>
      </div>

      <AdjustmentForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  )
}

export default AdjustmentCreate