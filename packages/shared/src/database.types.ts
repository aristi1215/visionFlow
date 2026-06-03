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
      alerts: {
        Row: {
          channel: Database["public"]["Enums"]["alert_channels"]
          completed_at: string
          execution_node: number | null
          id: number
          message: string
          sent_status: Database["public"]["Enums"]["execution_alert_status"]
          started_at: string
        }
        Insert: {
          channel: Database["public"]["Enums"]["alert_channels"]
          completed_at: string
          execution_node?: number | null
          id?: number
          message: string
          sent_status: Database["public"]["Enums"]["execution_alert_status"]
          started_at: string
        }
        Update: {
          channel?: Database["public"]["Enums"]["alert_channels"]
          completed_at?: string
          execution_node?: number | null
          id?: number
          message?: string
          sent_status?: Database["public"]["Enums"]["execution_alert_status"]
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_execution_node_fkey"
            columns: ["execution_node"]
            isOneToOne: false
            referencedRelation: "execution_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      detections: {
        Row: {
          completed_at: string
          execution_node: number | null
          id: number
          output_json: Json
          started_at: string
        }
        Insert: {
          completed_at: string
          execution_node?: number | null
          id?: number
          output_json: Json
          started_at: string
        }
        Update: {
          completed_at?: string
          execution_node?: number | null
          id?: number
          output_json?: Json
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "detections_execution_node_fkey"
            columns: ["execution_node"]
            isOneToOne: false
            referencedRelation: "execution_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      execution_nodes: {
        Row: {
          execution_id: number
          id: number
          node_id: number
          output_json: Json
          status: Database["public"]["Enums"]["execution_alert_status"]
        }
        Insert: {
          execution_id: number
          id?: number
          node_id: number
          output_json: Json
          status: Database["public"]["Enums"]["execution_alert_status"]
        }
        Update: {
          execution_id?: number
          id?: number
          node_id?: number
          output_json?: Json
          status?: Database["public"]["Enums"]["execution_alert_status"]
        }
        Relationships: [
          {
            foreignKeyName: "execution_nodes_execution_id_fkey"
            columns: ["execution_id"]
            isOneToOne: false
            referencedRelation: "workflow_execution"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "execution_nodes_node_id_fkey"
            columns: ["node_id"]
            isOneToOne: false
            referencedRelation: "workflow_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      timeline_events: {
        Row: {
          completed_at: string
          execution_node: number
          id: number
          output_json: Json
          started_at: string
        }
        Insert: {
          completed_at: string
          execution_node: number
          id?: number
          output_json: Json
          started_at: string
        }
        Update: {
          completed_at?: string
          execution_node?: number
          id?: number
          output_json?: Json
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "timeline_events_execution_node_fkey"
            columns: ["execution_node"]
            isOneToOne: false
            referencedRelation: "execution_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          password_hash: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          password_hash: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          password_hash?: string
        }
        Relationships: []
      }
      video_analysis: {
        Row: {
          Analysis: string
          completed_at: string
          execution_node: number
          id: number
          started_at: string
        }
        Insert: {
          Analysis: string
          completed_at: string
          execution_node: number
          id?: number
          started_at: string
        }
        Update: {
          Analysis?: string
          completed_at?: string
          execution_node?: number
          id?: number
          started_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_analysis_execution_node_fkey"
            columns: ["execution_node"]
            isOneToOne: false
            referencedRelation: "execution_nodes"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          duration: number
          format: string
          fps: number
          height: number | null
          id: number
          size: number | null
          user_id: string
          video_url: string
          width: number | null
        }
        Insert: {
          duration: number
          format: string
          fps: number
          height?: number | null
          id?: number
          size?: number | null
          user_id: string
          video_url: string
          width?: number | null
        }
        Update: {
          duration?: number
          format?: string
          fps?: number
          height?: number | null
          id?: number
          size?: number | null
          user_id?: string
          video_url?: string
          width?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_edges: {
        Row: {
          id: number
          source_node: number
          target_node: number
          workflow_id: number
        }
        Insert: {
          id?: number
          source_node: number
          target_node: number
          workflow_id: number
        }
        Update: {
          id?: number
          source_node?: number
          target_node?: number
          workflow_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "workflow_edges_source_in_workflow_fkey"
            columns: ["workflow_id", "source_node"]
            isOneToOne: false
            referencedRelation: "workflow_nodes"
            referencedColumns: ["workflow_id", "id"]
          },
          {
            foreignKeyName: "workflow_edges_source_node_fkey"
            columns: ["source_node"]
            isOneToOne: false
            referencedRelation: "workflow_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_edges_target_in_workflow_fkey"
            columns: ["workflow_id", "target_node"]
            isOneToOne: true
            referencedRelation: "workflow_nodes"
            referencedColumns: ["workflow_id", "id"]
          },
          {
            foreignKeyName: "workflow_edges_target_node_fkey"
            columns: ["target_node"]
            isOneToOne: false
            referencedRelation: "workflow_nodes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_edges_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_execution: {
        Row: {
          completed_at: string
          id: number
          started_at: string
          status: Database["public"]["Enums"]["execution_alert_status"]
          video_id: number
          workflow_id: number
        }
        Insert: {
          completed_at: string
          id?: number
          started_at: string
          status: Database["public"]["Enums"]["execution_alert_status"]
          video_id: number
          workflow_id: number
        }
        Update: {
          completed_at?: string
          id?: number
          started_at?: string
          status?: Database["public"]["Enums"]["execution_alert_status"]
          video_id?: number
          workflow_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "execution_workflow_id_fkey"
            columns: ["workflow_id"]
            isOneToOne: false
            referencedRelation: "workflows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "workflow_execution_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      workflow_nodes: {
        Row: {
          id: number
          position_x: number
          position_y: number
          type: Database["public"]["Enums"]["node_types"]
          workflow_id: number
        }
        Insert: {
          id?: number
          position_x: number
          position_y: number
          type: Database["public"]["Enums"]["node_types"]
          workflow_id: number
        }
        Update: {
          id?: number
          position_x?: number
          position_y?: number
          type?: Database["public"]["Enums"]["node_types"]
          workflow_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "workflow_nodes_workflow_id_fkey"
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
          description: string | null
          id: number
          name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          name: string
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "workflows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
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
      alert_channels: "slack" | "gmail"
      execution_alert_status: "started" | "pending" | "completed" | "failed"
      node_types:
        | "upload_video"
        | "extract_frames"
        | "scene_analysis"
        | "object_detection"
        | "timeline_events_generator"
        | "alert_node"
        | "ai_description_node"
        | "save_results_node"
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
      alert_channels: ["slack", "gmail"],
      execution_alert_status: ["started", "pending", "completed", "failed"],
      node_types: [
        "upload_video",
        "extract_frames",
        "scene_analysis",
        "object_detection",
        "timeline_events_generator",
        "alert_node",
        "ai_description_node",
        "save_results_node",
      ],
    },
  },
} as const
