
"use client";

import { useState, useRef } from 'react';
import Image from 'next/image';
import Draggable from 'react-draggable';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Scale, Sparkles, Hand, RotateCcw, ZoomIn, ZoomOut, CheckCircle } from 'lucide-react';
import { products } from '@/lib/placeholder-data';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VirtualTryOnPage() {
  const [handImage, setHandImage] = useState<string | null>(null);
  const [selectedRing, setSelectedRing] = useState(products.find(p => p.category === 'Rings'));
  const [ringState, setRingState] = useState({ scale: 1, rotation: 0 });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setHandImage(event.target?.result as string);
        setIsSubmitted(false);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSelectRing = (slug: string) => {
      const ring = products.find(p => p.slug === slug);
      setSelectedRing(ring);
  }

  const ringRings = products.filter(p => p.category === 'Rings');

  const handleSubmitForQuote = () => {
    setIsSubmitted(true);
    // In a real app, you would handle the submission here,
    // e.g., by saving the composite image or sending data to a server.
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 bg-hero-pattern">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Virtual Try-On</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          See how our rings look on your hand. Upload a photo and find your perfect piece.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2">
          <Card className="border-border/40 w-full h-[600px] flex items-center justify-center relative overflow-hidden bg-card/50">
            {!handImage && (
              <div className="text-center text-muted-foreground">
                <Hand className="mx-auto h-24 w-24 mb-4" />
                <h3 className="text-2xl font-headline mb-2 text-foreground">Upload a photo of your hand</h3>
                <p>Click the button on the right to get started.</p>
              </div>
            )}
            
            {handImage && (
              <Image src={handImage} alt="User's hand" layout="fill" objectFit="contain" />
            )}
            
            {handImage && selectedRing && (
              <Draggable bounds="parent">
                <div className="absolute cursor-move" style={{ transform: `scale(${ringState.scale}) rotate(${ringState.rotation}deg)` }}>
                  <Image src={selectedRing.images[0]} alt={selectedRing.name} width={100} height={100} data-ai-hint="ring" />
                </div>
              </Draggable>
            )}
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Sparkles className="h-6 w-6" /> Controls</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                  <Label className="mb-2 block">1. Upload Your Photo</Label>
                  <Button onClick={() => fileInputRef.current?.click()} className="w-full" variant="outline">
                    <Upload className="mr-2" /> Upload Hand Photo
                  </Button>
                  <Input 
                    ref={fileInputRef} 
                    type="file" 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                  />
                </div>
                <div>
                  <Label htmlFor="ring-select" className="mb-2 block">2. Select a Ring</Label>
                  <Select onValueChange={handleSelectRing} defaultValue={selectedRing?.slug}>
                    <SelectTrigger id="ring-select">
                        <SelectValue placeholder="Choose a ring to try on" />
                    </SelectTrigger>
                    <SelectContent>
                        {ringRings.map(ring => (
                            <SelectItem key={ring.id} value={ring.slug}>{ring.name}</SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              <div className="space-y-4">
                 <Label>3. Adjust the Ring</Label>
                 <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" onClick={() => setRingState(s => ({...s, scale: s.scale * 1.1}))} disabled={!handImage}>
                        <ZoomIn className="mr-2"/> Zoom In
                    </Button>
                     <Button variant="outline" onClick={() => setRingState(s => ({...s, scale: s.scale * 0.9}))} disabled={!handImage}>
                        <ZoomOut className="mr-2"/> Zoom Out
                    </Button>
                     <Button variant="outline" onClick={() => setRingState(s => ({...s, rotation: s.rotation - 15}))} disabled={!handImage}>
                        <RotateCcw className="mr-2"/> Rotate
                    </Button>
                     <Button variant="outline" onClick={() => setRingState({ scale: 1, rotation: 0})} disabled={!handImage}>
                        Reset
                    </Button>
                 </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/40">
             <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">Happy With Your Choice?</CardTitle>
             </CardHeader>
             <CardContent>
                {isSubmitted ? (
                    <div className="text-center py-4 flex flex-col items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                        <h2 className="font-headline text-xl text-primary mb-2">Quote Requested!</h2>
                        <p className="text-muted-foreground text-sm">Our team will contact you shortly with details.</p>
                    </div>
                ) : (
                    <>
                    <p className="text-muted-foreground mb-4">Click below to submit your design for a personalized quote from our expert artisans.</p>
                    <Button onClick={handleSubmitForQuote} className="w-full" size="lg" disabled={!handImage || !selectedRing}>
                        Submit for a Quote
                    </Button>
                    </>
                )}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
