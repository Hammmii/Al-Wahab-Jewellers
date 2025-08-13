import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define validation schema for contact form
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request data
    const result = contactFormSchema.safeParse(body);
    
    if (!result.success) {
      // Return validation errors
      return NextResponse.json(
        { success: false, errors: result.error.format() },
        { status: 400 }
      );
    }
    
    // In a real application, you would save this data to a database
    // and potentially send an email notification
    // For now, we'll simulate a successful submission
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Your message has been sent successfully. We will contact you soon!',
        reference: `MSG-${Date.now()}` // Generate a unique reference number
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}