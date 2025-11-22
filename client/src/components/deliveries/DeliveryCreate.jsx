import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import DeliveryForm from '../../components/deliveries/DeliveryForm'
import { useMutation } from '../../hooks/useApi'
import { deliveriesAPI } from '../../services/api/deliveries'

const DeliveryCreate = () => {
  const navigate = useNavigate()
  
  const { mutate: createDelivery, loading } = useMutation(
    deliveriesAPI.create,
    {
      onSuccess: () => {
        navigate('/deliveries')
      }
    }
  )

  const handleSubmit = async (formData) => {
    await createDelivery(formData)
  }

  const handleCancel = () => {
    navigate('/deliveries')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/deliveries"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Delivery Order</h1>
          <p className="text-gray-600">Process outgoing stock to customers</p>
        </div>
      </div>

      <DeliveryForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  )
}

export default DeliveryCreateimport { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import DeliveryForm from '../../components/deliveries/DeliveryForm'
import { useMutation } from '../../hooks/useApi'
import { deliveriesAPI } from '../../services/api/deliveries'

const DeliveryCreate = () => {
  const navigate = useNavigate()
  
  const { mutate: createDelivery, loading } = useMutation(
    deliveriesAPI.create,
    {
      onSuccess: () => {
        navigate('/deliveries')
      }
    }
  )

  const handleSubmit = async (formData) => {
    await createDelivery(formData)
  }

  const handleCancel = () => {
    navigate('/deliveries')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/deliveries"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Delivery Order</h1>
          <p className="text-gray-600">Process outgoing stock to customers</p>
        </div>
      </div>

      <DeliveryForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  )
}

export default DeliveryCreate