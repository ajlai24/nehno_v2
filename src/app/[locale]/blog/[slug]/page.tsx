import { getStoryblokApi } from "@/lib/storyblok";
import { type ISbStoryData } from "@storyblok/js";
import BlogPostDetail from "../components/BlogPostDetail";
import { draftMode } from "next/headers";
import { Suspense } from "react";
import CenteredLoader from "@/components/CenteredLoader";

async function BlogPostContent({ slug }: { slug: string }) {
  const storyblokApi = getStoryblokApi();
  const { isEnabled } = await draftMode();

  let story: ISbStoryData | null = null;

  const version = isEnabled ? "draft" : "published";

  try {
    const { data } = await storyblokApi.get(`cdn/stories/blog/${slug}`, {
      version,
      resolve_relations: ["post.author"],
    });
    story = data?.story ?? null;
  } catch (error) {
    console.error("Storyblok Fetch Error:", error);
    story = null;
  }
  if (!story) {
    return <div className="p-20 text-center">Post not found.</div>;
  }

  return <BlogPostDetail story={story} />;
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <Suspense fallback={<CenteredLoader />}>
      <BlogPostContent slug={slug} />
    </Suspense>
  );
}
