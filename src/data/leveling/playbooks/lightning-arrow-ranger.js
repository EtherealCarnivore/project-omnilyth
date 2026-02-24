/**
 * Lightning Arrow Ranger Leveling Playbook
 *
 * Source: TytyKiller's Lightning Arrow Ranger league start VOD
 * Video: https://www.youtube.com/watch?v=TH0w7fUoRqE
 * Build: Lightning Arrow Deadeye — SSF League Start
 * Conditions: Fresh league start, no twink gear, no trade, campaign-only resources
 * Credit: All speedrunning knowledge extracted from TytyKiller's stream/VOD
 */

export const lightningArrowRangerPlaybook = {
  id: 'lightning-arrow-ranger',
  name: 'Lightning Arrow Ranger',
  class: 'Ranger',
  ascendancy: ['Deadeye'],
  patchVersion: '3.27',
  difficulty: 'intermediate',
  estimatedTime: '3-5 hours',
  author: 'TytyKiller',
  description: 'SSF league-start bow build. Pace is dictated entirely by bow quality. Scales through flat elemental essences, Trinity, and Precise Technique. Fast clear, mobile playstyle.',

  principles: [
    {
      id: 'p1',
      title: 'Opportunity cost is everything',
      description: 'Being 15 minutes faster into maps matters more than being overleveled. Skip questionable XP mobs and arrive at good zones sooner.',
      priority: 'critical'
    },
    {
      id: 'p2',
      title: 'Bow quality dictates run pace',
      description: 'The difference between a good and bad bow run IS the difference between a good and bad run overall. Essence every bow upgrade.',
      priority: 'critical'
    },
    {
      id: 'p3',
      title: 'Three-link is non-negotiable',
      description: 'Your main attack link is the mandatory gear piece. Never sacrifice your primary damage link for anything else.',
      priority: 'critical'
    },
    {
      id: 'p4',
      title: 'Essences go on bows only',
      description: 'Any flat elemental damage essence on a bow roughly doubles your damage. Never use flat elemental essences on armor.',
      priority: 'high'
    },
    {
      id: 'p5',
      title: 'Unidentified rares = transmute shards',
      description: 'Identifying everything wastes scrolls and yields fewer transmutes. Unidentified rares vendor for transmute shards, which fund flat damage crafts.',
      priority: 'high'
    },
    {
      id: 'p6',
      title: 'Precise Technique = 40% more damage',
      description: 'Rangers naturally stack dexterity with low life, making accuracy > life easy to maintain. Monitor accuracy vs life when swapping gear.',
      priority: 'high'
    },
    {
      id: 'p7',
      title: 'Trinity needs two alternating elements',
      description: 'Lightning wide damage range naturally procs Trinity. If one element dominates too heavily, Trinity stops working. Craft the underrepresented element.',
      priority: 'medium'
    },
    {
      id: 'p8',
      title: 'Life Tap is a damage multiplier',
      description: 'Spending life instead of mana triggers Mana Forged Arrows constantly, making Life Tap effectively a "more damage" support.',
      priority: 'high'
    },
    {
      id: 'p9',
      title: 'Resist benchmarks shift by act',
      description: 'You do not need capped resists during campaign. Aim for ~105% total combined resists entering Act 5.',
      priority: 'medium'
    },
    {
      id: 'p10',
      title: 'Splits lie — context matters',
      description: 'A 17-minute Merveil at level 11 with no gear is worse than 19 minutes at level 13 with transmutes and a 3-link ready for Act 2.',
      priority: 'medium'
    }
  ],

  powerSpikes: [
    {
      level: 8,
      spike: 'Primal Spirit passive',
      impact: 'Solves early mana problems, enables Shield Charge + Frost Blink usage',
      gear: [],
      gems: ['Frost Blink', 'Shield Charge', 'Shrapnel Ballista'],
      videoTimestamp: '00:04:06'
    },
    {
      level: 12,
      spike: 'Lightning Arrow online',
      impact: 'Primary skill available — massive clear improvement over Galvanic Arrow',
      gear: ['Short bow with links'],
      gems: ['Lightning Arrow', 'Mana Forged Arrows'],
      videoTimestamp: '00:13:06'
    },
    {
      level: 15,
      spike: 'Aspect of the Lynx',
      impact: 'Movement speed and damage passive node',
      gear: [],
      gems: [],
      videoTimestamp: '00:13:36'
    },
    {
      level: 18,
      spike: 'Precise Technique keystone',
      impact: '40% more damage if accuracy > life. Critical to socket for bosses.',
      gear: [],
      gems: [],
      videoTimestamp: '00:30:47'
    },
    {
      level: 24,
      spike: 'Haste aura',
      impact: 'Movement speed increase for clear and traversal. Must equip immediately.',
      gear: [],
      gems: ['Haste'],
      videoTimestamp: '00:39:23'
    },
    {
      level: 28,
      spike: 'Mana Forged Arrows setup',
      impact: 'Sets up automatic trigger for secondary skills — major QoL and damage',
      gear: [],
      gems: ['Mana Forged Arrows'],
      videoTimestamp: null
    },
    {
      level: 32,
      spike: 'XP penalty bracket shift',
      impact: 'Bracket shifts AND you gain a level — can be in level 37 zones penalty-free',
      gear: [],
      gems: [],
      videoTimestamp: '00:24:18'
    },
    {
      level: 38,
      spike: 'Life Tap on main links',
      impact: 'Enables constant Mana Forged Arrows triggering — huge damage multiplier',
      gear: [],
      gems: ['Life Tap'],
      videoTimestamp: '02:24:49'
    },
    {
      level: null,
      spike: 'First bow essence',
      impact: 'Flat elemental essence on bow roughly doubles damage (e.g., 250 → 567 DPS)',
      gear: ['Essenced bow'],
      gems: [],
      videoTimestamp: '00:28:54'
    },
    {
      level: null,
      spike: 'Cruel Lab — Far Shot + Endless Munitions',
      impact: '30% more damage at range + extra projectile. Can drop LMP entirely.',
      gear: [],
      gems: [],
      videoTimestamp: '02:19:35'
    },
    {
      level: null,
      spike: '100% spell suppression',
      impact: 'Near immunity to spell damage — enables aggressive playstyle in maps',
      gear: ['All-evasion gear'],
      gems: [],
      videoTimestamp: '03:21:38'
    }
  ],

  acts: [
    {
      act: 1,
      title: 'Coast to Merveil',
      levelRange: { enter: 1, exit: 12 },
      timeTarget: 'Sub-9 minutes to Prison',

      route: [
        { zone: 'Twilight Strand', objective: 'Kill Hillock, pick up starting weapon', skipMobs: true },
        { zone: 'The Coast', objective: 'Guess layout direction, look for top-right opening. Fill every gear slot.', skipMobs: false },
        { zone: 'Tidal Island', objective: 'Complete quest for Quicksilver Flask reward', skipMobs: true },
        { zone: 'Mud Flats', objective: 'Rush through — fill gear slots for survivability', skipMobs: true },
        { zone: 'Submerged Passage', objective: 'Find Ledge entrance', skipMobs: true },
        { zone: 'The Ledge', objective: 'Kill rare/blue packs for XP', skipMobs: false },
        { zone: 'The Climb', objective: 'Rush through', skipMobs: true },
        { zone: 'Lower Prison', objective: 'Break barrels for currency. Look for quicksilver strongbox side area.', skipMobs: false },
        { zone: 'Upper Prison', objective: 'Kill Brutus at level 8+', skipMobs: true },
        { zone: 'Ship Graveyard', objective: 'Complete Fairgraves for skill point', skipMobs: true },
        { zone: "Merveil's Cavern", objective: 'MUST be level 12 for Lightning Arrow gem', skipMobs: false }
      ],

      quests: [
        { name: 'Tidal Island', reward: 'Quicksilver Flask', required: true, timing: 'Before Mud Flats' },
        { name: 'Dweller of the Deep', reward: 'Skill Point', required: true, timing: 'Before leaving Act 1' },
        { name: 'Fairgraves', reward: 'Skill Point', required: true, timing: 'In Ship Graveyard' },
        { name: 'Den side quest', reward: 'Second Quicksilver', required: false, timing: 'Only if no strongbox quicksilver' }
      ],

      gems: [
        { level: 1, action: 'start', gems: ['Galvanic Arrow'], links: ['Galvanic Arrow'] },
        { level: 8, action: 'add', gems: ['Shrapnel Ballista', "Sniper's Mark", 'Mirage Archer'], links: ['Galvanic Arrow', 'Mirage Archer'] },
        { level: 8, action: 'add', gems: ['Frost Blink', 'Shield Charge'], links: ['Buy from vendor — Primal Spirit enables mana'] },
        { level: 12, action: 'switch', gems: ['Lightning Arrow', 'Mana Forged Arrows'], links: ['Lightning Arrow'] },
        { level: 12, action: 'prepare', gems: ['LMP'], links: ['Buy from vendor for later'] }
      ],

      gear: [
        { slot: 'weapon', priority: 'critical', target: 'Short bow — buy from vendor or find drop', upgrade: 'As soon as possible' },
        { slot: 'quiver', priority: 'high', target: 'Any flat damage quiver', upgrade: 'Serating/flat ele on drop' },
        { slot: 'all slots', priority: 'high', target: 'Fill every slot for defenses (mud flats kills you otherwise)', upgrade: 'Immediately' },
        { slot: 'chest', priority: 'medium', target: 'Backup chest with good link colors — do NOT equip yet (3% MS penalty)', upgrade: 'Before boss only' },
        { slot: 'ring', priority: 'medium', target: 'Iron ring from vendor (costs 1 alteration)', upgrade: 'Vendor recipe for flat damage' }
      ],

      bosses: [
        {
          name: 'Brutus',
          level: 8,
          difficulty: 'easy',
          strategy: 'Frost Blink over him — instant movement + chill. Sniper\'s Mark so projectiles chain. Shrapnel Ballista for extra damage + chill.',
          dangerLevel: 'low',
          videoTimestamp: '00:12:38'
        },
        {
          name: 'Merveil',
          level: 12,
          difficulty: 'medium',
          strategy: 'Must be level 12. Take quicksilver as quest reward.',
          dangerLevel: 'medium',
          videoTimestamp: null
        }
      ],

      decisionPoints: [
        {
          id: 'act1-d1',
          condition: 'Find a good bow but have no 3-link for it',
          ifTrue: 'Carry a backup chest/helm with matching links and swap when ready',
          ifFalse: 'Equip directly if links are fine',
          reasoning: 'Dropping to a 1-link is unacceptable DPS loss',
          priority: 'high'
        },
        {
          id: 'act1-d2',
          condition: 'Zero transmutes by Act 2',
          ifTrue: 'You are identifying too many rares. Leave them unidentified for transmute shards.',
          ifFalse: 'Continue as normal',
          reasoning: 'Unidentified rares vendor for transmute shards which fund flat damage crafts',
          priority: 'high'
        },
        {
          id: 'act1-d3',
          condition: 'Find a flat elemental damage essence',
          ifTrue: 'Save it for a bow — never use on armor',
          ifFalse: 'Continue looking',
          reasoning: 'Flat elemental on a bow approximately doubles your damage',
          priority: 'critical'
        }
      ],

      checklistItems: [
        { id: 'act1-c1', task: 'Fill every gear slot for survivability', category: 'gear', required: true },
        { id: 'act1-c2', task: 'Buy iron ring from vendor (1 alteration)', category: 'gear', required: false },
        { id: 'act1-c3', task: 'Complete Tidal Island for Quicksilver Flask', category: 'quest', required: true },
        { id: 'act1-c4', task: 'Keep backup chest with good link colors (do NOT equip yet)', category: 'gear', required: false },
        { id: 'act1-c5', task: 'Level 8: Take Primal Spirit passive', category: 'level', required: true },
        { id: 'act1-c6', task: 'Buy Frost Blink + Shield Charge + Shrapnel Ballista', category: 'gem', required: true },
        { id: 'act1-c7', task: 'Break barrels in Lower Prison for currency', category: 'other', required: false },
        { id: 'act1-c8', task: 'Kill rare/blue packs for XP — MUST hit level 12 by Merveil', category: 'level', required: true },
        { id: 'act1-c9', task: 'Take Lightning Arrow + Mana Forged Arrows from Merveil reward', category: 'gem', required: true },
        { id: 'act1-c10', task: 'Buy LMP from vendor for later', category: 'gem', required: true }
      ],

      mistakes: [
        {
          id: 'act1-m1',
          mistake: 'Pressing quicksilver immediately after entering a portal/door',
          why: 'Duration is only ~6 seconds, wasted on short transitions',
          severity: 'major',
          fix: 'Wait until you are in the zone and moving',
          videoTimestamp: '00:08:29'
        },
        {
          id: 'act1-m2',
          mistake: 'Using essence on bow before checking nearby essence type',
          why: 'A better essence (like Hatred for flat cold) might be nearby',
          severity: 'minor',
          fix: 'Always check what essences are available before using one',
          videoTimestamp: '00:09:24'
        },
        {
          id: 'act1-m3',
          mistake: 'Using instant mana flask or "recover mana at end" flask',
          why: 'These are the worst possible mana flask mods for sustained combat',
          severity: 'major',
          fix: 'Never use these mods — use normal mana flasks',
          videoTimestamp: '00:06:53'
        }
      ]
    },

    {
      act: 2,
      title: 'Forest to Weaver',
      levelRange: { enter: 12, exit: 18 },
      timeTarget: '19-21 minutes total',

      route: [
        { zone: 'Act 2 Town', objective: 'Buy Trinity and Elemental Damage with Attacks — DO NOT FORGET', skipMobs: false },
        { zone: 'Various', objective: 'Equip Shield Charge + Momentum + Faster Attacks in weapon swap', skipMobs: false },
        { zone: 'Forest areas', objective: 'Weaver is OPPOSITE side of road from waypoint. Alira = same side as WP.', skipMobs: true },
        { zone: 'Spider areas', objective: 'Spider webs on trees confirm Weaver direction', skipMobs: true },
        { zone: 'Den', objective: 'Only do if no quicksilver from Act 1 strongbox', skipMobs: true }
      ],

      quests: [
        { name: 'Talk to woman NPC', reward: '15% all res', required: true, timing: 'Immediately' },
        { name: 'Skill point quests', reward: 'Skill Points', required: true, timing: 'All of them' },
        { name: 'Den quest', reward: 'Quicksilver', required: false, timing: 'Only if no QS from Act 1' },
        { name: 'Aspect of the Eagle', reward: 'Passive', required: true, timing: 'After Merveil rewards' }
      ],

      gems: [
        { level: 12, action: 'switch', gems: ['Lightning Arrow'], links: ['Lightning Arrow', 'LMP', 'Mirage Archer'] },
        { level: 15, action: 'add', gems: ['Aspect of the Lynx'], links: ['Passive node'] },
        { level: 18, action: 'add', gems: ['Precise Technique'], links: ['MUST socket for bosses — 40% more damage'] },
        { level: 12, action: 'add', gems: ['Faster Attacks', 'Momentum'], links: ['Shield Charge', 'Momentum', 'Faster Attacks'] }
      ],

      gear: [
        { slot: 'weapon', priority: 'critical', target: 'Essence any bow with flat elemental — doubles damage (250 → 567)', upgrade: 'First essence found' },
        { slot: 'boots', priority: 'high', target: '15 MS boots (first available from Merveil area)', upgrade: 'On drop' },
        { slot: 'rings', priority: 'medium', target: 'Iron ring for vendor recipe if needed', upgrade: 'When affordable' }
      ],

      bosses: [
        {
          name: 'Weaver',
          level: 16,
          difficulty: 'medium',
          strategy: 'Precise Technique MUST be equipped — missing it is ~40% damage loss. The racer forgot this for all of Acts 1-2.',
          dangerLevel: 'medium',
          videoTimestamp: '00:30:47'
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
          condition: 'Mobs are stone golems or high-HP single targets',
          ifTrue: 'Skip them entirely',
          ifFalse: 'Kill if they are in a pack',
          reasoning: 'Time-to-kill ratio is terrible compared to clearing large packs',
          priority: 'medium'
        }
      ],

      checklistItems: [
        { id: 'act2-c1', task: 'Equip Shield Charge + Momentum + Faster Attacks in weapon swap', category: 'gem', required: true },
        { id: 'act2-c2', task: 'BUY Trinity and Elemental Damage with Attacks', category: 'gem', required: true },
        { id: 'act2-c3', task: 'Use flat elemental essence on bow if found (doubles damage)', category: 'gear', required: false },
        { id: 'act2-c4', task: 'Look for 15 MS boots', category: 'gear', required: false },
        { id: 'act2-c5', task: 'Level 18: Socket Precise Technique for bosses (40% more damage)', category: 'gem', required: true }
      ],

      mistakes: [
        {
          id: 'act2-m1',
          mistake: 'Forgot Precise Technique on bosses for all of Acts 1-2',
          why: 'Missing 40% damage on every single boss fought',
          severity: 'major',
          fix: 'Socket Precise Technique at level 18 and never forget it',
          videoTimestamp: '00:30:47'
        },
        {
          id: 'act2-m2',
          mistake: 'Equipping a chest piece during clear',
          why: 'Costs 3% movement speed — only equip before bosses',
          severity: 'minor',
          fix: 'Remove chest during clear for speed, equip before dangerous fights',
          videoTimestamp: '00:05:56'
        }
      ]
    },

    {
      act: 3,
      title: 'Sewers to Dominus',
      levelRange: { enter: 18, exit: 28 },
      timeTarget: '36 minutes total with everything done',

      route: [
        { zone: 'Sarn Sewers', objective: 'One bust before WP, two after. Big room = bust top, small room = bust bottom.', skipMobs: false },
        { zone: 'Crematorium', objective: 'IF fire res capped → walk over traps. If not, craft fire res first.', skipMobs: true },
        { zone: 'Ancient Pyramid', objective: 'Always look for the opposite corner', skipMobs: true },
        { zone: 'Docks', objective: 'Level 24 entering is fine — zone prints XP fast, ~95% XP efficiency', skipMobs: false }
      ],

      quests: [
        { name: 'All skill point quests', reward: 'Skill Points', required: true, timing: 'All of them' },
        { name: 'Haste aura', reward: 'Movement speed', required: true, timing: 'Level 24 — EQUIP IMMEDIATELY' },
        { name: 'Anger aura', reward: 'Flat fire damage', required: true, timing: 'When available' }
      ],

      gems: [
        { level: 24, action: 'add', gems: ['Haste'], links: ['Aura — equip immediately'] },
        { level: 24, action: 'add', gems: ['Anger'], links: ['Aura — weapon swap or off-slots'] },
        { level: 18, action: 'switch', gems: ['Lightning Arrow', 'LMP', 'Mirage Archer'], links: ['Lightning Arrow', 'LMP', 'Mirage Archer'] }
      ],

      gear: [
        { slot: 'chest', priority: 'medium', target: 'Pure evasion chest (easier to chrome to 3 green)', upgrade: 'When found' },
        { slot: 'crafting', priority: 'high', target: "Fire damage craft from Solar's Temple 2, Lightning from Piety area", upgrade: 'When transmutes available' }
      ],

      bosses: [
        {
          name: 'Dominus',
          level: 28,
          difficulty: 'hard',
          strategy: 'Must be at least level 28. Cap fire resist for Crematorium traps — walk right over them if capped.',
          dangerLevel: 'high',
          videoTimestamp: '00:54:28'
        }
      ],

      decisionPoints: [
        {
          id: 'act3-d1',
          condition: 'Fire resist is capped entering Crematorium',
          ifTrue: 'Walk straight over fire traps — trivializes the zone',
          ifFalse: 'Essence/craft fire res first or get "completely owned"',
          reasoning: 'Capped fire res makes Crematorium a non-issue, uncapped means death',
          priority: 'critical'
        },
        {
          id: 'act3-d2',
          condition: 'Level 24 entering Docks (zone level 29)',
          ifTrue: 'This is fine — still get ~95% XP, zone prints XP fast',
          ifFalse: 'No need to grind — push forward',
          reasoning: 'Docks is so efficient you will catch up naturally',
          priority: 'medium'
        }
      ],

      checklistItems: [
        { id: 'act3-c1', task: 'Grab Haste aura at level 24 — EQUIP IMMEDIATELY', category: 'gem', required: true },
        { id: 'act3-c2', task: 'Grab Anger aura', category: 'gem', required: true },
        { id: 'act3-c3', task: 'Look for pure evasion chest pieces (easier to chrome to 3G)', category: 'gear', required: false },
        { id: 'act3-c4', task: 'Fire damage craft from Solar\'s Temple 2', category: 'gear', required: false },
        { id: 'act3-c5', task: 'Level 24 entering Docks, 27 killing Piety, 28+ killing Dominus', category: 'level', required: true }
      ],

      mistakes: [
        {
          id: 'act3-m1',
          mistake: 'Forgot to buy Elemental Damage with Attacks and Trinity in Act 2',
          why: 'Had to backtrack from Act 3 to purchase them — significant time loss and damage loss',
          severity: 'major',
          fix: 'Buy these BEFORE leaving Act 2 vendor',
          videoTimestamp: '00:43:04'
        },
        {
          id: 'act3-m2',
          mistake: 'Forgot to equip Haste aura after purchasing it',
          why: 'Ran multiple zones without the movement speed bonus',
          severity: 'major',
          fix: 'Equip Haste the moment you get it',
          videoTimestamp: '00:45:15'
        }
      ]
    },

    {
      act: 4,
      title: 'Kaom/Daresso to Malachai',
      levelRange: { enter: 28, exit: 33 },
      timeTarget: 'Sub-55 minutes total',

      route: [
        { zone: 'Kaom/Daresso areas', objective: 'Blink Arrow skips available — practice beforehand', skipMobs: true },
        { zone: 'Aqueduct', objective: 'Movement shortcuts available', skipMobs: true },
        { zone: 'Grand Arena', objective: 'WP trick: take waypoint, go back, do Comb zone if XP needed', skipMobs: false }
      ],

      quests: [
        { name: 'All skill point quests', reward: 'Skill Points', required: true, timing: 'All of them' },
        { name: 'Cold damage bench craft', reward: 'Crafting option', required: true, timing: 'Available in Act 4' }
      ],

      gems: [
        { level: 28, action: 'prepare', gems: ['Barrage Support'], links: ['For single target on bosses — replace LMP'] }
      ],

      gear: [
        { slot: 'rings', priority: 'high', target: 'Two-stone rings for resist — use vault corruption chamber', upgrade: 'Act 3+ on drop' },
        { slot: 'quiver', priority: 'medium', target: 'Woe essences give percent bow damage', upgrade: 'When Woe essence found' }
      ],

      bosses: [
        {
          name: 'Malachai',
          level: 32,
          difficulty: 'medium',
          strategy: 'Bow builds are strong enough to skip Comb zone farming that other builds need before this boss.',
          dangerLevel: 'medium',
          videoTimestamp: '01:04:38'
        }
      ],

      decisionPoints: [
        {
          id: 'act4-d1',
          condition: 'Find a two-stone ring near Act 3+',
          ifTrue: 'Pick it up for vault corruption chamber — resist rings solve biggest gearing constraint',
          ifFalse: 'Continue without',
          reasoning: 'Resist rings solve the biggest gearing constraint in mid-campaign',
          priority: 'high'
        }
      ],

      checklistItems: [
        { id: 'act4-c1', task: 'Hit level 32 before leaving Act 4 (XP penalty breakpoint)', category: 'level', required: true },
        { id: 'act4-c2', task: 'Use Woe essences on quiver for percent bow damage', category: 'gear', required: false },
        { id: 'act4-c3', task: 'Practice Blink Arrow skips in Kaom/Daresso areas', category: 'other', required: false },
        { id: 'act4-c4', task: 'Grab cold damage bench craft', category: 'gear', required: true }
      ],

      mistakes: []
    },

    {
      act: 5,
      title: 'Innocence and Kitava',
      levelRange: { enter: 33, exit: 39 },
      timeTarget: 'Sub-1:30 total',

      route: [
        { zone: 'Standard Act 5', objective: 'Innocence fight is dangerous at low HP', skipMobs: false }
      ],

      quests: [
        { name: 'All skill point quests', reward: 'Skill Points', required: true, timing: 'All' },
        { name: 'Dead Eye Ascendancy', reward: 'Tailwind', required: true, timing: 'Normal Lab' }
      ],

      gems: [
        { level: null, action: 'add', gems: ['Herald of Ice'], links: ['Clear improvement'] },
        { level: null, action: 'add', gems: ['Blood Rage'], links: ['Attack speed + frenzy charges'] }
      ],

      gear: [
        { slot: 'all', priority: 'high', target: 'Running ~700 HP with no defensive auras — every gear upgrade matters', upgrade: 'Accept occasional deaths on softcore' }
      ],

      bosses: [
        {
          name: 'Innocence',
          level: 36,
          difficulty: 'hard',
          strategy: 'Dangerous at low HP. Use portals as free resurrections in softcore speed runs.',
          dangerLevel: 'high',
          videoTimestamp: null
        }
      ],

      decisionPoints: [
        {
          id: 'act5-d1',
          condition: 'Boss fight is dangerous and you have portals',
          ifTrue: 'Place portal at boss entrance and use it as free resurrections',
          ifFalse: 'Fight normally',
          reasoning: 'Death costs are time, not currency, in softcore speed runs',
          priority: 'medium'
        }
      ],

      checklistItems: [
        { id: 'act5-c1', task: 'Grab Dead Eye Ascendancy: Tailwind', category: 'quest', required: true },
        { id: 'act5-c2', task: 'Equip Herald of Ice for clear', category: 'gem', required: true },
        { id: 'act5-c3', task: 'Equip Blood Rage for attack speed + frenzy charges', category: 'gem', required: true }
      ],

      mistakes: []
    },

    {
      act: 6,
      title: 'Tidal Island Redux',
      levelRange: { enter: 39, exit: 45 },
      timeTarget: 'Sub-1:30 total',

      route: [
        { zone: 'Tidal Island', objective: 'Do for belt drops (heavy belt upgrades). Portal to Twilight Strand after — faster than waypoint.', skipMobs: false }
      ],

      quests: [
        { name: 'All skill point quests', reward: 'Skill Points', required: true, timing: 'All' }
      ],

      gems: [
        { level: 38, action: 'add', gems: ['Life Tap'], links: ['On main links — DO NOT FORGET. Massive DPS multiplier.'] },
        { level: null, action: 'switch', gems: ['Flame Dash'], links: ['Replaces Frost Blink if found'] }
      ],

      gear: [
        { slot: 'belt', priority: 'high', target: 'Heavy belt with life and strength', upgrade: 'From Tidal Island run' },
        { slot: 'boots', priority: 'high', target: '30 MS boots — chrome pure evasion to 3G1R', upgrade: 'When found' }
      ],

      bosses: [],

      decisionPoints: [
        {
          id: 'act6-d1',
          condition: 'Trinity stops proccing (one element dominates)',
          ifTrue: 'Craft the underrepresented element on gear or swap Anger on/off',
          ifFalse: 'Continue as normal',
          reasoning: 'Trinity provides massive damage only when both elements alternate as highest',
          priority: 'high'
        }
      ],

      checklistItems: [
        { id: 'act6-c1', task: 'Socket Life Tap on main links — DO NOT FORGET', category: 'gem', required: true },
        { id: 'act6-c2', task: 'Chrome pure evasion boots to 3G1R', category: 'gear', required: false },
        { id: 'act6-c3', task: 'Monitor Trinity — craft underrepresented element if needed', category: 'gem', required: false }
      ],

      mistakes: [
        {
          id: 'act6-m1',
          mistake: 'Did not socket Life Tap on main links until deep into maps',
          why: '"There is no reason not to have life tap on my main gems." Major DPS loss for extended period.',
          severity: 'major',
          fix: 'Socket Life Tap the moment it is available',
          videoTimestamp: '02:24:49'
        },
        {
          id: 'act6-m2',
          mistake: 'Crafted fire damage on bow when already doing too much fire for Trinity',
          why: 'Broke Trinity proccing, had to toggle Anger on/off as workaround',
          severity: 'major',
          fix: 'Check Trinity balance before adding more of any element',
          videoTimestamp: '01:56:27'
        }
      ]
    },

    {
      act: 7,
      title: 'Acts 7-8',
      levelRange: { enter: 45, exit: 55 },
      timeTarget: 'Act 7 entry at ~2 hour mark',

      route: [
        { zone: 'Act 8', objective: 'Hidden side area connects to sewers — shortcuts to Bath House and Concourse', skipMobs: true }
      ],

      quests: [
        { name: 'All skill point quests', reward: 'Skill Points', required: true, timing: 'All' }
      ],

      gems: [
        { level: null, action: 'switch', gems: ['Return Projectiles'], links: ['On Lightning Arrow for clear'] },
        { level: null, action: 'add', gems: ['Barrage Support'], links: ['For single target on bosses'] },
        { level: null, action: 'add', gems: ['Mana Forged Arrows', 'Frenzy'], links: ['For charge generation'] }
      ],

      gear: [
        { slot: 'all', priority: 'medium', target: 'Start looking for 6-socket items (7 jeweller = fusings = chance orbs)', upgrade: 'Always pick up 6-sockets' },
        { slot: 'belt', priority: 'medium', target: 'Heavy belt with life', upgrade: 'On drop' },
        { slot: 'quiver', priority: 'medium', target: 'Bow damage + resist', upgrade: 'On drop' }
      ],

      bosses: [],

      decisionPoints: [
        {
          id: 'act7-d1',
          condition: 'Find a six-socket item in maps',
          ifTrue: 'Always pick it up — converts to 7 jeweller → fusings → chance orbs',
          ifFalse: 'N/A',
          reasoning: 'Critical for map sustain economy',
          priority: 'high'
        }
      ],

      checklistItems: [
        { id: 'act7-c1', task: 'Swap to Return Projectiles on Lightning Arrow for clear', category: 'gem', required: true },
        { id: 'act7-c2', task: 'Level up Barrage Support in offhand for boss swapping', category: 'gem', required: true },
        { id: 'act7-c3', task: 'Pick up all 6-socket items for currency conversion', category: 'gear', required: false }
      ],

      mistakes: [
        {
          id: 'act7-m1',
          mistake: 'Forgot to put Return Projectiles gem in leveling slot',
          why: 'Found it unleveled in stash — "this gem loses a lot of effectiveness" when underleveled',
          severity: 'major',
          fix: 'Put Return Projectiles in a leveling slot as soon as you get it',
          videoTimestamp: '02:52:06'
        },
        {
          id: 'act7-m2',
          mistake: 'Anger aura stopped leveling for ~20 levels',
          why: 'Accidentally delisted — went from expected level 19 to only level 13',
          severity: 'major',
          fix: 'Periodically check aura gem levels are still progressing',
          videoTimestamp: '04:34:00'
        }
      ]
    },

    {
      act: 9,
      title: 'Acts 9-10 + Lab',
      levelRange: { enter: 55, exit: 62 },
      timeTarget: 'Sub-3:00 with lab',

      route: [
        { zone: 'Act 10 bridge', objective: 'Blink Arrow skip available across the bridge', skipMobs: true }
      ],

      quests: [
        { name: 'All skill point quests', reward: 'Skill Points', required: true, timing: 'All' },
        { name: 'Cruel Lab', reward: 'Far Shot + Endless Munitions', required: true, timing: 'When convenient' },
        { name: 'Merc Lab', reward: 'Gem quality + power', required: true, timing: 'Dark shrines give extra enchants' }
      ],

      gems: [
        { level: null, action: 'switch', gems: ['Drop LMP after Endless Munitions'], links: ['LA', 'Return Projectiles', 'Mirage Archer', 'Life Tap'] }
      ],

      gear: [
        { slot: 'all', priority: 'high', target: 'Push toward 100% spell suppression (all-evasion gear)', upgrade: 'Prioritize' },
        { slot: 'weapon', priority: 'high', target: 'Final bow upgrades via gambling or essence crafting', upgrade: 'When possible' }
      ],

      bosses: [],

      decisionPoints: [
        {
          id: 'act9-d1',
          condition: 'Need endurance charge generation',
          ifTrue: 'Prioritize unveiling rings for +1 min endurance charge on kill',
          ifFalse: 'Continue without',
          reasoning: 'Endurance charges are primary physical mitigation for bow builds — dramatically reduce deaths',
          priority: 'high'
        }
      ],

      checklistItems: [
        { id: 'act9-c1', task: 'Cruel Lab: Far Shot (30% more dmg) + Endless Munitions (extra proj)', category: 'quest', required: true },
        { id: 'act9-c2', task: 'After Endless Munitions: drop LMP, switch to Return Projectiles', category: 'gem', required: true },
        { id: 'act9-c3', task: 'Target level 58-62 entering maps (64+ preferred)', category: 'level', required: true },
        { id: 'act9-c4', task: 'Blood Rage OFF during lab traps', category: 'other', required: true },
        { id: 'act9-c5', task: 'Merc Lab when convenient (dark shrines = extra enchants)', category: 'quest', required: false }
      ],

      mistakes: [
        {
          id: 'act9-m1',
          mistake: 'Blood Rage will kill you running through lab traps',
          why: 'Life degen + trap damage = death',
          severity: 'major',
          fix: 'Turn Blood Rage OFF before trap sections',
          videoTimestamp: '02:20:04'
        }
      ]
    },

    {
      act: 10,
      title: 'Early Maps',
      levelRange: { enter: 62, exit: 80 },
      timeTarget: 'Sub-5:30 two-stone',

      route: [
        { zone: 'T1-T4', objective: 'Run for completion first, then push upward', skipMobs: false },
        { zone: 'T7+', objective: 'Full clear — boss kills drop +2 tiers, rare mobs +1', skipMobs: false },
        { zone: 'T9+', objective: 'Grab Exarch/Eater influence', skipMobs: false }
      ],

      quests: [
        { name: 'Unwavering atlas node', reward: 'Map sustain', required: true, timing: 'Early' },
        { name: 'Betrayal nodes (4 points)', reward: 'Massive XP + unveils', required: true, timing: 'Priority' },
        { name: 'Kirac missions', reward: 'Map purchasing to push tiers', required: true, timing: 'Use regularly' }
      ],

      gems: [],

      gear: [
        { slot: 'weapon', priority: 'critical', target: 'Gamble bows from vendors with chance orbs', upgrade: 'Regularly' },
        { slot: 'all', priority: 'critical', target: 'Cap spell suppression at 100% with all-evasion gear + tree', upgrade: 'Priority' },
        { slot: 'all', priority: 'high', target: 'Target 4k+ HP', upgrade: 'Through gear upgrades' }
      ],

      bosses: [],

      decisionPoints: [
        {
          id: 'maps-d1',
          condition: 'Thinking about corrupting maps early',
          ifTrue: 'Do NOT — save Vaal orbs. Chance orbs are more valuable for map sustain.',
          ifFalse: 'Correct instinct',
          reasoning: 'Vaal orbs are scarce, chance orbs convert to map sustain',
          priority: 'high'
        },
        {
          id: 'maps-d2',
          condition: 'Running higher tier maps before lower tiers',
          ifTrue: 'This is correct — boss drops +2, rare mobs +1 from current tier',
          ifFalse: 'Run higher tiers first for better adjacent drops',
          reasoning: 'Higher tiers give better drop progression',
          priority: 'high'
        }
      ],

      checklistItems: [
        { id: 'maps-c1', task: 'Switch to real loot filter (not leveling filter!)', category: 'other', required: true },
        { id: 'maps-c2', task: 'Run T1-T4 for completion', category: 'other', required: true },
        { id: 'maps-c3', task: 'Full clear T7+ for adjacent tier drops', category: 'other', required: true },
        { id: 'maps-c4', task: 'Grab Betrayal atlas nodes (4 points = huge XP + unveils)', category: 'quest', required: true },
        { id: 'maps-c5', task: 'Grab Unwavering atlas node for map sustain', category: 'quest', required: true },
        { id: 'maps-c6', task: 'Use Kirac missions for purchasing maps', category: 'other', required: true },
        { id: 'maps-c7', task: 'Exarch/Eater influence starting at T9', category: 'quest', required: false },
        { id: 'maps-c8', task: 'Cap spell suppression at 100%', category: 'gear', required: true },
        { id: 'maps-c9', task: 'Check Exarch/Eater quest log for required map tier BEFORE applying influence', category: 'other', required: true }
      ],

      mistakes: [
        {
          id: 'maps-m1',
          mistake: 'Ran red maps with leveling loot filter still active',
          why: '"I\'m still using my like giga early game leveling filter even though I\'m like red maps." Cluttered screen, missed drops.',
          severity: 'major',
          fix: 'Switch to real loot filter immediately upon entering maps',
          videoTimestamp: '04:27:07'
        },
        {
          id: 'maps-m2',
          mistake: 'Put wrong influence tier on Eater progression',
          why: 'Ran T15 when Eater required T14, wasted a crucial T16 map',
          severity: 'major',
          fix: 'Always check quest log for required map tier before applying influence',
          videoTimestamp: '05:09:13'
        }
      ]
    }
  ],

  heuristics: [
    {
      id: 'h1',
      category: 'gearing',
      rule: 'IF you find a good bow but no 3-link THEN carry backup chest with matching links',
      reasoning: 'Dropping to a 1-link is unacceptable DPS loss',
      priority: 'critical'
    },
    {
      id: 'h2',
      category: 'economy',
      rule: 'IF zero transmutes by Act 2 THEN you are identifying too many rares',
      reasoning: 'Unidentified rares vendor for transmute shards — more valuable than ID chance',
      priority: 'high'
    },
    {
      id: 'h3',
      category: 'crafting',
      rule: 'IF flat elemental damage essence found THEN save it for bow only',
      reasoning: 'Flat elemental on bow doubles damage; on armor it does nothing comparable',
      priority: 'critical'
    },
    {
      id: 'h4',
      category: 'gems',
      rule: 'IF Trinity stops proccing (one element dominates) THEN craft underrepresented element or toggle Anger',
      reasoning: 'Trinity provides massive damage only when both elements alternate as highest',
      priority: 'high'
    },
    {
      id: 'h5',
      category: 'leveling',
      rule: 'IF mob pack is rare/blue with many enemies THEN always stop and kill',
      reasoning: 'Rare/magic packs give disproportionate XP for level thresholds',
      priority: 'high'
    },
    {
      id: 'h6',
      category: 'leveling',
      rule: 'IF mobs are stone golems or high-HP singles THEN skip them',
      reasoning: 'Time-to-kill ratio is terrible compared to clearing large packs',
      priority: 'medium'
    },
    {
      id: 'h7',
      category: 'defense',
      rule: 'IF fire resist is capped entering Crematorium THEN walk over fire traps',
      reasoning: 'Capped fire res trivializes the zone; uncapped means death',
      priority: 'critical'
    },
    {
      id: 'h8',
      category: 'flasks',
      rule: 'IF instant mana flask or "recover at end" flask drops THEN never use it',
      reasoning: 'Worst possible mana flask mods for sustained combat',
      priority: 'high'
    },
    {
      id: 'h9',
      category: 'economy',
      rule: 'IF six-socket item found in maps THEN always pick it up',
      reasoning: '7 jeweller → fusings → chance orbs — critical for map sustain',
      priority: 'high'
    },
    {
      id: 'h10',
      category: 'combat',
      rule: 'IF boss is dangerous and you have portals THEN place portal at entrance for free resurrections',
      reasoning: 'Death costs are time, not currency, in softcore speed runs',
      priority: 'medium'
    }
  ],

  commonMistakes: [
    {
      id: 'cm1',
      mistake: 'Pressing quicksilver immediately after portal/door',
      fix: 'Wait until zone loads and you are moving — duration is only ~6 seconds',
      severity: 'major',
      category: 'movement'
    },
    {
      id: 'cm2',
      mistake: 'Equipping chest piece during clear',
      fix: 'Costs 3% movement speed — only equip before bosses, remove for clear',
      severity: 'minor',
      category: 'movement'
    },
    {
      id: 'cm3',
      mistake: 'Forgetting to level gems in offhand',
      fix: 'Always put Return Projectiles, Barrage, and auras in leveling slots',
      severity: 'major',
      category: 'gems'
    },
    {
      id: 'cm4',
      mistake: 'Not switching loot filter for maps',
      fix: 'Switch to real loot filter immediately upon entering maps',
      severity: 'major',
      category: 'maps'
    },
    {
      id: 'cm5',
      mistake: 'Corrupting maps early (wasting Vaal orbs)',
      fix: 'Save Vaal orbs — chance orbs are more valuable for map sustain',
      severity: 'minor',
      category: 'economy'
    }
  ],

  tags: ['bow', 'ranger', 'deadeye', 'lightning-arrow', 'ssf', 'league-start', 'fast', 'intermediate'],

  resources: {
    pobPaste: null,
    guideUrl: null,
    videoUrl: 'https://www.youtube.com/watch?v=TH0w7fUoRqE',
    authorChannel: 'https://www.youtube.com/@TytyKiller',
    transcriptSource: 'transcripts/lightning-arrow-ranger.srt',
    analysisSource: 'transcripts/lightning-arrow-ranger-analysis.md'
  }
};

export default lightningArrowRangerPlaybook;
