import { getCollection } from "astro:content";
import { marked } from "marked";

let cachedDocs: any = null;
let cachedGroupedDocs: any = null;
let htmlCache = new Map();

export async function getGroupedDocs() {
  if (cachedGroupedDocs && import.meta.env.DEV) return cachedGroupedDocs;

  const docs = await getCollection("docs");
  
  const categories = [...new Set(docs.map((doc) => doc.data.category))].sort(
    (a, b) => {
      if (a === "Overview") return -1;
      if (b === "Overview") return 1;
      return a.localeCompare(b);
    },
  );

  cachedGroupedDocs = categories.map((category) => ({
    name: category,
    items: docs
      .filter((doc) => doc.data.category === category)
      .sort((a, b) => a.data.order - b.data.order),
  }));

  return cachedGroupedDocs;
}

export async function getAllDocs() {
    if (cachedDocs && import.meta.env.DEV) return cachedDocs;
    cachedDocs = await getCollection("docs");
    return cachedDocs;
}

export function getParsedMarkdown(content: string, id: string) {
    if (htmlCache.has(id) && import.meta.env.DEV) return htmlCache.get(id);
    const html = marked.parse(content);
    htmlCache.set(id, html);
    return html;
}
