"use client";

import { DiscussionEmbed } from "disqus-react";
import { useTheme } from "next-themes";

interface DisqusCommentsProps {
  slug: string;
  id: string | number;
  title: string;
}

export const DisqusComments = ({ slug, id, title }: DisqusCommentsProps) => {
  const { theme } = useTheme();

  return (
    <DiscussionEmbed
      key={theme}
      shortname="nehno"
      config={{
        url: `https://nehno.com/blog/${slug}`,
        identifier: String(id),
        title: title,
      }}
    />
  );
};
