import { getLatestWritings } from "@/helpers/get-latest-writing";
import rss from "@astrojs/rss";
import type { APIRoute } from "astro";

export const GET: APIRoute = async (context) => {
  const latestWriting = await getLatestWritings();

  return rss({
    title: "kzuraw.com",
    description: "Website about TypeScript, React and all things frontend",
    site: context.site?.toString() ?? "https://kzuraw.com",
    trailingSlash: false,
    items: latestWriting.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/writing/${post.slug}/`,
    })),
    customData: `<language>en-us</language>`,
    stylesheet: "/rss/styles.xsl",
  });
};
