import { createClient } from "@/utils/supabase/server";
import { FilterPanel } from "./components/FilterPanel";
import { SwitchCard } from "./components/SwitchCard";

export default async function Switches() {
  const supabase = await createClient();
  const { data } = await supabase.from("switches").select();
  const { data: filters } = await supabase.rpc("get_filters");

  console.log(data);
  console.log(JSON.stringify(filters));
  return (
    <div>
      <h2 className="text-4xl font-bold">Mechanical Keyboard Switches</h2>
      <div className="grid lg:grid-cols-5">
        <FilterPanel filters={filters} />
        <div className="col-span-3 lg:col-span-4 lg:border-l">
          <div className="p-4 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {data &&
              data.map((switchDetails) => (
                <div key={switchDetails.id} className="">
                  <SwitchCard details={switchDetails} />
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
