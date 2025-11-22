import { useState } from 'react'
import { Package, Truck, CheckCircle, Clock } from 'lucide-react'

const DeliveryTracking = ({ delivery }) => {
  const trackingSteps = [
    {
      status: 'PENDING',
      label: 'Order Created',
      description: 'Delivery order has been created',
      icon: Package
    },
    {
      status: 'PROCESSING',
      label: 'Processing',
      description: 'Items are being prepared for shipment',
      icon: Clock
    },
    {
      status: 'IN_TRANSIT',
      label: 'In Transit',
      description: 'Package is on the way to destination',
      icon: Truck
    },
    {
      status: 'DELIVERED',
      label: 'Delivered',
      description: 'Package has been delivered successfully',
      icon: CheckCircle
    }
  ]

  const getCurrentStepIndex = () => {
    return trackingSteps.findIndex(step => step.status === delivery?.status) || 0
  }

  const currentStepIndex = getCurrentStepIndex()

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Delivery Tracking</h3>
      
      <div className="space-y-4">
        {trackingSteps.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex
          const isUpcoming = index > currentStepIndex
          
          const Icon = step.icon
          
          return (
            <div key={step.status} className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                isCompleted ? 'bg-green-100 text-green-600' :
                isCurrent ? 'bg-blue-100 text-blue-600' :
                'bg-gray-100 text-gray-400'
              }`}>
                <Icon className="h-4 w-4" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${
                  isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {step.label}
                </div>
                <div className={`text-sm ${
                  isCompleted || isCurrent ? 'text-gray-600' : 'text-gray-400'
                }`}>
                  {step.description}
                </div>
                
                {isCurrent && delivery?.statusUpdatedAt && (
                  <div className="text-xs text-blue-600 mt-1">
                    Last updated: {new Date(delivery.statusUpdatedAt).toLocaleString()}
                  </div>
                )}
              </div>
              
              {isCompleted && delivery?.statusUpdatedAt && (
                <div className="text-xs text-gray-500">
                  {new Date(delivery.statusUpdatedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {delivery?.trackingNumber && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-900 mb-2">Tracking Information</h4>
          <div className="text-sm text-blue-800">
            <div>Tracking Number: <strong>{delivery.trackingNumber}</strong></div>
            {delivery.carrier && (
              <div>Carrier: <strong>{delivery.carrier}</strong></div>
            )}
            {delivery.estimatedDelivery && (
              <div>Estimated Delivery: <strong>{new Date(delivery.estimatedDelivery).toLocaleDateString()}</strong></div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default DeliveryTracking