/**
 * Guide Tabs - Navigation between different guide types
 */

const GuideTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'leveling', label: 'Leveling', icon: '⚔️', hotkey: '1' },
    { id: 'atlas', label: 'Atlas', icon: '🗺️', hotkey: '2' },
    { id: 'mechanics', label: 'Mechanics', icon: '⚙️', hotkey: '3' },
    { id: 'oils', label: 'Oils', icon: '🧪', hotkey: '4' },
    { id: 'cluster', label: 'Cluster Jewels', icon: '💎', hotkey: '5' },
  ];

  return (
    <div className="flex border-b border-amber-500/20 bg-black/20">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`
            flex-1 px-4 py-3 text-sm font-medium transition-all
            ${activeTab === tab.id
              ? 'bg-amber-500/20 text-amber-400 border-b-2 border-amber-500'
              : 'text-white/50 hover:text-white/80 hover:bg-white/5'
            }
          `}
        >
          <span className="mr-2">{tab.icon}</span>
          {tab.label}
          <span className="ml-1 text-white/20 text-xs">[{tab.hotkey}]</span>
        </button>
      ))}
    </div>
  );
};

export default GuideTabs;
