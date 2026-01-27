"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ISbStoryData } from "@storyblok/js";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

interface StoryblokBlogPostsProps {
  initialStories: ISbStoryData[];
  totalPosts?: number;
  searchTerm?: string;
  selectedTag?: string;
}

const StoryblokBlogPosts = ({
  initialStories,
  // totalPosts,
  // searchTerm,
  // selectedTag,
}: StoryblokBlogPostsProps) => {
  const searchParams = useSearchParams();

  // We use initialStories since that is the prop name you passed
  const posts = initialStories || [];

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
      {posts.length === 0 && (
        <div className="col-span-full text-center py-10">0 Results</div>
      )}

      {posts.map((story) => {
        // Destructure Storyblok's specific properties
        const { name, full_slug, uuid, first_published_at, tag_list } = story;
        const { content } = story;

        return (
          <Link href={`/${full_slug}?${searchParams.toString()}`} key={uuid}>
            <Card className="h-full hover:border-primary transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>{name}</CardTitle>
                <CardDescription className="flex justify-between pt-1">
                  <div className="text-sm">
                    {first_published_at
                      ? new Date(first_published_at).toLocaleDateString()
                      : "Draft"}
                  </div>
                  <div>
                    {tag_list?.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {content.mainImage && (
                  <Image
                    src={`${content.mainImage.filename}/m/800x451`}
                    alt={content.mainImage.alt || name}
                    className="aspect-video w-full rounded-xl"
                    priority={false}
                    width="550"
                    height="310"
                  />
                )}
                <div className="pt-4">
                  <div>{content.excerpt || content.intro}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
};

export default StoryblokBlogPosts;
