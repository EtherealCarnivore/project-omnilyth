import { modulesForGame } from '../modules/registry';
import CategoryOverviewCard from '../components/CategoryOverviewCard';
import { useGame } from '../contexts/GameContext';

const ACCENT = 'from-teal-500/20 to-teal-500/5 border-teal-500/20';

const ICONS = {
  Gems: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 2L2 9l10 13L22 9z" />
      <path d="M2 9h20" />
      <path d="M12 2l5 7-5 13-5-13z" />
    </svg>
  ),
  Vendors: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 3h18v4H3V3z" />
      <path d="M3 7v14h18V7" />
      <path d="M8 10h8M8 14h5" />
    </svg>
  ),
};

const SUBCATEGORY_ORDER = ['Gems', 'Vendors'];

export default function LevelingOverviewPage() {
  const { game } = useGame();
  const levelingMods = modulesForGame(game).filter(m => m.category === 'Leveling');
  const grouped = {};
  for (const mod of levelingMods) {
    if (!grouped[mod.subcategory]) grouped[mod.subcategory] = [];
    grouped[mod.subcategory].push(mod);
  }

  const subcategories = SUBCATEGORY_ORDER.filter(s => grouped[s]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Leveling</h1>
        <p className="text-sm text-zinc-500 mt-1">Gem search and leveling tools</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {levelingMods.map(mod => (
          <a
            key={mod.id}
            href={`#${mod.subcategory.toLowerCase()}`}
            className="text-xs px-3 py-1.5 rounded-full border border-white/[0.06] text-zinc-400 hover:text-teal-400 hover:border-teal-400/30 transition-colors"
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
