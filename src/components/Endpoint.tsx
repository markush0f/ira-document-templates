import { Copy } from '@phosphor-icons/react';

interface EndpointProps {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    path: string;
    description: string;
}

const methodColors = {
    GET: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    POST: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    PUT: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    DELETE: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    PATCH: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
};

export const Endpoint: React.FC<EndpointProps> = ({ method, path, description }) => {
    return (
        <div className="group flex flex-col md:flex-row items-stretch border-b last:border-0 border-slate-100 dark:border-slate-800 transition-all hover:bg-slate-50/80 dark:hover:bg-blue-900/10">
            {/* Method and Path Area */}
            <div className="flex items-center gap-4 px-6 py-5 md:w-[40%] bg-slate-50/30 dark:bg-slate-900/20 group-hover:bg-white dark:group-hover:bg-slate-900/40 transition-colors">
                <span className={`w-20 shrink-0 text-center py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest leading-none ${methodColors[method]} shadow-sm`}>
                    {method}
                </span>
                <code className="text-[14px] font-mono font-semibold text-slate-800 dark:text-blue-400 break-all">
                    {path}
                </code>
            </div>

            {/* Description Area */}
            <div className="flex-1 px-8 py-5 flex items-center border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800">
                <p className="text-[14.5px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {description}
                </p>

                {/* Visual indicator for interactive feel */}
                <div className="ml-auto pl-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-blue-500 transition-colors" title="Copy URL">
                        <Copy size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
};
