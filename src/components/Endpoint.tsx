import React from 'react';

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
        <div className="group mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900/50">
            <div className="flex items-center gap-4 p-4">
                <span className={`rounded px-2.5 py-1 text-xs font-bold uppercase tracking-wider ${methodColors[method]}`}>
                    {method}
                </span>
                <code className="text-sm font-mono font-medium text-slate-800 dark:text-slate-200">
                    {path}
                </code>
            </div>
            <div className="border-t border-slate-100 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/30">
                <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                    {description}
                </p>
            </div>
        </div>
    );
};
