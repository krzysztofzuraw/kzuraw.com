import { compareWritingsByDateDescending } from "@/helpers/compare-writings-by-date";
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async (context) => {
  const writing = await getCollection("writing").then((posts) =>
    posts.sort(compareWritingsByDateDescending),
  );

  return rss({
    title: "kzuraw.com",
    description: "Website about TypeScript, React and all things frontend",
    site: context.site?.toString() ?? "https://kzuraw.com",
    trailingSlash: false,
    items: writing.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/writing/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
    stylesheet: "/rss/styles.xsl",
  });
};
