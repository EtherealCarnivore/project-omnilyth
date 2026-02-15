import modules from '../modules/registry';
import CategoryOverviewCard from '../components/CategoryOverviewCard';

const ACCENT = 'from-teal-500/20 to-teal-500/5 border-teal-500/20';

const ICONS = {
  Maps: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M9 2L3 7v13l6-4 6 4 6-4V3l-6 4-6-4z" />
    </svg>
  ),
  Scarabs: (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  ),
};

const SUBCATEGORY_ORDER = ['Maps', 'Scarabs'];

export default function AtlasOverviewPage() {
  const atlasMods = modules.filter(m => m.category === 'Atlas/Mapping');
  const grouped = {};
  for (const mod of atlasMods) {
    if (!grouped[mod.subcategory]) grouped[mod.subcategory] = [];
    grouped[mod.subcategory].push(mod);
  }

  const subcategories = SUBCATEGORY_ORDER.filter(s => grouped[s]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">Atlas / Mapping</h1>
        <p className="text-sm text-zinc-500 mt-1">Map mod filtering and scarab regex tools</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {atlasMods.map(mod => (
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
