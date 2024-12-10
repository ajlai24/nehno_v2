"use client";

import { DiscussionEmbed } from "disqus-react";
import { SanityDocument } from "next-sanity";

export const DisqusComments = ({ post }: { post: SanityDocument }) => {
  return (
    <DiscussionEmbed
      shortname="nehno"
      config={{
        url: `https://nehno.com/posts/${post.slug}`,
        identifier: post.id,
        title: post.title,
      }}
    />
  );
};
