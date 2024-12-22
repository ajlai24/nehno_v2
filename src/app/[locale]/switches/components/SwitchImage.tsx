import { client } from "@/sanity/client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export function SwitchImage({
  image_src,
  alt = "",
}: {
  image_src: string | null;
  alt?: string;
}) {
  const src = image_src
    ? urlFor(image_src)?.width(513).height(513).url()
    : null;

  return src ? (
    <Image
      src={src}
      alt={alt}
      className="rounded-xl w-full"
      sizes="100vw"
      width="513"
      height="513"
    />
  ) : null;
}
