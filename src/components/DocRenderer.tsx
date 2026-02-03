import React, { useMemo } from 'react';
import { marked } from 'marked';
import Mermaid from './Mermaid';
import TableOfContents from './TableOfContents';

const EndpointReact = ({ method, path, description }: any) => {
    const methodColors: any = {
        GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
        DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        PATCH: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    };

    return (
        <div className="group flex flex-col md:flex-row items-stretch border-b last:border-0 border-main-border transition-all hover:bg-slate-50/50 dark:hover:bg-white/5">
            <div className="flex items-center gap-4 px-6 py-5 md:w-[40%] bg-main-bg/30 group-hover:bg-main-bg/50 transition-colors">
                <span className={`w-20 shrink-0 text-center py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest leading-none ${methodColors[method]} shadow-sm`}>
                    {method}
                </span>
                <code className="text-[14px] font-mono font-semibold text-sidebar-text-active break-all">
                    {path}
                </code>
            </div>
            <div className="flex-1 px-8 py-5 flex items-center border-t md:border-t-0 md:border-l border-main-border">
                <p className="text-[14.5px] leading-relaxed text-main-muted">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default function DocRenderer({ data }: { data: any }) {
    // Adapter for legacy/new format
    const content = data.content_markdown || data.content;
    const diagram = data.diagram_mermaid || data.diagram;
    const relatedFiles = data.related_files || [];

    // Force a fresh parse on every data change
    const htmlContent = useMemo(() => {
        if (!content) return '';
        // Ensure we're using the sync parse
        const parser = typeof marked.parse === 'function' ? marked.parse : (marked as any);
        return parser(content);
    }, [content]);

    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 animate-in fade-in duration-300">
            <div className="flex-1 min-w-0">
                <article className="prose max-w-4xl prose-headings:scroll-mt-24 dark:prose-invert">
                    {htmlContent && <div dangerouslySetInnerHTML={{ __html: htmlContent as string }} />}

                    {diagram && (
                        <div className="not-prose my-12" key={diagram.length}>
                            <Mermaid chart={diagram} />
                        </div>
                    )}
                </article>

                {relatedFiles.length > 0 && (
                     <div className="mt-16 border-t border-main-border pt-8">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-main-muted mb-4">
                            Related Files
                        </h3>
                        <ul className="space-y-2">
                            {relatedFiles.map((file: string, i: number) => (
                                <li key={i} className="flex items-center gap-2 text-sm font-mono text-sidebar-text-active bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-md">
                                    <span className="opacity-50">📄</span>
                                    {file}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {content && <TableOfContents content={content} />}
        </div>
    );
}
