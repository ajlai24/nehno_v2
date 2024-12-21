import { client } from "@/sanity/client";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import imageUrlBuilder from "@sanity/image-url";
import Image from "next/image";
import { Post } from "@/sanity/sanity.types";

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

export function BlogCardImage({
  image,
  alt = "",
}: {
  image: Post["mainImage"];
  alt?: string;
}) {
  const src = image?.asset ? urlFor(image)?.width(800).height(451).url() : null;

  return src ? (
    <Image
      src={src}
      alt={alt}
      className="aspect-video rounded-xl w-full"
      sizes="100vw"
      width="550"
      height="310"
    />
  ) : null;
}
