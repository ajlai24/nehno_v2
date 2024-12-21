"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database } from "@/utils/supabase/supabase.types";
import { SwitchImage } from "./SwitchImage";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface SwitchCardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  details: Database["public"]["Tables"]["switches"]["Row"];
}

export function SwitchCard({ details }: SwitchCardProps) {
  const {
    brand,
    series,
    name,
    feel,
    force,
    force_plus_minus,
    life,
    pins,
    pre_travel,
    pre_travel_plus_minus,
    profile,
    spring,
    travel_distance,
    image_src,
  } = details;

  const fullName = `${brand} ${series} ${name}`;

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
      value: `${life}M cycles`,
    },
    {
      key: "Spring",
      value: spring,
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="p-4 pb-0">
        <SwitchImage image_src={image_src} alt={fullName} />
        <CardTitle className="pt-4">{fullName}</CardTitle>
        <CardDescription>
          <div className="flex justify-between">
            <div className="text-sm">{feel}</div>
            <div className="text-sm">Profile: {profile}</div>
          </div>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
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
      </CardContent>
    </Card>
  );
}
