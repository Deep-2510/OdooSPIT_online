import { useQuery } from '../../hooks/useApi'
import { Package, Truck, Move, Settings } from 'lucide-react'
import { format } from 'date-fns'

const RecentActivities = () => {
  const { data: activities, loading } = useQuery('/api/dashboard/recent-activities')

  const getActivityIcon = (type) => {
    switch (type) {
      case 'RECEIPT':
        return <Package className="h-4 w-4 text-green-600" />
      case 'DELIVERY':
        return <Truck className="h-4 w-4 text-blue-600" />
      case 'TRANSFER':
        return <Move className="h-4 w-4 text-purple-600" />
      case 'ADJUSTMENT':
        return <Settings className="h-4 w-4 text-orange-600" />
      default:
        return <Package className="h-4 w-4 text-gray-600" />
    }
  }

  const getActivityColor = (type) => {
    switch (type) {
      case 'RECEIPT':
        return 'bg-green-100 text-green-800'
      case 'DELIVERY':
        return 'bg-blue-100 text-blue-800'
      case 'TRANSFER':
        return 'bg-purple-100 text-purple-800'
      case 'ADJUSTMENT':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3 animate-pulse">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h3>
      
      <div className="space-y-4">
        {activities?.data?.length > 0 ? (
          activities.data.slice(0, 8).map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                    {activity.type}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {activity.product?.name}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {activity.quantity > 0 ? '+' : ''}{activity.quantity} units • 
                  {activity.user?.email} • 
                  {format(new Date(activity.createdAt), 'MMM d, HH:mm')}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">No recent activities</p>
        )}
      </div>
    </div>
  )
}

export default RecentActivities