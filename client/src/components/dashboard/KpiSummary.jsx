import { useQuery } from '../../hooks/useApi'
import { Package, TrendingUp, AlertTriangle, Warehouse } from 'lucide-react'
import KpiCards from '../common/charts/KpiCards'

const KpiSummary = () => {
  const { data: kpiData, loading } = useQuery('/api/dashboard/kpis')

  const cards = [
    {
      title: 'Total Products',
      value: kpiData?.totalProducts || 0,
      icon: Package,
      color: 'blue',
      change: '+12%',
    },
    {
      title: 'Total Warehouses',
      value: kpiData?.totalWarehouses || 0,
      icon: Warehouse,
      color: 'green',
      change: '+5%',
    },
    {
      title: 'Low Stock Items',
      value: kpiData?.lowStockCount || 0,
      icon: AlertTriangle,
      color: 'red',
      change: '-3%',
    },
    {
      title: 'Movements Today',
      value: kpiData?.todayMovements || 0,
      icon: TrendingUp,
      color: 'purple',
      change: '+8%',
    },
  ]

  return <KpiCards cards={cards} loading={loading} />
}

export default KpiSummary