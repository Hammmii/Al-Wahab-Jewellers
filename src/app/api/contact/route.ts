import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveContactSubmission } from '@/lib/submissions';
import { sendEmail } from '@/lib/email/send';
import { ContactNotificationEmail } from '@/lib/email/templates/contact-notification';

// Validation schema for the contact form.
const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 digits' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = contactFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Persist (no-op until Supabase is configured).
    const submissionId = await saveContactSubmission(data);

    // Notify the shop. No-op until RESEND_API_KEY is set.
    await sendEmail({
      to: process.env.NOTIFY_EMAIL ?? 'owner@alwahabjewellers.com',
      subject: `New enquiry from ${data.name}`,
      react: ContactNotificationEmail(data),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully. We will contact you soon!',
        reference: submissionId ?? `MSG-${Date.now()}`,
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
