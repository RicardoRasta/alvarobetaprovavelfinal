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
    PostgrestVersion: "14.15"
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
      departures: {
        Row: {
          created_at: string
          date: string
          id: string
          return_date: string | null
          spots: number
          trip_id: string
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          return_date?: string | null
          spots?: number
          trip_id: string
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
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
      site_settings: {
        Row: {
          banner_badge: string
          banner_image_url: string | null
          banner_subtitle: string
          banner_title: string
          id: number
          stats: Json
          updated_at: string
          whatsapp_greeting: string
          whatsapp_number: string
        }
        Insert: {
          banner_badge?: string
          banner_image_url?: string | null
          banner_subtitle?: string
          banner_title?: string
          id?: number
          stats?: Json
          updated_at?: string
          whatsapp_greeting?: string
          whatsapp_number?: string
        }
        Update: {
          banner_badge?: string
          banner_image_url?: string | null
          banner_subtitle?: string
          banner_title?: string
          id?: number
          stats?: Json
          updated_at?: string
          whatsapp_greeting?: string
          whatsapp_number?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          activity_id: string | null
          created_at: string
          days: number
          description: string
          destination: string
          featured: boolean
          highlights: string[]
          id: string
          image_url: string | null
          images: string[]
          includes: string[]
          level: string
          name: string
          old_price: number | null
          price: number
          published: boolean
          rating: number
          slug: string
          state: string
          updated_at: string
        }
        Insert: {
          activity_id?: string | null
          created_at?: string
          days?: number
          description?: string
          destination: string
          featured?: boolean
          highlights?: string[]
          id?: string
          image_url?: string | null
          images?: string[]
          includes?: string[]
          level?: string
          name: string
          old_price?: number | null
          price?: number
          published?: boolean
          rating?: number
          slug: string
          state: string
          updated_at?: string
        }
        Update: {
          activity_id?: string | null
          created_at?: string
          days?: number
          description?: string
          destination?: string
          featured?: boolean
          highlights?: string[]
          id?: string
          image_url?: string | null
          images?: string[]
          includes?: string[]
          level?: string
          name?: string
          old_price?: number | null
          price?: number
          published?: boolean
          rating?: number
          slug?: string
          state?: string
          updated_at?: string
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
      admin_exists: { Args: never; Returns: boolean }
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
