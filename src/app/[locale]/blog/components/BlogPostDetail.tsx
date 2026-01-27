"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { type ISbStoryData } from "@storyblok/js";
import { useStoryblokRichText } from "@storyblok/react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function BlogPostDetail({ story }: { story: ISbStoryData }) {
  const { render } = useStoryblokRichText({
    resolvers: {},
  });

  if (!story || !story.content) return null;

  const { content, name, first_published_at, tag_list } = story;

  // Author details
  const author = content.author?.content;
  const authorName = author?.name || "Guest Author";
  const authorImg = author?.avatar?.filename;

  return (
    <article className="flex flex-col gap-4">
      <div className="pb-3">
        <Link href="/blog" className="text-sm text-primary hover:underline">
          ← Back to Posts
        </Link>
      </div>

      <header className="flex flex-col gap-6">
        <h1 className="text-4xl font-extrabold tracking-tight">{name}</h1>

        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={`${authorImg}/m/100x100`}
              alt={authorName}
              className="object-cover"
            />
            <AvatarFallback>{authorName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span>{authorName}</span>
            <span className="text-sm text-muted-foreground">
              {first_published_at &&
                new Date(first_published_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          {tag_list?.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </header>

      {content.mainImage?.filename && (
        <div className="flex justify-center">
          <div className="max-w-screen-lg relative aspect-video w-full mb-12 overflow-hidden rounded-2xl shadow-lg">
            <Image
              src={content.mainImage.filename}
              alt={content.mainImage.alt || name}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </div>
      )}

      {/* Render the Rich Text content */}
      <div className="prose lg:prose-lg dark:prose-invert max-w-none">
        {render(content.body)}
      </div>
    </article>
  );
}
