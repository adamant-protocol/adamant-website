import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('updates', ({ data }) => !data.draft);
  const sorted = posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  const site = context.site?.toString().replace(/\/$/, '') ?? 'https://adamantprotocol.com';

  const items = sorted
    .map((post) => {
      const url = `${site}/updates/${post.slug}`;
      return `    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>${url}</link>
      <guid>${url}</guid>
      <pubDate>${post.data.date.toUTCString()}</pubDate>
      <description><![CDATA[${post.data.description}]]></description>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Adamant — Updates</title>
    <link>${site}</link>
    <description>Project updates from the Adamant protocol.</description>
    <language>en-gb</language>
    <atom:link xmlns:atom="http://www.w3.org/2005/Atom" href="${site}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
