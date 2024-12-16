"use client";

import Link from "next/link";
import { Category, Post } from "@/sanity/sanity.types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BlogCardImage } from "@/components/BlogCardImage";
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
          className="cursor-pointer"
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
            className="cursor-pointer"
          >
            {category.title}
          </Badge>
        ))}
      </div>

      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-6">
        {posts.map((post) => (
          <Link
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
                <BlogCardImage image={post.mainImage} alt={post.title} />
                <div className="pt-4">
                  <div className="">{post.excerpt}</div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* TODO: pagination */}
    </div>
  );
};

export default BlogPosts;
