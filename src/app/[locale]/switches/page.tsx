import { createClient } from "@/utils/supabase/server";
import SwitchesCollection from "./components/SwitchesCollection";

export default async function Switches() {
  const supabase = await createClient();
  const { data: filters } = await supabase.rpc("get_filters");
  const { data: switches } = await supabase.from("switches").select();
  const initialSwitches = switches ?? [];

  return (
    <SwitchesCollection initialSwitches={initialSwitches} filters={filters} />
  );
}
