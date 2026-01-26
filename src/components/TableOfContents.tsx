import React from 'react';

export default function TableOfContents({ content }: { content: string }) {
    // Basic regex to find markdown headings (## and ###)
    const headingRegex = /^(##|###)\s+(.*)$/gm;
    const headings = [];
    let match;

    while ((match = headingRegex.exec(content)) !== null) {
        const level = match[1].length; // 2 for ##, 3 for ###
        const text = match[2];
        const id = text
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-");

        headings.push({ level, text, id });
    }

    if (headings.length === 0) return null;

    return (
        <aside className="hidden lg:block w-64 sticky top-24 self-start ml-8">
            <h4 className="text-[13px] font-semibold text-sidebar-text-active uppercase tracking-wider mb-4 opacity-70">
                On this page
            </h4>
            <nav className="space-y-3">
                {headings.map((heading, i) => (
                    <a
                        key={i}
                        href={`#${heading.id}`}
                        className={`block text-[13.5px] transition-colors hover:text-primary ${heading.level === 3
                                ? "ml-4 text-main-muted/80"
                                : "text-main-muted font-medium"
                            }`}
                    >
                        {heading.text}
                    </a>
                ))}
            </nav>
        </aside>
    );
}
