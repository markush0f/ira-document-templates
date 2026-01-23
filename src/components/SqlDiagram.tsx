import React, { useMemo, useState } from 'react';
import ReactFlow, {
    type Node,
    type Edge,
    Position,
    Handle,
    Background,
    Controls,
    ConnectionLineType,
    ReactFlowProvider
} from 'reactflow';
import { Parser } from 'node-sql-parser';
import dagre from 'dagre';

// Custom Table Node Component
const TableNode = ({ data }: { data: any }) => {
    return (
        <div className="min-w-[220px] shadow-2xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 font-sans text-[13px]">
            <div className="bg-blue-600 dark:bg-blue-600 px-4 py-2.5 border-b border-blue-500/20">
                <h3 className="text-white font-bold uppercase tracking-wider text-[11px]">{data.label}</h3>
            </div>
            <div className="p-0">
                <table className="w-full border-collapse">
                    <tbody>
                        {data.columns.map((col: any, idx: number) => (
                            <tr key={idx} className="border-b border-slate-100 dark:border-slate-900 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                                <td className="px-4 py-2 font-mono text-slate-700 dark:text-slate-300">
                                    <div className="flex items-center gap-2">
                                        {col.isPK && <span className="text-[10px] bg-yellow-400/20 text-yellow-600 dark:text-yellow-500 px-1 rounded font-bold" title="Primary Key">PK</span>}
                                        {col.isFK && <span className="text-[10px] bg-blue-400/20 text-blue-600 dark:text-blue-400 px-1 rounded font-bold" title="Foreign Key">FK</span>}
                                        <span className={col.isPK ? "font-bold" : ""}>{col.name}</span>
                                    </div>
                                </td>
                                <td className="px-4 py-2 text-right text-slate-400 dark:text-slate-500 italic text-[11px]">
                                    {col.type}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Handle type="target" position={Position.Left} className="!w-2 !h-2 !bg-blue-500 !border-white dark:!border-slate-900" />
            <Handle type="source" position={Position.Right} className="!w-2 !h-2 !bg-blue-500 !border-white dark:!border-slate-900" />
            <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-blue-500 !border-white dark:!border-slate-900" />
            <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-blue-500 !border-white dark:!border-slate-900" />
        </div>
    );
};

const nodeTypes = {
    table: TableNode,
};

const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
    const dagreGraph = new dagre.graphlib.Graph();
    dagreGraph.setDefaultEdgeLabel(() => ({}));
    dagreGraph.setGraph({ rankdir: direction, ranksep: 100, nodesep: 80 });

    nodes.forEach((node) => {
        const height = 60 + (node.data.columns.length * 30);
        dagreGraph.setNode(node.id, { width: 250, height });
    });

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    return nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id);
        const isHorizontal = direction === 'LR';
        node.targetPosition = isHorizontal ? Position.Left : Position.Top;
        node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom;
        node.position = {
            x: nodeWithPosition.x - 250 / 2,
            y: nodeWithPosition.y - 200 / 2,
        };
        return node;
    });
};

interface SqlDiagramProps {
    sql: string;
}

const Flow = ({ sql }: SqlDiagramProps) => {
    const [debugError, setDebugError] = useState<string | null>(null);

    const { nodes, edges } = useMemo(() => {
        if (!sql) return { nodes: [], edges: [] };

        try {
            const parser = new Parser();
            const ast = parser.astify(sql, { database: 'postgresql' });

            const nodes: Node[] = [];
            const edges: Edge[] = [];
            const tables = Array.isArray(ast) ? ast : [ast];

            tables.forEach((table: any) => {
                if (table.type === 'create' && table.keyword === 'table') {
                    const tableName = table.table[0].table;
                    const columns = table.create_definitions.map((def: any) => {
                        if (def.resource === 'column') {
                            const colName = def.column.column;
                            let isPK = def.primary_key === 'primary key';
                            let isFK = !!def.reference_definition;

                            table.create_definitions.forEach((d: any) => {
                                if (d.resource === 'constraint') {
                                    const isTarget = (d.definition?.[0]?.column === colName) || (d.columns?.[0]?.column === colName);
                                    if (isTarget) {
                                        if (d.constraint_type === 'primary key') isPK = true;
                                        if (d.constraint_type === 'foreign key') isFK = true;
                                    }
                                }
                            });

                            return { name: colName, type: def.definition.dataType, isPK, isFK };
                        }
                        return null;
                    }).filter(Boolean);

                    table.create_definitions.forEach((def: any) => {
                        const ref = def.reference_definition || def.definition?.reference_definition;
                        if (ref) {
                            const targetTable = ref.table[0].table;
                            edges.push({
                                id: `e-${targetTable}-${tableName}`,
                                source: targetTable,
                                target: tableName,
                                animated: true,
                                style: { stroke: '#3b82f6', strokeWidth: 2 },
                                type: ConnectionLineType.SmoothStep,
                            });
                        }
                    });

                    nodes.push({
                        id: tableName,
                        type: 'table',
                        data: { label: tableName, columns },
                        position: { x: 0, y: 0 },
                    });
                }
            });

            if (nodes.length === 0) {
                setDebugError("SQL no contiene tablas CREATE válidas.");
                return { nodes: [], edges: [] };
            }

            const layoutedNodes = getLayoutedElements(nodes, edges);
            return { nodes: layoutedNodes, edges };
        } catch (e: any) {
            setDebugError(`Error SQL: ${e.message}`);
            return { nodes: [], edges: [] };
        }
    }, [sql]);

    return (
        <div className="h-[600px] w-full bg-slate-100 dark:bg-[#020617] rounded-3xl border border-slate-200 dark:border-slate-800/50 overflow-hidden my-12 shadow-2xl relative">
            {debugError && (
                <div className="absolute top-4 right-4 z-[100] p-3 bg-red-500 text-white text-[10px] rounded-lg shadow-xl font-mono max-w-[300px]">
                    {debugError}
                </div>
            )}
            <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/80 dark:bg-slate-900/80 backdrop-blur rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-800">
                Interactive Schema Explorer
            </div>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                fitView
                fitViewOptions={{ padding: 0.2 }}
                minZoom={0.1}
                maxZoom={2}
            >
                <Background gap={24} color="#3b82f6" className="opacity-[0.03]" />
                <Controls className="!bg-white dark:!bg-slate-900 !border-slate-200 dark:!border-slate-800 !shadow-lg" />
            </ReactFlow>
        </div>
    );
};

export const SqlDiagram = (props: SqlDiagramProps) => (
    <ReactFlowProvider>
        <Flow {...props} />
    </ReactFlowProvider>
);
