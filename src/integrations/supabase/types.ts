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
      app_settings: {
        Row: {
          created_at: string
          id: string
          key: string
          updated_at: string
          value: string
        }
        Insert: {
          created_at?: string
          id?: string
          key: string
          updated_at?: string
          value: string
        }
        Update: {
          created_at?: string
          id?: string
          key?: string
          updated_at?: string
          value?: string
        }
        Relationships: []
      }
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
      audit_logs: {
        Row: {
          action: string
          changes: Json | null
          created_at: string
          entity_id: string | null
          entity_type: string
          id: string
          ip_address: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          changes?: Json | null
          created_at?: string
          entity_id?: string | null
          entity_type?: string
          id?: string
          ip_address?: string | null
          user_id?: string | null
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
      content_comments: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          post_id: string | null
          status: string | null
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          post_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          post_id?: string | null
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "content_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      content_flags: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          post_id: string | null
          reason: string
          reporter_id: string | null
          resolved_at: string | null
          status: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          post_id?: string | null
          reason: string
          reporter_id?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          post_id?: string | null
          reason?: string
          reporter_id?: string | null
          resolved_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_flags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "content_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      content_posts: {
        Row: {
          author_id: string | null
          content: string
          created_at: string
          id: string
          status: string | null
          title: string
          updated_at: string
          votes_down: number | null
          votes_up: number | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string
          id?: string
          status?: string | null
          title: string
          updated_at?: string
          votes_down?: number | null
          votes_up?: number | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string
          id?: string
          status?: string | null
          title?: string
          updated_at?: string
          votes_down?: number | null
          votes_up?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "content_posts_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      content_votes: {
        Row: {
          created_at: string
          id: string
          post_id: string | null
          user_id: string | null
          vote_type: string
        }
        Insert: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
          vote_type: string
        }
        Update: {
          created_at?: string
          id?: string
          post_id?: string | null
          user_id?: string | null
          vote_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "content_votes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "content_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      email_config: {
        Row: {
          api_key: string | null
          created_at: string
          from_email: string | null
          from_name: string | null
          id: string
          provider: Database["public"]["Enums"]["email_provider_type"]
          smtp_host: string | null
          smtp_password: string | null
          smtp_port: number | null
          smtp_user: string | null
          updated_at: string
        }
        Insert: {
          api_key?: string | null
          created_at?: string
          from_email?: string | null
          from_name?: string | null
          id?: string
          provider?: Database["public"]["Enums"]["email_provider_type"]
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          updated_at?: string
        }
        Update: {
          api_key?: string | null
          created_at?: string
          from_email?: string | null
          from_name?: string | null
          id?: string
          provider?: Database["public"]["Enums"]["email_provider_type"]
          smtp_host?: string | null
          smtp_password?: string | null
          smtp_port?: number | null
          smtp_user?: string | null
          updated_at?: string
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
      menu_visibility: {
        Row: {
          created_at: string
          id: string
          menu_key: string
          menu_path: string | null
          updated_at: string
          visible_to: Database["public"]["Enums"]["user_type"][]
        }
        Insert: {
          created_at?: string
          id?: string
          menu_key: string
          menu_path?: string | null
          updated_at?: string
          visible_to?: Database["public"]["Enums"]["user_type"][]
        }
        Update: {
          created_at?: string
          id?: string
          menu_key?: string
          menu_path?: string | null
          updated_at?: string
          visible_to?: Database["public"]["Enums"]["user_type"][]
        }
        Relationships: []
      }
      nd_age_group: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      nd_asset: {
        Row: {
          asset_group: string | null
          asset_mobility: string | null
          brand_id: number | null
          created_at: string | null
          created_by: string | null
          date_expired: string | null
          date_install: string | null
          date_waranty_supplier: string | null
          date_waranty_tp: string | null
          id: number
          is_active: boolean | null
          location_id: number | null
          name: string | null
          qty_unit: number | null
          remark: string | null
          serial_number: string | null
          site_id: number | null
          subtype_id: number | null
          type_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_group?: string | null
          asset_mobility?: string | null
          brand_id?: number | null
          created_at?: string | null
          created_by?: string | null
          date_expired?: string | null
          date_install?: string | null
          date_waranty_supplier?: string | null
          date_waranty_tp?: string | null
          id: number
          is_active?: boolean | null
          location_id?: number | null
          name?: string | null
          qty_unit?: number | null
          remark?: string | null
          serial_number?: string | null
          site_id?: number | null
          subtype_id?: number | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_group?: string | null
          asset_mobility?: string | null
          brand_id?: number | null
          created_at?: string | null
          created_by?: string | null
          date_expired?: string | null
          date_install?: string | null
          date_waranty_supplier?: string | null
          date_waranty_tp?: string | null
          id?: number
          is_active?: boolean | null
          location_id?: number | null
          name?: string | null
          qty_unit?: number | null
          remark?: string | null
          serial_number?: string | null
          site_id?: number | null
          subtype_id?: number | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_asset_attachment: {
        Row: {
          asset_id: number | null
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_id?: number | null
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_id?: number | null
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_asset_categories: {
        Row: {
          id: number
          name: string | null
          remark: string
        }
        Insert: {
          id?: number
          name?: string | null
          remark: string
        }
        Update: {
          id?: number
          name?: string | null
          remark?: string
        }
        Relationships: []
      }
      nd_asset_subtype: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          type_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          name?: string | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_asset_type: {
        Row: {
          category_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_id: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id: number
          name?: string | null
          updated_at?: string | null
          updated_id?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_id?: string | null
        }
        Relationships: []
      }
      nd_bandwidth: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      nd_bank_list: {
        Row: {
          bank_code: string | null
          bank_name: string | null
          id: number
        }
        Insert: {
          bank_code?: string | null
          bank_name?: string | null
          id?: number
        }
        Update: {
          bank_code?: string | null
          bank_name?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_booking: {
        Row: {
          asset_id: number | null
          booking_end: string | null
          booking_start: string | null
          created_at: string | null
          created_by: string | null
          id: number
          requester_id: string | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_id?: number | null
          booking_end?: string | null
          booking_start?: string | null
          created_at?: string | null
          created_by?: string | null
          id: number
          requester_id?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_id?: number | null
          booking_end?: string | null
          booking_start?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          requester_id?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_brand: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      nd_building_level: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id: number
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_building_type: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_candidate: {
        Row: {
          email: string | null
          fullname: string | null
          id: number
          mobile_no: string | null
          recuitment_id: number | null
          resume_path: string | null
        }
        Insert: {
          email?: string | null
          fullname?: string | null
          id: number
          mobile_no?: string | null
          recuitment_id?: number | null
          resume_path?: string | null
        }
        Update: {
          email?: string | null
          fullname?: string | null
          id?: number
          mobile_no?: string | null
          recuitment_id?: number | null
          resume_path?: string | null
        }
        Relationships: []
      }
      nd_carry_forward_setting: {
        Row: {
          allow_carry_forward: boolean | null
          expiry_month: number | null
          id: number
          last_updated: string | null
          max_carry_days: number | null
        }
        Insert: {
          allow_carry_forward?: boolean | null
          expiry_month?: number | null
          id: number
          last_updated?: string | null
          max_carry_days?: number | null
        }
        Update: {
          allow_carry_forward?: boolean | null
          expiry_month?: number | null
          id?: number
          last_updated?: string | null
          max_carry_days?: number | null
        }
        Relationships: []
      }
      nd_category_area: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      nd_category_service: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id: number
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_claim_application: {
        Row: {
          claim_status: boolean | null
          created_at: string | null
          created_by: string | null
          date_paid: string | null
          id: number
          month: number | null
          payment_status: boolean | null
          phase_id: number | null
          quarter: number | null
          ref_no: string | null
          refid_mcmc: number | null
          tp_dusp_id: number | null
          updated_at: string | null
          updated_by: string | null
          year: number | null
        }
        Insert: {
          claim_status?: boolean | null
          created_at?: string | null
          created_by?: string | null
          date_paid?: string | null
          id: number
          month?: number | null
          payment_status?: boolean | null
          phase_id?: number | null
          quarter?: number | null
          ref_no?: string | null
          refid_mcmc?: number | null
          tp_dusp_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          year?: number | null
        }
        Update: {
          claim_status?: boolean | null
          created_at?: string | null
          created_by?: string | null
          date_paid?: string | null
          id?: number
          month?: number | null
          payment_status?: boolean | null
          phase_id?: number | null
          quarter?: number | null
          ref_no?: string | null
          refid_mcmc?: number | null
          tp_dusp_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          year?: number | null
        }
        Relationships: []
      }
      nd_claim_attachment: {
        Row: {
          claim_type_id: number | null
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          request_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          claim_type_id?: number | null
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id: number
          request_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          claim_type_id?: number | null
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          request_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_claim_categories: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_claim_items: {
        Row: {
          category_id: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_claim_location: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean | null
          remark: string | null
          request_id: number | null
          site_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          is_active?: boolean | null
          remark?: string | null
          request_id?: number | null
          site_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          remark?: string | null
          request_id?: number | null
          site_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_claim_log: {
        Row: {
          claim_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          remark: string | null
          status_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          claim_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id: number
          remark?: string | null
          status_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          claim_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          remark?: string | null
          status_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_claim_request: {
        Row: {
          application_id: number | null
          category_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          item_id: number | null
          remark: string | null
          status_item: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          application_id?: number | null
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id: number
          item_id?: number | null
          remark?: string | null
          status_item?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          application_id?: number | null
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          item_id?: number | null
          remark?: string | null
          status_item?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_claim_status: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_claim_type: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_closure_affect_areas: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id: number
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_closure_categories: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id: number
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_closure_status: {
        Row: {
          id: number
          name: string | null
          remark: string | null
        }
        Insert: {
          id: number
          name?: string | null
          remark?: string | null
        }
        Update: {
          id?: number
          name?: string | null
          remark?: string | null
        }
        Relationships: []
      }
      nd_closure_subcategories: {
        Row: {
          bm: string | null
          category_id: number | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          category_id?: number | null
          eng?: string | null
          id: number
        }
        Update: {
          bm?: string | null
          category_id?: number | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_comment_votes: {
        Row: {
          comment_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          member_id: number | null
          updated_at: string | null
          updated_by: string | null
          vote_date: string | null
          vote_type: number | null
        }
        Insert: {
          comment_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id: number
          member_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          vote_date?: string | null
          vote_type?: number | null
        }
        Update: {
          comment_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          member_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          vote_date?: string | null
          vote_type?: number | null
        }
        Relationships: []
      }
      nd_community_post: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string | null
          id: number
          image_url: string | null
          member_id: number | null
          post_date: string | null
          status: string | null
          title: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id: number
          image_url?: string | null
          member_id?: number | null
          post_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          image_url?: string | null
          member_id?: number | null
          post_date?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_contract_type: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      nd_district: {
        Row: {
          code: number | null
          id: number
          name: string | null
          state_id: number
        }
        Insert: {
          code?: number | null
          id?: never
          name?: string | null
          state_id: number
        }
        Update: {
          code?: number | null
          id?: never
          name?: string | null
          state_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "nd_district_nd_state_fk"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "nd_state"
            referencedColumns: ["id"]
          },
        ]
      }
      nd_duns: {
        Row: {
          created_at: string | null
          created_by: string | null
          full_name: string | null
          id: number
          is_active: boolean | null
          name: string | null
          no_of_duns: number | null
          refid: string | null
          rfid_parliament: string | null
          states_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          full_name?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          no_of_duns?: number | null
          refid?: string | null
          rfid_parliament?: string | null
          states_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          full_name?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          no_of_duns?: number | null
          refid?: string | null
          rfid_parliament?: string | null
          states_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nd_duns_nd_state_fk"
            columns: ["states_id"]
            isOneToOne: false
            referencedRelation: "nd_state"
            referencedColumns: ["id"]
          },
        ]
      }
      nd_dusp: {
        Row: {
          code: string | null
          created_at: string | null
          created_by: string | null
          id: number
          logo: string | null
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          id: number
          logo?: string | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          logo?: string | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_dusp_profile: {
        Row: {
          created_at: string
          created_by: string | null
          dob: string | null
          dusp_id: number | null
          fullname: string | null
          ic_no: string | null
          id: number
          is_active: boolean | null
          join_date: string | null
          mobile_no: string | null
          position_id: number | null
          resign_date: string | null
          site_id: number | null
          updated_at: string
          updated_by: string | null
          user_id: number | null
          work_email: string | null
        }
        Insert: {
          created_at: string
          created_by?: string | null
          dob?: string | null
          dusp_id?: number | null
          fullname?: string | null
          ic_no?: string | null
          id: number
          is_active?: boolean | null
          join_date?: string | null
          mobile_no?: string | null
          position_id?: number | null
          resign_date?: string | null
          site_id?: number | null
          updated_at: string
          updated_by?: string | null
          user_id?: number | null
          work_email?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dob?: string | null
          dusp_id?: number | null
          fullname?: string | null
          ic_no?: string | null
          id?: number
          is_active?: boolean | null
          join_date?: string | null
          mobile_no?: string | null
          position_id?: number | null
          resign_date?: string | null
          site_id?: number | null
          updated_at?: string
          updated_by?: string | null
          user_id?: number | null
          work_email?: string | null
        }
        Relationships: []
      }
      nd_education: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: never
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: never
        }
        Relationships: []
      }
      nd_ethnics: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_event: {
        Row: {
          category_id: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration: number | null
          end_datetime: string | null
          id: number
          location_event: string | null
          module_id: number | null
          program_id: number | null
          program_method: number | null
          program_mode: number | null
          program_name: string | null
          requester_id: string | null
          site_id: number | null
          start_datetime: string | null
          status_id: number | null
          subcategory_id: number | null
          target_participant: number | null
          total_participant: number | null
          trainer_organization: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: number | null
          end_datetime?: string | null
          id?: number
          location_event?: string | null
          module_id?: number | null
          program_id?: number | null
          program_method?: number | null
          program_mode?: number | null
          program_name?: string | null
          requester_id?: string | null
          site_id?: number | null
          start_datetime?: string | null
          status_id?: number | null
          subcategory_id?: number | null
          target_participant?: number | null
          total_participant?: number | null
          trainer_organization?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration?: number | null
          end_datetime?: string | null
          id?: number
          location_event?: string | null
          module_id?: number | null
          program_id?: number | null
          program_method?: number | null
          program_mode?: number | null
          program_name?: string | null
          requester_id?: string | null
          site_id?: number | null
          start_datetime?: string | null
          status_id?: number | null
          subcategory_id?: number | null
          target_participant?: number | null
          total_participant?: number | null
          trainer_organization?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_event_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          event_id: number | null
          file_path: string | null
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          event_id?: number | null
          file_path?: string | null
          id: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          event_id?: number | null
          file_path?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_event_category: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_event_guest: {
        Row: {
          created_at: string | null
          created_by: string | null
          event_id: number | null
          id: number
          name: string | null
          organization: string | null
          position: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          event_id?: number | null
          id: number
          name?: string | null
          organization?: string | null
          position?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          event_id?: number | null
          id?: number
          name?: string | null
          organization?: string | null
          position?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_event_log: {
        Row: {
          created_at: string | null
          created_by: string | null
          event_id: number | null
          id: number
          remark: string | null
          status_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          event_id?: number | null
          id: number
          remark?: string | null
          status_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          event_id?: number | null
          id?: number
          remark?: string | null
          status_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_event_module: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string | null
          program_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          is_active?: boolean | null
          name?: string | null
          program_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          program_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_event_participant: {
        Row: {
          acceptance: boolean | null
          attendance: boolean | null
          created_at: string | null
          created_by: string | null
          event_id: number | null
          id: number
          member_id: number | null
          updated_at: string | null
          updated_by: string | null
          verified_by: string | null
        }
        Insert: {
          acceptance?: boolean | null
          attendance?: boolean | null
          created_at?: string | null
          created_by?: string | null
          event_id?: number | null
          id: number
          member_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          verified_by?: string | null
        }
        Update: {
          acceptance?: boolean | null
          attendance?: boolean | null
          created_at?: string | null
          created_by?: string | null
          event_id?: number | null
          id?: number
          member_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          verified_by?: string | null
        }
        Relationships: []
      }
      nd_event_program: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string | null
          subcategory_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          is_active?: boolean | null
          name?: string | null
          subcategory_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          subcategory_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_event_status: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_event_subcategory: {
        Row: {
          category_id: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          is_active: boolean | null
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_event_success_story: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          event_id: number | null
          id: number
          member_id: number | null
          remark: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_id?: number | null
          id: number
          member_id?: number | null
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          event_id?: number | null
          id?: number
          member_id?: number | null
          remark?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_genders: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: never
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: never
        }
        Relationships: []
      }
      nd_group: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          group_name: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          group_name?: string | null
          id: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          group_name?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_group_role_permission: {
        Row: {
          created_at: string
          group_id: number | null
          id: number
          permission_id: number | null
          role_id: number | null
          updated_at: string
        }
        Insert: {
          created_at: string
          group_id?: number | null
          id: number
          permission_id?: number | null
          role_id?: number | null
          updated_at: string
        }
        Update: {
          created_at?: string
          group_id?: number | null
          id?: number
          permission_id?: number | null
          role_id?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      nd_ict_knowledge: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_incident_type: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_income_levels: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_insurance_coverage_type: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_insurance_report: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          insurance_type_id: number | null
          report_detail: string | null
          site_remark_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          insurance_type_id?: number | null
          report_detail?: string | null
          site_remark_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          insurance_type_id?: number | null
          report_detail?: string | null
          site_remark_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_interview_panel: {
        Row: {
          id: number
          recuitment_id: number | null
          staff_id: number | null
        }
        Insert: {
          id: number
          recuitment_id?: number | null
          staff_id?: number | null
        }
        Update: {
          id?: number
          recuitment_id?: number | null
          staff_id?: number | null
        }
        Relationships: []
      }
      nd_inventory: {
        Row: {
          barcode: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          name: string | null
          price: number | null
          quantity: number | null
          type_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          barcode?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          name?: string | null
          price?: number | null
          quantity?: number | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          barcode?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          name?: string | null
          price?: number | null
          quantity?: number | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_inventory_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          inventory_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id: number
          inventory_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          inventory_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_inventory_type: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_iot_data: {
        Row: {
          area_id: number | null
          converted_timestamp: string | null
          created_at: string | null
          current_indicator_level: string | null
          current_reading: string | null
          data: string | null
          deleted_at: string | null
          id: number
          rain_gauge_time: string | null
          sensor_id: number | null
          updated_at: string | null
        }
        Insert: {
          area_id?: number | null
          converted_timestamp?: string | null
          created_at?: string | null
          current_indicator_level?: string | null
          current_reading?: string | null
          data?: string | null
          deleted_at?: string | null
          id: number
          rain_gauge_time?: string | null
          sensor_id?: number | null
          updated_at?: string | null
        }
        Update: {
          area_id?: number | null
          converted_timestamp?: string | null
          created_at?: string | null
          current_indicator_level?: string | null
          current_reading?: string | null
          data?: string | null
          deleted_at?: string | null
          id?: number
          rain_gauge_time?: string | null
          sensor_id?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nd_iot_sensor: {
        Row: {
          area_id: number | null
          created_at: string | null
          deleted_at: string | null
          device_id: string | null
          device_token: string | null
          id: number
          idwasp: string | null
          indicator: string | null
          latitude: string | null
          led: string | null
          longtitude: string | null
          name: string | null
          sensor_types_id: number | null
          siren: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          area_id?: number | null
          created_at?: string | null
          deleted_at?: string | null
          device_id?: string | null
          device_token?: string | null
          id: number
          idwasp?: string | null
          indicator?: string | null
          latitude?: string | null
          led?: string | null
          longtitude?: string | null
          name?: string | null
          sensor_types_id?: number | null
          siren?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          area_id?: number | null
          created_at?: string | null
          deleted_at?: string | null
          device_id?: string | null
          device_token?: string | null
          id?: number
          idwasp?: string | null
          indicator?: string | null
          latitude?: string | null
          led?: string | null
          longtitude?: string | null
          name?: string | null
          sensor_types_id?: number | null
          siren?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nd_kpi_audit_score: {
        Row: {
          audit_date: string | null
          id: number
          kpi_id: number | null
          score: number | null
          site_id: number | null
          user_id: string | null
        }
        Insert: {
          audit_date?: string | null
          id: number
          kpi_id?: number | null
          score?: number | null
          site_id?: number | null
          user_id?: string | null
        }
        Update: {
          audit_date?: string | null
          id?: number
          kpi_id?: number | null
          score?: number | null
          site_id?: number | null
          user_id?: string | null
        }
        Relationships: []
      }
      nd_kpi_categories: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      nd_kpi_criteria: {
        Row: {
          description: string | null
          id: number
          kpi_id: number | null
          max_score: number | null
          min_score: number | null
        }
        Insert: {
          description?: string | null
          id: number
          kpi_id?: number | null
          max_score?: number | null
          min_score?: number | null
        }
        Update: {
          description?: string | null
          id?: number
          kpi_id?: number | null
          max_score?: number | null
          min_score?: number | null
        }
        Relationships: []
      }
      nd_leave_add: {
        Row: {
          action_by: string | null
          action_date: string | null
          bypass: number | null
          contract_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          leave_type_id: number | null
          reason: string | null
          site_id: number | null
          staff_id: number | null
          status: number | null
          total: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          action_by?: string | null
          action_date?: string | null
          bypass?: number | null
          contract_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id: number
          leave_type_id?: number | null
          reason?: string | null
          site_id?: number | null
          staff_id?: number | null
          status?: number | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          action_by?: string | null
          action_date?: string | null
          bypass?: number | null
          contract_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          leave_type_id?: number | null
          reason?: string | null
          site_id?: number | null
          staff_id?: number | null
          status?: number | null
          total?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_leave_add_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          leave_add_id: number | null
          staff_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id: number
          leave_add_id?: number | null
          staff_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          leave_add_id?: number | null
          staff_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_leave_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          leave_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id: number
          leave_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          leave_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_leave_balance: {
        Row: {
          id: number
          leave_remainng: number | null
          leave_token: number | null
          staff_id: number | null
          total_leave_day: number | null
          year: number | null
        }
        Insert: {
          id: number
          leave_remainng?: number | null
          leave_token?: number | null
          staff_id?: number | null
          total_leave_day?: number | null
          year?: number | null
        }
        Update: {
          id?: number
          leave_remainng?: number | null
          leave_token?: number | null
          staff_id?: number | null
          total_leave_day?: number | null
          year?: number | null
        }
        Relationships: []
      }
      nd_leave_carry_forward: {
        Row: {
          carrieed_days: number | null
          expiry_date: string | null
          id: number
          leave_type_id: number | null
          processed_date: string | null
          staff_id: number | null
        }
        Insert: {
          carrieed_days?: number | null
          expiry_date?: string | null
          id: number
          leave_type_id?: number | null
          processed_date?: string | null
          staff_id?: number | null
        }
        Update: {
          carrieed_days?: number | null
          expiry_date?: string | null
          id?: number
          leave_type_id?: number | null
          processed_date?: string | null
          staff_id?: number | null
        }
        Relationships: []
      }
      nd_leave_entitlement: {
        Row: {
          annual_leave_day: number | null
          contract_type_id: number | null
          id: number
          pro_rate_formula: string | null
        }
        Insert: {
          annual_leave_day?: number | null
          contract_type_id?: number | null
          id: number
          pro_rate_formula?: string | null
        }
        Update: {
          annual_leave_day?: number | null
          contract_type_id?: number | null
          id?: number
          pro_rate_formula?: string | null
        }
        Relationships: []
      }
      nd_leave_off_group: {
        Row: {
          id: number
          name: string | null
          status: boolean
        }
        Insert: {
          id?: number
          name?: string | null
          status: boolean
        }
        Update: {
          id?: number
          name?: string | null
          status?: boolean
        }
        Relationships: []
      }
      nd_leave_off_type: {
        Row: {
          color: string | null
          created_at: string | null
          id: number
          name: string | null
          position: number | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          position?: number | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          position?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nd_leave_public_holiday: {
        Row: {
          date: string | null
          desc: string | null
          id: number
          status: number
          year: number | null
        }
        Insert: {
          date?: string | null
          desc?: string | null
          id?: number
          status: number
          year?: number | null
        }
        Update: {
          date?: string | null
          desc?: string | null
          id?: number
          status?: number
          year?: number | null
        }
        Relationships: []
      }
      nd_leave_public_holiday_state: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          public_holiday_id: number | null
          state_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          public_holiday_id?: number | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          public_holiday_id?: number | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_leave_rep_application: {
        Row: {
          active: number | null
          contract_id: number | null
          created_at: string | null
          created_by: string | null
          date_apply: string | null
          date_work: string | null
          id: number
          instructed_by: string | null
          leave_rep_id: number | null
          location: string | null
          no_day: number | null
          notes: string | null
          reason: string | null
          report_to: number | null
          site_id: number | null
          staff_id: number | null
          updated_at: string | null
          updated_by: string | null
          year_month: string | null
        }
        Insert: {
          active?: number | null
          contract_id?: number | null
          created_at?: string | null
          created_by?: string | null
          date_apply?: string | null
          date_work?: string | null
          id: number
          instructed_by?: string | null
          leave_rep_id?: number | null
          location?: string | null
          no_day?: number | null
          notes?: string | null
          reason?: string | null
          report_to?: number | null
          site_id?: number | null
          staff_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          year_month?: string | null
        }
        Update: {
          active?: number | null
          contract_id?: number | null
          created_at?: string | null
          created_by?: string | null
          date_apply?: string | null
          date_work?: string | null
          id?: number
          instructed_by?: string | null
          leave_rep_id?: number | null
          location?: string | null
          no_day?: number | null
          notes?: string | null
          reason?: string | null
          report_to?: number | null
          site_id?: number | null
          staff_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          year_month?: string | null
        }
        Relationships: []
      }
      nd_leave_rep_approval: {
        Row: {
          action_by: string | null
          date_action: string | null
          flag: number | null
          id: number
          leave_rep_id: number | null
          staff_id: number | null
          total_day: number | null
        }
        Insert: {
          action_by?: string | null
          date_action?: string | null
          flag?: number | null
          id: number
          leave_rep_id?: number | null
          staff_id?: number | null
          total_day?: number | null
        }
        Update: {
          action_by?: string | null
          date_action?: string | null
          flag?: number | null
          id?: number
          leave_rep_id?: number | null
          staff_id?: number | null
          total_day?: number | null
        }
        Relationships: []
      }
      nd_leave_rep_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          leave_rep_id: number | null
          staff_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id: number
          leave_rep_id?: number | null
          staff_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          leave_rep_id?: number | null
          staff_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_leave_rep_histories: {
        Row: {
          action_date: string | null
          action_remark: string | null
          created_at: string | null
          created_by: string | null
          flag: number | null
          id: number
          leave_rep_id: number | null
          staff_id: number | null
          status: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          action_date?: string | null
          action_remark?: string | null
          created_at?: string | null
          created_by?: string | null
          flag?: number | null
          id: number
          leave_rep_id?: number | null
          staff_id?: number | null
          status?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          action_date?: string | null
          action_remark?: string | null
          created_at?: string | null
          created_by?: string | null
          flag?: number | null
          id?: number
          leave_rep_id?: number | null
          staff_id?: number | null
          status?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_leave_request: {
        Row: {
          created_at: string | null
          created_by: string | null
          end_date: string | null
          half_day: boolean | null
          id: number
          leave_status: number | null
          leave_type: number | null
          remark: string | null
          staff_id: number | null
          start_date: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          half_day?: boolean | null
          id: number
          leave_status?: number | null
          leave_type?: number | null
          remark?: string | null
          staff_id?: number | null
          start_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          half_day?: boolean | null
          id?: number
          leave_status?: number | null
          leave_type?: number | null
          remark?: string | null
          staff_id?: number | null
          start_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_leave_status: {
        Row: {
          color: string | null
          color_code: string | null
          created_at: string | null
          desc: string | null
          id: number
          name: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          color_code?: string | null
          created_at?: string | null
          desc?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          color_code?: string | null
          created_at?: string | null
          desc?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nd_leave_type: {
        Row: {
          attachment: boolean
          code: string | null
          color_code: string | null
          created_at: string | null
          id: number
          name: string | null
          total: number | null
          updated_at: string | null
        }
        Insert: {
          attachment: boolean
          code?: string | null
          color_code?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Update: {
          attachment?: boolean
          code?: string | null
          color_code?: string | null
          created_at?: string | null
          id?: number
          name?: string | null
          total?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nd_maintenance_request: {
        Row: {
          asset_id: number | null
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          requester_by: string | null
          status: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          requester_by?: string | null
          status?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_id?: number | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          requester_by?: string | null
          status?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_marital_status: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_mcmc_lookup: {
        Row: {
          created_at: string | null
          created_by: string | null
          fullname: string | null
          id: number
          name: string | null
          site_id: number | null
          state_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          fullname?: string | null
          id: number
          name?: string | null
          site_id?: number | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          fullname?: string | null
          id?: number
          name?: string | null
          site_id?: number | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_mcmc_profile: {
        Row: {
          created_at: string
          created_by: string | null
          fullname: string | null
          ic_no: string | null
          id: number
          is_active: boolean | null
          mobile_no: string | null
          position_id: number | null
          updated_at: string
          updated_by: string | null
          user_id: number | null
          work_email: string | null
        }
        Insert: {
          created_at: string
          created_by?: string | null
          fullname?: string | null
          ic_no?: string | null
          id: number
          is_active?: boolean | null
          mobile_no?: string | null
          position_id?: number | null
          updated_at: string
          updated_by?: string | null
          user_id?: number | null
          work_email?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          fullname?: string | null
          ic_no?: string | null
          id?: number
          is_active?: boolean | null
          mobile_no?: string | null
          position_id?: number | null
          updated_at?: string
          updated_by?: string | null
          user_id?: number | null
          work_email?: string | null
        }
        Relationships: []
      }
      nd_member_address: {
        Row: {
          address1: string | null
          address2: string | null
          city: string | null
          created_at: string | null
          created_by: string | null
          district_id: number | null
          id: number
          member_id: number | null
          postcode: string | null
          state_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          district_id?: number | null
          id?: number
          member_id?: number | null
          postcode?: string | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          district_id?: number | null
          id?: number
          member_id?: number | null
          postcode?: string | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_member_health: {
        Row: {
          agree_declare: boolean | null
          allergy: string | null
          allergy_detail: string | null
          blood_sugar: number | null
          bmi: number | null
          cholestrol: number | null
          created_at: string | null
          created_by: string | null
          diastolic: number | null
          health_cond: string | null
          health_detail: string | null
          height: number | null
          id: number
          member_id: number | null
          pdpa_declare: boolean | null
          pulse: number | null
          systolic: number | null
          updated_at: string | null
          updated_by: string | null
          weight: number | null
        }
        Insert: {
          agree_declare?: boolean | null
          allergy?: string | null
          allergy_detail?: string | null
          blood_sugar?: number | null
          bmi?: number | null
          cholestrol?: number | null
          created_at?: string | null
          created_by?: string | null
          diastolic?: number | null
          health_cond?: string | null
          health_detail?: string | null
          height?: number | null
          id: number
          member_id?: number | null
          pdpa_declare?: boolean | null
          pulse?: number | null
          systolic?: number | null
          updated_at?: string | null
          updated_by?: string | null
          weight?: number | null
        }
        Update: {
          agree_declare?: boolean | null
          allergy?: string | null
          allergy_detail?: string | null
          blood_sugar?: number | null
          bmi?: number | null
          cholestrol?: number | null
          created_at?: string | null
          created_by?: string | null
          diastolic?: number | null
          health_cond?: string | null
          health_detail?: string | null
          height?: number | null
          id?: number
          member_id?: number | null
          pdpa_declare?: boolean | null
          pulse?: number | null
          systolic?: number | null
          updated_at?: string | null
          updated_by?: string | null
          weight?: number | null
        }
        Relationships: []
      }
      nd_member_profile: {
        Row: {
          age: number | null
          agree_declare: boolean | null
          community_status: boolean
          created_at: string | null
          created_by: string | null
          distance: number | null
          dob: string | null
          education_level: number | null
          email: string | null
          ethnic_id: number | null
          fullname: string | null
          gender: number
          ict_knowledge: number | null
          id: number
          identity_no: string | null
          income_range: number | null
          join_date: string | null
          mobile_no: string | null
          occupation_id: number | null
          oku_status: boolean | null
          pdpa_declare: boolean | null
          race_id: number | null
          ref_id: number
          register_method: string | null
          registration_status: boolean | null
          socio_id: number | null
          status_entrepreneur: boolean | null
          status_membership: number | null
          supervision: string | null
          type_membership: number
          type_sector: number | null
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          age?: number | null
          agree_declare?: boolean | null
          community_status: boolean
          created_at?: string | null
          created_by?: string | null
          distance?: number | null
          dob?: string | null
          education_level?: number | null
          email?: string | null
          ethnic_id?: number | null
          fullname?: string | null
          gender: number
          ict_knowledge?: number | null
          id?: number
          identity_no?: string | null
          income_range?: number | null
          join_date?: string | null
          mobile_no?: string | null
          occupation_id?: number | null
          oku_status?: boolean | null
          pdpa_declare?: boolean | null
          race_id?: number | null
          ref_id: number
          register_method?: string | null
          registration_status?: boolean | null
          socio_id?: number | null
          status_entrepreneur?: boolean | null
          status_membership?: number | null
          supervision?: string | null
          type_membership: number
          type_sector?: number | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          age?: number | null
          agree_declare?: boolean | null
          community_status?: boolean
          created_at?: string | null
          created_by?: string | null
          distance?: number | null
          dob?: string | null
          education_level?: number | null
          email?: string | null
          ethnic_id?: number | null
          fullname?: string | null
          gender?: number
          ict_knowledge?: number | null
          id?: number
          identity_no?: string | null
          income_range?: number | null
          join_date?: string | null
          mobile_no?: string | null
          occupation_id?: number | null
          oku_status?: boolean | null
          pdpa_declare?: boolean | null
          race_id?: number | null
          ref_id?: number
          register_method?: string | null
          registration_status?: boolean | null
          socio_id?: number | null
          status_entrepreneur?: boolean | null
          status_membership?: number | null
          supervision?: string | null
          type_membership?: number
          type_sector?: number | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      nd_mukims: {
        Row: {
          code: string | null
          created_at: string | null
          created_by: string | null
          district_id: number | null
          id: number
          is_active: boolean | null
          name: string | null
          states_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          district_id?: number | null
          id: number
          is_active?: boolean | null
          name?: string | null
          states_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          district_id?: number | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          states_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_nationalities: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: never
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: never
        }
        Relationships: []
      }
      nd_nms: {
        Row: {
          created_by: string | null
          date_time: string | null
          id: number
          pilm_refid: string | null
          service_provider: number | null
          throughput: number | null
          uptime: number | null
          utilization: number | null
        }
        Insert: {
          created_by?: string | null
          date_time?: string | null
          id: number
          pilm_refid?: string | null
          service_provider?: number | null
          throughput?: number | null
          uptime?: number | null
          utilization?: number | null
        }
        Update: {
          created_by?: string | null
          date_time?: string | null
          id?: number
          pilm_refid?: string | null
          service_provider?: number | null
          throughput?: number | null
          uptime?: number | null
          utilization?: number | null
        }
        Relationships: []
      }
      nd_occupation: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: never
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: never
        }
        Relationships: []
      }
      nd_parliaments: {
        Row: {
          created_at: string | null
          created_by: string | null
          fullname: string | null
          id: number
          is_active: boolean | null
          name: string | null
          refid: string | null
          state_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          fullname?: string | null
          id?: never
          is_active?: boolean | null
          name?: string | null
          refid?: string | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          fullname?: string | null
          id?: never
          is_active?: boolean | null
          name?: string | null
          refid?: string | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nd_parliaments_nd_state_fk"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "nd_state"
            referencedColumns: ["id"]
          },
        ]
      }
      nd_part_time_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          document_type: string | null
          file_path: string | null
          id: number
          part_time_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          document_type?: string | null
          file_path?: string | null
          id: number
          part_time_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          document_type?: string | null
          file_path?: string | null
          id?: number
          part_time_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_part_time_contract: {
        Row: {
          created_at: string | null
          created_by: string | null
          end_date: string | null
          id: number
          part_time_id: number | null
          start_date: string | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          id: number
          part_time_id?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          end_date?: string | null
          id?: number
          part_time_id?: number | null
          start_date?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_part_time_schedule: {
        Row: {
          created_at: string | null
          created_by: string | null
          date_work: string | null
          id: number
          part_time_id: number | null
          shift_end: string | null
          shift_start: string | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date_work?: string | null
          id: number
          part_time_id?: number | null
          shift_end?: string | null
          shift_start?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date_work?: string | null
          id?: number
          part_time_id?: number | null
          shift_end?: string | null
          shift_start?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_part_time_staff: {
        Row: {
          contract_end: string | null
          contract_start: string | null
          created_at: string | null
          created_by: string | null
          email: string | null
          ic_no: string | null
          id: number
          mobile_no: string | null
          name: string | null
          reason: string | null
          site_id: number | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          ic_no?: string | null
          id: number
          mobile_no?: string | null
          name?: string | null
          reason?: string | null
          site_id?: number | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          ic_no?: string | null
          id?: number
          mobile_no?: string | null
          name?: string | null
          reason?: string | null
          site_id?: number | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_permission: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          permission_name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          permission_name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          permission_name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_phases: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: never
          name?: string | null
        }
        Update: {
          id?: never
          name?: string | null
        }
        Relationships: []
      }
      nd_pos_service: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          pos_id: number | null
          quantity: number | null
          service_id: number | null
          total_amout: number | null
          transaction_date: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          pos_id?: number | null
          quantity?: number | null
          service_id?: number | null
          total_amout?: number | null
          transaction_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          pos_id?: number | null
          quantity?: number | null
          service_id?: number | null
          total_amout?: number | null
          transaction_date?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_pos_transaction: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          member_id: number | null
          transaction_date: string | null
          type: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          member_id?: number | null
          transaction_date?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          member_id?: number | null
          transaction_date?: string | null
          type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_pos_transaction_item: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          item_id: number | null
          price_per_unit: number | null
          quantity: number | null
          total_price: number | null
          transaction_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          item_id?: number | null
          price_per_unit?: number | null
          quantity?: number | null
          total_price?: number | null
          transaction_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          item_id?: number | null
          price_per_unit?: number | null
          quantity?: number | null
          total_price?: number | null
          transaction_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_position: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: never
          name?: string | null
        }
        Update: {
          id?: never
          name?: string | null
        }
        Relationships: []
      }
      nd_post_comment: {
        Row: {
          comment_date: string | null
          comment_text: string | null
          created_at: string | null
          created_by: string | null
          id: number
          member_id: number | null
          post_id: number | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          comment_date?: string | null
          comment_text?: string | null
          created_at?: string | null
          created_by?: string | null
          id: number
          member_id?: number | null
          post_id?: number | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          comment_date?: string | null
          comment_text?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          member_id?: number | null
          post_id?: number | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_post_report: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          member_id: number | null
          post_id: number | null
          report_reason: string | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          member_id?: number | null
          post_id?: number | null
          report_reason?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          member_id?: number | null
          post_id?: number | null
          report_reason?: string | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_post_votes: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          member_id: number | null
          post_id: number | null
          updated_at: string | null
          updated_by: string | null
          vote_date: string | null
          vote_type: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          member_id?: number | null
          post_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          vote_date?: string | null
          vote_type?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          member_id?: number | null
          post_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          vote_date?: string | null
          vote_type?: string | null
        }
        Relationships: []
      }
      nd_program_method: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean | null
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_program_mode: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean | null
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_races: {
        Row: {
          bm: string | null
          created_at: string | null
          eng: string | null
          id: number
          registered_by: string | null
          status: number | null
          updated_at: string | null
        }
        Insert: {
          bm?: string | null
          created_at?: string | null
          eng?: string | null
          id: number
          registered_by?: string | null
          status?: number | null
          updated_at?: string | null
        }
        Update: {
          bm?: string | null
          created_at?: string | null
          eng?: string | null
          id?: number
          registered_by?: string | null
          status?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nd_recruitment_appointment: {
        Row: {
          candidate_id: number | null
          hire_start_date: string | null
          id: number
          interview_date: string | null
          panel_id: number | null
          position_id: number | null
          site_id: number | null
          state_id: number | null
          status_id: number | null
        }
        Insert: {
          candidate_id?: number | null
          hire_start_date?: string | null
          id: number
          interview_date?: string | null
          panel_id?: number | null
          position_id?: number | null
          site_id?: number | null
          state_id?: number | null
          status_id?: number | null
        }
        Update: {
          candidate_id?: number | null
          hire_start_date?: string | null
          id?: number
          interview_date?: string | null
          panel_id?: number | null
          position_id?: number | null
          site_id?: number | null
          state_id?: number | null
          status_id?: number | null
        }
        Relationships: []
      }
      nd_recruitment_status: {
        Row: {
          id: number
          status_name: string | null
        }
        Insert: {
          id: number
          status_name?: string | null
        }
        Update: {
          id?: number
          status_name?: string | null
        }
        Relationships: []
      }
      nd_region: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_religion: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: never
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: never
        }
        Relationships: []
      }
      nd_roles: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: never
          name?: string | null
        }
        Update: {
          id?: never
          name?: string | null
        }
        Relationships: []
      }
      nd_sensor_type: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: number
          name: string | null
          unit: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id: number
          name?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: number
          name?: string | null
          unit?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nd_service: {
        Row: {
          category_service: number | null
          created_at: string | null
          created_by: string | null
          id: number
          service_charge: number | null
          status: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          category_service?: number | null
          created_at?: string | null
          created_by?: string | null
          id: number
          service_charge?: number | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          category_service?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          service_charge?: number | null
          status?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_service_charge: {
        Row: {
          category_id: number | null
          description: string | null
          fee: number | null
          id: number
        }
        Insert: {
          category_id?: number | null
          description?: string | null
          fee?: number | null
          id: number
        }
        Update: {
          category_id?: number | null
          description?: string | null
          fee?: number | null
          id?: number
        }
        Relationships: []
      }
      nd_service_provider: {
        Row: {
          code: string | null
          id: number
          logo: string | null
          name: string | null
        }
        Insert: {
          code?: string | null
          id?: never
          logo?: string | null
          name?: string | null
        }
        Update: {
          code?: string | null
          id?: never
          logo?: string | null
          name?: string | null
        }
        Relationships: []
      }
      nd_site: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          refid_mcmc: number | null
          refid_tp: number | null
          standard_code: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          refid_mcmc?: number | null
          refid_tp?: number | null
          standard_code?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          refid_mcmc?: number | null
          refid_tp?: number | null
          standard_code?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_site_address: {
        Row: {
          active_status: number | null
          address1: string | null
          address2: string | null
          city: string | null
          created_at: string | null
          created_by: string | null
          district_id: number | null
          id: number
          postcode: string | null
          remark: string | null
          site_id: number | null
          state_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          active_status?: number | null
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          district_id?: number | null
          id?: number
          postcode?: string | null
          remark?: string | null
          site_id?: number | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          active_status?: number | null
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          district_id?: number | null
          id?: number
          postcode?: string | null
          remark?: string | null
          site_id?: number | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "nd_site_address_site_id_fkey"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "nd_site_profile"
            referencedColumns: ["id"]
          },
        ]
      }
      nd_site_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          site_remark_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id: number
          site_remark_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          site_remark_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_site_closure: {
        Row: {
          affected_areas_id: number | null
          category_id: number | null
          close_end: string | null
          close_start: string | null
          created_at: string | null
          created_by: string | null
          duration: number | null
          id: number
          remark: string | null
          session: string | null
          site_id: number | null
          status: string | null
          subcategory_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          affected_areas_id?: number | null
          category_id?: number | null
          close_end?: string | null
          close_start?: string | null
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          id: number
          remark?: string | null
          session?: string | null
          site_id?: number | null
          status?: string | null
          subcategory_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          affected_areas_id?: number | null
          category_id?: number | null
          close_end?: string | null
          close_start?: string | null
          created_at?: string | null
          created_by?: string | null
          duration?: number | null
          id?: number
          remark?: string | null
          session?: string | null
          site_id?: number | null
          status?: string | null
          subcategory_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_site_contracts: {
        Row: {
          contract_end: string | null
          contract_start: string | null
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean | null
          remark: string | null
          site_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string | null
          created_by?: string | null
          id: number
          is_active?: boolean | null
          remark?: string | null
          site_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          remark?: string | null
          site_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_site_operation: {
        Row: {
          close_time: string | null
          created_at: string | null
          created_by: string | null
          days_of_week: string | null
          id: number
          is_closed: boolean | null
          open_time: string | null
          site_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          close_time?: string | null
          created_at?: string | null
          created_by?: string | null
          days_of_week?: string | null
          id: number
          is_closed?: boolean | null
          open_time?: string | null
          site_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          close_time?: string | null
          created_at?: string | null
          created_by?: string | null
          days_of_week?: string | null
          id?: number
          is_closed?: boolean | null
          open_time?: string | null
          site_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_site_profile: {
        Row: {
          active_status: number | null
          area_id: number | null
          bandwidth: number | null
          building_rental_id: number | null
          building_type_id: number | null
          cluster_id: number | null
          created_at: string | null
          created_by: string | null
          dun_rfid: number | null
          dusp_tp_id: number | null
          email: string | null
          fullname: string | null
          id: number
          latitude: string | null
          level_id: number | null
          longtitude: string | null
          mukim_id: number | null
          oku_friendly: boolean | null
          operate_date: string | null
          parliament_rfid: number | null
          phase_id: number | null
          ref_id: string | null
          region_id: number | null
          remark: string | null
          site_code_id: number | null
          sitename: string | null
          socioeconomic_id: number | null
          space_id: number | null
          state_id: number | null
          technology: number | null
          total_population: number | null
          updated_at: string | null
          updated_by: string | null
          ust_id: number | null
          website: string | null
          zone_id: number | null
        }
        Insert: {
          active_status?: number | null
          area_id?: number | null
          bandwidth?: number | null
          building_rental_id?: number | null
          building_type_id?: number | null
          cluster_id?: number | null
          created_at?: string | null
          created_by?: string | null
          dun_rfid?: number | null
          dusp_tp_id?: number | null
          email?: string | null
          fullname?: string | null
          id?: number
          latitude?: string | null
          level_id?: number | null
          longtitude?: string | null
          mukim_id?: number | null
          oku_friendly?: boolean | null
          operate_date?: string | null
          parliament_rfid?: number | null
          phase_id?: number | null
          ref_id?: string | null
          region_id?: number | null
          remark?: string | null
          site_code_id?: number | null
          sitename?: string | null
          socioeconomic_id?: number | null
          space_id?: number | null
          state_id?: number | null
          technology?: number | null
          total_population?: number | null
          updated_at?: string | null
          updated_by?: string | null
          ust_id?: number | null
          website?: string | null
          zone_id?: number | null
        }
        Update: {
          active_status?: number | null
          area_id?: number | null
          bandwidth?: number | null
          building_rental_id?: number | null
          building_type_id?: number | null
          cluster_id?: number | null
          created_at?: string | null
          created_by?: string | null
          dun_rfid?: number | null
          dusp_tp_id?: number | null
          email?: string | null
          fullname?: string | null
          id?: number
          latitude?: string | null
          level_id?: number | null
          longtitude?: string | null
          mukim_id?: number | null
          oku_friendly?: boolean | null
          operate_date?: string | null
          parliament_rfid?: number | null
          phase_id?: number | null
          ref_id?: string | null
          region_id?: number | null
          remark?: string | null
          site_code_id?: number | null
          sitename?: string | null
          socioeconomic_id?: number | null
          space_id?: number | null
          state_id?: number | null
          technology?: number | null
          total_population?: number | null
          updated_at?: string | null
          updated_by?: string | null
          ust_id?: number | null
          website?: string | null
          zone_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nd_site_profile_active_status_fkey"
            columns: ["active_status"]
            isOneToOne: false
            referencedRelation: "nd_site_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nd_site_profile_mukim_id_fkey"
            columns: ["mukim_id"]
            isOneToOne: false
            referencedRelation: "nd_mukims"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nd_site_profile_nd_duns_fk"
            columns: ["dun_rfid"]
            isOneToOne: false
            referencedRelation: "nd_duns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nd_site_profile_nd_site_fk"
            columns: ["site_code_id"]
            isOneToOne: false
            referencedRelation: "nd_site"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nd_site_profile_parliament_rfid_fkey"
            columns: ["parliament_rfid"]
            isOneToOne: false
            referencedRelation: "nd_parliaments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nd_site_profile_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "nd_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nd_site_profile_region_id_fkey"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "nd_region"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nd_site_profile_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "nd_state"
            referencedColumns: ["id"]
          },
        ]
      }
      nd_site_remark: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          site_id: number | null
          type_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          site_id?: number | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          site_id?: number | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_site_socioeconomic: {
        Row: {
          id: number
          site_id: number | null
          socioeconomic_id: number | null
        }
        Insert: {
          id?: never
          site_id?: number | null
          socioeconomic_id?: number | null
        }
        Update: {
          id?: never
          site_id?: number | null
          socioeconomic_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nd_site_socioeconomic_nd_site_profile_fk"
            columns: ["site_id"]
            isOneToOne: false
            referencedRelation: "nd_site_profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nd_site_socioeconomic_nd_socioeconomics_fk"
            columns: ["socioeconomic_id"]
            isOneToOne: false
            referencedRelation: "nd_socioeconomics"
            referencedColumns: ["id"]
          },
        ]
      }
      nd_site_status: {
        Row: {
          bm: string | null
          created_at: string | null
          created_by: string | null
          eng: string | null
          id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          bm?: string | null
          created_at?: string | null
          created_by?: string | null
          eng?: string | null
          id: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          bm?: string | null
          created_at?: string | null
          created_by?: string | null
          eng?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_sla_categories: {
        Row: {
          id: number
          max_day: number | null
          min_day: number | null
          name: string | null
        }
        Insert: {
          id?: number
          max_day?: number | null
          min_day?: number | null
          name?: string | null
        }
        Update: {
          id?: number
          max_day?: number | null
          min_day?: number | null
          name?: string | null
        }
        Relationships: []
      }
      nd_socioeconomics: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
          sector_id: number | null
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: never
          sector_id?: number | null
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: never
          sector_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nd_socioeconomics_nd_type_sector_fk"
            columns: ["sector_id"]
            isOneToOne: false
            referencedRelation: "nd_type_sector"
            referencedColumns: ["id"]
          },
        ]
      }
      nd_space: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_sso_profile: {
        Row: {
          created_at: string
          created_by: string | null
          fullname: string | null
          ic_no: string | null
          id: number
          is_active: boolean | null
          join_date: string | null
          mobile_no: string | null
          position_id: number | null
          resign_date: string | null
          updated_at: string
          updated_by: string | null
          user_id: number | null
          work_email: string | null
        }
        Insert: {
          created_at: string
          created_by?: string | null
          fullname?: string | null
          ic_no?: string | null
          id: number
          is_active?: boolean | null
          join_date?: string | null
          mobile_no?: string | null
          position_id?: number | null
          resign_date?: string | null
          updated_at: string
          updated_by?: string | null
          user_id?: number | null
          work_email?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          fullname?: string | null
          ic_no?: string | null
          id?: number
          is_active?: boolean | null
          join_date?: string | null
          mobile_no?: string | null
          position_id?: number | null
          resign_date?: string | null
          updated_at?: string
          updated_by?: string | null
          user_id?: number | null
          work_email?: string | null
        }
        Relationships: []
      }
      nd_staff_address: {
        Row: {
          address1: string | null
          address2: string | null
          city: string | null
          created_at: string | null
          created_by: string | null
          district_id: number | null
          id: number
          is_active: boolean | null
          postcode: string | null
          remark: string | null
          staff_id: number | null
          state_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          district_id?: number | null
          id?: number
          is_active?: boolean | null
          postcode?: string | null
          remark?: string | null
          staff_id?: number | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string | null
          district_id?: number | null
          id?: number
          is_active?: boolean | null
          postcode?: string | null
          remark?: string | null
          staff_id?: number | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_staff_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          letter_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id: number
          letter_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          letter_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_staff_attendance: {
        Row: {
          address: string | null
          attend_date: string | null
          attendance_type: number | null
          check_in: string | null
          check_out: string | null
          created_at: string | null
          created_by: string | null
          id: number
          latitude: number | null
          longtitude: number | null
          photo_path: string | null
          remark: string | null
          site_id: number | null
          staff_id: number | null
          status: boolean | null
          total_working_hour: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address?: string | null
          attend_date?: string | null
          attendance_type?: number | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          created_by?: string | null
          id: number
          latitude?: number | null
          longtitude?: number | null
          photo_path?: string | null
          remark?: string | null
          site_id?: number | null
          staff_id?: number | null
          status?: boolean | null
          total_working_hour?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address?: string | null
          attend_date?: string | null
          attendance_type?: number | null
          check_in?: string | null
          check_out?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          latitude?: number | null
          longtitude?: number | null
          photo_path?: string | null
          remark?: string | null
          site_id?: number | null
          staff_id?: number | null
          status?: boolean | null
          total_working_hour?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_staff_contact: {
        Row: {
          created_at: string | null
          created_by: string | null
          full_name: string | null
          ic_no: string | null
          id: number
          mobile_no: string | null
          relationship_id: number | null
          total_children: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          full_name?: string | null
          ic_no?: string | null
          id: number
          mobile_no?: string | null
          relationship_id?: number | null
          total_children?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          full_name?: string | null
          ic_no?: string | null
          id?: number
          mobile_no?: string | null
          relationship_id?: number | null
          total_children?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_staff_contract: {
        Row: {
          contract_end: string | null
          contract_start: string | null
          contract_type: number | null
          created_at: string | null
          created_by: string | null
          duration: string | null
          id: number
          is_active: boolean | null
          phase_id: number | null
          remark: string | null
          site_id: number | null
          staff_id: number | null
          updated_at: string | null
          updated_by: string | null
          user_id: string | null
        }
        Insert: {
          contract_end?: string | null
          contract_start?: string | null
          contract_type?: number | null
          created_at?: string | null
          created_by?: string | null
          duration?: string | null
          id?: number
          is_active?: boolean | null
          phase_id?: number | null
          remark?: string | null
          site_id?: number | null
          staff_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Update: {
          contract_end?: string | null
          contract_start?: string | null
          contract_type?: number | null
          created_at?: string | null
          created_by?: string | null
          duration?: string | null
          id?: number
          is_active?: boolean | null
          phase_id?: number | null
          remark?: string | null
          site_id?: number | null
          staff_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      nd_staff_job: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean | null
          join_date: string | null
          position_id: number | null
          resign_date: string | null
          site_id: number | null
          staff_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          join_date?: string | null
          position_id?: number | null
          resign_date?: string | null
          site_id?: number | null
          staff_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          join_date?: string | null
          position_id?: number | null
          resign_date?: string | null
          site_id?: number | null
          staff_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_staff_leave: {
        Row: {
          created_at: string | null
          date: string | null
          id: number
          leave_type_id: number | null
          staff_id: number | null
          status: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id: number
          leave_type_id?: number | null
          staff_id?: number | null
          status?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: number
          leave_type_id?: number | null
          staff_id?: number | null
          status?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      nd_staff_letter: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          letter_date: string | null
          letter_type: string | null
          notes: string | null
          notify_email: boolean | null
          reminder_no: number | null
          staff_id: number
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          letter_date?: string | null
          letter_type?: string | null
          notes?: string | null
          notify_email?: boolean | null
          reminder_no?: number | null
          staff_id: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          letter_date?: string | null
          letter_type?: string | null
          notes?: string | null
          notify_email?: boolean | null
          reminder_no?: number | null
          staff_id?: number
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_staff_pay_info: {
        Row: {
          bank_acc_no: string | null
          bank_id: number | null
          basic_pay: number | null
          created_at: string | null
          created_by: string | null
          epf_no: string | null
          id: number
          socso_no: string | null
          tax_no: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          bank_acc_no?: string | null
          bank_id?: number | null
          basic_pay?: number | null
          created_at?: string | null
          created_by?: string | null
          epf_no?: string | null
          id?: number
          socso_no?: string | null
          tax_no?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          bank_acc_no?: string | null
          bank_id?: number | null
          basic_pay?: number | null
          created_at?: string | null
          created_by?: string | null
          epf_no?: string | null
          id?: number
          socso_no?: string | null
          tax_no?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_staff_payroll: {
        Row: {
          basic_pay: number | null
          basic_rate: number | null
          created_at: string | null
          created_by: string
          epf_deduction: number | null
          gross_pay: number | null
          ic_no: string | null
          id: number
          net_pay: number | null
          pay_info_id: number | null
          payroll_date: string | null
          staff_eis: number | null
          staff_epf: number | null
          staff_id: number | null
          staff_socso: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          basic_pay?: number | null
          basic_rate?: number | null
          created_at?: string | null
          created_by: string
          epf_deduction?: number | null
          gross_pay?: number | null
          ic_no?: string | null
          id: number
          net_pay?: number | null
          pay_info_id?: number | null
          payroll_date?: string | null
          staff_eis?: number | null
          staff_epf?: number | null
          staff_id?: number | null
          staff_socso?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          basic_pay?: number | null
          basic_rate?: number | null
          created_at?: string | null
          created_by?: string
          epf_deduction?: number | null
          gross_pay?: number | null
          ic_no?: string | null
          id?: number
          net_pay?: number | null
          pay_info_id?: number | null
          payroll_date?: string | null
          staff_eis?: number | null
          staff_epf?: number | null
          staff_id?: number | null
          staff_socso?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_staff_photo: {
        Row: {
          created_at: string
          ext: string | null
          id: number
          is_active: boolean | null
          photo: string | null
          photo_thumb: string | null
          size: string | null
          staff_id: number | null
          updated_at: string
          user_id: number | null
        }
        Insert: {
          created_at: string
          ext?: string | null
          id: number
          is_active?: boolean | null
          photo?: string | null
          photo_thumb?: string | null
          size?: string | null
          staff_id?: number | null
          updated_at: string
          user_id?: number | null
        }
        Update: {
          created_at?: string
          ext?: string | null
          id?: number
          is_active?: boolean | null
          photo?: string | null
          photo_thumb?: string | null
          size?: string | null
          staff_id?: number | null
          updated_at?: string
          user_id?: number | null
        }
        Relationships: []
      }
      nd_staff_profile: {
        Row: {
          created_at: string | null
          created_by: string | null
          dob: string | null
          fullname: string | null
          gender_id: number | null
          ic_no: string | null
          id: number
          is_active: boolean | null
          job_id: number | null
          marital_status: number | null
          mobile_no: string | null
          nationality_id: number | null
          personal_email: string | null
          place_of_birth: string | null
          position_id: number | null
          prev_officer_id: number | null
          qualification: string | null
          race_id: number | null
          religion_id: number | null
          staff_mcmc_id: string | null
          staff_pay_id: number | null
          staff_tp_id: string | null
          status: number | null
          updated_at: string | null
          updated_by: string | null
          work_email: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          dob?: string | null
          fullname?: string | null
          gender_id?: number | null
          ic_no?: string | null
          id?: number
          is_active?: boolean | null
          job_id?: number | null
          marital_status?: number | null
          mobile_no?: string | null
          nationality_id?: number | null
          personal_email?: string | null
          place_of_birth?: string | null
          position_id?: number | null
          prev_officer_id?: number | null
          qualification?: string | null
          race_id?: number | null
          religion_id?: number | null
          staff_mcmc_id?: string | null
          staff_pay_id?: number | null
          staff_tp_id?: string | null
          status?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_email?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          dob?: string | null
          fullname?: string | null
          gender_id?: number | null
          ic_no?: string | null
          id?: number
          is_active?: boolean | null
          job_id?: number | null
          marital_status?: number | null
          mobile_no?: string | null
          nationality_id?: number | null
          personal_email?: string | null
          place_of_birth?: string | null
          position_id?: number | null
          prev_officer_id?: number | null
          qualification?: string | null
          race_id?: number | null
          religion_id?: number | null
          staff_mcmc_id?: string | null
          staff_pay_id?: number | null
          staff_tp_id?: string | null
          status?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_email?: string | null
        }
        Relationships: []
      }
      nd_staff_taining_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          staff_training_id: number | null
          type: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id: number
          staff_training_id?: number | null
          type?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          staff_training_id?: number | null
          type?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_staff_training: {
        Row: {
          acceptance: boolean | null
          attendance: boolean | null
          created_at: string | null
          created_by: string | null
          id: number
          staff_id: number | null
          training_id: number | null
          updated_at: string | null
          updated_by: string | null
          verified_tp: string | null
        }
        Insert: {
          acceptance?: boolean | null
          attendance?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id: number
          staff_id?: number | null
          training_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          verified_tp?: string | null
        }
        Update: {
          acceptance?: boolean | null
          attendance?: boolean | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          staff_id?: number | null
          training_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          verified_tp?: string | null
        }
        Relationships: []
      }
      nd_staff_training_cert: {
        Row: {
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          staff_training_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id: number
          staff_training_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          staff_training_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_state: {
        Row: {
          abbr: string | null
          code: string | null
          id: number
          name: string | null
          region_id: number | null
        }
        Insert: {
          abbr?: string | null
          code?: string | null
          id?: never
          name?: string | null
          region_id?: number | null
        }
        Update: {
          abbr?: string | null
          code?: string | null
          id?: never
          name?: string | null
          region_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nd_state_nd_region_fk"
            columns: ["region_id"]
            isOneToOne: false
            referencedRelation: "nd_region"
            referencedColumns: ["id"]
          },
        ]
      }
      nd_target_participant: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          is_active: boolean | null
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          is_active?: boolean | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_task: {
        Row: {
          asset_id: number | null
          created_at: string | null
          created_by: string
          detail: string | null
          id: number
          registration_number: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          asset_id?: number | null
          created_at?: string | null
          created_by: string
          detail?: string | null
          id: number
          registration_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          asset_id?: number | null
          created_at?: string | null
          created_by?: string
          detail?: string | null
          id?: number
          registration_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_team_area: {
        Row: {
          area_name: string | null
          created_at: string | null
          created_by: string
          id: number
          state_id: number | null
          team_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          area_name?: string | null
          created_at?: string | null
          created_by: string
          id: number
          state_id?: number | null
          team_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          area_name?: string | null
          created_at?: string | null
          created_by?: string
          id?: number
          state_id?: number | null
          team_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_tech_partner: {
        Row: {
          code: string | null
          created_at: string | null
          created_by: string | null
          id: number
          logo: string | null
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: never
          logo?: string | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          code?: string | null
          created_at?: string | null
          created_by?: string | null
          id?: never
          logo?: string | null
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_tech_partner_dusp: {
        Row: {
          created_at: string | null
          created_by: string | null
          dusp_id: number | null
          id: number
          tp_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          dusp_id?: number | null
          id: number
          tp_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          dusp_id?: number | null
          id?: number
          tp_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_tech_partner_profile: {
        Row: {
          created_at: string
          created_by: string | null
          dob: string | null
          fullname: string | null
          ic_no: string | null
          id: number
          is_active: boolean | null
          join_date: string | null
          marital_status: number | null
          mobile_no: string | null
          nationality: string | null
          personal_email: string | null
          place_of_birth: string | null
          position_id: number | null
          qualification: string | null
          race: string | null
          religion: string | null
          resign_date: string | null
          site_id: number | null
          tech_partner_id: number | null
          updated_at: string
          updated_by: string | null
          user_id: number | null
          work_email: string | null
        }
        Insert: {
          created_at: string
          created_by?: string | null
          dob?: string | null
          fullname?: string | null
          ic_no?: string | null
          id: number
          is_active?: boolean | null
          join_date?: string | null
          marital_status?: number | null
          mobile_no?: string | null
          nationality?: string | null
          personal_email?: string | null
          place_of_birth?: string | null
          position_id?: number | null
          qualification?: string | null
          race?: string | null
          religion?: string | null
          resign_date?: string | null
          site_id?: number | null
          tech_partner_id?: number | null
          updated_at: string
          updated_by?: string | null
          user_id?: number | null
          work_email?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          dob?: string | null
          fullname?: string | null
          ic_no?: string | null
          id?: number
          is_active?: boolean | null
          join_date?: string | null
          marital_status?: number | null
          mobile_no?: string | null
          nationality?: string | null
          personal_email?: string | null
          place_of_birth?: string | null
          position_id?: number | null
          qualification?: string | null
          race?: string | null
          religion?: string | null
          resign_date?: string | null
          site_id?: number | null
          tech_partner_id?: number | null
          updated_at?: string
          updated_by?: string | null
          user_id?: number | null
          work_email?: string | null
        }
        Relationships: []
      }
      nd_technology: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id?: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      nd_tp_lookup: {
        Row: {
          created_at: string | null
          created_by: string | null
          fullname: string | null
          id: number
          name: string | null
          refid: string | null
          state_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          fullname?: string | null
          id: number
          name?: string | null
          refid?: string | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          fullname?: string | null
          id?: number
          name?: string | null
          refid?: string | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_training: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          end_date: string | null
          id: number
          is_active: boolean | null
          location: string | null
          mode: string | null
          online_link: string | null
          start_date: string | null
          title: string | null
          trainer_name: string | null
          type: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id: number
          is_active?: boolean | null
          location?: string | null
          mode?: string | null
          online_link?: string | null
          start_date?: string | null
          title?: string | null
          trainer_name?: string | null
          type?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          id?: number
          is_active?: boolean | null
          location?: string | null
          mode?: string | null
          online_link?: string | null
          start_date?: string | null
          title?: string | null
          trainer_name?: string | null
          type?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_training_type: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_type_maintenance: {
        Row: {
          description: string | null
          id: number
          name: string | null
        }
        Insert: {
          description?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          description?: string | null
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      nd_type_relationship: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: number
        }
        Relationships: []
      }
      nd_type_sector: {
        Row: {
          bm: string | null
          eng: string | null
          id: number
        }
        Insert: {
          bm?: string | null
          eng?: string | null
          id?: never
        }
        Update: {
          bm?: string | null
          eng?: string | null
          id?: never
        }
        Relationships: []
      }
      nd_type_utilities: {
        Row: {
          created_at: string | null
          created_by: string
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_usage_log: {
        Row: {
          booking_id: number | null
          created_at: string | null
          created_by: string | null
          id: number
          login_time: string | null
          logout_time: string | null
          updated_at: string | null
          updated_by: string | null
          usage_hours: number | null
        }
        Insert: {
          booking_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id: number
          login_time?: string | null
          logout_time?: string | null
          updated_at?: string | null
          updated_by?: string | null
          usage_hours?: number | null
        }
        Update: {
          booking_id?: number | null
          created_at?: string | null
          created_by?: string | null
          id?: number
          login_time?: string | null
          logout_time?: string | null
          updated_at?: string | null
          updated_by?: string | null
          usage_hours?: number | null
        }
        Relationships: []
      }
      nd_user_group: {
        Row: {
          created_at: string
          description: string | null
          group_name: string | null
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at: string
          description?: string | null
          group_name?: string | null
          id: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          group_name?: string | null
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      nd_user_permission: {
        Row: {
          created_at: string
          descritpion: string | null
          id: number
          permission_name: string | null
          updated_at: string
        }
        Insert: {
          created_at: string
          descritpion?: string | null
          id: number
          permission_name?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          descritpion?: string | null
          id?: number
          permission_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      nd_user_profile: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string | null
          email_verified_at: string | null
          group_id: number
          id: number
          name: string | null
          password: string | null
          phone_number: string | null
          remember_token: string | null
          status: boolean | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          email_verified_at?: string | null
          group_id: number
          id: number
          name?: string | null
          password?: string | null
          phone_number?: string | null
          remember_token?: string | null
          status?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string | null
          email_verified_at?: string | null
          group_id?: number
          id?: number
          name?: string | null
          password?: string | null
          phone_number?: string | null
          remember_token?: string | null
          status?: boolean | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_user_role: {
        Row: {
          created_at: string
          description: string | null
          id: number
          role_name: string | null
          updated_at: string
        }
        Insert: {
          created_at: string
          description?: string | null
          id: number
          role_name?: string | null
          updated_at: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          role_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      nd_utilities: {
        Row: {
          amount_bill: number | null
          created_at: string | null
          created_by: string
          id: number
          month: number | null
          reference_no: string | null
          remark: string | null
          site_id: number | null
          type_id: number | null
          updated_at: string | null
          updated_by: string | null
          year: number | null
        }
        Insert: {
          amount_bill?: number | null
          created_at?: string | null
          created_by: string
          id: number
          month?: number | null
          reference_no?: string | null
          remark?: string | null
          site_id?: number | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          year?: number | null
        }
        Update: {
          amount_bill?: number | null
          created_at?: string | null
          created_by?: string
          id?: number
          month?: number | null
          reference_no?: string | null
          remark?: string | null
          site_id?: number | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          year?: number | null
        }
        Relationships: []
      }
      nd_utilities_attachment: {
        Row: {
          created_at: string | null
          created_by: string | null
          file_path: string | null
          id: number
          updated_at: string | null
          updated_by: string | null
          utilities_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id: number
          updated_at?: string | null
          updated_by?: string | null
          utilities_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          file_path?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
          utilities_id?: number | null
        }
        Relationships: []
      }
      nd_utilities_threshold: {
        Row: {
          amount: number | null
          created_at: string | null
          created_by: string
          id: number
          tech_profile_id: number | null
          type_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          created_by: string
          id: number
          tech_profile_id?: number | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          created_by?: string
          id?: number
          tech_profile_id?: number | null
          type_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_vendor_address: {
        Row: {
          address1: string | null
          address2: string | null
          city: string | null
          created_at: string | null
          created_by: string
          district_id: number | null
          id: number
          is_active: boolean | null
          postcode: string | null
          registration_number: string | null
          remark: string | null
          state_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          created_by: string
          district_id?: number | null
          id: number
          is_active?: boolean | null
          postcode?: string | null
          registration_number?: string | null
          remark?: string | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          address1?: string | null
          address2?: string | null
          city?: string | null
          created_at?: string | null
          created_by?: string
          district_id?: number | null
          id?: number
          is_active?: boolean | null
          postcode?: string | null
          registration_number?: string | null
          remark?: string | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_vendor_attachment: {
        Row: {
          created_at: string | null
          created_by: string
          file_name: string | null
          file_path: string | null
          id: number
          mime_type: string | null
          report_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          file_name?: string | null
          file_path?: string | null
          id: number
          mime_type?: string | null
          report_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          file_name?: string | null
          file_path?: string | null
          id?: number
          mime_type?: string | null
          report_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_vendor_contract: {
        Row: {
          contract_end: string | null
          contract_start: string | null
          created_at: string | null
          created_by: string
          duration: number | null
          id: number
          is_active: boolean | null
          registration_number: string | null
          updated_at: string | null
          updated_by: string | null
          user_id: number
        }
        Insert: {
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string | null
          created_by: string
          duration?: number | null
          id: number
          is_active?: boolean | null
          registration_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id: number
        }
        Update: {
          contract_end?: string | null
          contract_start?: string | null
          created_at?: string | null
          created_by?: string
          duration?: number | null
          id?: number
          is_active?: boolean | null
          registration_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
          user_id?: number
        }
        Relationships: []
      }
      nd_vendor_profile: {
        Row: {
          bank_account_number: number | null
          business_name: string | null
          business_type: string | null
          created_at: string | null
          created_by: string
          id: number
          phone_number: string | null
          registration_number: string | null
          service_detail: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          bank_account_number?: number | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          created_by: string
          id: number
          phone_number?: string | null
          registration_number?: string | null
          service_detail?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          bank_account_number?: number | null
          business_name?: string | null
          business_type?: string | null
          created_at?: string | null
          created_by?: string
          id?: number
          phone_number?: string | null
          registration_number?: string | null
          service_detail?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_vendor_report: {
        Row: {
          created_at: string | null
          created_by: string
          id: number
          notes: string | null
          notify_email: string | null
          registration_number: string | null
          report_date: string | null
          report_type: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id: number
          notes?: string | null
          notify_email?: string | null
          registration_number?: string | null
          report_date?: string | null
          report_type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: number
          notes?: string | null
          notify_email?: string | null
          registration_number?: string | null
          report_date?: string | null
          report_type?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_vendor_staff: {
        Row: {
          created_at: string | null
          created_by: string | null
          fullname: string | null
          ic_no: number | null
          id: number
          is_active: boolean | null
          mobile_no: number | null
          position_id: number | null
          registration_number: number | null
          updated_at: string | null
          updated_by: string | null
          work_email: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          fullname?: string | null
          ic_no?: number | null
          id: number
          is_active?: boolean | null
          mobile_no?: number | null
          position_id?: number | null
          registration_number?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_email?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          fullname?: string | null
          ic_no?: number | null
          id?: number
          is_active?: boolean | null
          mobile_no?: number | null
          position_id?: number | null
          registration_number?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_email?: string | null
        }
        Relationships: []
      }
      nd_vendor_staff_team: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: number
          updated_at: string | null
          updated_by: string | null
          vendor_staff_id: number | null
          vendor_team_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id: number
          updated_at?: string | null
          updated_by?: string | null
          vendor_staff_id?: number | null
          vendor_team_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: number
          updated_at?: string | null
          updated_by?: string | null
          vendor_staff_id?: number | null
          vendor_team_id?: number | null
        }
        Relationships: []
      }
      nd_vendor_state: {
        Row: {
          created_at: string | null
          created_by: string
          id: number
          registration_number: string | null
          state_id: number | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id: number
          registration_number?: string | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: number
          registration_number?: string | null
          state_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_vendor_team: {
        Row: {
          created_at: string | null
          created_by: string
          id: number
          name: string | null
          registration_number: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          id: number
          name?: string | null
          registration_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          id?: number
          name?: string | null
          registration_number?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_vote_type: {
        Row: {
          id: number
          name: string | null
        }
        Insert: {
          id: number
          name?: string | null
        }
        Update: {
          id?: number
          name?: string | null
        }
        Relationships: []
      }
      nd_work_order: {
        Row: {
          created_at: string | null
          created_by: string | null
          date_complete: string | null
          date_issued: string | null
          estimated_days: number | null
          id: number
          issued_by: string | null
          request_id: number | null
          state_id: number | null
          status: number | null
          team_id: number | null
          updated_at: string | null
          updated_by: string | null
          vendor_id: number | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          date_complete?: string | null
          date_issued?: string | null
          estimated_days?: number | null
          id: number
          issued_by?: string | null
          request_id?: number | null
          state_id?: number | null
          status?: number | null
          team_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_id?: number | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          date_complete?: string | null
          date_issued?: string | null
          estimated_days?: number | null
          id?: number
          issued_by?: string | null
          request_id?: number | null
          state_id?: number | null
          status?: number | null
          team_id?: number | null
          updated_at?: string | null
          updated_by?: string | null
          vendor_id?: number | null
        }
        Relationships: []
      }
      nd_work_order_report: {
        Row: {
          attachment: string | null
          created_at: string | null
          created_by: string | null
          date_complete: string | null
          date_issued: string | null
          id: number
          report_detail: string | null
          status: number | null
          updated_at: string | null
          updated_by: string | null
          work_order_id: number | null
        }
        Insert: {
          attachment?: string | null
          created_at?: string | null
          created_by?: string | null
          date_complete?: string | null
          date_issued?: string | null
          id: number
          report_detail?: string | null
          status?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_order_id?: number | null
        }
        Update: {
          attachment?: string | null
          created_at?: string | null
          created_by?: string | null
          date_complete?: string | null
          date_issued?: string | null
          id?: number
          report_detail?: string | null
          status?: number | null
          updated_at?: string | null
          updated_by?: string | null
          work_order_id?: number | null
        }
        Relationships: []
      }
      nd_work_order_status: {
        Row: {
          created_at: string | null
          created_by: string | null
          description: string | null
          id: number
          name: string | null
          updated_at: string | null
          updated_by: string | null
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          id?: number
          name?: string | null
          updated_at?: string | null
          updated_by?: string | null
        }
        Relationships: []
      }
      nd_zone: {
        Row: {
          area: string | null
          id: number
          zone: string | null
        }
        Insert: {
          area?: string | null
          id?: number
          zone?: string | null
        }
        Update: {
          area?: string | null
          id?: number
          zone?: string | null
        }
        Relationships: []
      }
      notification_preferences: {
        Row: {
          channels: Database["public"]["Enums"]["notification_channel"][] | null
          created_at: string
          enabled: boolean | null
          id: string
          template_id: string | null
          updated_at: string
          user_id: string | null
        }
        Insert: {
          channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          template_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          created_at?: string
          enabled?: boolean | null
          id?: string
          template_id?: string | null
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "notification_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_templates: {
        Row: {
          channels: Database["public"]["Enums"]["notification_channel"][] | null
          created_at: string
          id: string
          message_template: string
          name: string
          title_template: string
          type: Database["public"]["Enums"]["notification_type"] | null
          updated_at: string
        }
        Insert: {
          channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          created_at?: string
          id?: string
          message_template: string
          name: string
          title_template: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          updated_at?: string
        }
        Update: {
          channels?:
            | Database["public"]["Enums"]["notification_channel"][]
            | null
          created_at?: string
          id?: string
          message_template?: string
          name?: string
          title_template?: string
          type?: Database["public"]["Enums"]["notification_type"] | null
          updated_at?: string
        }
        Relationships: []
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
      organization_users: {
        Row: {
          created_at: string
          id: string
          organization_id: string
          role: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          organization_id: string
          role: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organization_id?: string
          role?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organization_users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organization_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      organizations: {
        Row: {
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          parent_id: string | null
          type: Database["public"]["Enums"]["organization_type"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          parent_id?: string | null
          type: Database["public"]["Enums"]["organization_type"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          parent_id?: string | null
          type?: Database["public"]["Enums"]["organization_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "organizations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string
          description: string | null
          id: string
          module: string
          name: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          id?: string
          module: string
          name: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          id?: string
          module?: string
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          full_name: string | null
          ic_number: string | null
          id: string
          phone_number: string | null
          updated_at: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Insert: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          ic_number?: string | null
          id: string
          phone_number?: string | null
          updated_at?: string
          user_type: Database["public"]["Enums"]["user_type"]
        }
        Update: {
          created_at?: string
          email?: string | null
          full_name?: string | null
          ic_number?: string | null
          id?: string
          phone_number?: string | null
          updated_at?: string
          user_type?: Database["public"]["Enums"]["user_type"]
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
      role_permissions: {
        Row: {
          created_at: string
          permission_id: string
          role_id: string
        }
        Insert: {
          created_at?: string
          permission_id: string
          role_id: string
        }
        Update: {
          created_at?: string
          permission_id?: string
          role_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "role_permissions_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      submodule_visibility: {
        Row: {
          created_at: string
          id: string
          parent_module: string
          submodule_key: string
          submodule_path: string | null
          updated_at: string
          visible_to: Database["public"]["Enums"]["user_type"][]
        }
        Insert: {
          created_at?: string
          id?: string
          parent_module: string
          submodule_key: string
          submodule_path?: string | null
          updated_at?: string
          visible_to?: Database["public"]["Enums"]["user_type"][]
        }
        Update: {
          created_at?: string
          id?: string
          parent_module?: string
          submodule_key?: string
          submodule_path?: string | null
          updated_at?: string
          visible_to?: Database["public"]["Enums"]["user_type"][]
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
      user_roles: {
        Row: {
          created_at: string
          id: string
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          created_by: string | null
          email: string
          id: string
          phone_number: string | null
          status: string | null
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          email: string
          id: string
          phone_number?: string | null
          status?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string | null
          email?: string
          id?: string
          phone_number?: string | null
          status?: string | null
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          reference_id: string | null
          status: string | null
          type: string
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string | null
          type: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string | null
          type?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number | null
          created_at: string
          currency: string | null
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          balance?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          balance?: number | null
          created_at?: string
          currency?: string | null
          id?: string
          updated_at?: string
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
      create_notification_from_template: {
        Args: {
          p_template_id: string
          p_user_id: string
          p_params: Json
        }
        Returns: {
          created_at: string
          id: string
          message: string
          read: boolean | null
          title: string
          type: Database["public"]["Enums"]["notification_type"] | null
          user_id: string | null
        }
      }
      get_current_user_type: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_type"]
      }
      get_user_type: {
        Args: Record<PropertyKey, never>
        Returns: Database["public"]["Enums"]["user_type"]
      }
      is_current_user_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      log_audit_event: {
        Args: {
          p_action: string
          p_entity_type: string
          p_entity_id: string
          p_changes?: Json
          p_ip_address?: string
        }
        Returns: string
      }
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
      email_provider_type: "smtp" | "resend" | "sendgrid"
      invoice_status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
      notification_channel: "in_app" | "email" | "sms"
      notification_type: "info" | "warning" | "success" | "error"
      organization_type: "dusp" | "tp"
      priority_level: "low" | "medium" | "high" | "urgent"
      programme_status: "draft" | "active" | "completed" | "cancelled"
      session_event_type:
        | "login"
        | "logout"
        | "session_expired"
        | "session_refreshed"
        | "inactivity_timeout"
      session_type: "login" | "system_access" | "feature_usage" | "api_call"
      task_status:
        | "pending"
        | "in_progress"
        | "completed"
        | "blocked"
        | "cancelled"
      transaction_type: "income" | "expense" | "transfer"
      user_type:
        | "member"
        | "vendor"
        | "tp_management"
        | "sso"
        | "dusp_admin"
        | "super_admin"
        | "tp_region"
        | "tp_hr"
        | "tp_finance"
        | "tp_admin"
        | "tp_operation"
        | "mcmc_admin"
        | "mcmc_operation"
        | "mcmc_management"
        | "sso_admin"
        | "sso_pillar"
        | "sso_management"
        | "sso_operation"
        | "dusp_management"
        | "dusp_operation"
        | "staff_assistant_manager"
        | "staff_manager"
        | "vendor_admin"
        | "vendor_staff"
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
