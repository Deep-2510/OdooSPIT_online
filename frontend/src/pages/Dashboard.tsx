import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { Package, Warehouse, TrendingUp, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  // Mock data - replace with actual API calls
  const stats = [
    { title: "Total Products", value: "1,284", icon: Package, trend: { value: 12, isPositive: true } },
    { title: "Active Warehouses", value: "8", icon: Warehouse, trend: { value: 0, isPositive: true } },
    { title: "Stock Value", value: "$2.4M", icon: TrendingUp, trend: { value: 8, isPositive: true } },
    { title: "Low Stock Items", value: "23", icon: AlertTriangle, trend: { value: -15, isPositive: true } },
  ];

  const recentMoves = [
    { id: 1, type: "RECEIPT", product: "Widget A", quantity: 500, warehouse: "Main Warehouse", time: "2 hours ago", status: "DONE" },
    { id: 2, type: "DELIVERY", product: "Component B", quantity: 200, warehouse: "Distribution Center", time: "4 hours ago", status: "DONE" },
    { id: 3, type: "INTERNAL", product: "Part C", quantity: 100, warehouse: "Rack A → Rack B", time: "5 hours ago", status: "DONE" },
    { id: 4, type: "RECEIPT", product: "Material D", quantity: 1000, warehouse: "Main Warehouse", time: "1 day ago", status: "DONE" },
  ];

  const lowStockItems = [
    { id: 1, name: "Widget A", sku: "WDG-001", current: 45, min: 100, warehouse: "Main" },
    { id: 2, name: "Component B", sku: "CMP-002", current: 12, min: 50, warehouse: "Distribution" },
    { id: 3, name: "Part C", sku: "PRT-003", current: 8, min: 25, warehouse: "Main" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE": return "bg-status-active/10 text-status-active border-status-active/20";
      case "DRAFT": return "bg-status-draft/10 text-status-draft border-status-draft/20";
      case "CANCELED": return "bg-status-canceled/10 text-status-canceled border-status-canceled/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "RECEIPT": return "bg-chart-2/10 text-chart-2 border-chart-2/20";
      case "DELIVERY": return "bg-chart-3/10 text-chart-3 border-chart-3/20";
      case "INTERNAL": return "bg-chart-1/10 text-chart-1 border-chart-1/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your inventory overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              trend={stat.trend}
              className="animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Stock Movements */}
          <Card className="lg:col-span-2 card-hover">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-bold">Recent Stock Movements</CardTitle>
                <Button variant="outline" size="sm">View All</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentMoves.map((move) => (
                  <div key={move.id} className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50">
                    <div className="flex items-center gap-4">
                      <Badge variant="outline" className={getTypeColor(move.type)}>
                        {move.type}
                      </Badge>
                      <div>
                        <p className="font-medium text-foreground">{move.product}</p>
                        <p className="text-sm text-muted-foreground">{move.warehouse}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-foreground">
                        {move.type === "DELIVERY" ? "-" : "+"}{move.quantity}
                      </p>
                      <p className="text-xs text-muted-foreground">{move.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-stock-low" />
                Low Stock Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {lowStockItems.map((item) => (
                  <div key={item.id} className="rounded-lg border border-stock-low/30 bg-stock-low/5 p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1">
                            <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                              <div 
                                className="h-full bg-stock-low transition-all"
                                style={{ width: `${(item.current / item.min) * 100}%` }}
                              />
                            </div>
                          </div>
                          <p className="text-xs font-medium text-stock-low whitespace-nowrap">
                            {item.current}/{item.min}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" size="sm">
                  View All Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
