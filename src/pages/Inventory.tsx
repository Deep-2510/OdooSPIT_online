import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Warehouse, MapPin } from "lucide-react";

export default function Inventory() {
  // Mock data - replace with API calls
  const warehouses = [
    {
      id: 1,
      name: "Main Warehouse",
      location: "Building A, Zone 1",
      stock: [
        { product: "Widget A", sku: "WDG-001", quantity: 250, location: "Rack A1" },
        { product: "Component B", sku: "CMP-002", quantity: 75, location: "Rack A2" },
        { product: "Part C", sku: "PRT-003", quantity: 45, location: "Rack B1" },
      ]
    },
    {
      id: 2,
      name: "Distribution Center",
      location: "Building B, Zone 2",
      stock: [
        { product: "Widget A", sku: "WDG-001", quantity: 200, location: "Shelf 1" },
        { product: "Component B", sku: "CMP-002", quantity: 50, location: "Shelf 2" },
        { product: "Material D", sku: "MTL-004", quantity: 800, location: "Bulk Storage" },
      ]
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Inventory</h1>
          <p className="text-muted-foreground">Real-time stock levels across all locations</p>
        </div>

        {/* Warehouses */}
        <div className="space-y-6">
          {warehouses.map((warehouse, index) => (
            <Card 
              key={warehouse.id} 
              className="card-hover animate-scale-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader className="border-b border-border bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl gradient-primary">
                      <Warehouse className="h-7 w-7 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{warehouse.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">{warehouse.location}</p>
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                    {warehouse.stock.length} SKUs
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-3">
                  {warehouse.stock.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <span className="text-lg font-bold text-primary">
                            {item.quantity}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{item.product}</p>
                          <p className="text-sm text-muted-foreground">{item.sku}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline" className="bg-secondary">
                          <MapPin className="mr-1 h-3 w-3" />
                          {item.location}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
