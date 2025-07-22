import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail } from "lucide-react";

export const metadata = {
  title: "Contact Us - ZarQ",
  description: "Get in touch with ZarQ for inquiries, appointments, or support.",
};

export default function ContactPage() {
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
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first-name">First Name</Label>
                  <Input id="first-name" placeholder="Ayesha" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last-name">Last Name</Label>
                  <Input id="last-name" placeholder="Khan" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="ayesha.khan@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Your message..." className="min-h-[120px]" />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold">Send Message</Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold font-headline text-primary">Our Showroom</h3>
              <p className="text-muted-foreground">123 Gold Street, Gulberg, Lahore, Pakistan</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Phone className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold font-headline text-primary">Phone</h3>
              <p className="text-muted-foreground">+92 300 1234567</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-3 rounded-full">
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-xl font-semibold font-headline text-primary">Email</h3>
              <p className="text-muted-foreground">contact@zarq.com</p>
            </div>
          </div>
          <div className="aspect-video w-full rounded-lg overflow-hidden mt-8 border border-border/40">
            {/* Placeholder for a map */}
            <img src="https://placehold.co/600x400" alt="Map to ZarQ" className="w-full h-full object-cover" data-ai-hint="city map" />
          </div>
        </div>
      </div>
    </div>
  );
}
