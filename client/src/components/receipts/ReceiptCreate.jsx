import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import ReceiptForm from '../../components/receipts/ReceiptForm'
import { useMutation } from '../../hooks/useApi'
import { receiptsAPI } from '../../services/api/receipts'

const ReceiptCreate = () => {
  const navigate = useNavigate()
  
  const { mutate: createReceipt, loading } = useMutation(
    receiptsAPI.create,
    {
      onSuccess: () => {
        navigate('/receipts')
      }
    }
  )

  const handleSubmit = async (formData) => {
    await createReceipt(formData)
  }

  const handleCancel = () => {
    navigate('/receipts')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link
          to="/receipts"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Create Goods Receipt</h1>
          <p className="text-gray-600">Record incoming stock from suppliers</p>
        </div>
      </div>

      <ReceiptForm
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
      />
    </div>
  )
}

export default ReceiptCreate