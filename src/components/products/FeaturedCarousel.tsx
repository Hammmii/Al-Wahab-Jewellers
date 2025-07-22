"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Product } from "@/lib/types";

interface FeaturedCarouselProps {
  products: Product[];
}

export function FeaturedCarousel({ products }: FeaturedCarouselProps) {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full max-w-6xl mx-auto"
    >
      <CarouselContent>
        {products.map((product) => (
          <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-1">
              <Card className="overflow-hidden group transition-all duration-300 hover:shadow-primary/20 hover:shadow-lg hover:border-primary/50">
                <CardContent className="flex flex-col items-center justify-center p-0">
                  <div className="relative w-full aspect-square overflow-hidden">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                      data-ai-hint="jewellery piece"
                    />
                  </div>
                  <div className="p-6 text-center w-full">
                    <h3 className="font-headline text-xl font-semibold text-primary">
                      {product.name}
                    </h3>
                    <p className="text-muted-foreground mt-2 text-sm h-10">
                      {product.description.substring(0, 60)}...
                    </p>
                    <Button asChild className="mt-4" variant="outline">
                      <Link href={`/collections/${product.slug}`}>View Details</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" />
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}
