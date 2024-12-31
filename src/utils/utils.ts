import { client } from "@/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { redirect } from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function urlFor({
  source,
  width,
  height,
}: {
  source: SanityImageSource;
  width: number;
  height: number;
}) {
  const { projectId, dataset } = client.config();

  if (!projectId || !dataset) {
    return null;
  }

  const builder = imageUrlBuilder({ projectId, dataset });

  if (source) {
    return builder.image(source).width(width).height(height).url();
  }

  return null;
}
