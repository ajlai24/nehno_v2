import {
  PortableText,
  PortableTextComponents,
  type SanityDocument,
} from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Category } from "@/sanity/sanity.types";
import { Badge } from "@/components/ui/badge";
import { Refractor, registerLanguage } from "react-refractor";
import js from "refractor/lang/javascript.js";
import typescript from "refractor/lang/typescript";
import json from "refractor/lang/json";
import { DisqusComments } from "@/components/DisqusComments";
import { SearchParams } from "next/dist/server/request/search-params";

// Then register them
registerLanguage(js);
registerLanguage(typescript);
registerLanguage(json);

const POST_QUERY = `
  *[_type == "post" && slug.current == $slug][0] {
    ...,
    author->{
      ...
    },
    "categories": categories[]->{
      _id,
      title
    }
  }
`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset
    ? imageUrlBuilder({ projectId, dataset }).image(source)
    : null;

const options = { next: { revalidate: 30 } };

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: (props) => <p className="my-4">{props.children}</p>,
  },
  marks: {
    code: ({ children }) => (
      <code className="bg-slate-300 dark:bg-slate-700 before:content-none after:content-none p-1 rounded-sm">
        {children}
      </code>
    ),
  },
  types: {
    code: ({ value }) => (
      <Refractor language={value.language} value={value.code} />
    ),
  },
};

export default async function PostPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: SearchParams;
}) {
  const { slug } = await params;
  const { category } = await searchParams;
  console.log(category);

  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    { slug },
    options
  );
  const postImageUrl = post.mainImage
    ? urlFor(post.mainImage)?.width(1600).height(900).quality(100).url()
    : null;

  const authorImage = post?.author?.image;
  const authorImageUrl = authorImage
    ? urlFor(authorImage)?.width(400).height(400).url()
    : undefined;
  const authorName = post?.author?.name || "";

  const queryParams = category ? `?category=${category}` : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="pb-4">
        <Link href={`/blog${queryParams}`} className="hover:underline">
          ← Back to posts
        </Link>
      </div>

      <h1 className="text-4xl font-bold">{post.title}</h1>
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage
            className="object-cover"
            src={authorImageUrl}
            alt={authorName}
          />
          <AvatarFallback>AL</AvatarFallback>
        </Avatar>
        <div>
          <div>{authorName}</div>
          <div className="text-xs text-neutral-500 dark:text-neutral-400">
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      {/* Categories */}
      <div>
        {post.categories.map((category: Category) => (
          <Badge key={category._id}>{category.title}</Badge>
        ))}
      </div>

      <div className="flex align-middle justify-center">
        <div className="max-w-screen-lg">
          {postImageUrl && (
            <Image
              src={postImageUrl}
              alt={post.title}
              className="rounded-xl"
              width="1568"
              height="1003"
              layout="responsive"
              quality={100}
            />
          )}
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        {Array.isArray(post.body) && (
          <PortableText
            key={post._id}
            value={post.body}
            components={portableTextComponents}
          />
        )}
      </div>

      <DisqusComments post={post} />
    </div>
  );
}
