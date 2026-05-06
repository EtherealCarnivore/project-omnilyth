import { modulesForGame } from '../modules/registry';
import CategoryOverviewCard from '../components/CategoryOverviewCard';
import { useGame } from '../contexts/GameContext';

const ACCENT = 'from-sky-500/20 to-sky-500/5 border-sky-500/20';

const ICONS = {
  Coloring: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="4" />
    </svg>
  ),
  Linking: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>
  ),
  Socketing: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="3" width="18" height="18" rx="4" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  Items: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 2L3 7v10l9 5 9-5V7l-9-5z" />
    </svg>
  ),
};

const SUBCATEGORY_ORDER = ['Coloring', 'Linking', 'Socketing', 'Items'];

export default function CraftingOverviewPage() {
  const { game } = useGame();
  const craftingMods = modulesForGame(game).filter(m => m.category === 'Crafting');
  const grouped = {};
  for (const mod of craftingMods) {
    if (!grouped[mod.subcategory]) grouped[mod.subcategory] = [];
    grouped[mod.subcategory].push(mod);
  }

  const subcategories = SUBCATEGORY_ORDER.filter(s => grouped[s]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Crafting</h1>
        <p className="text-sm text-zinc-500 mt-1">Socket coloring, linking, and item crafting calculators</p>
      </div>

      {/* Quick-access links */}
      <div className="flex flex-wrap gap-2">
        {craftingMods.map(mod => (
          <a
            key={mod.id}
            href={`#${mod.subcategory.toLowerCase()}`}
            className="text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-zinc-400 hover:text-sky-400 hover:border-sky-400/30 transition-colors"
          >
            {mod.title}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subcategories.map(sub => (
          <div key={sub} id={sub.toLowerCase()}>
            <CategoryOverviewCard
              subcategory={sub}
              icon={ICONS[sub]}
              modules={grouped[sub]}
              accentColor={ACCENT}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
