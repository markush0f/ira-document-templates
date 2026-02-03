import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import DocRenderer from './DocRenderer';
import { PencilSimple, FloppyDisk, X, Check, CaretRight, House } from '@phosphor-icons/react';

interface AppShellProps {
    groupedDocs: any[];
    activeSlug?: string;
    rawDoc?: any;
    children?: React.ReactNode;
}

export default function AppShell({ groupedDocs, activeSlug, rawDoc, children }: AppShellProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [liveData, setLiveData] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const lastSlug = useRef<string | undefined>(activeSlug);

    // Initial Sync & Persistence Check
    useEffect(() => {
        // Try to recover just-saved data from sessionStorage to bypass Astro HMR lag
        const pendingKey = `pending_save_${activeSlug}`;
        const pendingData = sessionStorage.getItem(pendingKey);

        if (pendingData) {
            setLiveData(JSON.parse(pendingData));
            // Keep it for a bit while Astro catches up, then clear
            setTimeout(() => sessionStorage.removeItem(pendingKey), 2000);
        } else if (rawDoc) {
            setLiveData(rawDoc);
        }

        if (activeSlug !== lastSlug.current) {
            setIsEditing(false);
            lastSlug.current = activeSlug;
        }
    }, [rawDoc, activeSlug]);

    const handleSave = async () => {
        if (!activeSlug || !liveData) return;
        setIsSaving(true);

        try {
            // 1. Save locally persistently for Astro reload
            sessionStorage.setItem(`pending_save_${activeSlug}`, JSON.stringify(liveData));

            const response = await fetch('/api/save-doc', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: activeSlug,
                    newData: liveData
                })
            });

            if (response.ok) {
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    setIsEditing(false);
                }, 800);
            } else {
                alert('Error saving');
                setIsSaving(false);
            }
        } catch (e) {
            alert('Connection error');
            setIsSaving(false);
        }
    };

    // Removed early return to support children rendering
    // if (!liveData) return null;

    return (
        <div className="min-h-screen">
            <Sidebar groupedDocs={groupedDocs} activeSlug={activeSlug} />

            <div className="md:ml-72 relative min-h-screen flex flex-col">
                <div className="fixed top-4 right-4 md:right-8 z-[60] flex items-center gap-3">
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all shadow-sm group backdrop-blur-md"
                        >
                            <PencilSimple size={18} className="group-hover:rotate-12 transition-transform" />
                        </button>
                    )}

                    {isEditing && (
                        <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4 duration-300">
                            <button
                                onClick={handleSave}
                                disabled={isSaving || showSuccess}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all shadow-lg font-medium text-sm ${showSuccess
                                    ? 'bg-green-500 text-white shadow-green-500/20'
                                    : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                                    }`}
                            >
                                {showSuccess ? <Check size={18} /> : <FloppyDisk size={18} />}
                                <span>{showSuccess ? 'Updated' : isSaving ? 'Saving...' : 'Save Changes'}</span>
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-red-500 transition-all shadow-sm backdrop-blur-md"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    )}

                    <ThemeToggle />
                </div>

                <main className={`flex-1 transition-colors h-full ${isEditing ? 'bg-slate-50/50 dark:bg-slate-950/30' : ''}`}>
                    {liveData ? (
                        <div className="p-6 md:p-12 lg:px-16 lg:py-12 pt-20 md:pt-12 max-w-7xl mx-auto h-full">
                            <nav className="flex items-center space-x-2 text-[13px] text-main-muted mb-8" aria-label="Breadcrumb">
                                <a href="/" className="flex items-center gap-1.5 opacity-70 hover:opacity-100 transition-opacity">
                                    <House size={14} />
                                    <span>Home</span>
                                </a>
                                <CaretRight size={14} className="opacity-30" />
                                <span className="opacity-70">Docs</span>
                                <CaretRight size={14} className="opacity-30" />
                                <span className="text-sidebar-text-active font-semibold">{liveData.title}</span>
                            </nav>

                            {isEditing ? (
                                <div className="animate-in fade-in duration-500 max-w-5xl">
                                    <div className="space-y-8">
                                        <textarea
                                            value={liveData.title}
                                            onChange={(e) => setLiveData({ ...liveData, title: e.target.value })}
                                            className="w-full bg-transparent border-none text-4xl md:text-5xl font-extrabold tracking-tight text-sidebar-text-active focus:outline-none resize-none overflow-hidden p-0 placeholder:opacity-20"
                                            rows={1}
                                            onInput={(e) => {
                                                const t = e.target as HTMLTextAreaElement;
                                                t.style.height = 'auto';
                                                t.style.height = t.scrollHeight + 'px';
                                            }}
                                        />
                                        <input
                                            type="text"
                                            value={liveData.description}
                                            onChange={(e) => setLiveData({ ...liveData, description: e.target.value })}
                                            className="w-full bg-transparent border-none text-xl text-main-muted focus:outline-none p-0 placeholder:opacity-20"
                                        />
                                        <div className="h-px bg-main-border w-full" />
                                        <textarea
                                            value={liveData.content_markdown || liveData.content || ''}
                                            onChange={(e) => setLiveData({ ...liveData, content_markdown: e.target.value })}
                                            className="w-full min-h-[500px] bg-transparent border-none text-[15.5px] leading-7 font-normal text-main-muted focus:outline-none resize-none p-0 overflow-hidden placeholder:opacity-20"
                                            onInput={(e) => {
                                                const t = e.target as HTMLTextAreaElement;
                                                t.style.height = 'auto';
                                                t.style.height = t.scrollHeight + 'px';
                                            }}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <DocRenderer data={liveData} />
                            )}
                        </div>
                    ) : (
                        <div className="h-full w-full">
                            {children}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
