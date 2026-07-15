import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  onReset: () => void;
  closeDrawer?: () => void;
}

export function FilterHeader({ title, onReset, closeDrawer }: Props) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>

      <div className="flex gap-2">
        <Button onClick={onReset} variant="secondary" size="sm">
          Reset
        </Button>

        <Button size="sm" className="lg:hidden" onClick={closeDrawer}>
          Apply
        </Button>
      </div>
    </div>
  );
}
