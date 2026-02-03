import { getCollection, getEntry } from "astro:content";
import { marked } from "marked";

let cachedDocs: any = null;
let cachedSidebar: any = null;
let htmlCache = new Map();

export async function getGroupedDocs() {
  if (cachedSidebar && import.meta.env.DEV) return cachedSidebar;

  const sidebarEntry = await getEntry("docs", "sidebar");
  if (sidebarEntry) {
    // Return the tree structure
    cachedSidebar = (sidebarEntry.data as any).tree;
  } else {
    // Fallback if no sidebar file
    cachedSidebar = [];
  }

  return cachedSidebar;
}

export async function getAllDocs() {
  if (cachedDocs && import.meta.env.DEV) return cachedDocs;
  const allEntries = await getCollection("docs");
  // Filter out sidebar and metadata, keep only actual docs (those with title)
  cachedDocs = allEntries.filter((entry) =>
    entry.id !== "sidebar" &&
    entry.id !== "metadata" &&
    "title" in entry.data
  );
  return cachedDocs;
}

export function getParsedMarkdown(content: string, id: string) {
  if (htmlCache.has(id) && import.meta.env.DEV) return htmlCache.get(id);
  const html = marked.parse(content);
  htmlCache.set(id, html);
  return html;
}
