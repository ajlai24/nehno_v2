import { Skeleton } from "@/components/ui/skeleton";
import Image, { ImageProps } from "next/image";

interface SwitchImageProps extends Omit<ImageProps, "src"> {
  src?: string | null;
  className?: string;
}

export function SwitchImage({
  src,
  alt = "",
  width = 700,
  height = 700,
  className = "",
  ...rest
}: SwitchImageProps) {
  if (!src) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[250px] w-[250px] rounded-xl animate-none" />
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-xl ${className}`}
      {...rest}
    />
  );
}
