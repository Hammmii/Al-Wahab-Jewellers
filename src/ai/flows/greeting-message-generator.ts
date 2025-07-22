'use server';

/**
 * @fileOverview A greeting message generator AI agent.
 *
 * - greetingMessageGenerator - A function that handles the greeting message generation process.
 * - GreetingMessageGeneratorInput - The input type for the greetingMessageGenerator function.
 * - GreetingMessageGeneratorOutput - The return type for the greetingMessageGenerator function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GreetingMessageGeneratorInputSchema = z.object({
  occasion: z.string().describe('The special occasion for the greeting message.'),
  recipientName: z.string().describe('The name of the recipient.'),
  senderName: z.string().describe('The name of the sender.'),
});
export type GreetingMessageGeneratorInput = z.infer<typeof GreetingMessageGeneratorInputSchema>;

const GreetingMessageGeneratorOutputSchema = z.object({
  greetingMessage: z.string().describe('The personalized greeting message with jewellery suggestions.'),
});
export type GreetingMessageGeneratorOutput = z.infer<typeof GreetingMessageGeneratorOutputSchema>;

export async function greetingMessageGenerator(input: GreetingMessageGeneratorInput): Promise<GreetingMessageGeneratorOutput> {
  return greetingMessageGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'greetingMessageGeneratorPrompt',
  input: {schema: GreetingMessageGeneratorInputSchema},
  output: {schema: GreetingMessageGeneratorOutputSchema},
  prompt: `You are a creative marketing specialist for a Gold Jewellery business in Pakistan named ZarQ.

You will generate a personalized greeting message for a special occasion with tailored jewellery suggestions.

Occasion: {{{occasion}}}
Recipient Name: {{{recipientName}}}
Sender Name: {{{senderName}}}

Greeting Message:`, // Handlebars syntax here
});

const greetingMessageGeneratorFlow = ai.defineFlow(
  {
    name: 'greetingMessageGeneratorFlow',
    inputSchema: GreetingMessageGeneratorInputSchema,
    outputSchema: GreetingMessageGeneratorOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
