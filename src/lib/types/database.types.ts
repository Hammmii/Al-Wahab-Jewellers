export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          position: number
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          position?: number
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          position?: number
          slug?: string
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          created_at: string
          email: string
          id: string
          message: string
          name: string
          phone: string | null
          status: Database['public']['Enums']['contact_status']
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          message: string
          name: string
          phone?: string | null
          status?: Database['public']['Enums']['contact_status']
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          message?: string
          name?: string
          phone?: string | null
          status?: Database['public']['Enums']['contact_status']
        }
        Relationships: []
      }
      custom_design_requests: {
        Row: {
          budget: number | null
          created_at: string
          customer_id: string | null
          description: string | null
          email: string
          gold_type: string
          id: string
          inspiration_image_path: string | null
          jewelry_type: string
          name: string
          phone: string
          status: Database['public']['Enums']['custom_design_status']
          weight_grams: number | null
        }
        Insert: {
          budget?: number | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          email: string
          gold_type: string
          id?: string
          inspiration_image_path?: string | null
          jewelry_type: string
          name: string
          phone: string
          status?: Database['public']['Enums']['custom_design_status']
          weight_grams?: number | null
        }
        Update: {
          budget?: number | null
          created_at?: string
          customer_id?: string | null
          description?: string | null
          email?: string
          gold_type?: string
          id?: string
          inspiration_image_path?: string | null
          jewelry_type?: string
          name?: string
          phone?: string
          status?: Database['public']['Enums']['custom_design_status']
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'custom_design_requests_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      gold_rates: {
        Row: {
          created_at: string
          currency: string
          effective_at: string
          id: string
          karat: Database['public']['Enums']['karat_type']
          rate_per_10g: number
          rate_per_gram: number
          rate_per_tola: number
          set_by: string | null
          source: Database['public']['Enums']['gold_rate_source']
        }
        Insert: {
          created_at?: string
          currency?: string
          effective_at?: string
          id?: string
          karat: Database['public']['Enums']['karat_type']
          rate_per_10g: number
          rate_per_gram: number
          rate_per_tola: number
          set_by?: string | null
          source?: Database['public']['Enums']['gold_rate_source']
        }
        Update: {
          created_at?: string
          currency?: string
          effective_at?: string
          id?: string
          karat?: Database['public']['Enums']['karat_type']
          rate_per_10g?: number
          rate_per_gram?: number
          rate_per_tola?: number
          set_by?: string | null
          source?: Database['public']['Enums']['gold_rate_source']
        }
        Relationships: [
          {
            foreignKeyName: 'gold_rates_set_by_fkey'
            columns: ['set_by']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      order_items: {
        Row: {
          id: string
          line_total: number
          name_snapshot: string
          order_id: string
          price_snapshot: number
          product_id: string
          quantity: number
          variant_id: string | null
        }
        Insert: {
          id?: string
          line_total: number
          name_snapshot: string
          order_id: string
          price_snapshot: number
          product_id: string
          quantity: number
          variant_id?: string | null
        }
        Update: {
          id?: string
          line_total?: number
          name_snapshot?: string
          order_id?: string
          price_snapshot?: number
          product_id?: string
          quantity?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'order_items_order_id_fkey'
            columns: ['order_id']
            isOneToOne: false
            referencedRelation: 'orders'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'order_items_variant_id_fkey'
            columns: ['variant_id']
            isOneToOne: false
            referencedRelation: 'product_variants'
            referencedColumns: ['id']
          },
        ]
      }
      orders: {
        Row: {
          address: Json
          created_at: string
          customer_id: string | null
          customer_name: string
          email: string | null
          id: string
          notes: string | null
          payment_method: Database['public']['Enums']['payment_method']
          payment_proof_path: string | null
          payment_status: Database['public']['Enums']['payment_status']
          phone: string
          status: Database['public']['Enums']['order_status']
          subtotal: number
          total: number
          updated_at: string
        }
        Insert: {
          address: Json
          created_at?: string
          customer_id?: string | null
          customer_name: string
          email?: string | null
          id?: string
          notes?: string | null
          payment_method: Database['public']['Enums']['payment_method']
          payment_proof_path?: string | null
          payment_status?: Database['public']['Enums']['payment_status']
          phone: string
          status?: Database['public']['Enums']['order_status']
          subtotal: number
          total: number
          updated_at?: string
        }
        Update: {
          address?: Json
          created_at?: string
          customer_id?: string | null
          customer_name?: string
          email?: string | null
          id?: string
          notes?: string | null
          payment_method?: Database['public']['Enums']['payment_method']
          payment_proof_path?: string | null
          payment_status?: Database['public']['Enums']['payment_status']
          phone?: string
          status?: Database['public']['Enums']['order_status']
          subtotal?: number
          total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'orders_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
        ]
      }
      product_images: {
        Row: {
          alt_text: string | null
          created_at: string
          id: string
          is_primary: boolean
          position: number
          product_id: string
          storage_path: string
        }
        Insert: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          position?: number
          product_id: string
          storage_path: string
        }
        Update: {
          alt_text?: string | null
          created_at?: string
          id?: string
          is_primary?: boolean
          position?: number
          product_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: 'product_images_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          metal_purity: Database['public']['Enums']['metal_purity']
          price: number
          product_id: string
          size: string | null
          sku: string | null
          stock: number
          weight_grams: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          metal_purity: Database['public']['Enums']['metal_purity']
          price: number
          product_id: string
          size?: string | null
          sku?: string | null
          stock?: number
          weight_grams?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          metal_purity?: Database['public']['Enums']['metal_purity']
          price?: number
          product_id?: string
          size?: string | null
          sku?: string | null
          stock?: number
          weight_grams?: number | null
        }
        Relationships: [
          {
            foreignKeyName: 'product_variants_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
      products: {
        Row: {
          category_id: string | null
          collection_id: string | null
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          is_featured: boolean
          metal_type: string | null
          name: string
          search_vector: unknown
          slug: string
          updated_at: string
        }
        Insert: {
          category_id?: string | null
          collection_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          metal_type?: string | null
          name: string
          search_vector?: unknown
          slug: string
          updated_at?: string
        }
        Update: {
          category_id?: string | null
          collection_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          is_featured?: boolean
          metal_type?: string | null
          name?: string
          search_vector?: unknown
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'products_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'products_collection_id_fkey'
            columns: ['collection_id']
            isOneToOne: false
            referencedRelation: 'collections'
            referencedColumns: ['id']
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string | null
          id: string
          is_admin: boolean
          phone: string | null
        }
        Insert: {
          created_at?: string
          full_name?: string | null
          id: string
          is_admin?: boolean
          phone?: string | null
        }
        Update: {
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          phone?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          body: string | null
          created_at: string
          customer_id: string
          id: string
          is_approved: boolean
          product_id: string
          rating: number
          title: string | null
        }
        Insert: {
          body?: string | null
          created_at?: string
          customer_id: string
          id?: string
          is_approved?: boolean
          product_id: string
          rating: number
          title?: string | null
        }
        Update: {
          body?: string | null
          created_at?: string
          customer_id?: string
          id?: string
          is_approved?: boolean
          product_id?: string
          rating?: number
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'reviews_customer_id_fkey'
            columns: ['customer_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'reviews_product_id_fkey'
            columns: ['product_id']
            isOneToOne: false
            referencedRelation: 'products'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      current_gold_rates: {
        Row: {
          currency: string | null
          effective_at: string | null
          karat: Database['public']['Enums']['karat_type'] | null
          rate_per_10g: number | null
          rate_per_gram: number | null
          rate_per_tola: number | null
          source: Database['public']['Enums']['gold_rate_source'] | null
        }
        Relationships: []
      }
    }
    Functions: {
      create_order: {
        Args: {
          p_payment_method: Database['public']['Enums']['payment_method']
          p_customer_name: string
          p_phone: string
          p_address: Json
          p_items: Json
          p_customer_id?: string
          p_email?: string
          p_notes?: string
          p_payment_proof_path?: string
          p_payment_status?: Database['public']['Enums']['payment_status']
        }
        Returns: string
      }
      is_admin: { Args: Record<PropertyKey, never>; Returns: boolean }
      is_verified_buyer: { Args: { p_product_id: string }; Returns: boolean }
    }
    Enums: {
      contact_status: 'new' | 'read' | 'replied'
      custom_design_status: 'new' | 'in_review' | 'quoted' | 'closed'
      gold_rate_source: 'auto' | 'manual'
      karat_type: '24k' | '22k' | '21k' | '18k'
      metal_purity: '24k' | '22k' | '21k' | '18k' | 'silver'
      order_status: 'pending' | 'confirmed' | 'dispatched' | 'delivered' | 'cancelled'
      payment_method: 'cod' | 'bank_transfer'
      payment_status: 'unpaid' | 'paid' | 'refunded'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export default Database
