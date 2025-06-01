import { getCollection } from "astro:content";
import { sortWritingsByDate } from "./sort-writings-by-date";

export const getLatestWritings = async () => {
  const writingsCollection = await getCollection("writing");

  return writingsCollection.sort(sortWritingsByDate).slice(0, 3);
};
