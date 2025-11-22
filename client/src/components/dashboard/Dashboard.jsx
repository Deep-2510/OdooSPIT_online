import KpiSummary from './KpiSummary'
import RecentActivities from './RecentActivities'
import StockChart from '../common/charts/StockChart'
import MovementChart from '../common/charts/MovementChart'

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to OdooSPIT Inventory Management</p>
      </div>

      <KpiSummary />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <StockChart />
        <MovementChart />
      </div>
      
      <RecentActivities />
    </div>
  )
}

export default Dashboard