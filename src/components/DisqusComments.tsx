"use client";

import { DiscussionEmbed } from "disqus-react";
import { SanityDocument } from "next-sanity";
import { useTheme } from "next-themes";

export const DisqusComments = ({ post }: { post: SanityDocument }) => {
  const { theme } = useTheme();

  return (
    <DiscussionEmbed
      key={theme}
      shortname="nehno"
      config={{
        url: `https://nehno.com/posts/${post.slug}`,
        identifier: post.id,
        title: post.title,
      }}
    />
  );
};
