/**
 * Mechanics Guide - League mechanics reference
 */

import { useState } from 'react';
// import mechanicsData from '../../data/guides/mechanics.json'; // Will be available after parsing

const MechanicsGuide = () => {
  const [expandedMechanic, setExpandedMechanic] = useState(null);

  // Temporary mock data until we parse the HTML
  const mockData = [
    {
      name: 'Betrayal',
      icon: '🗡️',
      description: 'Syndicate encounters and safehouse rewards',
      sections: [
        {
          title: 'Syndicate Board',
          content: 'Jun missions reveal syndicate members. Interrogate, bargain, or execute to manipulate the board.'
        },
        {
          title: 'Safehouse Rewards',
          content: 'Transportation: Scarabs, Research: Crafting benches, Fortification: Currency, Intervention: Breachstones'
        },
        {
          title: 'Key Members',
          content: 'It That Fled (Research): Pure breachstones. Vorici (Research): White sockets. Hillock (Fortification): 28% quality.'
        }
      ]
    },
    {
      name: 'Heist',
      icon: '💰',
      description: 'Contract planning and blueprint rewards',
      sections: [
        {
          title: 'Contract Types',
          content: 'Lockpicking: Currency. Demolition: Gems. Perception: Trinkets. Agility: Unique items.'
        },
        {
          title: 'Rogue Members',
          content: 'Karst (Lockpicking), Tibbs (Demolition), Niles (Perception), Tullina (Agility), Gianna (Deception)'
        },
        {
          title: 'Blueprint Strategy',
          content: 'Reveal all wings before running. Use "Demonstrates..." for revealing rooms. Gianna reduces alert level.'
        }
      ]
    },
    {
      name: 'Expedition',
      icon: '💣',
      description: 'Explosive placement and vendor rerolls',
      sections: [
        {
          title: 'Explosive Placement',
          content: 'Prioritize remnants with quantity/rarity. Avoid monster life/damage mods. Chain explosions for efficiency.'
        },
        {
          title: 'Gwennen Gamble',
          content: 'Heavy Belts (Mageblood), Leather Belts (HH), Sorcerer Boots (Elevated), Bone Helmets (Elevated)'
        },
        {
          title: 'Tujen Haggling',
          content: 'Always haggle to minimum (3-5%). Stack reroll currency. Look for raw currency and scarabs.'
        }
      ]
    },
    {
      name: 'Harvest',
      icon: '🌱',
      description: 'Craft bench options and values',
      sections: [
        {
          title: 'Valuable Crafts',
          content: 'Reforge Keep Prefix/Suffix, Change Resistance Type, Reforge More Likely, Augment Influence'
        },
        {
          title: 'Sacred Grove',
          content: 'Plant plots give crafts. Higher tier seeds = better crafts. Can store 10 crafts in horticrafting station.'
        }
      ]
    },
    {
      name: 'Ritual',
      icon: '⚡',
      description: 'Tribute optimization and defer strategy',
      sections: [
        {
          title: 'Tribute Farming',
          content: 'Kill all monsters in circles. Higher map tier = more tribute. Quantity/pack size increases tribute.'
        },
        {
          title: 'Defer Strategy',
          content: 'Defer expensive items (5-10% fee). Check every map. Items refresh weekly on Monday.'
        }
      ]
    },
    {
      name: 'Ultimatum',
      icon: '🎯',
      description: 'Challenge selection and reward scaling',
      sections: [
        {
          title: 'Challenge Types',
          content: 'Survive, Stone Circle (easiest), Kill Boss, Protect Altar (hardest). Check modifiers carefully.'
        },
        {
          title: 'Risk vs Reward',
          content: 'Rewards scale with rounds. Wave 9 = guaranteed unique. Can exit anytime with current rewards.'
        }
      ]
    }
  ];

  return (
    <div className="p-4 space-y-4">
      <div className="text-white/70 text-sm mb-4">
        ⚙️ Quick reference for league mechanics, vendors, and strategies.
      </div>

      {mockData.map((mechanic, idx) => (
        <div key={idx} className="border border-amber-500/20 rounded-lg overflow-hidden">
          {/* Mechanic header */}
          <button
            onClick={() => setExpandedMechanic(expandedMechanic === mechanic.name ? null : mechanic.name)}
            className="w-full px-4 py-3 bg-gradient-to-r from-amber-900/30 to-amber-800/30 hover:from-amber-900/40 hover:to-amber-800/40 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{mechanic.icon}</span>
              <div className="text-left">
                <div className="text-amber-400 font-bold">{mechanic.name}</div>
                <div className="text-white/50 text-sm">{mechanic.description}</div>
              </div>
            </div>
            <span className="text-amber-400">
              {expandedMechanic === mechanic.name ? '▼' : '▶'}
            </span>
          </button>

          {/* Mechanic sections */}
          {expandedMechanic === mechanic.name && (
            <div className="bg-black/20 divide-y divide-amber-500/10">
              {mechanic.sections.map((section, sIdx) => (
                <div key={sIdx} className="px-4 py-3 hover:bg-white/5 transition-colors">
                  <div className="text-amber-300 font-medium mb-2">{section.title}</div>
                  <div className="text-white/70 text-sm leading-relaxed">{section.content}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Coming soon placeholder */}
      <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-center">
        <div className="text-amber-400 font-medium mb-2">🚧 Data Parsing in Progress</div>
        <div className="text-white/50 text-sm">
          Full mechanics guide with Oils, Cluster Jewels, Blight, and more coming soon!
        </div>
      </div>
    </div>
  );
};

export default MechanicsGuide;
