import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { saveCustomDesignRequest } from '@/lib/submissions';
import { sendEmail } from '@/lib/email/send';
import { CustomDesignNotificationEmail } from '@/lib/email/templates/custom-design-notification';

// NOTE: this route-local schema accepts the string shapes the current form sends.
// It will align to the shared `customDesignSchema` (numeric fields) when the form
// is rebuilt in the storefront phase.
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
    const body = await request.json();
    const result = customDesignSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, errors: result.error.format() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Persist (no-op until Supabase is configured).
    const requestId = await saveCustomDesignRequest(data);

    // Notify the shop. No-op until RESEND_API_KEY is set.
    await sendEmail({
      to: process.env.NOTIFY_EMAIL ?? 'owner@alwahabjewellers.com',
      subject: `Custom design request from ${data.name}`,
      react: CustomDesignNotificationEmail({
        name: data.name,
        email: data.email,
        phone: data.phone,
        jewelryType: data.jewelryType,
        goldType: data.goldType,
        weightGrams: data.weight ? Number(data.weight) || undefined : undefined,
        budget: data.budget ? Number(data.budget) || undefined : undefined,
        description: data.description,
      }),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Custom design request submitted successfully',
        requestId: requestId ?? `CD-${Date.now()}`,
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
