/**
 * Trial of Ascendancy Data
 * Source: https://www.poewiki.net/wiki/Trial_of_Ascendancy
 *
 * Trials unlock labyrinth tiers for Ascendancy classes
 */

export const trialsData = {
  normal: [
    {
      act: 1,
      zone: 'The Lower Prison',
      trapType: 'Spike traps',
      tier: 'Normal',
      required: 6,
      order: 1,
      notes: 'First trial - introduces spike trap mechanics'
    },
    {
      act: 2,
      zone: 'The Crypt Level 1',
      trapType: 'Spinning blades',
      tier: 'Normal',
      required: 6,
      order: 2,
      notes: 'Circular blade obstacles'
    },
    {
      act: 2,
      zone: 'The Chamber of Sins Level 2',
      trapType: 'Sawblades',
      tier: 'Normal',
      required: 6,
      order: 3,
      notes: 'Horizontal sawblade patterns'
    },
    {
      act: 3,
      zone: 'The Crematorium',
      trapType: 'Furnace traps',
      tier: 'Normal',
      required: 6,
      order: 4,
      notes: 'Fire damage traps'
    },
    {
      act: 3,
      zone: 'The Catacombs',
      trapType: 'Blade sentries',
      tier: 'Normal',
      required: 6,
      order: 5,
      notes: 'Stationary spinning blade sentries'
    },
    {
      act: 3,
      zone: 'The Imperial Gardens',
      trapType: 'Dart traps',
      tier: 'Normal',
      required: 6,
      order: 6,
      notes: 'Projectile dart traps - final normal trial'
    }
  ],

  cruel: [
    {
      act: 6,
      zone: 'The Prison',
      trapType: 'Spike traps',
      tier: 'Cruel',
      required: 3,
      order: 1,
      minLevel: 40,
      notes: 'Spike traps revisited with higher damage'
    },
    {
      act: 7,
      zone: 'The Crypt',
      trapType: 'Spinning blades',
      tier: 'Cruel',
      required: 3,
      order: 2,
      minLevel: 40,
      notes: 'Spinning blades with increased speed'
    },
    {
      act: 7,
      zone: 'The Chamber of Sins Level 2',
      trapType: 'Sawblades',
      tier: 'Cruel',
      required: 3,
      order: 3,
      minLevel: 40,
      notes: 'Sawblades with complex patterns'
    }
  ],

  merciless: [
    {
      act: 8,
      zone: 'The Bath House',
      trapType: 'Furnace traps',
      tier: 'Merciless',
      required: 3,
      order: 1,
      minLevel: 50,
      notes: 'High fire damage furnace traps'
    },
    {
      act: 9,
      zone: 'The Tunnel',
      trapType: 'Blade sentries',
      tier: 'Merciless',
      required: 3,
      order: 2,
      minLevel: 50,
      notes: 'Multiple blade sentries in tight spaces'
    },
    {
      act: 10,
      zone: 'The Ossuary',
      trapType: 'Dart traps',
      tier: 'Merciless',
      required: 3,
      order: 3,
      minLevel: 50,
      notes: 'Final campaign trial before maps'
    }
  ],

  // NOTE: Eternal Lab does NOT require completing all 6 trial types.
  // Any trial completion drops "Offering to the Goddess" which grants one lab entry.
  // Most players buy offerings from trade instead of farming trials.
  eternal: [
    {
      tier: 'Eternal',
      source: 'Maps (Yellow Tier 6+)',
      trialName: 'Trial of Piercing Truth',
      trapType: 'Spike traps',
      minLevel: 60,
      notes: 'Drops Offering to the Goddess (consumable lab entry)'
    },
    {
      tier: 'Eternal',
      source: 'Maps (Yellow Tier 6+)',
      trialName: 'Trial of Swirling Fear',
      trapType: 'Spinning blades',
      minLevel: 60,
      notes: 'Drops Offering to the Goddess (consumable lab entry)'
    },
    {
      tier: 'Eternal',
      source: 'Maps (Yellow Tier 6+)',
      trialName: 'Trial of Crippling Grief',
      trapType: 'Sawblades',
      minLevel: 60,
      notes: 'Drops Offering to the Goddess (consumable lab entry)'
    },
    {
      tier: 'Eternal',
      source: 'Maps (Yellow Tier 6+)',
      trialName: 'Trial of Burning Rage',
      trapType: 'Furnace traps',
      minLevel: 60,
      notes: 'Drops Offering to the Goddess (consumable lab entry)'
    },
    {
      tier: 'Eternal',
      source: 'Maps (Yellow Tier 6+)',
      trialName: 'Trial of Lingering Pain',
      trapType: 'Blade sentries',
      minLevel: 60,
      notes: 'Drops Offering to the Goddess (consumable lab entry)'
    },
    {
      tier: 'Eternal',
      source: 'Maps (Yellow Tier 6+)',
      trialName: 'Trial of Stinging Doubt',
      trapType: 'Dart traps',
      minLevel: 60,
      notes: 'Drops Offering to the Goddess (consumable lab entry)'
    }
  ]
};

/**
 * Labyrinth unlock requirements
 */
export const labyrinthRequirements = {
  normal: {
    trialsRequired: 6,
    minLevel: 33,
    location: 'Sarn Encampment (Act 3)',
    rewards: 'First 2 Ascendancy points'
  },
  cruel: {
    trialsRequired: 3,
    minLevel: 40,
    location: 'Sarn Encampment (Act 3)',
    rewards: '2 more Ascendancy points (4 total)'
  },
  merciless: {
    trialsRequired: 3,
    minLevel: 50,
    location: 'Sarn Encampment (Act 3)',
    rewards: '2 more Ascendancy points (6 total)'
  },
  eternal: {
    trialsRequired: 'N/A',
    minLevel: 60,
    location: 'Aspirants\' Plaza (via Offering to the Goddess)',
    rewards: '2 more Ascendancy points (8 total)',
    notes: 'Requires Offering to the Goddess. Drop from any trial in yellow+ maps (Tier 6+), or buy from trade.'
  }
};

/**
 * Trial trap types and survival tips
 */
export const trapTips = {
  'Spike traps': {
    danger: 'Physical damage',
    tips: [
      'Time your movement between spike intervals',
      'Physical mitigation helps (armor, endurance charges)',
      'Watch for patterns - some alternate timing'
    ]
  },
  'Spinning blades': {
    danger: 'Physical damage',
    tips: [
      'Move through gaps, never run parallel',
      'Some patterns require waiting for alignment',
      'Quicksilver flask helps with tight timing'
    ]
  },
  'Sawblades': {
    danger: 'Physical damage',
    tips: [
      'Horizontal blades - jump over or go under',
      'Multiple lanes often alternate patterns',
      'Movement skills can skip entire sections'
    ]
  },
  'Furnace traps': {
    danger: 'Fire damage',
    tips: [
      'Fire resistance is critical (75%+ recommended)',
      'Ruby flask provides temporary immunity',
      'Burst through with movement skill + instant flask'
    ]
  },
  'Blade sentries': {
    danger: 'Physical damage',
    tips: [
      'Stationary spinners - safe zones between them',
      'Time your dash during gaps in rotation',
      'Can be skipped with leap slam / flame dash'
    ]
  },
  'Dart traps': {
    danger: 'Physical damage',
    tips: [
      'Projectiles fired in patterns',
      'Hug walls to avoid most darts',
      'Evasion and dodge help but not reliable'
    ]
  }
};

/**
 * Helper function to get trials for a specific act
 */
export function getTrialsForAct(actNumber) {
  const allTrials = [...trialsData.normal, ...trialsData.cruel, ...trialsData.merciless];
  return allTrials.filter(trial => trial.act === actNumber);
}

/**
 * Helper function to get all trials up to a specific act
 */
export function getTrialsUpToAct(actNumber) {
  const allTrials = [...trialsData.normal, ...trialsData.cruel, ...trialsData.merciless];
  return allTrials.filter(trial => trial.act <= actNumber);
}

/**
 * Helper function to check if lab is unlockable
 */
export function checkLabUnlock(completedTrials) {
  const normalComplete = trialsData.normal.every(trial =>
    completedTrials.includes(`${trial.act}-${trial.zone}`)
  );
  const cruelComplete = trialsData.cruel.every(trial =>
    completedTrials.includes(`${trial.act}-${trial.zone}`)
  );
  const mercilessComplete = trialsData.merciless.every(trial =>
    completedTrials.includes(`${trial.act}-${trial.zone}`)
  );

  return {
    normal: normalComplete,
    cruel: cruelComplete,
    merciless: mercilessComplete,
    // Eternal requires map trials, tracked separately
  };
}

export default trialsData;
