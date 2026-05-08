import { modulesForGame } from '../modules/registry';
import CategoryOverviewCard from '../components/CategoryOverviewCard';
import { useGame } from '../contexts/GameContext';

const ACCENT = 'from-violet-500/20 to-violet-500/5 border-violet-500/20';

const ICONS = {
  'Cluster Jewels': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="12" cy="8" r="3" /><circle cx="7" cy="16" r="3" /><circle cx="17" cy="16" r="3" />
    </svg>
  ),
  'Timeless Jewels': (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  ),
};

const SUBCATEGORY_ORDER = ['Cluster Jewels', 'Timeless Jewels'];

export default function BuildPlanningOverviewPage() {
  const { game } = useGame();
  const buildMods = modulesForGame(game).filter(m => m.category === 'Jewels');
  const grouped = {};
  for (const mod of buildMods) {
    if (!grouped[mod.subcategory]) grouped[mod.subcategory] = [];
    grouped[mod.subcategory].push(mod);
  }

  const subcategories = SUBCATEGORY_ORDER.filter(s => grouped[s]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Jewels</h1>
          <p className="text-sm text-zinc-500 mt-1">Cluster jewel and timeless jewel calculators</p>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">
          Build planning splits into two questions Omnilyth answers separately: which
          Large Cluster Jewel notables actually fit your archetype, and what the rest of
          your passive tree should look like. The cluster calculator filters notables by
          base type and effect; the passive tree planner is a full class- and ascendancy-
          aware tree builder with code import and export.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {buildMods.map(mod => (
          <a
            key={mod.id}
            href={`#${mod.subcategory.toLowerCase().replace(' ', '-')}`}
            className="text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-zinc-400 hover:text-violet-400 hover:border-violet-400/30 transition-colors"
          >
            {mod.title}
          </a>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {subcategories.map(sub => (
          <div key={sub} id={sub.toLowerCase().replace(' ', '-')}>
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
