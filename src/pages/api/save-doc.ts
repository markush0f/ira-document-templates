import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { id, newData } = await request.json();

    // Build path to original file
    const filePath = path.join(process.cwd(), 'src', 'content', 'docs', `${id}.json`);

    // Format JSON with 2 spaces indentation
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf-8');

    return new Response(JSON.stringify({ message: 'Document saved successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving document:', error);
    return new Response(JSON.stringify({ error: 'Could not save file' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
