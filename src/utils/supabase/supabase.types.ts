export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      switches: {
        Row: {
          brand: string | null;
          created_at: string;
          feel: Database["public"]["Enums"]["feel"] | null;
          force: number | null;
          force_plus_minus: number | null;
          id: number;
          image_src: string | null;
          life: number | null;
          name: string;
          pins: number | null;
          pre_travel: number | null;
          pre_travel_plus_minus: number | null;
          prelubed: boolean | null;
          profile: Database["public"]["Enums"]["profile"] | null;
          rgb: boolean | null;
          series: string | null;
          silent: boolean | null;
          spring: string | null;
          travel_distance: number | null;
          updated_at: string | null;
        };
        Insert: {
          brand?: string | null;
          created_at?: string;
          feel?: Database["public"]["Enums"]["feel"] | null;
          force?: number | null;
          force_plus_minus?: number | null;
          id?: number;
          image_src?: string | null;
          life?: number | null;
          name: string;
          pins?: number | null;
          pre_travel?: number | null;
          pre_travel_plus_minus?: number | null;
          prelubed?: boolean | null;
          profile?: Database["public"]["Enums"]["profile"] | null;
          rgb?: boolean | null;
          series?: string | null;
          silent?: boolean | null;
          spring?: string | null;
          travel_distance?: number | null;
          updated_at?: string | null;
        };
        Update: {
          brand?: string | null;
          created_at?: string;
          feel?: Database["public"]["Enums"]["feel"] | null;
          force?: number | null;
          force_plus_minus?: number | null;
          id?: number;
          image_src?: string | null;
          life?: number | null;
          name?: string;
          pins?: number | null;
          pre_travel?: number | null;
          pre_travel_plus_minus?: number | null;
          prelubed?: boolean | null;
          profile?: Database["public"]["Enums"]["profile"] | null;
          rgb?: boolean | null;
          series?: string | null;
          silent?: boolean | null;
          spring?: string | null;
          travel_distance?: number | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_filters: {
        Args: Record<PropertyKey, never>;
        Returns: Json;
      };
      get_switch_brands: {
        Args: Record<PropertyKey, never>;
        Returns: string[];
      };
    };
    Enums: {
      feel: "Clicky" | "Linear" | "Tactile";
      profile: "Normal" | "Low";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
