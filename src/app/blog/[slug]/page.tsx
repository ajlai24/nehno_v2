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
      <code className="bg-slate-400 before:content-none after:content-none p-[2px] rounded-sm">
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
}: {
  params: { slug: string };
}) {
  const { slug } = await params;
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    { slug },
    options
  );
  const postImageUrl = post.mainImage
    ? urlFor(post.mainImage)?.width(800).height(451).url()
    : null;

  const authorImage = post?.author?.image;
  const authorImageUrl = authorImage
    ? urlFor(authorImage)?.width(400).height(400).url()
    : undefined;
  const authorName = post?.author?.name || "";

  return (
    <div className="flex flex-col gap-4">
      <div className="pb-4">
        <Link href="/blog" className="hover:underline">
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

      <div className="flex align-middle">
        {postImageUrl && (
          <Image
            src={postImageUrl}
            alt={post.title}
            className="aspect-video rounded-xl w-full"
            sizes="100vw"
            width="550"
            height="310"
          />
        )}
      </div>

      <div className="prose dark:prose-invert">
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
