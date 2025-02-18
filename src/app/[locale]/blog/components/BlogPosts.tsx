"use client";

import NavigationLink from "@/components/NavigationLink";
import { SanityImage } from "@/components/SanityImage";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Category, Post } from "@/sanity/sanity.types";
import { useRouter, useSearchParams } from "next/navigation";

const BlogPosts = ({
  posts,
  categories,
  selectedCategory,
}: {
  posts: Post[];
  categories: Category[];
  selectedCategory?: Category;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Handle category change and filter posts
  const handleCategoryChange = (categoryId?: string) => {
    if (selectedCategory?._id === categoryId) {
      return;
    }
    const newCategory = categories.find(
      (category) => category._id === categoryId
    );
    const newCategoryKey = newCategory?.key;

    const newSearchParams = new URLSearchParams(searchParams.toString());
    if (newCategoryKey) {
      newSearchParams.set("category", newCategoryKey);
    } else {
      newSearchParams.delete("category");
    }
    router.push(`/blog?${newSearchParams.toString()}`);
  };

  return (
    <div>
      <div className="pt-4 flex gap-1 items-center">
        <Badge
          className="cursor-pointer select-none"
          variant="secondary"
          onClick={() => handleCategoryChange(undefined)}
        >
          All
        </Badge>
        {categories.map((category) => (
          <Badge
            key={category._id}
            variant="secondary"
            onClick={() => handleCategoryChange(category._id)}
            className="cursor-pointer select-none"
          >
            {category.title}
          </Badge>
        ))}
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
        {posts.length === 0 && <div>0 Results</div>}
        {posts.map((post) => (
          <NavigationLink
            href={`/blog/${post.slug?.current}?${searchParams.toString()}`}
            key={post._id}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription className="flex justify-between">
                  <div>
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : "No date available"}{" "}
                  </div>
                  <div>
                    {post.categories?.map((category) => (
                      <Badge key={category._id} variant="outline">
                        {category.title}
                      </Badge>
                    ))}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SanityImage
                  className="aspect-video w-full"
                  sanitySrc={post.mainImage}
                  sanityWidth={800}
                  sanityHeight={451}
                  alt={post.title || ""}
                  width="550"
                  height="310"
                />
                <div className="pt-4">
                  <div className="">{post.excerpt}</div>
                </div>
              </CardContent>
            </Card>
          </NavigationLink>
        ))}
      </div>

      {/* TODO: pagination */}
    </div>
  );
};

export default BlogPosts;
