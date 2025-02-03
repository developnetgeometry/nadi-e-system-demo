export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      assets: {
        Row: {
          assigned_to: string | null
          category: Database["public"]["Enums"]["asset_category"]
          created_at: string
          current_value: number | null
          depreciation_rate: number | null
          description: string | null
          id: string
          last_maintenance_date: string | null
          location: string | null
          name: string
          next_maintenance_date: string | null
          purchase_cost: number
          purchase_date: string
          status: Database["public"]["Enums"]["asset_status"] | null
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category: Database["public"]["Enums"]["asset_category"]
          created_at?: string
          current_value?: number | null
          depreciation_rate?: number | null
          description?: string | null
          id?: string
          last_maintenance_date?: string | null
          location?: string | null
          name: string
          next_maintenance_date?: string | null
          purchase_cost: number
          purchase_date: string
          status?: Database["public"]["Enums"]["asset_status"] | null
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: Database["public"]["Enums"]["asset_category"]
          created_at?: string
          current_value?: number | null
          depreciation_rate?: number | null
          description?: string | null
          id?: string
          last_maintenance_date?: string | null
          location?: string | null
          name?: string
          next_maintenance_date?: string | null
          purchase_cost?: number
          purchase_date?: string
          status?: Database["public"]["Enums"]["asset_status"] | null
          updated_at?: string
        }
        Relationships: []
      }
      claims: {
        Row: {
          amount: number
          attachments: Json | null
          claim_number: string
          claim_type: Database["public"]["Enums"]["claim_type"]
          created_at: string
          description: string | null
          id: string
          review_notes: string | null
          reviewer_id: string | null
          status: Database["public"]["Enums"]["claim_status"] | null
          title: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount: number
          attachments?: Json | null
          claim_number: string
          claim_type: Database["public"]["Enums"]["claim_type"]
          created_at?: string
          description?: string | null
          id?: string
          review_notes?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["claim_status"] | null
          title: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          attachments?: Json | null
          claim_number?: string
          claim_type?: Database["public"]["Enums"]["claim_type"]
          created_at?: string
          description?: string | null
          id?: string
          review_notes?: string | null
          reviewer_id?: string | null
          status?: Database["public"]["Enums"]["claim_status"] | null
          title?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      maintenance_records: {
        Row: {
          asset_id: string | null
          cost: number
          created_at: string
          description: string
          id: string
          maintenance_date: string
          next_maintenance_date: string | null
          performed_by: string
        }
        Insert: {
          asset_id?: string | null
          cost: number
          created_at?: string
          description: string
          id?: string
          maintenance_date: string
          next_maintenance_date?: string | null
          performed_by: string
        }
        Update: {
          asset_id?: string | null
          cost?: number
          created_at?: string
          description?: string
          id?: string
          maintenance_date?: string
          next_maintenance_date?: string | null
          performed_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "maintenance_records_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "assets"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      asset_category:
        | "equipment"
        | "furniture"
        | "vehicle"
        | "electronics"
        | "software"
        | "other"
      asset_status: "active" | "in_maintenance" | "retired" | "disposed"
      claim_status: "pending" | "approved" | "rejected"
      claim_type: "damage" | "reimbursement" | "medical" | "travel" | "other"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
