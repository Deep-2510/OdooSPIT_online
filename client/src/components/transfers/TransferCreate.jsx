import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import TransferForm from '../../components/transfers/TransferForm'
import { useMutation } from '../../hooks/useApi'
import { transfersAPI } from '../../services/api/transfers'

const TransferCreate = () => {
  const navigate = useNavigate()
  
  const { mutate: createTransfer, loading } = useMutation(
    transfersAPI.create,
    {
      onSuccess: () => {
        navigate('/transfers')
      }
    }
  )

  const handleSubmit = async (formData) => {
    await createTransfer(formData)
  }

  const handleCancel = () => {
    navigate('/transfers')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/transfers"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Internal Transfer</h1>
          <p className="text-gray-600">Move stock between warehouses</p>
        </div>
      </div>

      <TransferForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  )
}

export default TransferCreate