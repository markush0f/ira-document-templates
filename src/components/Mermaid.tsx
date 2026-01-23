import React, { useEffect, useRef, useState, useId } from 'react';
import mermaid from 'mermaid';

interface MermaidProps {
    chart: string;
}

const Mermaid: React.FC<MermaidProps> = ({ chart }) => {
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const id = useId().replace(/:/g, '');

    useEffect(() => {
        const isDark = document.documentElement.classList.contains('dark');

        mermaid.initialize({
            startOnLoad: false,
            theme: isDark ? 'dark' : 'base',
            securityLevel: 'loose',
            fontFamily: 'Inter, system-ui, sans-serif',
            themeVariables: {
                // Colors adjusted for a professional "Database Tool" look
                primaryColor: isDark ? '#3b82f6' : '#2563eb',
                primaryTextColor: '#ffffff',
                primaryBorderColor: isDark ? '#3b82f6' : '#2563eb',
                lineColor: isDark ? '#64748b' : '#94a3b8',
                secondaryColor: isDark ? '#1e293b' : '#f1f5f9',
                tertiaryColor: isDark ? '#0f172a' : '#ffffff',

                // Entity specific styles
                mainBkg: isDark ? '#0f172a' : '#ffffff',
                entityBkg: isDark ? '#1e293b' : '#ffffff',
                entityBorder: isDark ? '#334155' : '#e2e8f0',
                attributeBackgroundColor: isDark ? '#111827' : '#f8fafc',
                attributeFontColor: isDark ? '#94a3b8' : '#64748b',
            }
        });

        const renderDiagram = async () => {
            if (!chart) return;
            try {
                const renderId = `mermaid-render-${id}`;
                // Clean up title and extra spaces
                const cleanChart = chart.trim();
                const { svg } = await mermaid.render(renderId, cleanChart);
                setSvg(svg);
                setError(null);
            } catch (err) {
                console.error('Mermaid error:', err);
                setError('Error al renderizar el diagrama de DB');
            }
        };

        renderDiagram();

        const observer = new MutationObserver(() => {
            const isDarkNew = document.documentElement.classList.contains('dark');
            mermaid.initialize({ theme: isDarkNew ? 'dark' : 'base' });
            renderDiagram();
        });

        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, [chart, id]);

    if (error) {
        return (
            <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-xs font-mono">
                {error}
            </div>
        );
    }

    return (
        <div className="mermaid-outer w-full flex flex-col items-center py-10 px-6 bg-slate-50/30 dark:bg-slate-900/10 rounded-3xl border border-slate-200/50 dark:border-slate-800/50 my-10 transition-all overflow-hidden">
            {svg ? (
                <div
                    className="mermaid-svg-container w-full max-w-full flex justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-w-[700px] transition-opacity duration-500"
                    dangerouslySetInnerHTML={{ __html: svg }}
                />
            ) : (
                <div className="flex items-center gap-3 text-slate-400 text-xs animate-pulse py-8">
                    <div className="w-2 h-2 bg-blue-500/50 rounded-full"></div>
                    Esquematizando base de datos...
                </div>
            )}
        </div>
    );
};

export default Mermaid;
