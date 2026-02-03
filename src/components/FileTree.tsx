import React, { useState } from 'react';
import { Folder, FolderOpen, File, CaretRight, CaretDown } from '@phosphor-icons/react';

interface TreeNode {
    type: 'file' | 'directory';
    name: string;
    contents?: TreeNode[];
}

const FileTreeNode = ({ node, depth = 0 }: { node: TreeNode; depth?: number }) => {
    const [isOpen, setIsOpen] = useState(depth < 2); // Open top levels by default
    const isDir = node.type === 'directory';

    if (!isDir) {
        return (
            <div
                className="flex items-center gap-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded px-2 cursor-default transition-colors text-zinc-600 dark:text-zinc-400"
                style={{ paddingLeft: `${depth * 20 + 8}px` }}
            >
                <File weight="regular" size={14} className="text-zinc-400" />
                <span className="text-sm font-mono">{node.name}</span>
            </div>
        );
    }

    return (
        <div>
            <div
                className="flex items-center gap-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 rounded px-2 cursor-pointer select-none transition-colors text-zinc-800 dark:text-zinc-200"
                style={{ paddingLeft: `${depth * 20}px` }}
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="opacity-50 w-4 flex justify-center">
                    {isOpen ? <CaretDown size={14} /> : <CaretRight size={14} />}
                </span>
                {isOpen ? <FolderOpen weight="fill" size={16} className="text-blue-500" /> : <Folder weight="fill" size={16} className="text-blue-500" />}
                <span className="text-sm font-medium">{node.name}</span>
            </div>

            {isOpen && node.contents && (
                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                    {node.contents.map((child, index) => (
                        <FileTreeNode key={`${child.name}-${index}`} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default function FileTree({ data }: { data: TreeNode[] }) {
    if (!data || data.length === 0) return null;

    // Handle the root array
    return (
        <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 bg-white dark:bg-[#0a0a0a] overflow-x-auto min-h-[500px]">
            {data.map((node, index) => (
                <FileTreeNode key={`${node.name}-${index}`} node={node} />
            ))}
        </div>
    );
}
