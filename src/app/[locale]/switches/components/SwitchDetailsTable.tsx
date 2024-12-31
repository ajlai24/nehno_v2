"use client";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Tables } from "@/utils/supabase/supabase.types";

interface SwitchDetailsTableProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  details: Tables<"switches">;
}

export function SwitchDetailsTable({ details }: SwitchDetailsTableProps) {
  const {
    force,
    force_plus_minus,
    life,
    pins,
    pre_travel,
    pre_travel_plus_minus,
    spring,
    travel_distance,
  } = details;

  const rowData = [
    {
      key: "Operation Force",
      value: `${force} ± ${force_plus_minus} gf`,
    },
    {
      key: "Pre-Travel",
      value: `${pre_travel} ± ${pre_travel_plus_minus} mm`,
    },
    {
      key: "Total Travel",
      value: `${travel_distance}mm`,
    },
    {
      key: "Pins",
      value: pins,
    },
    {
      key: "Lifecycles",
      value: life ? `${life}M cycles` : "",
    },
    {
      key: "Spring",
      value: spring,
    },
  ];

  return (
    <Table>
      <TableBody>
        {rowData.map(({ key, value }) => (
          <TableRow key={key}>
            <TableCell className="text-xs">{key}</TableCell>
            <TableCell className="text-xs">{value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
