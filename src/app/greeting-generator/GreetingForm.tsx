"use client";

import { useFormState, useFormStatus } from "react-dom";
import { generateGreetingAction, type FormState } from "./actions";
import { useEffect, useRef } from "react";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const initialState: FormState = {
  message: "",
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full font-bold">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="mr-2 h-4 w-4" />
          Generate Greeting
        </>
      )}
    </Button>
  );
}

export function GreetingForm() {
  const { toast } = useToast();
  const [state, formAction] = useFormState(generateGreetingAction, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.message && !state.data) {
       toast({
        variant: "destructive",
        title: "Error",
        description: state.message,
       });
    }
    if (state.message && state.data) {
        formRef.current?.reset();
    }
  }, [state, toast]);


  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
      <Card className="border-border/40">
        <form ref={formRef} action={formAction}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary">Create the Perfect Message</CardTitle>
            <CardDescription>
              Tell us a bit about the occasion, and our AI will craft a beautiful message with jewellery suggestions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="occasion">Occasion</Label>
              <Input
                id="occasion"
                name="occasion"
                placeholder="e.g., Wedding Anniversary, Birthday, Eid"
                defaultValue={state.fields?.occasion}
              />
              {state.issues?.find(issue => issue.includes("Occasion")) && <p className="text-sm text-destructive">{state.issues.find(issue => issue.includes("Occasion"))}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipientName">Recipient's Name</Label>
              <Input
                id="recipientName"
                name="recipientName"
                placeholder="e.g., Fatima"
                defaultValue={state.fields?.recipientName}
              />
              {state.issues?.find(issue => issue.includes("Recipient")) && <p className="text-sm text-destructive">{state.issues.find(issue => issue.includes("Recipient"))}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="senderName">Your Name (Sender)</Label>
              <Input
                id="senderName"
                name="senderName"
                placeholder="e.g., Ahmed"
                defaultValue={state.fields?.senderName}
              />
              {state.issues?.find(issue => issue.includes("Sender")) && <p className="text-sm text-destructive">{state.issues.find(issue => issue.includes("Sender"))}</p>}
            </div>
          </CardContent>
          <CardFooter>
            <SubmitButton />
          </CardFooter>
        </form>
      </Card>

      <div className="flex items-center justify-center">
        {state.data ? (
          <Card className="w-full bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">Your Generated Message</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-foreground/90">{state.data.greetingMessage}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="text-center text-muted-foreground p-8 border-2 border-dashed border-border/40 rounded-lg">
            <Sparkles className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4">Your personalized greeting will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
