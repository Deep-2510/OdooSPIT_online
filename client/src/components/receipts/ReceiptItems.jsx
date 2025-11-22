import { useState } from 'react'
import { Plus, Trash2, Package } from 'lucide-react'

const ReceiptItems = ({ items, onItemsChange }) => {
  const [newItem, setNewItem] = useState({
    productId: '',
    quantity: 1,
    unitCost: 0
  })

  const addItem = () => {
    if (!newItem.productId || newItem.quantity <= 0) {
      return
    }

    const item = {
      ...newItem,
      id: Date.now(),
      product: { name: `Product #${newItem.productId}` } // Mock product data
    }

    onItemsChange([...items, item])
    setNewItem({
      productId: '',
      quantity: 1,
      unitCost: 0
    })
  }

  const removeItem = (itemId) => {
    onItemsChange(items.filter(item => item.id !== itemId))
  }

  const updateItem = (itemId, field, value) => {
    onItemsChange(items.map(item => 
      item.id === itemId ? { ...item, [field]: value } : item
    ))
  }

  const totalValue = items.reduce((sum, item) => 
    sum + (item.quantity * item.unitCost), 0
  )

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center">
        <Package className="h-5 w-5 mr-2" />
        Receipt Items
      </h3>
      
      {/* Add Item Form */}
      <div className="bg-gray-50 p-4 rounded-lg">
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
              <option value="3">Cordless Drill</option>
              <option value="4">A4 Printer Paper</option>
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
              disabled={!newItem.productId || newItem.quantity <= 0}
              className="w-full bg-green-600 text-white py-2 px-3 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-1"
            >
              <Plus className="h-4 w-4" />
              <span>Add Item</span>
            </button>
          </div>
        </div>
      </div>

      {/* Items List */}
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 bg-white border rounded-lg">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <span className="font-medium text-sm">{item.product?.name}</span>
                </div>
                <div>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    min="1"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={item.unitCost}
                    onChange={(e) => updateItem(item.id, 'unitCost', parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.01"
                    className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <span className="font-medium text-sm">
                    ${((item.quantity || 0) * (item.unitCost || 0)).toFixed(2)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                className="ml-4 text-red-600 hover:text-red-900 p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          
          {/* Total */}
          <div className="flex justify-between items-center p-4 bg-gray-50 border rounded-lg">
            <span className="font-semibold text-gray-900">Total Value:</span>
            <span className="font-bold text-lg text-gray-900">
              ${totalValue.toFixed(2)}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No items added yet</p>
          <p className="text-sm text-gray-400 mt-1">Add items using the form above</p>
        </div>
      )}
    </div>
  )
}

export default ReceiptItems