import SwitchesCollection from "./components/SwitchesCollection";
import { supabaseAdmin } from "@/utils/supabase/admin";

export default async function Switches() {
  const { data: filters, error } = await supabaseAdmin.rpc("get_filters");

  if (error) {
    throw new Error("Failed to fetch filters");
  }

  return <SwitchesCollection filters={filters} />;
}
