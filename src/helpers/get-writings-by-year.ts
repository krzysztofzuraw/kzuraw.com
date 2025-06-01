import { getCollection } from "astro:content";
import { sortWritingsByDate } from "./sort-writings-by-date";

export const getWritingsByYear = async () => {
  const posts = await getCollection("writing");

  const sortedPosts = posts.sort(sortWritingsByDate);

  const groupedByYear = sortedPosts.reduce(
    (acc, post) => {
      const year = post.data.pubDate?.getFullYear();
      if (!year) return acc;

      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(post);
      return acc;
    },
    {} as Record<number, typeof posts>,
  );

  return Object.entries(groupedByYear)
    .map(([year, posts]) => [parseInt(year), posts] as [number, typeof posts])
    .sort(([a], [b]) => b - a);
};
