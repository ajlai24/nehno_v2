import { getStoryblokApi } from "@/lib/storyblok";
import { type ISbStoryData } from "@storyblok/js";
import StoryblokBlogPosts from "./components/StoryblokBlogPosts";
import TagFilter from "./components/TagFilter";
import { StoryblokTag } from "./storyblok.types";

interface BlogIndexPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BlogIndexPage({
  searchParams,
}: BlogIndexPageProps) {
  const params = await searchParams; // In Next.js 15+, searchParams is a promise
  const selectedTag =
    typeof params?.tag === "string"
      ? params.tag
      : Array.isArray(params?.tag)
        ? params.tag[0] || ""
        : "";
  const searchTerm =
    typeof params?.search === "string"
      ? params.search
      : Array.isArray(params?.search)
        ? params.search[0] || ""
        : "";

  const storyblokApi = getStoryblokApi();

  // 1. Fetch Page 1 and All Available Tags in parallel
  const [storiesResponse, tagsResponse] = await Promise.all([
    storyblokApi.get(`cdn/stories`, {
      version:
        (process.env.STORYBLOK_VERSION as "draft" | "published") || "published",
      starts_with: "blog/",
      with_tag: selectedTag,
      search_term: searchTerm,
      sort_by: "first_published_at:desc",
      page: 1, // Always start with page 1 on the server
      per_page: 12,
    }),
    storyblokApi.get(`cdn/tags`, {
      starts_with: "blog/",
    }),
  ]);

  const initialStories = (storiesResponse.data?.stories ||
    []) as ISbStoryData[];
  const allTags = (tagsResponse.data?.tags || []) as StoryblokTag[];
  // Storyblok API returns headers with total count
  const totalHeader =
    storiesResponse.headers &&
    typeof storiesResponse.headers === "object" &&
    "total" in storiesResponse.headers
      ? String(storiesResponse.headers.total)
      : storiesResponse.headers instanceof Headers
        ? storiesResponse.headers.get("total") || "0"
        : "0";
  const totalPosts = Number(totalHeader);

  return (
    <main className="blog">
      <h2 className="text-3xl lg:text-4xl font-bold">Blog</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-2">
        {/* <SearchBar defaultValue={searchTerm} /> */}
        <TagFilter tags={allTags} selectedTag={selectedTag} />
      </div>

      <StoryblokBlogPosts
        initialStories={initialStories}
        totalPosts={totalPosts}
        searchTerm={searchTerm}
        selectedTag={selectedTag}
      />
    </main>
  );
}
