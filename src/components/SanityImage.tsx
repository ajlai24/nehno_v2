import { urlFor } from "@/utils/utils";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image, { ImageProps } from "next/image";
import { Skeleton } from "./ui/skeleton";

interface SanityImageProps extends Omit<ImageProps, "src"> {
  sanitySrc?: string | SanityImageSource | null;
  sanityWidth?: number;
  sanityHeight?: number;
  className?: string;
}

export function SanityImage({
  sanitySrc,
  sanityWidth = 700,
  sanityHeight = 700,
  alt = "",
  width = 700,
  height = 700,
  className = "",
  ...rest
}: SanityImageProps) {
  const imageUrl = sanitySrc
    ? urlFor({ source: sanitySrc, width: sanityWidth, height: sanityHeight })
    : undefined;

  if (!imageUrl) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[250px] w-[250px] rounded-xl animate-none" />
      </div>
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={`rounded-xl ${className}`}
      {...rest}
    />
  );
}
