import NavigationLink from "@/components/NavigationLink";
import { SanityImage } from "@/components/SanityImage";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { client } from "@/sanity/client";
import { Category } from "@/sanity/sanity.types";
import { urlFor } from "@/utils/utils";
import {
  PortableText,
  PortableTextComponents,
  type SanityDocument,
} from "next-sanity";
import { Refractor, registerLanguage } from "react-refractor";
import js from "refractor/lang/javascript.js";
import json from "refractor/lang/json";
import typescript from "refractor/lang/typescript";
import { DisqusComments } from "../components/DisqusComments";

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
      <Refractor language={value.language || "text"} value={value.code} />
    ),
  },
};

export default async function PostPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const category = (await searchParams).category;

  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    { slug },
    options
  );

  const authorImage = post?.author?.image;
  const authorImageUrl = urlFor({
    source: authorImage,
    width: 400,
    height: 400,
  });
  const authorName = post?.author?.name || "";

  const queryParams = category ? `?category=${category}` : "";

  return (
    <div className="flex flex-col gap-4">
      <div className="pb-4">
        <NavigationLink
          href={`/blog${queryParams}`}
          className="hover:underline"
        >
          ← Back to posts
        </NavigationLink>
      </div>

      <h1 className="text-4xl font-bold">{post.title}</h1>
      <div className="flex gap-3 items-center">
        {authorImageUrl && (
          <Avatar>
            <AvatarImage
              className="object-cover"
              src={authorImageUrl}
              alt={authorName}
            />
            <AvatarFallback>AL</AvatarFallback>
          </Avatar>
        )}
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
          <SanityImage
            sanitySrc={post.mainImage}
            sanityWidth={1600}
            sanityHeight={900}
            alt={post.title}
            width="1568"
            height="1003"
          />
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
