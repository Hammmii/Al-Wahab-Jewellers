import { GreetingForm } from "./GreetingForm";

export const metadata = {
  title: "AI Greeting Generator - ZarQ",
  description: "Craft the perfect personalized greeting message for any occasion with jewellery suggestions, powered by AI.",
};

export default function GreetingGeneratorPage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold text-primary">AI Greeting Generator</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
          Let our creative AI assistant help you find the perfect words to express your feelings on special occasions.
        </p>
      </div>
      <GreetingForm />
    </div>
  );
}
