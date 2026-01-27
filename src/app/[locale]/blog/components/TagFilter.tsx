"use client";

import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import { StoryblokTag } from "../storyblok.types";

const TagFilter = ({
  tags,
  selectedTag,
}: {
  tags: StoryblokTag[];
  selectedTag: string;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTagChange = (tagName: string | undefined) => {
    const params = new URLSearchParams(searchParams.toString());

    if (!tagName) {
      params.delete("tag");
    } else {
      params.set("tag", tagName);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="pt-4 flex flex-wrap gap-2 items-center">
      <Badge
        className="cursor-pointer select-none"
        variant={!selectedTag ? "default" : "secondary"}
        onClick={() => handleTagChange(undefined)}
      >
        All
      </Badge>

      {tags.map((tag) => (
        <Badge
          key={tag.name}
          variant={selectedTag === tag.name ? "default" : "secondary"}
          onClick={() => handleTagChange(tag.name)}
          className="cursor-pointer select-none"
        >
          {tag.name}
        </Badge>
      ))}
    </div>
  );
};

export default TagFilter;
