"use server";

import { z } from "zod";
import {
  greetingMessageGenerator,
  type GreetingMessageGeneratorInput,
} from "@/ai/flows/greeting-message-generator";

const formSchema = z.object({
  occasion: z.string().min(3, "Occasion must be at least 3 characters long."),
  recipientName: z.string().min(2, "Recipient's name must be at least 2 characters long."),
  senderName: z.string().min(2, "Sender's name must be at least 2 characters long."),
});

export type FormState = {
  message: string;
  fields?: Record<string, string>;
  issues?: string[];
  data?: {
    greetingMessage: string;
  }
};

export async function generateGreetingAction(
  prevState: FormState,
  data: FormData
): Promise<FormState> {
  const formData = Object.fromEntries(data);
  const parsed = formSchema.safeParse(formData);

  if (!parsed.success) {
    const fields: Record<string, string> = {};
    for (const key of Object.keys(formData)) {
      fields[key] = formData[key].toString();
    }
    return {
      message: "Invalid form data",
      fields,
      issues: parsed.error.issues.map((issue) => issue.message),
    };
  }

  try {
    const input: GreetingMessageGeneratorInput = {
      occasion: parsed.data.occasion,
      recipientName: parsed.data.recipientName,
      senderName: parsed.data.senderName,
    };
    
    const result = await greetingMessageGenerator(input);
    
    return {
      message: "Greeting generated successfully!",
      data: result,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to generate greeting. Please try again later.",
      fields: parsed.data,
    };
  }
}
