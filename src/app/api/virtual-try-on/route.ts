import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveVirtualTryOnSubmission } from '@/lib/submissions';

// Define validation schema for virtual try-on quote request
const virtualTryOnSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }).optional(),
  email: z.string().email({ message: 'Invalid email address' }).optional(),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }).optional(),
  ringId: z.string().min(1, { message: 'Ring ID is required' }),
  imageData: z.string().optional(), // Base64 encoded image data
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();

    // Validate request data
    const result = virtualTryOnSchema.safeParse(body);

    if (!result.success) {
      // Return validation errors
      return NextResponse.json(
        { success: false, errors: result.error.format() },
        { status: 400 }
      );
    }

    // Save to database (note: imageData may be large, consider using Firebase Storage for images)
    const { imageData, ...dataToSave } = result.data;
    const quoteId = await saveVirtualTryOnSubmission(dataToSave);

    // TODO: Send email notification if email service is configured
    // This is where you would integrate with Resend, SendGrid, etc.

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: 'Your virtual try-on quote request has been submitted successfully',
        quoteId: quoteId || `VTO-${Date.now()}`,
        estimatedResponse: '24 hours'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing virtual try-on request:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}