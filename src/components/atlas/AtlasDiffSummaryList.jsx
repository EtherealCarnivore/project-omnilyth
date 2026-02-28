/*
 * AtlasDiffSummaryList.jsx — Lists nodes to add/remove in the diff view.
 *
 * Grouped by content type, with node names, type badges, and stats.
 * Hovering a node highlights it on the tree.
 */

import { useMemo } from 'react';
import { useAtlasDiff } from '../../contexts/AtlasDiffContext';
import { CONTENT_TYPES } from '../../data/atlas/atlasTreeConstants';

const TYPE_BADGE = {
  keystone: { text: 'Key', color: 'text-purple-400 bg-purple-400/10 border-purple-400/20' },
  notable: { text: 'Not', color: 'text-amber-400 bg-amber-400/10 border-amber-400/20' },
  regular: { text: 'Sm', color: 'text-zinc-500 bg-zinc-500/10 border-zinc-500/20' },
};

function classifyNode(node) {
  if (!node?.stats?.length) return 'General';
  for (const stat of node.stats) {
    for (const [contentType, keywords] of Object.entries(CONTENT_TYPES)) {
      if (contentType === 'General') continue;
      if (keywords.some(kw => stat.toLowerCase().includes(kw.toLowerCase()))) {
        return contentType;
      }
    }
  }
  return 'General';
}

function NodeRow({ nodeId, node, type, onHover, onLeave, color }) {
  const badge = TYPE_BADGE[type] || TYPE_BADGE.regular;

  return (
    <div
      className="flex items-start gap-2 py-1.5 px-2 rounded hover:bg-white/5 cursor-default transition-colors"
      onMouseEnter={() => onHover(nodeId)}
      onMouseLeave={onLeave}
    >
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0`} style={{ backgroundColor: color }} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-zinc-200 truncate">{node.name}</span>
          <span className={`text-[9px] px-1 py-0 rounded border flex-shrink-0 ${badge.color}`}>
            {badge.text}
          </span>
        </div>
        {node.stats?.length > 0 && (
          <div className="mt-0.5">
            {node.stats.map((stat, i) => (
              <div key={i} className="text-[10px] text-zinc-500 leading-tight truncate">{stat}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function NodeGroup({ title, nodeEntries, color, onHover, onLeave }) {
  if (nodeEntries.length === 0) return null;
  return (
    <div className="mb-3">
      <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider px-2 mb-1">
        {title} ({nodeEntries.length})
      </div>
      {nodeEntries.map(({ nodeId, node, type }) => (
        <NodeRow
          key={nodeId}
          nodeId={nodeId}
          node={node}
          type={type}
          color={color}
          onHover={onHover}
          onLeave={onLeave}
        />
      ))}
    </div>
  );
}

export default function AtlasDiffSummaryList() {
  const { treeData, diffResult, setHoveredNode } = useAtlasDiff();

  // Group diff nodes by content type
  const { addGroups, removeGroups } = useMemo(() => {
    if (!diffResult || !treeData) return { addGroups: {}, removeGroups: {} };

    const groupNodes = (nodeSet) => {
      const groups = {};
      for (const nodeId of nodeSet) {
        const node = treeData.nodes[nodeId];
        if (!node?.name) continue;
        const category = classifyNode(node);
        if (!groups[category]) groups[category] = [];
        groups[category].push({
          nodeId,
          node,
          type: treeData.nodeMeta[nodeId]?.type || 'regular',
        });
      }
      // Sort each group: keystones first, then notables, then regular
      const typeOrder = { keystone: 0, notable: 1, regular: 2 };
      for (const entries of Object.values(groups)) {
        entries.sort((a, b) => (typeOrder[a.type] || 2) - (typeOrder[b.type] || 2));
      }
      return groups;
    };

    return {
      addGroups: groupNodes(diffResult.toAdd),
      removeGroups: groupNodes(diffResult.toRemove),
    };
  }, [diffResult, treeData]);

  const onHover = (nodeId) => setHoveredNode(nodeId);
  const onLeave = () => setHoveredNode(null);

  if (!diffResult) {
    return (
      <div className="text-xs text-zinc-600 text-center py-4">
        Paste two trees above and click Compare to see the diff.
      </div>
    );
  }

  const addEntries = Object.entries(addGroups).sort((a, b) => b[1].length - a[1].length);
  const removeEntries = Object.entries(removeGroups).sort((a, b) => b[1].length - a[1].length);

  const noChanges = addEntries.length === 0 && removeEntries.length === 0;

  if (noChanges) {
    return (
      <div className="text-xs text-green-400 text-center py-4">
        Trees are identical — no changes needed.
      </div>
    );
  }

  return (
    <div>
      {/* Nodes to Add (green) */}
      {addEntries.length > 0 && (
        <div className="mb-4">
          <div className="text-xs font-semibold text-green-400 mb-2 px-2 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            Nodes to Add ({diffResult.toAdd.size})
          </div>
          {addEntries.map(([category, entries]) => (
            <NodeGroup
              key={category}
              title={category}
              nodeEntries={entries}
              color="#22c55e"
              onHover={onHover}
              onLeave={onLeave}
            />
          ))}
        </div>
      )}

      {/* Nodes to Remove (red) */}
      {removeEntries.length > 0 && (
        <div>
          <div className="text-xs font-semibold text-red-400 mb-2 px-2 flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            Nodes to Remove ({diffResult.toRemove.size})
          </div>
          {removeEntries.map(([category, entries]) => (
            <NodeGroup
              key={category}
              title={category}
              nodeEntries={entries}
              color="#ef4444"
              onHover={onHover}
              onLeave={onLeave}
            />
          ))}
        </div>
      )}
    </div>
  );
}
