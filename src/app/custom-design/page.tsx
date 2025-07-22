
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Upload, DollarSign, Scale, Gem } from "lucide-react";

export default function CustomDesignPage() {
  const [weight, setWeight] = useState([10]);
  const [budget, setBudget] = useState([1500]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Create Your Own Masterpiece</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          Bring your vision to life. Collaborate with our master artisans to craft a piece of jewellery that is uniquely yours.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
        <div className="md:col-span-2">
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Gem className="h-6 w-6" /> Design Your Jewellery</CardTitle>
              <CardDescription>Fill out the details below to start the creation process.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" placeholder="Ayesha Khan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" placeholder="ayesha.khan@example.com" />
                </div>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-6">
                 <div className="space-y-2">
                    <Label htmlFor="jewellery-type">Jewellery Type</Label>
                    <Select>
                      <SelectTrigger id="jewellery-type">
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ring">Ring</SelectItem>
                        <SelectItem value="necklace">Necklace</SelectItem>
                        <SelectItem value="bracelet">Bracelet</SelectItem>
                        <SelectItem value="earrings">Earrings</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gold-type">Gold Type</Label>
                    <Select>
                      <SelectTrigger id="gold-type">
                        <SelectValue placeholder="Select gold purity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="24k">24k Gold</SelectItem>
                        <SelectItem value="22k">22k Gold</SelectItem>
                        <SelectItem value="white">White Gold</SelectItem>
                        <SelectItem value="rose">Rose Gold</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="weight">Desired Weight (grams)</Label>
                <div className="flex items-center gap-4">
                    <Slider id="weight" value={weight} onValueChange={setWeight} max={100} step={1} className="flex-1" />
                    <span className="font-semibold text-primary w-16 text-center">{weight[0]}g</span>
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="budget">Your Budget ($)</Label>
                <div className="flex items-center gap-4">
                    <Slider id="budget" value={budget} onValueChange={setBudget} max={10000} step={100} className="flex-1" />
                    <span className="font-semibold text-primary w-24 text-center">${budget[0].toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Design Description</Label>
                <Textarea id="description" placeholder="Describe your vision, including style, stones, and any special details..." className="min-h-[140px]" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inspiration">Inspiration (Optional)</Label>
                 <div className="flex items-center justify-center w-full">
                    <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                            <p className="text-xs text-muted-foreground">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                        </div>
                        <Input id="dropzone-file" type="file" className="hidden" />
                    </Label>
                </div> 
              </div>

              <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Submit Your Design</Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card className="bg-card border-border/40">
             <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><DollarSign className="h-6 w-6"/> Today's Gold Rate</CardTitle>
             </CardHeader>
             <CardContent className="space-y-3">
                <div className="flex justify-between text-lg">
                    <span className="font-medium text-muted-foreground">24k Gold (per gram)</span>
                    <span className="font-bold text-foreground">$75.50</span>
                </div>
                <div className="flex justify-between text-lg">
                    <span className="font-medium text-muted-foreground">22k Gold (per gram)</span>
                    <span className="font-bold text-foreground">$70.10</span>
                </div>
             </CardContent>
          </Card>
           <Card className="bg-card border-border/40">
             <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Scale className="h-6 w-6"/> Our Process</CardTitle>
             </CardHeader>
             <CardContent className="space-y-4 text-muted-foreground">
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center shrink-0">1</div>
                    <p>Submit your design concept and requirements.</p>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center shrink-0">2</div>
                    <p>Our team will contact you to refine the details and provide a quote.</p>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center shrink-0">3</div>
                    <p>Upon approval, our artisans begin crafting your unique piece.</p>
                </div>
                 <div className="flex items-start gap-4">
                    <div className="bg-primary/10 text-primary font-bold rounded-full h-8 w-8 flex items-center justify-center shrink-0">4</div>
                    <p>Receive your one-of-a-kind jewellery, crafted to perfection.</p>
                </div>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
