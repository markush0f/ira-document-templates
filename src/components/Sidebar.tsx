import React, { useState, useEffect } from 'react';
import { X, Menu } from 'lucide-react';

interface SidebarProps {
    groupedDocs: any[];
    activeSlug?: string;
}

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
                <div className="p-8 h-full flex flex-col">
                    <div className="flex-1 overflow-y-auto custom-scrollbar -mr-4 pr-4">
                        {groupedDocs.map((category) => (
                            <div key={category.name} className="mb-6">
                                <h3 className="px-3 mb-2 text-[13px] font-normal text-sidebar-text opacity-90">
                                    {category.name}
                                </h3>
                                <nav className="space-y-0.5 ml-3">
                                    {category.items.map((doc: any) => (
                                        <a
                                            key={doc.id}
                                            href={`/docs/${doc.id}`}
                                            className={`block px-4 py-1.5 rounded-md text-[13.5px] transition-all duration-150 ${activeSlug === doc.id
                                                ? "bg-sidebar-bg-active text-sidebar-text-active font-medium shadow-sm"
                                                : "text-sidebar-text hover:text-sidebar-text-active hover:bg-sidebar-bg-active/40"
                                                }`}
                                        >
                                            {doc.data.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>
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
