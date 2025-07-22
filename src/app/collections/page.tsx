import { products } from "@/lib/placeholder-data";
import { ProductCard } from "@/components/products/ProductCard";

export const metadata = {
  title: "Collections - Al-Wahab Jewellers",
  description: "Explore our exquisite collections of gold jewellery.",
};

export default function CollectionsPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Our Collections</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Browse our curated selections of rings, necklaces, bracelets, and earrings, each crafted with passion and precision.
        </p>
      </div>
      
      {/* TODO: Add filter sidebar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
