import { z } from 'zod'

/**
 * Shared validation schemas — the single source of truth, reused on the
 * client (react-hook-form) and the server (Route Handlers / Server Actions).
 */

// Pakistani mobile: +92 3XX XXXXXXX or 03XX XXXXXXX
const phoneSchema = z
  .string()
  .min(1, 'Phone is required')
  .regex(
    /^(\+92|0)?3\d{2}[- ]?\d{7}$/,
    'Enter a valid Pakistani mobile number, e.g. 0300 1234567',
  )

const emailSchema = z.string().email('Enter a valid email address')

// ─── Contact ────────────────────────────────────────────────────────────────
export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  email: emailSchema,
  phone: phoneSchema,
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message is too long'),
})
export type ContactInput = z.infer<typeof contactSchema>

// ─── Custom design request ──────────────────────────────────────────────────
export const customDesignSchema = z.object({
  name: z.string().min(2).max(80),
  email: emailSchema,
  phone: phoneSchema,
  jewelryType: z.string().min(1, 'Select a jewellery type'),
  goldType: z.string().min(1, 'Select a gold type'),
  weightGrams: z.number().positive().max(1000).optional(),
  budget: z.number().nonnegative().max(100_000_000).optional(),
  description: z.string().max(2000).optional(),
})
export type CustomDesignInput = z.infer<typeof customDesignSchema>

// ─── Orders (COD + bank transfer) ───────────────────────────────────────────
export const paymentMethodSchema = z.enum(['cod', 'bank_transfer'])

export const orderSchema = z.object({
  customerName: z.string().min(2, 'Name is required').max(120),
  phone: phoneSchema,
  email: emailSchema.optional().or(z.literal('')),
  paymentMethod: paymentMethodSchema,
  address: z.object({
    line1: z.string().min(3, 'Address is required').max(200),
    line2: z.string().max(200).optional(),
    city: z.string().min(2, 'City is required').max(80),
    province: z.string().min(2, 'Province is required').max(80),
    postalCode: z.string().max(20).optional(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        variantId: z.string().uuid().optional(),
        name: z.string(),
        price: z.number().nonnegative(),
        quantity: z.number().int().positive(),
      }),
    )
    .min(1, 'Your cart is empty'),
  notes: z.string().max(1000).optional(),
})
export type OrderInput = z.infer<typeof orderSchema>

// ─── Reviews (verified buyers only) ─────────────────────────────────────────
export const reviewSchema = z.object({
  productId: z.string().uuid(),
  rating: z.number().int().min(1, 'Pick a rating').max(5),
  title: z.string().max(120).optional(),
  body: z.string().max(2000).optional(),
})
export type ReviewInput = z.infer<typeof reviewSchema>

// ─── Admin: products ────────────────────────────────────────────────────────
export const metalPuritySchema = z.enum(['24k', '22k', '21k', '18k', 'silver'])

export const productVariantSchema = z.object({
  metalPurity: metalPuritySchema,
  weightGrams: z.number().positive().max(1000).optional(),
  size: z.string().max(20).optional(),
  price: z.number().nonnegative('Price must be 0 or more'),
  sku: z.string().max(60).optional(),
  stock: z.number().int().nonnegative().default(0),
})

export const productAdminSchema = z.object({
  name: z.string().min(2, 'Name is required').max(200),
  slug: z
    .string()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Lowercase letters, numbers and hyphens only'),
  categoryId: z.string().uuid('Select a category'),
  collectionId: z.string().uuid().optional(),
  description: z.string().max(5000).optional(),
  metalType: z.string().max(60).optional(),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  variants: z.array(productVariantSchema).min(1, 'Add at least one variant'),
})
export type ProductAdminInput = z.infer<typeof productAdminSchema>

// ─── Gold rates ─────────────────────────────────────────────────────────────
export const goldRateSchema = z.object({
  karat: z.enum(['24k', '22k', '21k', '18k']),
  ratePerTola: z.number().nonnegative(),
  ratePer10g: z.number().nonnegative(),
  ratePerGram: z.number().nonnegative(),
  source: z.enum(['auto', 'manual']).default('manual'),
})
export type GoldRateInput = z.infer<typeof goldRateSchema>

/** Lowercase, hyphenated slug from a name. */
export const slugify = (s: string): string =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
