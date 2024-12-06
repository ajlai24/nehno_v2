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

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

const options = { next: { revalidate: 30 } };

export default async function Home() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <div className="p-4">
      <ul className="flex flex-col gap-y-4">
        {posts.map((post) => (
          <Link href={`/${post.slug.current}`} key={post._id}>
            <Card>
              <CardHeader>
                <CardTitle>{post.title}</CardTitle>
                <CardDescription>
                  {new Date(post.publishedAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent></CardContent>
            </Card>
          </Link>
        ))}
      </ul>
    </div>
  );
}
