import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"; // Import Dialog components
import { ProductForm } from "@/components/forms/ProductForm"; // Import the new form

// Define the shape of a Product object
interface Product {
  id: number | string;
  name: string;
  sku: string;
  description: string;
  stock: number;
  price: number;
}

// Mock initial data
const initialProducts: Product[] = [
  { id: 1, name: "Widget A", sku: "WID-A-001", description: "Standard widget for all needs", stock: 500, price: 10.50 },
  { id: 2, name: "Component B", sku: "CMP-B-200", description: "Essential component for Assembly X", stock: 800, price: 5.75 },
  { id: 3, name: "Assembly E", sku: "ASM-E-050", description: "Final product assembly", stock: 120, price: 150.00 },
];

export default function Products() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Function to add a new product to the state array
  const handleProductAdded = (newProductData: any) => {
    // Add the new product with a stock based on the 'initialStock' from the form
    const newProduct: Product = {
      id: newProductData.id,
      name: newProductData.name,
      sku: newProductData.sku,
      description: newProductData.description,
      stock: newProductData.initialStock, // Use initialStock as the current stock
      price: newProductData.price,
    };
    setProducts(prev => [newProduct, ...prev]); // Add new product to the start of the list
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory and stock levels.</p>
          </div>
          <div className="flex gap-2">
            
            {/* 💡 Dialog to add new product */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gradient-primary hover:opacity-90">
                  <Plus className="mr-2 h-4 w-4" />
                  New Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[550px]">
                <DialogHeader>
                  <DialogTitle>Add New Product</DialogTitle>
                </DialogHeader>
                <ProductForm 
                  onSuccess={() => setIsDialogOpen(false)} // Close dialog on success
                  onProductAdded={handleProductAdded} // Update product list
                />
              </DialogContent>
            </Dialog>
            {/* End Dialog */}

          </div>
        </div>

        {/* Product List */}
        <div className="space-y-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="card-hover animate-scale-in"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Placeholder Icon/Visual */}
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary font-semibold text-xl">
                      {product.sku.slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>SKU: {product.sku}</span>
                        <span>•</span>
                        <span>Price: ${product.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      {product.stock}
                    </p>
                    <p className="text-sm text-muted-foreground">Stock</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {products.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                No products found. Click "New Product" to get started.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
