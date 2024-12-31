import { urlFor } from "@/utils/utils";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image, { ImageProps } from "next/image";

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
    return null;
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
