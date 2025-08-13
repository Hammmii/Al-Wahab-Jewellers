import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Define validation schema for custom design request
const customDesignSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  jewelryType: z.string().min(1, { message: 'Jewelry type is required' }),
  goldType: z.string().min(1, { message: 'Gold type is required' }),
  weight: z.string().optional(),
  budget: z.string().min(1, { message: 'Budget is required' }),
  description: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    
    // Validate request data
    const result = customDesignSchema.safeParse(body);
    
    if (!result.success) {
      // Return validation errors
      return NextResponse.json(
        { success: false, errors: result.error.format() },
        { status: 400 }
      );
    }
    
    // In a real application, you would save this data to a database
    // For now, we'll simulate a successful submission
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return success response
    return NextResponse.json(
      { 
        success: true, 
        message: 'Custom design request submitted successfully',
        requestId: `CD-${Date.now()}` // Generate a unique request ID
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing custom design request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}