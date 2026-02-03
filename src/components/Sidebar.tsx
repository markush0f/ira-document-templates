import React, { useState, useEffect } from 'react';
import { X, Menu, ChevronRight, ChevronDown, MessageCircle, FolderTree } from 'lucide-react';

interface SidebarNode {
    id: string;
    label: string;
    type: 'category' | 'page';
    children?: SidebarNode[];
}

interface SidebarProps {
    groupedDocs: SidebarNode[];
    activeSlug?: string;
}

const SidebarItem = ({ item, activeSlug, depth = 0 }: { item: SidebarNode, activeSlug?: string, depth?: number }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const isActive = activeSlug === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isCategory = item.type === 'category';

    useEffect(() => {
        // Auto-expand if a child is active
        if (hasChildren) {
            const containsActive = (nodes: SidebarNode[]): boolean => {
                return nodes.some(node => node.id === activeSlug || (node.children && containsActive(node.children)));
            };
            if (containsActive(item.children!)) {
                setIsExpanded(true);
            }
        }
    }, [activeSlug, item, hasChildren]);

    if (isCategory) {
        return (
            <div className="mb-1">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`w-full flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium transition-colors rounded-md hover:bg-white/5 
                    ${depth === 0 ? 'text-sidebar-text opacity-90 mt-4 mb-2 uppercase tracking-wider text-xs' : 'text-sidebar-text/80'}`}
                    style={{ paddingLeft: depth > 0 ? `${depth * 12 + 12}px` : undefined }}
                >
                    {depth > 0 && (
                        <span className="opacity-50">
                            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                        </span>
                    )}
                    {/* Only show icon for deeper categories if desired, or just text for top level */}

                    <span>{item.label}</span>
                </button>
                {isExpanded && hasChildren && (
                    <div className="flex flex-col">
                        {item.children!.map((child) => (
                            <SidebarItem key={child.id} item={child} activeSlug={activeSlug} depth={depth + 1} />
                        ))}
                    </div>
                )}
            </div>
        );
    }

    // Page Item
    return (
        <a
            href={`/docs/${item.id}`}
            className={`flex items-center gap-2 px-3 py-1.5 text-[13.5px] rounded-md transition-all duration-150 mb-0.5
            ${isActive
                    ? "bg-sidebar-bg-active text-sidebar-text-active font-medium shadow-sm"
                    : "text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-bg-active/40"
                }`}
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
            {/* <span>{item.label}</span> already has text only */}
            <span>{item.label}</span>
        </a>
    );
};

export default function Sidebar({ groupedDocs, activeSlug }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Close sidebar on route change (mobile)
    useEffect(() => {
        setIsOpen(false);
    }, [activeSlug]);

    return (
        <>
            {/* Mobile Toggle Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="md:hidden fixed top-4 left-4 z-[60] p-2 rounded-lg bg-white/10 border border-white/10 backdrop-blur-md text-slate-400 hover:text-white transition-all shadow-xl"
                >
                    <Menu size={20} />
                </button>
            )}

            {/* Sidebar Container */}
            <aside
                className={`w-72 fixed inset-y-0 left-0 bg-sidebar-bg border-r border-sidebar-border z-50 transition-transform duration-300 backdrop-blur-xl flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    }`}
            >
                <div className="h-full flex flex-col">
                    {/* Header/Brand if needed */}
                    <div className="p-6 pb-2">
                        {/* Use the top level project structure if useful, or just iterate */}
                    </div>

                    <div className="px-3 mb-2">
                        <a
                            href="/chat"
                            className={`flex items-center gap-2 px-3 py-2 text-[13.5px] rounded-md transition-all duration-150 mb-0.5 border border-transparent
                            ${activeSlug === 'chat'
                                    ? "bg-sidebar-bg-active text-sidebar-text-active font-medium shadow-sm"
                                    : "text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-bg-active/40 hover:border-sidebar-border"
                                }`}
                        >
                            <span className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-sm">
                                <MessageCircle size={12} />
                            </span>
                            <span className="font-medium">AI Assistant</span>
                        </a>
                        <a
                            href="/structure"
                            className={`flex items-center gap-2 px-3 py-2 text-[13.5px] rounded-md transition-all duration-150 mb-0.5 border border-transparent
                            ${activeSlug === 'structure'
                                    ? "bg-sidebar-bg-active text-sidebar-text-active font-medium shadow-sm"
                                    : "text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-bg-active/40 hover:border-sidebar-border"
                                }`}
                        >
                            <span className="flex items-center justify-center w-5 h-5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 shadow-sm">
                                <FolderTree size={12} />
                            </span>
                            <span className="font-medium">Structure</span>
                        </a>
                        <div className="h-px bg-sidebar-border/50 my-2 mx-2"></div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-8">
                        {groupedDocs.map((node) => (
                            <SidebarItem key={node.id} item={node} activeSlug={activeSlug} />
                        ))}
                    </div>

                    {/* Mobile Close Button */}
                    <button
                        onClick={() => setIsOpen(false)}
                        className="md:hidden absolute top-6 right-6 p-2 text-sidebar-text hover:text-sidebar-text-active transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    onClick={() => setIsOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden animate-in fade-in duration-300"
                />
            )}
        </>
    );
}
