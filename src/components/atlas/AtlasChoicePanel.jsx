/*
 * AtlasChoicePanel.jsx — Pick the active effect of each allocated
 * choose-one notable (3.30 `isMultipleChoiceVariant` nodes).
 *
 * Lines shown are the tree data's own `stats` / `variantEffects[].stats`,
 * with GGG's [key|text] markup rendered as its display text.
 */

import { useAtlasTree } from '../../contexts/AtlasTreeContext';
import { formatStatText } from '../../calculators/atlasTree';

function StatLines({ lines, className }) {
  return lines.map((line, i) => (
    <div key={i} className={`whitespace-pre-line leading-tight ${className}`}>
      {formatStatText(line)}
    </div>
  ));
}

export default function AtlasChoicePanel() {
  const { choiceNodes, setPick } = useAtlasTree();

  if (choiceNodes.length === 0) {
    return (
      <div className="text-sm text-zinc-500 italic px-1">
        Some notables make you choose one effect when allocated. Allocate one and
        pick its effect here.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {choiceNodes.map(({ nodeId, node, effectId }) => (
        <div
          key={nodeId}
          className="bg-zinc-900/60 border border-white/[0.06] rounded-lg p-3 space-y-2"
        >
          <div className="flex items-center gap-2">
            <span id={`atlas-choice-${nodeId}`} className="text-sm font-semibold text-zinc-100 flex-1 truncate">
              {node.name}
            </span>
            {effectId == null ? (
              <span className="text-[10px] px-1.5 py-0.5 rounded border text-amber-400 bg-amber-400/10 border-amber-400/20">
                Choose one
              </span>
            ) : (
              <button
                type="button"
                onClick={() => setPick(nodeId, null)}
                className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                Clear
              </button>
            )}
          </div>

          {node.stats?.length > 0 && (
            <StatLines lines={node.stats} className="text-xs text-zinc-400" />
          )}

          <div role="radiogroup" aria-labelledby={`atlas-choice-${nodeId}`} className="space-y-1">
            {node.variantEffects.map(variant => {
              const active = variant.effect === effectId;
              return (
                <button
                  key={variant.effect}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setPick(nodeId, variant.effect)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors ${
                    active
                      ? 'bg-amber-500/20 border-2 border-amber-500/50 text-amber-400'
                      : 'bg-zinc-800/40 border border-white/[0.04] text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/70'
                  }`}
                >
                  <StatLines lines={variant.stats} className="" />
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
