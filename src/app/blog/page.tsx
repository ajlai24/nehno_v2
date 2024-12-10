import Link from "next/link";
import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BlogCardImage } from "@/components/BlogCardImage";
import { Post } from "@/sanity/sanity.types";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, mainImage }`;

const options = { next: { revalidate: 30 } };

export default async function Blog() {
  const posts = await client.fetch<SanityDocument<Post>[]>(
    POSTS_QUERY,
    {},
    options
  );

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {posts.map((post) => (
        <Link href={`/blog/${post.slug?.current}`} key={post._id}>
          <Card>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
              <CardDescription>
                {post.publishedAt
                  ? new Date(post.publishedAt).toLocaleDateString()
                  : "No date available"}{" "}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BlogCardImage image={post.mainImage} alt={post.title} />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
