export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      activities: {
        Row: {
          created_at: string
          description: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          description?: string
          id: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          content: string
          cover_url: string | null
          created_at: string
          excerpt: string
          id: string
          images: string[]
          published: boolean
          published_at: string
          slug: string
          title: string
          updated_at: string
          videos: string[]
        }
        Insert: {
          content?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          images?: string[]
          published?: boolean
          published_at?: string
          slug: string
          title: string
          updated_at?: string
          videos?: string[]
        }
        Update: {
          content?: string
          cover_url?: string | null
          created_at?: string
          excerpt?: string
          id?: string
          images?: string[]
          published?: boolean
          published_at?: string
          slug?: string
          title?: string
          updated_at?: string
          videos?: string[]
        }
        Relationships: []
      }
      booking_requests: {
        Row: {
          contact: string
          created_at: string
          customer_name: string
          departure_date: string | null
          id: string
          people: number
          status: string
          trip_id: string | null
          trip_name: string
        }
        Insert: {
          contact?: string
          created_at?: string
          customer_name: string
          departure_date?: string | null
          id?: string
          people?: number
          status?: string
          trip_id?: string | null
          trip_name: string
        }
        Update: {
          contact?: string
          created_at?: string
          customer_name?: string
          departure_date?: string | null
          id?: string
          people?: number
          status?: string
          trip_id?: string | null
          trip_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          created_at: string
          description: string
          id: string
          image_url: string | null
          sort_order: number
          title: string
        }
        Insert: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          sort_order?: number
          title: string
        }
        Update: {
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      departures: {
        Row: {
          created_at: string
          date: string
          id: string
          meeting_point: string
          return_date: string | null
          spots: number
          trip_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          meeting_point?: string
          return_date?: string | null
          spots?: number
          trip_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          meeting_point?: string
          return_date?: string | null
          spots?: number
          trip_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "departures_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollment_links: {
        Row: {
          active: boolean
          created_at: string
          id: string
          token: string
          trip_id: string | null
          trip_name: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          id?: string
          token: string
          trip_id?: string | null
          trip_name: string
        }
        Update: {
          active?: boolean
          created_at?: string
          id?: string
          token?: string
          trip_id?: string | null
          trip_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollment_links_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          allergy: boolean
          allergy_detail: string
          birth_date: string | null
          blood_type: string
          city: string
          country: string
          cpf: string
          created_at: string
          district: string
          email: string
          emergency_contact: string
          expectations: string
          food_restriction: string
          full_name: string
          health_notes: string
          health_plan: string
          heart_condition: boolean
          heart_condition_detail: string
          height: string
          how_found_us: string
          id: string
          link_id: string | null
          number: string
          outdoor_practitioner: string
          passport: string
          payment_method: string
          phone: string
          previous_events: string
          profession: string
          risk_terms_accepted: boolean
          routine_activity: string
          shirt_size: string
          shoe_size: string
          state: string
          street: string
          trip_id: string | null
          trip_name: string
          vaccine_covid: boolean
          vaccine_rabies: boolean
          vaccine_yellow_fever: boolean
          weight: string
          zip_code: string
        }
        Insert: {
          allergy?: boolean
          allergy_detail?: string
          birth_date?: string | null
          blood_type?: string
          city?: string
          country?: string
          cpf?: string
          created_at?: string
          district?: string
          email?: string
          emergency_contact?: string
          expectations?: string
          food_restriction?: string
          full_name: string
          health_notes?: string
          health_plan?: string
          heart_condition?: boolean
          heart_condition_detail?: string
          height?: string
          how_found_us?: string
          id?: string
          link_id?: string | null
          number?: string
          outdoor_practitioner?: string
          passport?: string
          payment_method?: string
          phone?: string
          previous_events?: string
          profession?: string
          risk_terms_accepted?: boolean
          routine_activity?: string
          shirt_size?: string
          shoe_size?: string
          state?: string
          street?: string
          trip_id?: string | null
          trip_name: string
          vaccine_covid?: boolean
          vaccine_rabies?: boolean
          vaccine_yellow_fever?: boolean
          weight?: string
          zip_code?: string
        }
        Update: {
          allergy?: boolean
          allergy_detail?: string
          birth_date?: string | null
          blood_type?: string
          city?: string
          country?: string
          cpf?: string
          created_at?: string
          district?: string
          email?: string
          emergency_contact?: string
          expectations?: string
          food_restriction?: string
          full_name?: string
          health_notes?: string
          health_plan?: string
          heart_condition?: boolean
          heart_condition_detail?: string
          height?: string
          how_found_us?: string
          id?: string
          link_id?: string | null
          number?: string
          outdoor_practitioner?: string
          passport?: string
          payment_method?: string
          phone?: string
          previous_events?: string
          profession?: string
          risk_terms_accepted?: boolean
          routine_activity?: string
          shirt_size?: string
          shoe_size?: string
          state?: string
          street?: string
          trip_id?: string | null
          trip_name?: string
          vaccine_covid?: boolean
          vaccine_rabies?: boolean
          vaccine_yellow_fever?: boolean
          weight?: string
          zip_code?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "enrollment_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          about_image_url: string | null
          about_text: string
          about_title: string
          address: string
          banner_badge: string
          banner_image_url: string | null
          banner_subtitle: string
          banner_title: string
          contact_email: string
          facebook_url: string
          footer_text: string
          fx_eur: number
          fx_updated_at: string | null
          fx_usd: number
          hero_images: string[]
          id: number
          instagram_url: string
          phone: string
          stats: Json
          updated_at: string
          whatsapp_greeting: string
          whatsapp_number: string
          youtube_url: string
        }
        Insert: {
          about_image_url?: string | null
          about_text?: string
          about_title?: string
          address?: string
          banner_badge?: string
          banner_image_url?: string | null
          banner_subtitle?: string
          banner_title?: string
          contact_email?: string
          facebook_url?: string
          footer_text?: string
          fx_eur?: number
          fx_updated_at?: string | null
          fx_usd?: number
          hero_images?: string[]
          id?: number
          instagram_url?: string
          phone?: string
          stats?: Json
          updated_at?: string
          whatsapp_greeting?: string
          whatsapp_number?: string
          youtube_url?: string
        }
        Update: {
          about_image_url?: string | null
          about_text?: string
          about_title?: string
          address?: string
          banner_badge?: string
          banner_image_url?: string | null
          banner_subtitle?: string
          banner_title?: string
          contact_email?: string
          facebook_url?: string
          footer_text?: string
          fx_eur?: number
          fx_updated_at?: string | null
          fx_usd?: number
          hero_images?: string[]
          id?: number
          instagram_url?: string
          phone?: string
          stats?: Json
          updated_at?: string
          whatsapp_greeting?: string
          whatsapp_number?: string
          youtube_url?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
          sort_order: number
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          sort_order?: number
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          activity_date: string | null
          approved: boolean
          comment: string
          created_at: string
          id: string
          name: string
          photos: string[]
          rating: number
          trip_name: string
        }
        Insert: {
          activity_date?: string | null
          approved?: boolean
          comment: string
          created_at?: string
          id?: string
          name: string
          photos?: string[]
          rating?: number
          trip_name?: string
        }
        Update: {
          activity_date?: string | null
          approved?: boolean
          comment?: string
          created_at?: string
          id?: string
          name?: string
          photos?: string[]
          rating?: number
          trip_name?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          activity_id: string | null
          characteristics: string
          checklist: string[]
          climate: string
          created_at: string
          days: number
          description: string
          destination: string
          destination_text: string
          equipment: string[]
          featured: boolean
          food: string
          guide_image_url: string | null
          guide_text: string
          highlights: string[]
          id: string
          image_url: string | null
          images: string[]
          includes: string[]
          itinerary: Json
          level: string
          name: string
          not_included: string[]
          old_price: number | null
          prerequisites: string[]
          price: number
          published: boolean
          rating: number
          slug: string
          state: string
          tags: string[]
          tech_sheet: Json
          updated_at: string
          video_url: string
        }
        Insert: {
          activity_id?: string | null
          characteristics?: string
          checklist?: string[]
          climate?: string
          created_at?: string
          days?: number
          description?: string
          destination: string
          destination_text?: string
          equipment?: string[]
          featured?: boolean
          food?: string
          guide_image_url?: string | null
          guide_text?: string
          highlights?: string[]
          id?: string
          image_url?: string | null
          images?: string[]
          includes?: string[]
          itinerary?: Json
          level?: string
          name: string
          not_included?: string[]
          old_price?: number | null
          prerequisites?: string[]
          price?: number
          published?: boolean
          rating?: number
          slug: string
          state: string
          tags?: string[]
          tech_sheet?: Json
          updated_at?: string
          video_url?: string
        }
        Update: {
          activity_id?: string | null
          characteristics?: string
          checklist?: string[]
          climate?: string
          created_at?: string
          days?: number
          description?: string
          destination?: string
          destination_text?: string
          equipment?: string[]
          featured?: boolean
          food?: string
          guide_image_url?: string | null
          guide_text?: string
          highlights?: string[]
          id?: string
          image_url?: string | null
          images?: string[]
          includes?: string[]
          itinerary?: Json
          level?: string
          name?: string
          not_included?: string[]
          old_price?: number | null
          prerequisites?: string[]
          price?: number
          published?: boolean
          rating?: number
          slug?: string
          state?: string
          tags?: string[]
          tech_sheet?: Json
          updated_at?: string
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_clicks: {
        Row: {
          created_at: string
          departure_date: string | null
          id: string
          source: string
          trip_id: string | null
          trip_name: string
        }
        Insert: {
          created_at?: string
          departure_date?: string | null
          id?: string
          source: string
          trip_id?: string | null
          trip_name: string
        }
        Update: {
          created_at?: string
          departure_date?: string | null
          id?: string
          source?: string
          trip_id?: string | null
          trip_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_clicks_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
