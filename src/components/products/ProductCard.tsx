import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Product } from '@/lib/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="w-full max-w-sm rounded-lg overflow-hidden group border-border/40 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="p-0">
        <div className="aspect-square overflow-hidden relative">
          <Link href={`/collections/${product.slug}`}>
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              style={{objectFit: 'cover'}}
              className="w-full h-full transition-transform duration-500 ease-in-out group-hover:scale-110"
              data-ai-hint="jewellery product"
            />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <Badge variant="secondary" className="mb-2 bg-accent/20 text-accent">{product.metalType}</Badge>
        <CardTitle className="font-headline text-lg leading-tight">
          <Link href={`/collections/${product.slug}`} className="hover:text-primary transition-colors">
            {product.name}
          </Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 flex justify-between items-center">
        <p className="text-lg font-semibold text-primary">PKR {product.price.toLocaleString()}</p>
        <Button asChild variant="outline">
          <Link href={`/collections/${product.slug}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
