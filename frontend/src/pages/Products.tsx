import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Trash2, Package } from "lucide-react";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data - replace with API calls
  const products = [
    { id: 1, name: "Widget A", sku: "WDG-001", category: "Electronics", uom: "Pieces", minStock: 100, totalStock: 450 },
    { id: 2, name: "Component B", sku: "CMP-002", category: "Hardware", uom: "Units", minStock: 50, totalStock: 125 },
    { id: 3, name: "Part C", sku: "PRT-003", category: "Parts", uom: "Boxes", minStock: 25, totalStock: 85 },
    { id: 4, name: "Material D", sku: "MTL-004", category: "Raw Materials", uom: "Kg", minStock: 200, totalStock: 1500 },
    { id: 5, name: "Assembly E", sku: "ASM-005", category: "Finished Goods", uom: "Pieces", minStock: 30, totalStock: 75 },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (current: number, min: number) => {
    const percentage = (current / min) * 100;
    if (percentage <= 50) return { label: "Critical", class: "bg-stock-critical/10 text-stock-critical border-stock-critical/20" };
    if (percentage <= 100) return { label: "Low", class: "bg-stock-low/10 text-stock-low border-stock-low/20" };
    return { label: "Optimal", class: "bg-stock-optimal/10 text-stock-optimal border-stock-optimal/20" };
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Products</h1>
            <p className="text-muted-foreground">Manage your product catalog</p>
          </div>
          <Button className="gradient-primary hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>

        {/* Search Bar */}
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredProducts.map((product, index) => {
            const status = getStockStatus(product.totalStock, product.minStock);
            return (
              <Card 
                key={product.id} 
                className="card-hover animate-scale-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className={status.class}>
                      {status.label}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Category:</span>
                      <span className="font-medium text-foreground">{product.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">UOM:</span>
                      <span className="font-medium text-foreground">{product.uom}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Stock Level:</span>
                      <span className="font-semibold text-foreground">
                        {product.totalStock} / {product.minStock}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="pt-2">
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div 
                          className={`h-full transition-all ${
                            status.label === "Critical" ? "bg-stock-critical" :
                            status.label === "Low" ? "bg-stock-low" : "bg-stock-optimal"
                          }`}
                          style={{ width: `${Math.min((product.totalStock / product.minStock) * 100, 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Edit className="mr-1 h-3 w-3" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-destructive hover:text-destructive">
                        <Trash2 className="mr-1 h-3 w-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
