
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Upload, DollarSign, Scale, Gem, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import GoldRateDisplay from "@/components/GoldRateDisplay";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function CustomDesignPage() {
  const [weight, setWeight] = useState([10]);
  const [budget, setBudget] = useState([250000]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    jewelryType: '',
    goldType: '',
    weight: 10,
    budget: 250000,
    description: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSelectChange = (value: string, field: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    // Update form data with current slider values
    const updatedFormData = {
      ...formData,
      weight: weight[0],
      budget: budget[0]
    };
    
    try {
      const response = await fetch('/api/custom-design', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        if (data.errors) {
          // Format and display validation errors
          const formattedErrors: Record<string, string> = {};
          Object.entries(data.errors).forEach(([key, value]: [string, any]) => {
            if (value?._errors?.[0]) {
              formattedErrors[key] = value._errors[0];
            }
          });
          setErrors(formattedErrors);
        } else {
          toast({
            title: "Error",
            description: data.message || "Something went wrong. Please try again.",
            variant: "destructive"
          });
        }
        setIsSubmitting(false);
        return;
      }
      
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Design Submitted!",
        description: `Our team will review your request (ID: ${data.requestId}) and get back to you shortly.`,
      });
      
      // Reset form after a delay
      setTimeout(() => {
        setIsSubmitted(false);
        // Reset form data
        setFormData({
          name: '',
          email: '',
          phone: '',
          jewelryType: '',
          goldType: '',
          weight: 10,
          budget: 250000,
          description: ''
        });
        setWeight([10]);
        setBudget([250000]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setIsSubmitting(false);
      toast({
        title: "Error",
        description: "There was a problem connecting to the server. Please try again.",
        variant: "destructive"
      });
    }
  };

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
            <CardContent>
              {isSubmitted ? (
                <div className="text-center py-16 flex flex-col items-center justify-center">
                    <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                    <h2 className="font-headline text-2xl text-primary mb-2">Thank You!</h2>
                    <p className="text-muted-foreground">Your design has been submitted successfully. We will be in touch soon.</p>
                </div>
              ) : (
              <>
              {errors && Object.keys(errors).length > 0 && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>
                    Please correct the errors in the form and try again.
                  </AlertDescription>
                </Alert>
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      placeholder="Ayesha Khan" 
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="ayesha.khan@example.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      placeholder="03XX XXXXXXX" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className={errors.phone ? "border-red-500" : ""}
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jewelryType">Jewellery Type</Label>
                    <Select 
                      value={formData.jewelryType} 
                      onValueChange={(value) => handleSelectChange(value, 'jewelryType')}
                      required
                    >
                      <SelectTrigger id="jewelryType" className={errors.jewelryType ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ring">Ring</SelectItem>
                        <SelectItem value="necklace">Necklace</SelectItem>
                        <SelectItem value="bracelet">Bracelet</SelectItem>
                        <SelectItem value="earrings">Earrings</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.jewelryType && <p className="text-red-500 text-sm mt-1">{errors.jewelryType}</p>}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="goldType">Gold Type</Label>
                  <Select 
                    value={formData.goldType} 
                    onValueChange={(value) => handleSelectChange(value, 'goldType')}
                    required
                  >
                    <SelectTrigger id="goldType" className={errors.goldType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select gold purity" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24k">24k Gold</SelectItem>
                      <SelectItem value="22k">22k Gold</SelectItem>
                      <SelectItem value="white">White Gold</SelectItem>
                      <SelectItem value="rose">Rose Gold</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.goldType && <p className="text-red-500 text-sm mt-1">{errors.goldType}</p>}
                </div>

                <div className="space-y-4">
                  <Label htmlFor="weight">Desired Weight (grams)</Label>
                  <div className="flex items-center gap-4">
                      <Slider id="weight" value={weight} onValueChange={setWeight} max={100} step={1} className="flex-1" />
                      <span className="font-semibold text-primary w-16 text-center">{weight[0]}g</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="budget">Your Budget (PKR)</Label>
                  <div className="flex items-center gap-4">
                      <Slider id="budget" value={budget} onValueChange={setBudget} min={50000} max={5000000} step={10000} className="flex-1" />
                      <span className="font-semibold text-primary w-32 text-center">PKR {budget[0].toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Design Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe your vision, including style, stones, and any special details..." 
                    className={`min-h-[140px] ${errors.description ? "border-red-500" : ""}`}
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inspiration">Inspiration (Optional)</Label>
                   <div className="flex items-center justify-center w-full">
                      <Label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-border border-dashed rounded-lg cursor-pointer bg-card hover:bg-muted/50">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-muted-foreground">PNG, JPG or other image formats</p>
                          </div>
                          <Input id="dropzone-file" type="file" className="hidden" ref={fileInputRef} />
                      </Label>
                  </div> 
                </div>

                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold" disabled={isSubmitting}>
                   {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                   {isSubmitting ? 'Submitting...' : 'Submit Your Design'}
                </Button>
              </form>
              </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="space-y-8">
          <Card className="bg-card border-border/40">
             <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><DollarSign className="h-6 w-6"/> Today's Gold Rate</CardTitle>
                <CardDescription>Rates per Tola</CardDescription>
             </CardHeader>
             <CardContent>
                <GoldRateDisplay />
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
