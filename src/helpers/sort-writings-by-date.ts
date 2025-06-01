import type { CollectionEntry } from "astro:content";

export const sortWritingsByDate = (
  firstEntry: CollectionEntry<"writing">,
  secondEntry: CollectionEntry<"writing">,
) => {
  const firstTimestamp = firstEntry.data.pubDate
    ? new Date(firstEntry.data.pubDate).getTime()
    : 0;
  const secondTimestamp = secondEntry.data.pubDate
    ? new Date(secondEntry.data.pubDate).getTime()
    : 0;
  return secondTimestamp - firstTimestamp;
};
