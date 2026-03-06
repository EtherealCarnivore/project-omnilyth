/**
 * Smite Scion (Ascendant) Leveling Playbook
 *
 * Source: BigDaddy Gaming's Smite Scion Leaguestart guide on Mobalytics
 * Build: https://mobalytics.gg/poe/profile/bigdaddygaming/builds/bigdaddies-smite-scion-leagustart
 * PoB: https://pobb.in/mJRitnzVra3x
 * Class: Scion → Ascendant (Level 83)
 * Conditions: League start, heist farming focus, budget-friendly
 * Credit: Build design by BigDaddy Gaming
 *
 * IMPORTANT: This build is designed for heist farming on league start.
 * It is NOT an atlas progression build. The plan is to farm heists from
 * Act 7 onward to bankroll a stronger endgame character.
 *
 * Endgame setup:
 *   Weapons: Dual Hyaon's Fury (claws) — NOT 1H + shield
 *   Helmet: Devoto's Devotion
 *   Body: Field Lamellar (high armour)
 *   6L: Vaal Smite + Volatility + Multistrike + Added Lightning + EDA + Lightning Pen
 *   Auras: Determination, Anger, Vitality, Precision (with Arrogance)
 *   CWDT: Cast when Damage Taken + Molten Shell
 *   Utility: Phase Run + More Duration, Blood Rage
 *   Movement: Leap Slam + Faster Attacks
 *   Keystones: Iron Reflexes, Precise Technique, Unwavering Stance, Versatile Combatant
 *   Flasks: Granite, Jade, Silver, Quicksilver, Divine Life
 *   Stats: 1,446,326 DPS, 2,579 Life, 22,370 Armour, 60,042 eHP
 *
 * Variants on Mobalytics (progression stages):
 *   Sperm → Baby → Man → Chad → Molten Strike Chad
 *
 * Campaign routing adapted from general speedrunning knowledge.
 * Build-specific data extracted from the Mobalytics guide.
 */

export const smiteScionPlaybook = {
  id: 'smite-scion',
  name: 'Smite Scion (Heist Farmer)',
  class: 'Scion',
  ascendancy: ['Ascendant'],
  patchVersion: '3.28',
  difficulty: 'advanced',
  estimatedTime: '4-6 hours (to heist farming)',
  author: 'BigDaddy Gaming',
  description: 'Budget league-start Scion built for heist farming. Levels with Spectral Throw, transitions to dual-wield Smite with Hyaon\'s Fury claws. Iron Reflexes + Versatile Combatant for layered defense. Not an atlas pusher — farm heists to fund your real build.',

  principles: [
    {
      id: 'p1',
      title: 'This is a heist farmer, not a mapper',
      description: 'The entire point of this build is to get into heists fast and farm currency for a better character. Do not expect to push atlas with this.',
      priority: 'critical'
    },
    {
      id: 'p2',
      title: 'Speed through campaign, gear at vendors',
      description: 'Do not waste time farming gear during campaign. Vendor gear is good enough. Focus on getting to Act 7 Lab 2, then heist.',
      priority: 'critical'
    },
    {
      id: 'p3',
      title: 'Precise Technique = 40% more damage',
      description: 'Keep accuracy rating higher than maximum life. Scion naturally stacks dexterity early. Monitor this when swapping gear.',
      priority: 'high'
    },
    {
      id: 'p4',
      title: 'Dual wield + Versatile Combatant = layered defense',
      description: 'This build dual-wields Hyaon\'s Fury claws. Versatile Combatant converts attack block to spell block. Iron Reflexes converts evasion to armour. 22K armour with Determination.',
      priority: 'high'
    },
    {
      id: 'p5',
      title: 'Kill all bandits',
      description: 'Two passive points are better than any bandit reward for this build.',
      priority: 'high'
    },
    {
      id: 'p6',
      title: 'Lab 2 is the turning point',
      description: 'After completing your second labyrinth in Act 7, you have enough power to start heisting. This is where the real build begins.',
      priority: 'critical'
    },
    {
      id: 'p7',
      title: 'Spectral Throw carries early, Smite carries late',
      description: 'Do not force Smite too early. Spectral Throw with Volley + Added Cold clears fast enough through Acts 1-4.',
      priority: 'medium'
    },
    {
      id: 'p8',
      title: 'Resist benchmarks shift by act',
      description: 'You do not need capped resists during early campaign. -30% after Act 5 Kitava, -60% total after Act 10. Plan ahead.',
      priority: 'medium'
    }
  ],

  powerSpikes: [
    {
      level: 1,
      spike: 'Spectral Throw online',
      impact: 'Starting attack skill — solid clear with projectile coverage',
      gear: ['Any weapon from Hillock'],
      gems: ['Spectral Throw'],
      videoTimestamp: null
    },
    {
      level: 8,
      spike: 'Volley + Added Cold support',
      impact: 'Major damage increase on Spectral Throw — clears packs much faster',
      gear: [],
      gems: ['Volley Support', 'Added Cold Damage Support'],
      videoTimestamp: null
    },
    {
      level: 12,
      spike: 'Blade Trap option available',
      impact: 'Optional skill switch — Blade Trap with Added Cold + Multiple Traps can outperform ST in enclosed areas',
      gear: [],
      gems: ['Blade Trap', 'Multiple Traps Support'],
      videoTimestamp: null
    },
    {
      level: 18,
      spike: 'Precise Technique keystone',
      impact: '40% more attack damage if accuracy > life. Massive damage boost.',
      gear: [],
      gems: [],
      videoTimestamp: null
    },
    {
      level: 28,
      spike: 'Smite available',
      impact: 'Main endgame skill comes online. Lightning melee with aura buff effect.',
      gear: ['Decent one-hand weapon (claw preferred for later Hyaon\'s Fury transition)'],
      gems: ['Smite'],
      videoTimestamp: null
    },
    {
      level: null,
      spike: 'Lab 2 complete (Act 7)',
      impact: 'Ascendancy points unlock build potential. This is when you START HEISTING.',
      gear: [],
      gems: [],
      videoTimestamp: null
    },
    {
      level: null,
      spike: 'Chad variant gear assembled',
      impact: 'Full build online — dual Hyaon\'s Fury, 22K armour, 1.4M Vaal Smite DPS, 60K eHP',
      gear: ['Dual Hyaon\'s Fury claws', 'Devoto\'s Devotion helmet', 'Field Lamellar body'],
      gems: ['Vaal Smite + Volatility + Multistrike + Added Lightning + EDA + Lightning Pen'],
      videoTimestamp: null
    }
  ],

  acts: [
    {
      act: 1,
      title: 'Coast to Merveil',
      levelRange: { enter: 1, exit: 12 },
      timeTarget: 'Sub-12 minutes to Prison',

      route: [
        { zone: 'Twilight Strand', objective: 'Kill Hillock, pick up starting weapon', skipMobs: true },
        { zone: 'The Coast', objective: 'Guess layout direction — look for top-right opening. Fill every gear slot.', skipMobs: false },
        { zone: 'Tidal Island', objective: 'Complete quest for Quicksilver Flask reward', skipMobs: true },
        { zone: 'Mud Flats', objective: 'Rush through — fill gear slots for survivability', skipMobs: true },
        { zone: 'Submerged Passage', objective: 'Find Ledge entrance', skipMobs: true },
        { zone: 'The Ledge', objective: 'Kill rare/blue packs for XP — linear zone, good density', skipMobs: false },
        { zone: 'The Climb', objective: 'Rush through', skipMobs: true },
        { zone: 'Lower Prison', objective: 'Break barrels for currency. Look for quicksilver strongbox side area.', skipMobs: false },
        { zone: 'Upper Prison', objective: 'Kill Brutus at level 8+', skipMobs: true },
        { zone: 'Ship Graveyard', objective: 'Complete Fairgraves for skill point', skipMobs: true },
        { zone: "Merveil's Cavern", objective: 'Kill Merveil — take quest reward gems', skipMobs: false }
      ],

      quests: [
        { name: 'Tidal Island', reward: 'Quicksilver Flask', required: true, timing: 'Before Mud Flats' },
        { name: 'Dweller of the Deep', reward: 'Skill Point', required: true, timing: 'Before leaving Act 1' },
        { name: 'Fairgraves', reward: 'Skill Point', required: true, timing: 'In Ship Graveyard' },
        { name: 'Den side quest', reward: 'Second Quicksilver', required: false, timing: 'Only if no strongbox quicksilver' }
      ],

      gems: [
        { level: 1, action: 'start', gems: ['Spectral Throw'], links: ['Spectral Throw — starting skill for Scion'] },
        { level: 8, action: 'add', gems: ['Volley Support', 'Added Cold Damage Support'], links: ['Spectral Throw + Volley + Added Cold (3-link)'] },
        { level: 8, action: 'add', gems: ['Leap Slam', 'Faster Attacks Support'], links: ['Leap Slam + Faster Attacks — primary movement'] },
        { level: 1, action: 'add', gems: ['Frostblink'], links: ['Secondary movement — instant blink'] }
      ],

      gear: [
        { slot: 'weapon', priority: 'critical', target: 'Any 2H weapon — higher base damage = faster clear', upgrade: 'As soon as possible' },
        { slot: 'all slots', priority: 'high', target: 'Fill every slot for defenses — Mud Flats kills you otherwise', upgrade: 'Immediately' },
        { slot: 'chest', priority: 'medium', target: 'Look for 3-link with correct colors (2G 1B for ST setup)', upgrade: 'Before Brutus' },
        { slot: 'boots', priority: 'medium', target: 'Any boots with movement speed', upgrade: 'On drop' }
      ],

      bosses: [
        {
          name: 'Brutus',
          level: 8,
          difficulty: 'easy',
          strategy: 'Leap Slam over him when he winds up. Spectral Throw from range. Frostblink if cornered.',
          dangerLevel: 'low',
          videoTimestamp: null
        },
        {
          name: 'Merveil',
          level: 12,
          difficulty: 'medium',
          strategy: 'Cold damage phase 2 — bring a coral ring if struggling. Leap Slam to dodge ice geysers.',
          dangerLevel: 'medium',
          videoTimestamp: null
        }
      ],

      decisionPoints: [
        {
          id: 'act1-d1',
          condition: 'Find Splitting Steel before Spectral Throw',
          ifTrue: 'Use Splitting Steel — it works fine as an alternative early skill',
          ifFalse: 'Stick with Spectral Throw',
          reasoning: 'Both projectile attacks clear well early. Use whichever you find first.',
          priority: 'medium'
        },
        {
          id: 'act1-d2',
          condition: 'No 3-link by Brutus',
          ifTrue: 'Check vendor for 3-link weapon or chest after killing Brutus',
          ifFalse: 'Continue — you are fine',
          reasoning: 'A 3-link makes Acts 2-3 dramatically smoother',
          priority: 'high'
        }
      ],

      checklistItems: [
        { id: 'act1-c1', task: 'Fill every gear slot for survivability', category: 'gear', required: true },
        { id: 'act1-c2', task: 'Complete Tidal Island for Quicksilver Flask', category: 'quest', required: true },
        { id: 'act1-c3', task: 'Level 8: Get Volley + Added Cold — link with Spectral Throw', category: 'gem', required: true },
        { id: 'act1-c4', task: 'Get Leap Slam + Faster Attacks for movement', category: 'gem', required: true },
        { id: 'act1-c5', task: 'Get Frostblink for secondary movement', category: 'gem', required: true },
        { id: 'act1-c6', task: 'Kill Brutus at level 8+', category: 'level', required: true },
        { id: 'act1-c7', task: 'Complete Fairgraves for skill point', category: 'quest', required: true },
        { id: 'act1-c8', task: 'Break barrels in Lower Prison for currency', category: 'other', required: false },
        { id: 'act1-c9', task: 'Look for 3-link with 2G 1B colors', category: 'gear', required: true }
      ],

      mistakes: [
        {
          id: 'act1-m1',
          mistake: 'Pressing quicksilver immediately after entering a portal/door',
          why: 'Duration is only ~6 seconds, wasted on short transitions',
          severity: 'major',
          fix: 'Wait until you are in the zone and moving',
          videoTimestamp: null
        },
        {
          id: 'act1-m2',
          mistake: 'Trying to use Smite in Act 1',
          why: 'Smite is not available until later. Spectral Throw is your early skill.',
          severity: 'minor',
          fix: 'Follow the skill progression — ST early, Smite later',
          videoTimestamp: null
        }
      ]
    },

    {
      act: 2,
      title: 'Forest to Weaver',
      levelRange: { enter: 12, exit: 18 },
      timeTarget: '20-25 minutes total',

      route: [
        { zone: 'Act 2 Town', objective: 'Check vendor for gem upgrades and gear', skipMobs: false },
        { zone: 'Forest areas', objective: 'Weaver is OPPOSITE side of road from waypoint. Alira = same side as WP.', skipMobs: true },
        { zone: 'Spider areas', objective: 'Spider webs on trees confirm Weaver direction', skipMobs: true },
        { zone: 'Den', objective: 'Only do if no quicksilver from Act 1 strongbox', skipMobs: true }
      ],

      quests: [
        { name: 'Talk to woman NPC', reward: '15% all res', required: true, timing: 'Immediately' },
        { name: 'Kill all bandits', reward: '2 Passive Points', required: true, timing: 'Kill all three — Alira, Kraityn, Oak' },
        { name: 'All skill point quests', reward: 'Skill Points', required: true, timing: 'All of them' },
        { name: 'Heavy Belt quest reward', reward: 'Heavy Belt', required: true, timing: 'Act 2 quest reward' }
      ],

      gems: [
        { level: 12, action: 'switch', gems: ['Blade Trap', 'Added Cold Damage Support', 'Multiple Traps Support'], links: ['Optional: Blade Trap + Added Cold + Multiple Traps (swap from ST for indoor zones)'] },
        { level: 12, action: 'add', gems: ['Clarity'], links: ['Clarity aura — solves mana issues'] },
        { level: 18, action: 'add', gems: ['Precise Technique'], links: ['KEYSTONE — 40% more attack damage. Socket it.'] }
      ],

      gear: [
        { slot: 'belt', priority: 'high', target: 'Heavy Belt from quest reward — life and strength', upgrade: 'Quest reward' },
        { slot: 'weapon', priority: 'high', target: 'Best base damage weapon from vendor or drops', upgrade: 'Check vendors each act' },
        { slot: 'boots', priority: 'medium', target: '15 MS boots', upgrade: 'On drop' }
      ],

      bosses: [
        {
          name: 'Weaver',
          level: 16,
          difficulty: 'medium',
          strategy: 'Dodge the charge attack. Spectral Throw from range or Blade Trap the area. Leap Slam out of danger.',
          dangerLevel: 'medium',
          videoTimestamp: null
        }
      ],

      decisionPoints: [
        {
          id: 'act2-d1',
          condition: 'Mob pack is rare/blue with many enemies',
          ifTrue: 'Always stop and kill — disproportionate XP keeps you at level thresholds',
          ifFalse: 'Skip white packs and move on',
          reasoning: 'Rare/magic packs give disproportionate XP',
          priority: 'high'
        },
        {
          id: 'act2-d2',
          condition: 'Want to switch to Blade Trap',
          ifTrue: 'Do it — Blade Trap + Added Cold + Multiple Traps is strong in enclosed zones',
          ifFalse: 'Continue with Spectral Throw — both are fine through Act 4',
          reasoning: 'Blade Trap is optional, not required. Use whichever feels better.',
          priority: 'medium'
        }
      ],

      checklistItems: [
        { id: 'act2-c1', task: 'Kill ALL three bandits for 2 passive points', category: 'quest', required: true },
        { id: 'act2-c2', task: 'Get Heavy Belt from quest reward', category: 'gear', required: true },
        { id: 'act2-c3', task: 'Socket Clarity aura for mana sustain', category: 'gem', required: true },
        { id: 'act2-c4', task: 'Level 18: Socket Precise Technique (40% more damage)', category: 'gem', required: true },
        { id: 'act2-c5', task: 'Look for 15 MS boots', category: 'gear', required: false },
        { id: 'act2-c6', task: 'Optional: Try Blade Trap + Added Cold + Multiple Traps', category: 'gem', required: false }
      ],

      mistakes: [
        {
          id: 'act2-m1',
          mistake: 'Forgetting Precise Technique at level 18',
          why: 'Missing 40% more damage on everything',
          severity: 'major',
          fix: 'Socket Precise Technique the moment it is available',
          videoTimestamp: null
        },
        {
          id: 'act2-m2',
          mistake: 'Helping a bandit instead of killing all',
          why: 'This build specifically requires kill all for 2 passive points',
          severity: 'major',
          fix: 'Kill Alira, Kraityn, and Oak',
          videoTimestamp: null
        }
      ]
    },

    {
      act: 3,
      title: 'Sewers to Dominus',
      levelRange: { enter: 18, exit: 28 },
      timeTarget: '40 minutes total',

      route: [
        { zone: 'Sarn Sewers', objective: 'One bust before WP, two after. Big room = bust top, small room = bust bottom.', skipMobs: false },
        { zone: 'Crematorium', objective: 'IF fire res is decent, walk over traps. If not, craft fire res first.', skipMobs: true },
        { zone: 'Ancient Pyramid', objective: 'Always look for the opposite corner', skipMobs: true },
        { zone: 'Docks', objective: 'Good XP farming zone if underleveled — ~95% XP efficiency even at low level', skipMobs: false }
      ],

      quests: [
        { name: 'All skill point quests', reward: 'Skill Points', required: true, timing: 'All of them' },
        { name: 'Lapis Amulet quest reward', reward: 'Lapis Amulet', required: true, timing: 'Act 3 quest reward' },
        { name: 'Siosa vendor', reward: 'All gems available', required: false, timing: 'Library side quest — buy any missing gems' }
      ],

      gems: [
        { level: 24, action: 'prepare', gems: ['Smite'], links: ['Buy from Siosa or quest vendor if available — start leveling it'] },
        { level: null, action: 'add', gems: ['Determination'], links: ['Armour aura — major defense boost when mana allows'] }
      ],

      gear: [
        { slot: 'amulet', priority: 'high', target: 'Lapis Amulet from quest reward — intelligence for gem requirements', upgrade: 'Quest reward' },
        { slot: 'weapon', priority: 'high', target: 'Upgrade weapon at vendor — look for highest base damage', upgrade: 'Every few acts' },
        { slot: 'chest', priority: 'medium', target: 'Armour-based chest for defense scaling', upgrade: 'When found' }
      ],

      bosses: [
        {
          name: 'Dominus',
          level: 28,
          difficulty: 'hard',
          strategy: 'Phase 1: dodge the multistrikes. Phase 2 (blood rain): stay mobile, use Leap Slam to reposition. Keep up flask charges.',
          dangerLevel: 'high',
          videoTimestamp: null
        }
      ],

      decisionPoints: [
        {
          id: 'act3-d1',
          condition: 'Fire resist is decent entering Crematorium',
          ifTrue: 'Walk over fire traps — they become trivial',
          ifFalse: 'Craft fire res on gear or bring fire res flask',
          reasoning: 'Capped fire res trivializes Crematorium, low res means death',
          priority: 'critical'
        },
        {
          id: 'act3-d2',
          condition: 'Smite is available from vendor or quest',
          ifTrue: 'Buy it and start leveling in offhand — you will switch to it soon',
          ifFalse: 'Buy from Siosa in Library if you completed that quest',
          reasoning: 'Getting Smite leveling early means smoother transition later',
          priority: 'high'
        }
      ],

      checklistItems: [
        { id: 'act3-c1', task: 'Get Lapis Amulet from quest reward', category: 'gear', required: true },
        { id: 'act3-c2', task: 'Buy Smite from vendor/Siosa — start leveling in offhand', category: 'gem', required: true },
        { id: 'act3-c3', task: 'Check Siosa for any missing support gems', category: 'gem', required: false },
        { id: 'act3-c4', task: 'Look for armour-based chest pieces', category: 'gear', required: false },
        { id: 'act3-c5', task: 'Level 24+ entering Docks, 28+ killing Dominus', category: 'level', required: true }
      ],

      mistakes: [
        {
          id: 'act3-m1',
          mistake: 'Skipping Siosa in the Library',
          why: 'Siosa sells ALL gems — this is your chance to buy Smite and any missing supports',
          severity: 'minor',
          fix: 'Do the Library quest if you need gems',
          videoTimestamp: null
        }
      ]
    },

    {
      act: 4,
      title: 'Kaom/Daresso to Malachai',
      levelRange: { enter: 28, exit: 33 },
      timeTarget: 'Sub-55 minutes total',

      route: [
        { zone: 'Kaom/Daresso areas', objective: 'Leap Slam shortcuts available — practice gaps', skipMobs: true },
        { zone: 'Aqueduct', objective: 'Movement shortcuts available', skipMobs: true },
        { zone: 'Crystal Veins', objective: 'WP trick: take waypoint, go back for XP if needed', skipMobs: false }
      ],

      quests: [
        { name: 'All skill point quests', reward: 'Skill Points', required: true, timing: 'All of them' }
      ],

      gems: [
        { level: 28, action: 'switch', gems: ['Smite'], links: ['Switch to Smite as main skill — it should be leveled from offhand'] },
        { level: 28, action: 'add', gems: ['Ancestral Call Support'], links: ['Smite + Ancestral Call for clear — massive pack coverage'] },
        { level: null, action: 'prepare', gems: ['Multistrike Support'], links: ['Add when available — huge attack speed multiplier'] }
      ],

      gear: [
        { slot: 'weapon', priority: 'critical', target: 'Switch to best 1H melee weapon — claw preferred for endgame Hyaon\'s Fury transition', upgrade: 'When switching to Smite' },
        { slot: 'offhand', priority: 'high', target: 'Dual wield — second 1H weapon for attack speed and block via Versatile Combatant later', upgrade: 'When available' }
      ],

      bosses: [
        {
          name: 'Malachai',
          level: 32,
          difficulty: 'hard',
          strategy: 'Smite with Ancestral Call hits hard here. Use Leap Slam to dodge the slam attacks. Keep flasks up. Portal resurrections are fine in softcore.',
          dangerLevel: 'high',
          videoTimestamp: null
        }
      ],

      decisionPoints: [
        {
          id: 'act4-d1',
          condition: 'Found two decent 1H weapons (claws preferred)',
          ifTrue: 'Switch to dual wield NOW — attack speed + dual wield block via Versatile Combatant later',
          ifFalse: 'Continue 2H until you find dual 1H options — damage is fine on 2H for now',
          reasoning: 'The build uses dual Hyaon\'s Fury claws endgame with Versatile Combatant for block conversion',
          priority: 'high'
        },
        {
          id: 'act4-d2',
          condition: 'Smite feels weak compared to Spectral Throw',
          ifTrue: 'Check your Smite gem level — it needs to be leveled up. Also check weapon damage.',
          ifFalse: 'Continue with Smite — it scales much better into endgame',
          reasoning: 'Smite starts feeling strong once you have Ancestral Call + a decent weapon',
          priority: 'medium'
        }
      ],

      checklistItems: [
        { id: 'act4-c1', task: 'Switch to Smite as main skill (should be leveled from offhand)', category: 'gem', required: true },
        { id: 'act4-c2', task: 'Link Smite + Ancestral Call for pack clear', category: 'gem', required: true },
        { id: 'act4-c3', task: 'Look for dual 1H weapons (claws preferred) for dual-wield setup', category: 'gear', required: true },
        { id: 'act4-c4', task: 'Hit level 32-33 before entering Act 5 (XP penalty breakpoint)', category: 'level', required: true }
      ],

      mistakes: [
        {
          id: 'act4-m1',
          mistake: 'Not leveling Smite in offhand since Act 3',
          why: 'Switching to an underleveled Smite makes Acts 4-5 painful',
          severity: 'major',
          fix: 'Always level Smite in offhand starting Act 3',
          videoTimestamp: null
        }
      ]
    },

    {
      act: 5,
      title: 'Innocence and Kitava',
      levelRange: { enter: 33, exit: 39 },
      timeTarget: 'Sub-1:30 total',

      route: [
        { zone: 'Standard Act 5', objective: 'Innocence fight is dangerous at low HP', skipMobs: false },
        { zone: 'Cathedral Rooftop', objective: 'Kitava gives -30% all res penalty', skipMobs: false }
      ],

      quests: [
        { name: 'All skill point quests', reward: 'Skill Points', required: true, timing: 'All' },
        { name: 'Granite Flask reward', reward: 'Granite Flask', required: true, timing: 'Act 5 quest reward' },
        { name: 'Normal Lab (if ready)', reward: 'First Ascendancy points', required: false, timing: 'When you have the trials' }
      ],

      gems: [
        { level: null, action: 'add', gems: ['Determination'], links: ['Armour aura — core defense, scales with Iron Reflexes'] },
        { level: null, action: 'add', gems: ['Vitality'], links: ['Life regen aura — sustain for mapping and heisting'] },
        { level: null, action: 'keystone', gems: ['Iron Reflexes'], links: ['KEYSTONE — converts all evasion to armour. Combined with Determination = massive armour.'] },
        { level: null, action: 'keystone', gems: ['Unwavering Stance'], links: ['KEYSTONE — cannot be stunned. Critical for melee survivability.'] }
      ],

      gear: [
        { slot: 'flask', priority: 'high', target: 'Granite Flask from quest reward — armour boost (scales with Iron Reflexes)', upgrade: 'Quest reward' },
        { slot: 'all', priority: 'high', target: 'Prepare for -30% all res after Kitava. Craft resists on gear.', upgrade: 'Before Kitava kill' }
      ],

      bosses: [
        {
          name: 'Innocence',
          level: 36,
          difficulty: 'hard',
          strategy: 'Dodge the beam and orbs. Leap Slam to reposition. Smite hits hard up close — dart in and out.',
          dangerLevel: 'high',
          videoTimestamp: null
        },
        {
          name: 'Kitava (Act 5)',
          level: 38,
          difficulty: 'hard',
          strategy: 'Phase fight. Dodge the ground slam. Use portal resurrections in softcore. -30% all res penalty after.',
          dangerLevel: 'high',
          videoTimestamp: null
        }
      ],

      decisionPoints: [
        {
          id: 'act5-d1',
          condition: 'Boss is dangerous and you have portals',
          ifTrue: 'Place portal at boss entrance — use as free resurrections (softcore)',
          ifFalse: 'Fight normally',
          reasoning: 'Death costs are time, not currency, in softcore speed runs',
          priority: 'medium'
        },
        {
          id: 'act5-d2',
          condition: 'Ready for Normal Lab',
          ifTrue: 'Do it now — ascendancy points are a big power spike',
          ifFalse: 'Skip for now — you can do it later. Campaign progression is more important.',
          reasoning: 'Lab is a big power spike but not strictly required before Act 7',
          priority: 'medium'
        }
      ],

      checklistItems: [
        { id: 'act5-c1', task: 'Get Granite Flask from quest reward', category: 'gear', required: true },
        { id: 'act5-c2', task: 'Craft resists on gear BEFORE killing Kitava (-30% penalty)', category: 'gear', required: true },
        { id: 'act5-c3', task: 'Normal Lab if trials are done', category: 'quest', required: false },
        { id: 'act5-c4', task: 'Socket Determination aura if mana allows', category: 'gem', required: false }
      ],

      mistakes: [
        {
          id: 'act5-m1',
          mistake: 'Not preparing for the -30% all res penalty from Kitava',
          why: 'Suddenly being uncapped on resists makes Act 6 deadly',
          severity: 'major',
          fix: 'Craft or find resist gear before killing Kitava',
          videoTimestamp: null
        }
      ]
    },

    {
      act: 6,
      title: 'Tidal Island Redux + Lilly Roth',
      levelRange: { enter: 39, exit: 45 },
      timeTarget: 'Sub-1:50 total',

      route: [
        { zone: 'Tidal Island', objective: 'Do for belt drops. Portal to Twilight Strand after — faster than waypoint.', skipMobs: false },
        { zone: 'Lilly Roth', objective: 'Complete her quest — unlocks ALL gem purchases', skipMobs: false }
      ],

      quests: [
        { name: 'All skill point quests', reward: 'Skill Points', required: true, timing: 'All' },
        { name: 'Lilly Roth quest', reward: 'All gems available for purchase', required: true, timing: 'Priority — buy missing gems' }
      ],

      gems: [
        { level: null, action: 'add', gems: ['Vaal Smite'], links: ['Buy Vaal version from Lilly if available — huge burst damage'] },
        { level: null, action: 'switch', gems: ['Multistrike Support'], links: ['Add to Smite links if not already — massive attack speed'] },
        { level: null, action: 'add', gems: ['Added Lightning Damage Support', 'Elemental Damage with Attacks Support'], links: ['Start building endgame 6L: Smite + Multistrike + Added Lightning + EDA'] },
        { level: null, action: 'add', gems: ['Anger'], links: ['Anger aura — flat fire damage to attacks, scales with EDA'] },
        { level: null, action: 'add', gems: ['Blood Rage'], links: ['Free attack speed + frenzy charge generation — massive DPS boost'] },
        { level: null, action: 'add', gems: ['Cast when Damage Taken Support', 'Molten Shell'], links: ['CWDT + Molten Shell — automated armour-based guard skill'] },
        { level: null, action: 'add', gems: ['Phase Run', 'Increased Duration Support'], links: ['Phase Run + Inc Duration — movement speed and phasing'] }
      ],

      gear: [
        { slot: 'belt', priority: 'medium', target: 'Heavy belt with life and resist', upgrade: 'From Tidal Island drops or vendor' },
        { slot: 'weapons', priority: 'high', target: 'Dual 1H weapons — claws preferred for endgame Hyaon\'s Fury', upgrade: 'On drop or vendor' },
        { slot: 'boots', priority: 'medium', target: '25-30% MS boots with resist', upgrade: 'When found' }
      ],

      bosses: [],

      decisionPoints: [
        {
          id: 'act6-d1',
          condition: 'Lilly Roth quest available',
          ifTrue: 'DO IT — she sells every gem. Buy anything missing for your Smite setup.',
          ifFalse: 'You will get this in Act 6 naturally',
          reasoning: 'Lilly unlocks all gems for purchase. Critical for completing your links.',
          priority: 'critical'
        }
      ],

      checklistItems: [
        { id: 'act6-c1', task: 'Complete Lilly Roth quest — unlocks all gems for purchase', category: 'quest', required: true },
        { id: 'act6-c2', task: 'Buy Vaal Smite if available', category: 'gem', required: false },
        { id: 'act6-c3', task: 'Build Smite links: Smite + Multistrike + Added Lightning + EDA', category: 'gem', required: true },
        { id: 'act6-c4', task: 'Set up CWDT + Molten Shell for automated defense', category: 'gem', required: true },
        { id: 'act6-c5', task: 'Socket Blood Rage for attack speed + frenzy charges', category: 'gem', required: true },
        { id: 'act6-c6', task: 'Socket Anger aura if mana allows', category: 'gem', required: false },
        { id: 'act6-c7', task: 'Get 25-30% MS boots with resist', category: 'gear', required: false }
      ],

      mistakes: [
        {
          id: 'act6-m1',
          mistake: 'Skipping Lilly Roth quest',
          why: 'Missing access to all gems means incomplete links',
          severity: 'major',
          fix: 'Always complete Lilly Roth quest in Act 6',
          videoTimestamp: null
        }
      ]
    },

    {
      act: 7,
      title: 'Lab 2 + START HEISTING',
      levelRange: { enter: 45, exit: 55 },
      timeTarget: 'Act 7 entry at ~2 hour mark',

      route: [
        { zone: 'Act 7 zones', objective: 'Push through to Cruel Lab trials', skipMobs: true },
        { zone: 'Cruel Lab', objective: 'Complete Lab 2 — this is the build milestone', skipMobs: false },
        { zone: 'Harbour Bridge (Heist)', objective: 'After Lab 2: STOP campaign. Start heisting immediately.', skipMobs: false }
      ],

      quests: [
        { name: 'All skill point quests', reward: 'Skill Points', required: true, timing: 'All' },
        { name: 'Jade Flask reward', reward: 'Jade Flask', required: true, timing: 'Act 7 quest reward' },
        { name: 'Cruel Lab (Lab 2)', reward: 'Ascendancy Points', required: true, timing: 'PRIORITY — this is the turning point' }
      ],

      gems: [
        { level: null, action: 'add', gems: ['Precision'], links: ['Precision aura — accuracy for Precise Technique. Run at low level to save mana.'] },
        { level: null, action: 'add', gems: ['Arrogance Support'], links: ['Link Precision with Arrogance — reserves life instead of mana'] },
        { level: null, action: 'add', gems: ['Volatility Support'], links: ['Add to Smite 6L when available — damage multiplier'] },
        { level: null, action: 'add', gems: ['Lightning Penetration Support'], links: ['Complete the 6L: Vaal Smite + Volatility + Multistrike + Added Lightning + EDA + Lightning Pen'] }
      ],

      gear: [
        { slot: 'flask', priority: 'high', target: 'Jade Flask from quest reward — evasion boost', upgrade: 'Quest reward' },
        { slot: 'all', priority: 'high', target: 'Solidify your gear before heisting — cap resists, get life', upgrade: 'Before starting heists' }
      ],

      bosses: [
        {
          name: 'Cruel Lab (Izaro)',
          level: 50,
          difficulty: 'medium',
          strategy: 'Smite + Ancestral Call + Multistrike shreds Izaro. Block helps survive his hits. Check mechanics each phase.',
          dangerLevel: 'medium',
          videoTimestamp: null
        }
      ],

      decisionPoints: [
        {
          id: 'act7-d1',
          condition: 'Lab 2 completed',
          ifTrue: 'STOP CAMPAIGN. Start heisting NOW. This is the builds purpose.',
          ifFalse: 'Finish Lab 2 first — it is the turning point of this build',
          reasoning: 'The entire build is designed to heist farm from this point onward',
          priority: 'critical'
        },
        {
          id: 'act7-d2',
          condition: 'Struggling with Lab 2',
          ifTrue: 'Farm a few levels in Blood Aqueduct (Act 9 entrance) — dense zone, good XP',
          ifFalse: 'Do Lab 2 and start heisting',
          reasoning: 'A few extra levels make Lab trivial. But do not over-farm.',
          priority: 'medium'
        }
      ],

      checklistItems: [
        { id: 'act7-c1', task: 'Get Jade Flask from quest reward', category: 'gear', required: true },
        { id: 'act7-c2', task: 'Complete Cruel Lab (Lab 2) — THIS IS THE MILESTONE', category: 'quest', required: true },
        { id: 'act7-c3', task: 'Complete 6L: Vaal Smite + Volatility + Multistrike + Added Lightning + EDA + Lightning Pen', category: 'gem', required: true },
        { id: 'act7-c4', task: 'Cap resists before heisting', category: 'gear', required: true },
        { id: 'act7-c5', task: 'STOP CAMPAIGN — Start heisting after Lab 2', category: 'other', required: true },
        { id: 'act7-c6', task: 'Set up heist contracts and rogues', category: 'other', required: true }
      ],

      mistakes: [
        {
          id: 'act7-m1',
          mistake: 'Continuing campaign after Lab 2 instead of heisting',
          why: 'This build is not designed for atlas progression. Continuing wastes time.',
          severity: 'major',
          fix: 'Start heisting immediately after Lab 2',
          videoTimestamp: null
        },
        {
          id: 'act7-m2',
          mistake: 'Trying to push atlas with this character',
          why: 'Creator explicitly warns: "will be hard to complete atlas" — this is a currency farmer',
          severity: 'major',
          fix: 'Farm heists, accumulate currency, build a proper mapper',
          videoTimestamp: null
        }
      ]
    },

    {
      act: 9,
      title: 'Acts 8-10 (Optional Campaign Completion)',
      levelRange: { enter: 55, exit: 65 },
      timeTarget: 'Only if continuing past heist start',

      route: [
        { zone: 'Act 8', objective: 'Hidden side area connects to sewers — shortcuts available', skipMobs: true },
        { zone: 'Blood Aqueduct', objective: 'Best leveling zone in campaign — farm here if needed', skipMobs: false },
        { zone: 'Act 10', objective: 'Kitava gives another -30% all res (-60% total from both Kitavas)', skipMobs: false }
      ],

      quests: [
        { name: 'All skill point quests', reward: 'Skill Points', required: false, timing: 'Only if continuing campaign' },
        { name: 'Silver Flask reward', reward: 'Silver Flask (Onslaught)', required: false, timing: 'Act 10 — if you get there' },
        { name: 'Merc Lab (Lab 3)', reward: 'More Ascendancy Points', required: false, timing: 'When convenient' }
      ],

      gems: [],

      gear: [
        { slot: 'all', priority: 'high', target: 'Prepare for final -30% res penalty from Act 10 Kitava', upgrade: 'Before Kitava' },
        { slot: 'flask', priority: 'medium', target: 'Silver Flask from Act 10 gives Onslaught (20% attack/move speed)', upgrade: 'Quest reward' }
      ],

      bosses: [
        {
          name: 'Kitava (Act 10)',
          level: 62,
          difficulty: 'hard',
          strategy: 'Same as Act 5 but harder. Portal resurrections. -30% all res penalty (total -60% from both).',
          dangerLevel: 'high',
          videoTimestamp: null
        }
      ],

      decisionPoints: [
        {
          id: 'act9-d1',
          condition: 'You are heisting and want to complete campaign for map access',
          ifTrue: 'Continue campaign — yellow maps will supplement heist income',
          ifFalse: 'Stay in heists — campaign completion is optional for this build',
          reasoning: 'The build creator says yellow maps are possible but atlas progression will be hard',
          priority: 'medium'
        }
      ],

      checklistItems: [
        { id: 'act9-c1', task: '(OPTIONAL) Complete Acts 8-10 for map access', category: 'quest', required: false },
        { id: 'act9-c2', task: '(OPTIONAL) Merc Lab for more Ascendancy points', category: 'quest', required: false },
        { id: 'act9-c3', task: '(OPTIONAL) Blood Aqueduct farming if underlevel', category: 'level', required: false },
        { id: 'act9-c4', task: 'Prepare for -60% total all res after Act 10 Kitava', category: 'gear', required: false }
      ],

      mistakes: [
        {
          id: 'act9-m1',
          mistake: 'Trying to push red maps with this build',
          why: 'The build explicitly is not designed for endgame mapping. Use heist currency to fund a mapper.',
          severity: 'major',
          fix: 'Stick to heists and yellow maps at most',
          videoTimestamp: null
        }
      ]
    },

    {
      act: 10,
      title: 'Heist Farming Guide',
      levelRange: { enter: 50, exit: 80 },
      timeTarget: 'Ongoing — farm until you can fund your next build',

      route: [
        { zone: 'Rogue Harbour', objective: 'Your home base. Talk to all rogues, level their skills.', skipMobs: false },
        { zone: 'Contracts', objective: 'Run contracts for raw currency, rogue markers, and blueprint reveals', skipMobs: false },
        { zone: 'Grand Heists', objective: 'Blueprints for high-value reward rooms (currency, divination, gems)', skipMobs: false }
      ],

      quests: [
        { name: 'Level rogue skills', reward: 'Access to higher-level heists', required: true, timing: 'Ongoing' },
        { name: 'Reveal blueprints', reward: 'Grand Heist access', required: true, timing: 'As markers accumulate' }
      ],

      gems: [],

      gear: [
        { slot: 'all', priority: 'high', target: 'Cap resists, maximize life and armour. Target: 2.5K+ life, 22K+ armour, 75% all res.', upgrade: 'Continuously from heist drops' },
        { slot: 'weapons', priority: 'critical', target: 'Dual Hyaon\'s Fury claws — this is the endgame weapon', upgrade: 'Priority purchase from trade' },
        { slot: 'helmet', priority: 'high', target: 'Devoto\'s Devotion — attack speed + movement speed + evasion (converted to armour by Iron Reflexes)', upgrade: 'Priority purchase from trade' },
        { slot: 'chest', priority: 'medium', target: 'Field Lamellar or similar high-armour base', upgrade: 'When found' },
        { slot: 'flask', priority: 'high', target: 'Granite, Jade, Silver, Quicksilver, Divine Life flask setup', upgrade: 'Complete set before serious heisting' }
      ],

      bosses: [],

      decisionPoints: [
        {
          id: 'heist-d1',
          condition: 'Accumulated enough currency for your real build',
          ifTrue: 'Roll your next character — mapper, bosser, or whatever you planned',
          ifFalse: 'Keep heisting — the currency per hour is good on this build',
          reasoning: 'This character is a means to an end. The goal is funding your actual endgame build.',
          priority: 'critical'
        },
        {
          id: 'heist-d2',
          condition: 'Want to switch to Molten Strike variant',
          ifTrue: 'Swap Smite for Molten Strike — similar tree, different clear style (more single-target)',
          ifFalse: 'Stick with Smite — good clear and single target for heists',
          reasoning: 'Molten Strike Chad is an alternative variant on the Mobalytics guide',
          priority: 'low'
        }
      ],

      checklistItems: [
        { id: 'heist-c1', task: 'Talk to all rogues in Rogue Harbour', category: 'quest', required: true },
        { id: 'heist-c2', task: 'Run contracts to level rogues and earn markers', category: 'other', required: true },
        { id: 'heist-c3', task: 'Reveal blueprints for Grand Heists', category: 'other', required: true },
        { id: 'heist-c4', task: 'Target capped resists, 2.5K+ life, 20K+ armour, dual Hyaon\'s Fury', category: 'gear', required: true },
        { id: 'heist-c5', task: 'Accumulate currency for your real build', category: 'other', required: true },
        { id: 'heist-c6', task: 'Switch loot filter to heist-appropriate if available', category: 'other', required: false }
      ],

      mistakes: [
        {
          id: 'heist-m1',
          mistake: 'Spending heist currency on this character instead of saving',
          why: 'This is a farming character. All currency should go toward your next build.',
          severity: 'major',
          fix: 'Only upgrade this character with drops. Save currency.',
          videoTimestamp: null
        },
        {
          id: 'heist-m2',
          mistake: 'Running heists without capped resists',
          why: 'Heist mobs hit hard — dying in a heist loses all your loot',
          severity: 'major',
          fix: 'Cap resists and get decent life/armour before heisting',
          videoTimestamp: null
        }
      ]
    }
  ],

  heuristics: [
    {
      id: 'h1',
      category: 'build',
      rule: 'IF you want to push atlas THEN do NOT use this build — it is a heist farmer',
      reasoning: 'Creator explicitly warns this is not an atlas build',
      priority: 'critical'
    },
    {
      id: 'h2',
      category: 'defense',
      rule: 'IF you find dual 1H weapons (claws preferred) THEN switch to dual wield — Versatile Combatant converts attack block to spell block',
      reasoning: 'Build uses dual Hyaon\'s Fury endgame with Iron Reflexes + Versatile Combatant for layered defense',
      priority: 'critical'
    },
    {
      id: 'h3',
      category: 'gems',
      rule: 'IF accuracy is lower than max life THEN fix it immediately — Precise Technique is offline',
      reasoning: 'Precise Technique gives 40% more damage but only if accuracy > life',
      priority: 'critical'
    },
    {
      id: 'h4',
      category: 'leveling',
      rule: 'IF mob pack is rare/blue with many enemies THEN always stop and kill',
      reasoning: 'Rare/magic packs give disproportionate XP for level thresholds',
      priority: 'high'
    },
    {
      id: 'h5',
      category: 'leveling',
      rule: 'IF mobs are high-HP single targets THEN skip them',
      reasoning: 'Time-to-kill ratio is terrible compared to clearing packs',
      priority: 'medium'
    },
    {
      id: 'h6',
      category: 'defense',
      rule: 'IF fire resist is capped entering Crematorium THEN walk over fire traps',
      reasoning: 'Capped fire res trivializes the zone; uncapped means death',
      priority: 'critical'
    },
    {
      id: 'h7',
      category: 'economy',
      rule: 'IF currency drops in heists THEN save it — do not spend on this character',
      reasoning: 'This is a farming character. All wealth goes to your next build.',
      priority: 'high'
    },
    {
      id: 'h8',
      category: 'combat',
      rule: 'IF boss is dangerous and you have portals THEN place portal at entrance for free resurrections',
      reasoning: 'Death costs are time, not currency, in softcore',
      priority: 'medium'
    },
    {
      id: 'h9',
      category: 'heist',
      rule: 'IF alert level is near max THEN stop opening chests and head for the exit',
      reasoning: 'Dying in a heist with full inventory means losing everything',
      priority: 'critical'
    },
    {
      id: 'h10',
      category: 'gearing',
      rule: 'IF you find armour gear with life + resist THEN equip it — armour scaling is your secondary defense',
      reasoning: 'Build uses Determination + high armour bases for damage reduction',
      priority: 'high'
    }
  ],

  commonMistakes: [
    {
      id: 'cm1',
      mistake: 'Trying to push atlas/maps with this character',
      fix: 'This build is a heist farmer. Use it to fund a proper mapper.',
      severity: 'major',
      category: 'build'
    },
    {
      id: 'cm2',
      mistake: 'Not switching from Spectral Throw to Smite in Acts 4-5',
      fix: 'Smite is your endgame skill. Start leveling it in Act 3 offhand and switch by Act 4.',
      severity: 'major',
      category: 'gems'
    },
    {
      id: 'cm3',
      mistake: 'Staying on 2H instead of switching to dual wield',
      fix: 'Dual wield with Versatile Combatant is the endgame defense layer. Switch to dual 1H (claws) when you can.',
      severity: 'major',
      category: 'defense'
    },
    {
      id: 'cm4',
      mistake: 'Spending heist currency upgrading this character',
      fix: 'Only upgrade with drops. Save all tradeable currency for your next build.',
      severity: 'minor',
      category: 'economy'
    },
    {
      id: 'cm5',
      mistake: 'Running heists without capped resists',
      fix: 'Cap resists first. Dying in heists means losing all collected loot.',
      severity: 'major',
      category: 'defense'
    }
  ],

  tags: ['scion', 'ascendant', 'smite', 'melee', 'dual-wield', 'armour', 'heist', 'league-start', 'budget', 'advanced', 'iron-reflexes', 'lightning'],

  // Endgame link groups from PoB — what gems go in which gear slot
  linkGroups: [
    {
      id: 'smite-6l',
      name: '6L Body — Main Skill',
      slot: 'Body Armour',
      mainSkill: true,
      gems: [
        { name: 'Vaal Smite', isSupport: false },
        { name: 'Volatility Support', isSupport: true },
        { name: 'Multistrike Support', isSupport: true },
        { name: 'Added Lightning Damage Support', isSupport: true },
        { name: 'Elemental Damage with Attacks Support', isSupport: true },
        { name: 'Lightning Penetration Support', isSupport: true },
      ],
      activeLinks: 6,
      sockets: 'RRRRGB',
    },
    {
      id: 'smite-auras',
      name: 'Auras (Helmet)',
      slot: 'Helmet',
      mainSkill: false,
      gems: [
        { name: 'Determination', isSupport: false },
        { name: 'Anger', isSupport: false },
        { name: 'Vitality', isSupport: false },
      ],
      activeLinks: 3,
      sockets: 'RRR',
    },
    {
      id: 'smite-precision',
      name: 'Precision (Ring)',
      slot: 'Ring',
      mainSkill: false,
      gems: [
        { name: 'Precision', isSupport: false },
        { name: 'Arrogance Support', isSupport: true },
      ],
      activeLinks: 2,
      sockets: 'RR',
    },
    {
      id: 'smite-cwdt',
      name: 'CWDT (Gloves)',
      slot: 'Gloves',
      mainSkill: false,
      gems: [
        { name: 'Cast when Damage Taken Support', isSupport: true },
        { name: 'Molten Shell', isSupport: false },
      ],
      activeLinks: 2,
      sockets: 'RR',
    },
    {
      id: 'smite-movement',
      name: 'Movement (Boots)',
      slot: 'Boots',
      mainSkill: false,
      gems: [
        { name: 'Leap Slam', isSupport: false },
        { name: 'Faster Attacks Support', isSupport: true },
      ],
      activeLinks: 2,
      sockets: 'RG',
    },
    {
      id: 'smite-utility',
      name: 'Utility (Weapon)',
      slot: 'Weapon',
      mainSkill: false,
      gems: [
        { name: 'Phase Run', isSupport: false },
        { name: 'More Duration Support', isSupport: true },
      ],
      activeLinks: 2,
      sockets: 'GG',
    },
    {
      id: 'smite-selfcast',
      name: 'Self-Cast (Unlinked)',
      slot: 'Various',
      mainSkill: false,
      gems: [
        { name: 'Blood Rage', isSupport: false },
        { name: 'Clarity', isSupport: false },
        { name: 'Frostblink', isSupport: false },
      ],
      activeLinks: 1,
      sockets: 'GBB',
    },
  ],

  resources: {
    pobPaste: 'https://pobb.in/mJRitnzVra3x',
    guideUrl: 'https://mobalytics.gg/poe/profile/bigdaddygaming/builds/bigdaddies-smite-scion-leagustart',
    videoUrl: null,
    authorChannel: null,
    transcriptSource: null,
    analysisSource: null
  }
};

export default smiteScionPlaybook;
