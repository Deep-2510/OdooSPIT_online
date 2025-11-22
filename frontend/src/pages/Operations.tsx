import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight } from "lucide-react";

export default function Operations() {
  const [activeTab, setActiveTab] = useState("all");

  // Mock data - replace with API calls
  const operations = [
    { id: 1, type: "RECEIPT", product: "Widget A", quantity: 500, warehouse: "Main Warehouse", status: "DONE", date: "2024-11-22", time: "10:30 AM" },
    { id: 2, type: "DELIVERY", product: "Component B", quantity: 200, warehouse: "Distribution Center", status: "DONE", date: "2024-11-22", time: "11:45 AM" },
    { id: 3, type: "INTERNAL", product: "Part C", quantity: 100, from: "Rack A", to: "Rack B", status: "DONE", date: "2024-11-22", time: "02:15 PM" },
    { id: 4, type: "RECEIPT", product: "Material D", quantity: 1000, warehouse: "Main Warehouse", status: "DRAFT", date: "2024-11-22", time: "03:00 PM" },
    { id: 5, type: "DELIVERY", product: "Assembly E", quantity: 50, warehouse: "Distribution Center", status: "DONE", date: "2024-11-21", time: "09:00 AM" },
  ];

  const filteredOperations = activeTab === "all" 
    ? operations 
    : operations.filter(op => op.type === activeTab.toUpperCase());

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "RECEIPT": return ArrowDownToLine;
      case "DELIVERY": return ArrowUpFromLine;
      case "INTERNAL": return ArrowLeftRight;
      default: return ArrowLeftRight;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DONE": return "bg-status-active/10 text-status-active border-status-active/20";
      case "DRAFT": return "bg-status-draft/10 text-status-draft border-status-draft/20";
      case "CANCELED": return "bg-status-canceled/10 text-status-canceled border-status-canceled/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Operations</h1>
            <p className="text-muted-foreground">Track and manage stock movements</p>
          </div>
          <div className="flex gap-2">
            <Button className="gradient-primary hover:opacity-90">
              <Plus className="mr-2 h-4 w-4" />
              New Operation
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="receipt">Receipts</TabsTrigger>
            <TabsTrigger value="delivery">Deliveries</TabsTrigger>
            <TabsTrigger value="internal">Internal</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            <div className="space-y-4">
              {filteredOperations.map((operation, index) => {
                const TypeIcon = getTypeIcon(operation.type);
                return (
                  <Card 
                    key={operation.id} 
                    className="card-hover animate-scale-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                            <TypeIcon className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold text-lg text-foreground">{operation.product}</h3>
                              <Badge variant="outline" className={getTypeColor(operation.type)}>
                                {operation.type}
                              </Badge>
                              <Badge variant="outline" className={getStatusColor(operation.status)}>
                                {operation.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              {operation.type === "INTERNAL" ? (
                                <span>{operation.from} → {operation.to}</span>
                              ) : (
                                <span>{operation.warehouse}</span>
                              )}
                              <span>•</span>
                              <span>{operation.date} at {operation.time}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-foreground">
                            {operation.type === "DELIVERY" ? "-" : "+"}{operation.quantity}
                          </p>
                          <p className="text-sm text-muted-foreground">units</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
