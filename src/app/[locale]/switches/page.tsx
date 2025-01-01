import SwitchesCollection from "./components/SwitchesCollection";
import { getFilters } from "./queries";

export default async function Switches() {
  const { data: filters } = await getFilters();

  return <SwitchesCollection filters={filters} />;
}
