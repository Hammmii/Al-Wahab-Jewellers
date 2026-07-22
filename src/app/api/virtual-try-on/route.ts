import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveVirtualTryOnSubmission } from '@/lib/submissions';
import { sendEmail } from '@/lib/email/send';
import {
  VirtualTryOnConfirmationEmail,
  VirtualTryOnNotificationEmail,
} from '@/lib/email/templates/virtual-try-on';

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

    // Notify the shop. Email failures are logged but do not block the success response.
    try {
      await sendEmail({
        to: process.env.NOTIFY_EMAIL ?? 'owner@alwahabjewellers.com',
        subject: `Virtual try-on request for ${result.data.ringId}`,
        react: VirtualTryOnNotificationEmail({
          name: result.data.name,
          email: result.data.email,
          phone: result.data.phone,
          ringId: result.data.ringId,
          hasImage: !!imageData,
        }),
      });

      // Send a confirmation to the customer if they provided an email.
      if (result.data.email) {
        await sendEmail({
          to: result.data.email,
          subject: 'We received your virtual try-on request',
          react: VirtualTryOnConfirmationEmail({
            name: result.data.name,
            email: result.data.email,
            phone: result.data.phone,
            ringId: result.data.ringId,
          }),
        });
      }
    } catch (emailError) {
      console.error('[virtual-try-on] email notification failed', emailError);
    }

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