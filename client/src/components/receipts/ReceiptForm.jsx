import { useState } from 'react'
import { Save, X, Plus, Trash2 } from 'lucide-react'
import LoadingSpinner from '../common/UI/LoadingSpinner'
import { useNotification } from '../../contexts/NotificationContext'

const ReceiptForm = ({ receipt, onSubmit, onCancel, loading = false }) => {
  const { addNotification } = useNotification()
  
  const [formData, setFormData] = useState({
    reference: `REC-${Date.now()}`,
    supplier: '',
    expectedDate: '',
    notes: '',
    items: []
  })

  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: 1,
    unitCost: 0
  })

  const addItem = () => {
    if (!newItem.productId || newItem.quantity <= 0) {
      addNotification('Please fill all item fields', 'error')
      return
    }

    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { ...newItem, id: Date.now() }]
    }))
    
    setNewItem({
      productId: '',
      quantity: 1,
      unitCost: 0
    })
  }

  const removeItem = (itemId) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== itemId)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (formData.items.length === 0) {
      addNotification('Please add at least one item', 'error')
      return
    }

    try {
      await onSubmit(formData)
      addNotification('Receipt created successfully!', 'success')
    } catch (error) {
      addNotification(error.message || 'Failed to create receipt', 'error')
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-semibold text-gray-900">
          {receipt ? 'Edit Receipt' : 'Create Goods Receipt'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reference Number *
            </label>
            <input
              type="text"
              value={formData.reference}
              onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="REC-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Supplier *
            </label>
            <input
              type="text"
              value={formData.supplier}
              onChange={(e) => setFormData(prev => ({ ...prev, supplier: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Supplier name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Delivery Date
            </label>
            <input
              type="date"
              value={formData.expectedDate}
              onChange={(e) => setFormData(prev => ({ ...prev, expectedDate: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional notes..."
          />
        </div>

        {/* Items Section */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Items</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                <select
                  value={newItem.productId}
                  onChange={(e) => setNewItem(prev => ({ ...prev, productId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Product</option>
                  <option value="1">Laptop Computer</option>
                  <option value="2">Wireless Mouse</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                <input
                  type="number"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit Cost</label>
                <input
                  type="number"
                  value={newItem.unitCost}
                  onChange={(e) => setNewItem(prev => ({ ...prev, unitCost: parseFloat(e.target.value) || 0 }))}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={addItem}
                  className="w-full bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700 flex items-center justify-center space-x-1"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Item</span>
                </button>
              </div>
            </div>
          </div>

          {formData.items.length > 0 ? (
            <div className="space-y-2">
              {formData.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                  <div className="flex-1">
                    <span className="font-medium">Product #{item.productId}</span>
                    <span className="text-gray-600 ml-4">Qty: {item.quantity}</span>
                    <span className="text-gray-600 ml-4">Cost: ${item.unitCost}</span>
                    <span className="text-gray-600 ml-4">Total: ${(item.quantity * item.unitCost).toFixed(2)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No items added yet</p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6 border-t">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            <X className="h-4 w-4 inline mr-2" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                <Save className="h-4 w-4 inline mr-2" />
                {receipt ? 'Update Receipt' : 'Create Receipt'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ReceiptForm