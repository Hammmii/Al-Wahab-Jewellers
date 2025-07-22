import { notFound } from "next/navigation";
import Image from "next/image";
import { products } from "@/lib/placeholder-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";

export async function generateStaticParams() {
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);
  if (!product) {
    return {
      title: "Product Not Found",
    };
  }
  return {
    title: `${product.name} - Al-Wahab Jewellers`,
    description: product.description,
  };
}

export default function ProductDetailPage({ params }: { params: { slug: string } }) {
  const product = products.find((p) => p.slug === params.slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16 items-start">
        <div className="grid gap-4">
          <div className="aspect-square rounded-lg overflow-hidden border border-border/40">
            <Image
              src={product.images[0]}
              alt={product.name}
              width={800}
              height={800}
              className="w-full h-full object-cover"
              data-ai-hint="jewellery product"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.slice(1).map((img, index) => (
              <div key={index} className="aspect-square rounded-lg overflow-hidden border border-border/40">
                <Image
                  src={img}
                  alt={`${product.name} view ${index + 2}`}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  data-ai-hint="product detail"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <Badge variant="secondary" className="mb-2 bg-accent/20 text-accent">{product.category}</Badge>
            <h1 className="font-headline text-3xl md:text-4xl font-bold text-primary">{product.name}</h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-0.5 text-primary">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5" />
             </div>
             <p className="text-sm text-muted-foreground">(12 customer reviews)</p>
          </div>
          <Separator />
          <p className="text-3xl font-bold text-foreground">${product.price.toLocaleString()}</p>
          <p className="text-muted-foreground">{product.description}</p>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
                <span className="text-muted-foreground">Metal Type:</span>
                <span className="font-medium">{product.metalType}</span>
            </div>
          </div>
          <Button size="lg" className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Inquire Now</Button>
        </div>
      </div>
    </div>
  );
}
