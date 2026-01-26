import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const { id, newData } = await request.json();
    
    // Construir la ruta al archivo original en src/content/docs/
    const filePath = path.join(process.cwd(), 'src', 'content', 'docs', `${id}.json`);
    
    // Formatear el JSON para que siga siendo legible (2 espacios)
    await fs.writeFile(filePath, JSON.stringify(newData, null, 2), 'utf-8');
    
    return new Response(JSON.stringify({ message: 'Documento guardado con éxito' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error saving document:', error);
    return new Response(JSON.stringify({ error: 'No se pudo guardar el archivo' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
