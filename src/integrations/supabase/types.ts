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
      certificates: {
        Row: {
          activity_id: string | null
          activity_type: Database["public"]["Enums"]["activity_type"] | null
          certificate_url: string | null
          created_at: string
          id: string
          issue_date: string
          issuer: string | null
          title: string
          user_id: string
        }
        Insert: {
          activity_id?: string | null
          activity_type?: Database["public"]["Enums"]["activity_type"] | null
          certificate_url?: string | null
          created_at?: string
          id?: string
          issue_date?: string
          issuer?: string | null
          title: string
          user_id: string
        }
        Update: {
          activity_id?: string | null
          activity_type?: Database["public"]["Enums"]["activity_type"] | null
          certificate_url?: string | null
          created_at?: string
          id?: string
          issue_date?: string
          issuer?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      club_members: {
        Row: {
          club_id: string
          id: string
          joined_at: string
          role: string | null
          user_id: string
        }
        Insert: {
          club_id: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id: string
        }
        Update: {
          club_id?: string
          id?: string
          joined_at?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "club_members_club_id_fkey"
            columns: ["club_id"]
            isOneToOne: false
            referencedRelation: "clubs"
            referencedColumns: ["id"]
          },
        ]
      }
      clubs: {
        Row: {
          banner_url: string | null
          category: string | null
          college_id: string | null
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          banner_url?: string | null
          category?: string | null
          college_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          banner_url?: string | null
          category?: string | null
          college_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "clubs_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      colleges: {
        Row: {
          address: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
          website: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
          website?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
          website?: string | null
        }
        Relationships: []
      }
      departments: {
        Row: {
          code: string | null
          college_id: string | null
          created_at: string
          id: string
          name: string
        }
        Insert: {
          code?: string | null
          college_id?: string | null
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          code?: string | null
          college_id?: string | null
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "departments_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          banner_url: string | null
          category: Database["public"]["Enums"]["event_category"]
          college_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          end_date: string | null
          event_date: string
          id: string
          max_seats: number | null
          organizer: string | null
          registration_deadline: string | null
          registration_link: string | null
          status: Database["public"]["Enums"]["opportunity_status"]
          title: string
          venue: string | null
        }
        Insert: {
          banner_url?: string | null
          category?: Database["public"]["Enums"]["event_category"]
          college_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          max_seats?: number | null
          organizer?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title: string
          venue?: string | null
        }
        Update: {
          banner_url?: string | null
          category?: Database["public"]["Enums"]["event_category"]
          college_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          max_seats?: number | null
          organizer?: string | null
          registration_deadline?: string | null
          registration_link?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "events_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      internships: {
        Row: {
          application_deadline: string | null
          apply_link: string | null
          college_id: string | null
          company_name: string
          created_at: string
          created_by: string | null
          description: string | null
          duration: string | null
          eligibility: string | null
          id: string
          location: string | null
          logo_url: string | null
          mode: string | null
          required_skills: string[] | null
          role: string
          status: Database["public"]["Enums"]["opportunity_status"]
          stipend: string | null
        }
        Insert: {
          application_deadline?: string | null
          apply_link?: string | null
          college_id?: string | null
          company_name: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          eligibility?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          mode?: string | null
          required_skills?: string[] | null
          role: string
          status?: Database["public"]["Enums"]["opportunity_status"]
          stipend?: string | null
        }
        Update: {
          application_deadline?: string | null
          apply_link?: string | null
          college_id?: string | null
          company_name?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          eligibility?: string | null
          id?: string
          location?: string | null
          logo_url?: string | null
          mode?: string | null
          required_skills?: string[] | null
          role?: string
          status?: Database["public"]["Enums"]["opportunity_status"]
          stipend?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internships_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      notices: {
        Row: {
          attachment_url: string | null
          category: Database["public"]["Enums"]["notice_category"]
          college_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          is_pinned: boolean | null
          title: string
        }
        Insert: {
          attachment_url?: string | null
          category?: Database["public"]["Enums"]["notice_category"]
          college_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_pinned?: boolean | null
          title: string
        }
        Update: {
          attachment_url?: string | null
          category?: Database["public"]["Enums"]["notice_category"]
          college_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          is_pinned?: boolean | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "notices_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean | null
          link: string | null
          message: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean | null
          link?: string | null
          message?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      placement_drives: {
        Row: {
          college_id: string | null
          company_name: string
          created_at: string
          created_by: string | null
          drive_date: string | null
          eligibility: string | null
          id: string
          job_location: string | null
          logo_url: string | null
          package: string | null
          registration_deadline: string | null
          required_skills: string[] | null
          role: string
          selection_process: string | null
          status: Database["public"]["Enums"]["opportunity_status"]
        }
        Insert: {
          college_id?: string | null
          company_name: string
          created_at?: string
          created_by?: string | null
          drive_date?: string | null
          eligibility?: string | null
          id?: string
          job_location?: string | null
          logo_url?: string | null
          package?: string | null
          registration_deadline?: string | null
          required_skills?: string[] | null
          role: string
          selection_process?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
        }
        Update: {
          college_id?: string | null
          company_name?: string
          created_at?: string
          created_by?: string | null
          drive_date?: string | null
          eligibility?: string | null
          id?: string
          job_location?: string | null
          logo_url?: string | null
          package?: string | null
          registration_deadline?: string | null
          required_skills?: string[] | null
          role?: string
          selection_process?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
        }
        Relationships: [
          {
            foreignKeyName: "placement_drives_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          branch: string | null
          cgpa: number | null
          college_id: string | null
          created_at: string
          department_id: string | null
          email: string | null
          enrollment_no: string | null
          full_name: string | null
          github_url: string | null
          id: string
          linkedin_url: string | null
          phone: string | null
          resume_url: string | null
          semester: number | null
          skills: string[] | null
          updated_at: string
          year: number | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          branch?: string | null
          cgpa?: number | null
          college_id?: string | null
          created_at?: string
          department_id?: string | null
          email?: string | null
          enrollment_no?: string | null
          full_name?: string | null
          github_url?: string | null
          id: string
          linkedin_url?: string | null
          phone?: string | null
          resume_url?: string | null
          semester?: number | null
          skills?: string[] | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          branch?: string | null
          cgpa?: number | null
          college_id?: string | null
          created_at?: string
          department_id?: string | null
          email?: string | null
          enrollment_no?: string | null
          full_name?: string | null
          github_url?: string | null
          id?: string
          linkedin_url?: string | null
          phone?: string | null
          resume_url?: string | null
          semester?: number | null
          skills?: string[] | null
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      registrations: {
        Row: {
          activity_id: string
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at: string
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["registration_status"]
          user_id: string
        }
        Insert: {
          activity_id: string
          activity_type: Database["public"]["Enums"]["activity_type"]
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          user_id: string
        }
        Update: {
          activity_id?: string
          activity_type?: Database["public"]["Enums"]["activity_type"]
          created_at?: string
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["registration_status"]
          user_id?: string
        }
        Relationships: []
      }
      seminars: {
        Row: {
          banner_url: string | null
          capacity: number | null
          college_id: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          organization: string | null
          registration_link: string | null
          seminar_date: string
          speaker: string | null
          status: Database["public"]["Enums"]["opportunity_status"]
          title: string
          topic: string | null
          venue: string | null
        }
        Insert: {
          banner_url?: string | null
          capacity?: number | null
          college_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          organization?: string | null
          registration_link?: string | null
          seminar_date: string
          speaker?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title: string
          topic?: string | null
          venue?: string | null
        }
        Update: {
          banner_url?: string | null
          capacity?: number | null
          college_id?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          organization?: string | null
          registration_link?: string | null
          seminar_date?: string
          speaker?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title?: string
          topic?: string | null
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "seminars_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          college_id: string | null
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          college_id?: string | null
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          college_id?: string | null
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
            referencedColumns: ["id"]
          },
        ]
      }
      workshops: {
        Row: {
          banner_url: string | null
          certificate_available: boolean | null
          college_id: string | null
          company: string | null
          created_at: string
          created_by: string | null
          description: string | null
          duration_hours: number | null
          id: string
          max_seats: number | null
          registration_link: string | null
          speaker: string | null
          status: Database["public"]["Enums"]["opportunity_status"]
          title: string
          venue: string | null
          workshop_date: string
        }
        Insert: {
          banner_url?: string | null
          certificate_available?: boolean | null
          college_id?: string | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          max_seats?: number | null
          registration_link?: string | null
          speaker?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title: string
          venue?: string | null
          workshop_date: string
        }
        Update: {
          banner_url?: string | null
          certificate_available?: boolean | null
          college_id?: string | null
          company?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration_hours?: number | null
          id?: string
          max_seats?: number | null
          registration_link?: string | null
          speaker?: string | null
          status?: Database["public"]["Enums"]["opportunity_status"]
          title?: string
          venue?: string | null
          workshop_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "workshops_college_id_fkey"
            columns: ["college_id"]
            isOneToOne: false
            referencedRelation: "colleges"
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
      is_staff: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      activity_type:
        | "event"
        | "workshop"
        | "seminar"
        | "internship"
        | "placement"
        | "club"
      app_role: "super_admin" | "college_admin" | "faculty" | "student"
      event_category:
        | "technical"
        | "cultural"
        | "sports"
        | "academic"
        | "entrepreneurship"
        | "innovation"
      notice_category:
        | "academic"
        | "examination"
        | "placement"
        | "internship"
        | "holiday"
        | "emergency"
        | "general"
      opportunity_status: "draft" | "published" | "closed" | "cancelled"
      registration_status:
        | "registered"
        | "waitlisted"
        | "attended"
        | "cancelled"
        | "selected"
        | "rejected"
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
      activity_type: [
        "event",
        "workshop",
        "seminar",
        "internship",
        "placement",
        "club",
      ],
      app_role: ["super_admin", "college_admin", "faculty", "student"],
      event_category: [
        "technical",
        "cultural",
        "sports",
        "academic",
        "entrepreneurship",
        "innovation",
      ],
      notice_category: [
        "academic",
        "examination",
        "placement",
        "internship",
        "holiday",
        "emergency",
        "general",
      ],
      opportunity_status: ["draft", "published", "closed", "cancelled"],
      registration_status: [
        "registered",
        "waitlisted",
        "attended",
        "cancelled",
        "selected",
        "rejected",
      ],
    },
  },
} as const
