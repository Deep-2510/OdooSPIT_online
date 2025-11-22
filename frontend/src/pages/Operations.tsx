import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Save } from "lucide-react";

// ⚠️ PLACEHOLDER: Replace this with your actual API call to the backend.
const createProductAPI = async (productData: any) => {
  // Simulate an API delay
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Product Created (Simulated):", productData);
      resolve({ id: Math.random().toString(36).substring(7), ...productData });
    }, 1500);
  });
};

interface ProductFormProps {
  onSuccess: () => void; // Function to call after successful submission (e.g., close dialog)
  onProductAdded: (newProduct: any) => void; // Function to update product list
}

export function ProductForm({ onSuccess, onProductAdded }: ProductFormProps) {
  const [product, setProduct] = useState({
    name: "",
    sku: "", // Stock Keeping Unit
    description: "",
    initialStock: 0,
    price: 0.00,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [id]: id === 'initialStock' ? parseInt(value) || 0 : id === 'price' ? parseFloat(value) || 0.00 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!product.name || !product.sku) {
      setError("Name and SKU are required fields.");
      return;
    }

    setIsLoading(true);
    try {
      const newProduct = await createProductAPI(product);
      onProductAdded(newProduct);
      onSuccess(); // Close the form/dialog
    } catch (err) {
      setError("Failed to create product. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Name and SKU */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name *</Label>
          <Input id="name" value={product.name} onChange={handleChange} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU *</Label>
          <Input id="sku" value={product.sku} onChange={handleChange} required />
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={product.description} onChange={handleChange} />
      </div>

      {/* Stock and Price */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="initialStock">Initial Stock</Label>
          <Input id="initialStock" type="number" value={product.initialStock} onChange={handleChange} min="0" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Unit Price</Label>
          <Input id="price" type="number" value={product.price} onChange={handleChange} step="0.01" min="0" />
        </div>
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <div className="pt-2 flex justify-end">
        <Button type="submit" disabled={isLoading || !!error}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Product
        </Button>
      </div>
    </form>
  );
}
