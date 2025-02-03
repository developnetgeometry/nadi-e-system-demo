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
      budgets: {
        Row: {
          amount: number
          category: string
          created_at: string
          description: string | null
          end_date: string
          id: string
          name: string
          start_date: string
          updated_at: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          description?: string | null
          end_date: string
          id?: string
          name: string
          start_date: string
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          description?: string | null
          end_date?: string
          id?: string
          name?: string
          start_date?: string
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
      financial_transactions: {
        Row: {
          amount: number
          category: string | null
          created_at: string
          date: string
          description: string | null
          id: string
          reference_number: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string
        }
        Insert: {
          amount: number
          category?: string | null
          created_at?: string
          date: string
          description?: string | null
          id?: string
          reference_number?: string | null
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Update: {
          amount?: number
          category?: string | null
          created_at?: string
          date?: string
          description?: string | null
          id?: string
          reference_number?: string | null
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string
        }
        Relationships: []
      }
      invoices: {
        Row: {
          amount: number
          client_name: string
          created_at: string
          due_date: string
          id: string
          invoice_number: string
          issue_date: string
          items: Json
          notes: string | null
          status: Database["public"]["Enums"]["invoice_status"] | null
          updated_at: string
        }
        Insert: {
          amount: number
          client_name: string
          created_at?: string
          due_date: string
          id?: string
          invoice_number: string
          issue_date: string
          items: Json
          notes?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          updated_at?: string
        }
        Update: {
          amount?: number
          client_name?: string
          created_at?: string
          due_date?: string
          id?: string
          invoice_number?: string
          issue_date?: string
          items?: Json
          notes?: string | null
          status?: Database["public"]["Enums"]["invoice_status"] | null
          updated_at?: string
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
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"] | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean | null
          title: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean | null
          title?: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          user_id?: string | null
        }
        Relationships: []
      }
      programme_participants: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          programme_id: string | null
          registration_date: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          programme_id?: string | null
          registration_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          programme_id?: string | null
          registration_date?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "programme_participants_programme_id_fkey"
            columns: ["programme_id"]
            isOneToOne: false
            referencedRelation: "programmes"
            referencedColumns: ["id"]
          },
        ]
      }
      programmes: {
        Row: {
          capacity: number | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          id: string
          location: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["programme_status"] | null
          title: string
          updated_at: string
        }
        Insert: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["programme_status"] | null
          title: string
          updated_at?: string
        }
        Update: {
          capacity?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: string
          location?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["programme_status"] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      reports: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          last_generated: string | null
          parameters: Json | null
          schedule: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          last_generated?: string | null
          parameters?: Json | null
          schedule?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          last_generated?: string | null
          parameters?: Json | null
          schedule?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      usage_sessions: {
        Row: {
          actions_performed: Json | null
          created_at: string
          device_info: Json | null
          end_time: string | null
          id: string
          ip_address: string | null
          session_type: Database["public"]["Enums"]["session_type"]
          start_time: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          actions_performed?: Json | null
          created_at?: string
          device_info?: Json | null
          end_time?: string | null
          id?: string
          ip_address?: string | null
          session_type: Database["public"]["Enums"]["session_type"]
          start_time?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          actions_performed?: Json | null
          created_at?: string
          device_info?: Json | null
          end_time?: string | null
          id?: string
          ip_address?: string | null
          session_type?: Database["public"]["Enums"]["session_type"]
          start_time?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      workflow_escalations: {
        Row: {
          created_at: string
          escalated_by: string | null
          escalated_to: string | null
          id: string
          reason: string
          resolved: boolean | null
          resolved_at: string | null
          task_id: string | null
        }
        Insert: {
          created_at?: string
          escalated_by?: string | null
          escalated_to?: string | null
          id?: string
          reason: string
          resolved?: boolean | null
          resolved_at?: string | null
          task_id?: string | null
        }
        Update: {
          created_at?: string
          escalated_by?: string | null
          escalated_to?: string | null
          id?: string
          reason?: string
          resolved?: boolean | null
          resolved_at?: string | null
          task_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_escalations_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "workflow_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_task_comments: {
        Row: {
          content: string
          created_at: string
          id: string
          task_id: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          task_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_task_comments_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "workflow_tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_tasks: {
        Row: {
          approver_id: string | null
          assignee_id: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          order_index: number
          priority: Database["public"]["Enums"]["priority_level"] | null
          requires_approval: boolean | null
          status: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at: string
          workflow_id: string | null
        }
        Insert: {
          approver_id?: string | null
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          order_index: number
          priority?: Database["public"]["Enums"]["priority_level"] | null
          requires_approval?: boolean | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title: string
          updated_at?: string
          workflow_id?: string | null
        }
        Update: {
          approver_id?: string | null
          assignee_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          order_index?: number
          priority?: Database["public"]["Enums"]["priority_level"] | null
          requires_approval?: boolean | null
          status?: Database["public"]["Enums"]["task_status"] | null
          title?: string
          updated_at?: string
          workflow_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "workflow_tasks_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflows: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          status: Database["public"]["Enums"]["workflow_status"] | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          status?: Database["public"]["Enums"]["workflow_status"] | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          status?: Database["public"]["Enums"]["workflow_status"] | null
          updated_at?: string
        }
        Relationships: []
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
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      notification_type: "info" | "warning" | "success" | "error"
      priority_level: "low" | "medium" | "high" | "urgent"
      programme_status: "draft" | "active" | "completed" | "cancelled"
      session_type: "login" | "system_access" | "feature_usage" | "api_call"
      task_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "blocked"
        | "cancelled"
      transaction_type: "income" | "expense" | "transfer"
      workflow_status: "draft" | "active" | "completed" | "cancelled"
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
