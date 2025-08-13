"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Metadata moved to layout.tsx since this is now a client component

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
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
        title: "Message Sent!",
        description: `Thank you for contacting us. We'll get back to you soon. Reference: ${data.contactId}`,
      });
      
      // Reset form after a delay
      setTimeout(() => {
        setIsSubmitted(false);
        // Reset form data
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          message: ''
        });
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
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">Get In Touch</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          We would love to hear from you. Whether you have a question about our collections, need assistance, or want to book an appointment, we're here to help.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Send us a Message</CardTitle>
            <CardDescription>Fill out the form below and we'll get back to you as soon as possible.</CardDescription>
          </CardHeader>
          <CardContent>
            {isSubmitted ? (
              <div className="py-8 text-center">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground">Thank you for contacting us. We'll get back to you shortly.</p>
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
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input 
                        id="firstName" 
                        placeholder="Ayesha" 
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className={errors.firstName ? "border-red-500" : ""}
                        required
                      />
                      {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Khan" 
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className={errors.lastName ? "border-red-500" : ""}
                        required
                      />
                      {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="ayesha.khan@example.com" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input 
                      id="phone" 
                      placeholder="03XX XXXXXXX" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={errors.phone ? "border-red-500" : ""}
                      required
                    />
                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Your message..." 
                      className={`min-h-[120px] ${errors.message ? "border-red-500" : ""}`}
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message}</p>}
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      'Send Message'
                    )}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold font-headline text-primary">Our Showroom</h3>
              <p className="text-muted-foreground">45 Sarafa Bazar, Multan, Pakistan</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold font-headline text-primary">Phone</h3>
              <p className="text-muted-foreground">+92 321 6543210</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold font-headline text-primary">Email</h3>
              <p className="text-muted-foreground">contact@alwahabjewellers.com</p>
            </div>
          </div>
          <div className="aspect-video w-full rounded-lg overflow-hidden mt-8 border border-border/40">
            {/* Placeholder for a map */}
            <img src="https://placehold.co/600x400" alt="Map to Al-Wahab Jewellers" className="w-full h-full object-cover" data-ai-hint="city map" />
          </div>
        </div>
      </div>
    </div>
  );
}
