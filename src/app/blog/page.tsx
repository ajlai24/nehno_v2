import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import { Category, Post } from "@/sanity/sanity.types";
import BlogPosts from "./components/BlogPosts";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{
  _id, 
  excerpt,
  title, 
  slug, 
  publishedAt, 
  mainImage, 
  "categories": categories[]-> {
     _id,
    _type,
    title,
  }
}`;

const CATEGORIES_QUERY = `*[_type == "category"] {
  _id,
  title,
  key,
}`;

const POSTS_BY_CATEGORY_QUERY = `*[
  _type == "post"
  && references($categoryId)
] | order(publishedAt desc) {
 _id,
  excerpt,
  title,
  slug,
  publishedAt,
  mainImage,
  "categories": categories[]-> {
     _id,
    _type,
    title,
  }
}`;

const options = { next: { revalidate: 30 } };

export default async function Blog({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const categories = await client.fetch<SanityDocument<Category>[]>(
    CATEGORIES_QUERY,
    {},
    options
  );

  const categoryKey = (await searchParams)?.category;
  const selectedCategory = categories.find(
    (category) => category.key === categoryKey
  );
  const posts = await client.fetch<SanityDocument<Post>[]>(
    selectedCategory ? POSTS_BY_CATEGORY_QUERY : POSTS_QUERY,
    selectedCategory ? { categoryId: selectedCategory?._id } : {},
    options
  );

  return (
    <div>
      <h2 className="text-4xl font-bold">Blog</h2>
      <BlogPosts
        posts={posts}
        categories={categories}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}
