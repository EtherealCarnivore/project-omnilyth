/**
 * acts123.js - Leveling data for Acts 1, 2, 3
 * Generated: 2026-02-19T10:58:16.316Z
 *
 * Data sources:
 * - exile-leveling by HeartofPhos (GitHub)
 * - poe-leveling.com leveling guides
 * - Path of Exile Wiki (CC BY-NC-SA 3.0)
 */

export const acts123Data = {
  "acts": [
    1,
    2,
    3
  ],
  "areas": [
    {
      "id": "act1-area-pre",
      "name": "The Twilight Strand",
      "act": 1,
      "level": 1,
      "hasWaypoint": false,
      "isOptional": false,
      "isTutorial": true,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Kill Hillock and pick up starting weapon/gem",
          "reward": "Skill gem (class-dependent)"
        }
      ],
      "tips": [
        {
          "content": "Skip all monsters, run straight to Hillock",
          "category": "combat",
          "freshOnly": false
        },
        {
          "content": "Pick up any gear drops to fill empty slots",
          "category": "combat",
          "freshOnly": true
        }
      ],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-0",
      "name": "Lioneye's Watch",
      "act": 1,
      "level": 1,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in Lioneye's Watch",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-1",
      "name": "The Coast",
      "act": 1,
      "level": 1,
      "hasWaypoint": false,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Coast",
          "reward": null
        }
      ],
      "tips": [
        {
          "content": "Skip most monsters, only kill blue packs for flasks",
          "category": "combat",
          "freshOnly": false
        },
        {
          "content": "Pick up all movement speed boots at vendors",
          "category": "vendor",
          "freshOnly": true
        }
      ],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-1s",
      "name": "The Tidal Island",
      "act": 1,
      "level": 1,
      "hasWaypoint": false,
      "isOptional": true,
      "isSideArea": true,
      "parentZone": "act1-area-1",
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Mercy Mission - Find the Medicine Chest",
          "reward": "Quicksilver Flask"
        }
      ],
      "tips": [
        {
          "content": "The Quicksilver Flask reward is essential for leveling speed",
          "category": "quest",
          "freshOnly": true
        }
      ],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-2",
      "name": "The Mud Flats",
      "act": 1,
      "level": 2,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Mud Flats",
          "reward": null
        }
      ],
      "tips": [
        {
          "content": "Grab the Quicksilver Flask from this zone",
          "category": "quest",
          "freshOnly": false
        },
        {
          "content": "Use Flame Dash or Leap Slam for faster movement",
          "category": "movement",
          "freshOnly": false
        }
      ],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-3",
      "name": "The Fetid Pool",
      "act": 1,
      "level": 3,
      "hasWaypoint": false,
      "isOptional": true,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Fetid Pool",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-4",
      "name": "The Submerged Passage",
      "act": 1,
      "level": 3,
      "hasWaypoint": false,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Submerged Passage",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-5",
      "name": "The Flooded Depths",
      "act": 1,
      "level": 4,
      "hasWaypoint": false,
      "isOptional": true,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Flooded Depths",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-6",
      "name": "The Ledge",
      "act": 1,
      "level": 5,
      "hasWaypoint": false,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Ledge",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-7",
      "name": "The Climb",
      "act": 1,
      "level": 8,
      "hasWaypoint": false,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Climb",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-8",
      "name": "The Lower Prison",
      "act": 1,
      "level": 9,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Lower Prison",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": [],
      "hasTrial": true,
      "trialType": "Spike traps"
    },
    {
      "id": "act1-area-9",
      "name": "The Upper Prison",
      "act": 1,
      "level": 10,
      "hasWaypoint": false,
      "isOptional": true,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Upper Prison",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-10",
      "name": "Prisoner's Gate",
      "act": 1,
      "level": 11,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in Prisoner's Gate",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-11",
      "name": "The Ship Graveyard",
      "act": 1,
      "level": 11,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Ship Graveyard",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-11s",
      "name": "The Ship Graveyard Cave",
      "act": 1,
      "level": 11,
      "hasWaypoint": false,
      "isOptional": true,
      "isSideArea": true,
      "parentZone": "act1-area-11",
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "The Marooned Mariner - Defeat Fairgraves for the Allflame",
          "reward": "Book of Skill (2 passive points)"
        }
      ],
      "tips": [
        {
          "content": "Short zone - Fairgraves is right at the end",
          "category": "combat",
          "freshOnly": false
        },
        {
          "content": "Worth doing for the 2 passive skill points",
          "category": "quest",
          "freshOnly": true
        }
      ],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-12",
      "name": "The Cavern of Wrath",
      "act": 1,
      "level": 12,
      "hasWaypoint": false,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Cavern of Wrath",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act1-area-13",
      "name": "The Cavern of Anger",
      "act": 1,
      "level": 13,
      "hasWaypoint": false,
      "isOptional": true,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Cavern of Anger",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act2-area-0",
      "name": "The Forest Encampment",
      "act": 2,
      "level": 14,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Forest Encampment",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act2-area-1",
      "name": "The Riverways",
      "act": 2,
      "level": 14,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Riverways",
          "reward": null
        }
      ],
      "tips": [
        {
          "content": "Deal with bandits - usually kill all for 2 passive points",
          "category": "quest",
          "freshOnly": false
        }
      ],
      "craftingRecipes": []
    },
    {
      "id": "act2-area-2",
      "name": "The Crossroads",
      "act": 2,
      "level": 15,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Crossroads",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act2-area-3",
      "name": "The Chamber of Sins Level 1",
      "act": 2,
      "level": 16,
      "hasWaypoint": false,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Chamber of Sins Level 1",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act2-area-4",
      "name": "The Chamber of Sins Level 2",
      "act": 2,
      "level": 18,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Chamber of Sins Level 2",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": [],
      "hasTrial": true,
      "trialType": "Sawblades"
    },
    {
      "id": "act2-area-5",
      "name": "The Broken Bridge",
      "act": 2,
      "level": 16,
      "hasWaypoint": false,
      "isOptional": true,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Broken Bridge",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act2-area-6",
      "name": "The Fellshrine Ruins",
      "act": 2,
      "level": 17,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Fellshrine Ruins",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act2-area-7",
      "name": "The Crypt Level 1",
      "act": 2,
      "level": 18,
      "hasWaypoint": false,
      "isOptional": true,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Crypt Level 1",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": [],
      "hasTrial": true,
      "trialType": "Spinning blades"
    },
    {
      "id": "act2-area-8",
      "name": "The Western Forest",
      "act": 2,
      "level": 17,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Western Forest",
          "reward": null
        }
      ],
      "tips": [
        {
          "content": "Get Quicksilver Flask of Adrenaline from Weaver quest",
          "category": "quest",
          "freshOnly": false
        }
      ],
      "craftingRecipes": []
    },
    {
      "id": "act2-area-9",
      "name": "The Weaver's Chambers",
      "act": 2,
      "level": 19,
      "hasWaypoint": false,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Weaver's Chambers",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act2-area-10",
      "name": "The Wetlands",
      "act": 2,
      "level": 18,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Wetlands",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act2-area-11",
      "name": "The Vaal Ruins",
      "act": 2,
      "level": 20,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Vaal Ruins",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act2-area-12",
      "name": "The Northern Forest",
      "act": 2,
      "level": 21,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Northern Forest",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act2-area-13",
      "name": "The Caverns",
      "act": 2,
      "level": 22,
      "hasWaypoint": false,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Caverns",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act3-area-0",
      "name": "The Sarn Encampment",
      "act": 3,
      "level": 23,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Sarn Encampment",
          "reward": null
        }
      ],
      "tips": [
        {
          "content": "Stock up on Chromatic Orbs from vendoring RGB items",
          "category": "vendor",
          "freshOnly": true
        }
      ],
      "craftingRecipes": []
    },
    {
      "id": "act3-area-1",
      "name": "The Slums",
      "act": 3,
      "level": 23,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Slums",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act3-area-2",
      "name": "The Crematorium",
      "act": 3,
      "level": 24,
      "hasWaypoint": false,
      "isOptional": true,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Crematorium",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": [],
      "hasTrial": true,
      "trialType": "Furnace traps"
    },
    {
      "id": "act3-area-3",
      "name": "The Sewers",
      "act": 3,
      "level": 24,
      "hasWaypoint": false,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Sewers",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act3-area-4",
      "name": "The Marketplace",
      "act": 3,
      "level": 25,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Marketplace",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act3-area-5",
      "name": "The Catacombs",
      "act": 3,
      "level": 26,
      "hasWaypoint": false,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Catacombs",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": [],
      "hasTrial": true,
      "trialType": "Blade sentries"
    },
    {
      "id": "act3-area-6",
      "name": "The Battlefront",
      "act": 3,
      "level": 27,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Battlefront",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act3-area-7",
      "name": "The Imperial Gardens",
      "act": 3,
      "level": 27,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Imperial Gardens",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": [],
      "hasTrial": true,
      "trialType": "Dart traps"
    },
    {
      "id": "act3-area-8",
      "name": "The Docks",
      "act": 3,
      "level": 26,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Docks",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act3-area-9",
      "name": "The Solaris Temple Level 2",
      "act": 3,
      "level": 28,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Solaris Temple Level 2",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act3-area-10",
      "name": "The Eternal Laboratory",
      "act": 3,
      "level": 30,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Eternal Laboratory",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act3-area-11",
      "name": "The Sceptre of God",
      "act": 3,
      "level": 32,
      "hasWaypoint": false,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Sceptre of God",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    }
  ],
  "quests": [
    {
      "id": "act1-quest-0",
      "name": "Enemy at the Gate",
      "act": 1,
      "required": true,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 0,
        "passive": false,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act1-quest-1",
      "name": "Mercy Mission",
      "act": 1,
      "required": false,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 1,
        "passive": true,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act1-quest-2",
      "name": "Breaking Some Eggs",
      "act": 1,
      "required": true,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 0,
        "passive": false,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act1-quest-3",
      "name": "The Caged Brute",
      "act": 1,
      "required": true,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 0,
        "passive": false,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act1-quest-4",
      "name": "The Siren's Cadence",
      "act": 1,
      "required": false,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 1,
        "passive": true,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act1-quest-5",
      "name": "The Marooned Mariner",
      "act": 1,
      "required": true,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 0,
        "passive": false,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act1-quest-6",
      "name": "The Dweller of the Deep",
      "act": 1,
      "required": false,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 1,
        "passive": true,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act2-quest-0",
      "name": "Deal with the Bandits",
      "act": 2,
      "required": false,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 2,
        "passive": true,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act2-quest-1",
      "name": "The Way Forward",
      "act": 2,
      "required": true,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 0,
        "passive": false,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act2-quest-2",
      "name": "Intruders in Black",
      "act": 2,
      "required": false,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 1,
        "passive": true,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act2-quest-3",
      "name": "Sharp and Cruel",
      "act": 2,
      "required": true,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 0,
        "passive": false,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act2-quest-4",
      "name": "Through Sacred Ground",
      "act": 2,
      "required": true,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 0,
        "passive": false,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act3-quest-0",
      "name": "Lost in Love",
      "act": 3,
      "required": false,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 1,
        "passive": true,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act3-quest-1",
      "name": "Victario's Secrets",
      "act": 3,
      "required": false,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 1,
        "passive": true,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act3-quest-2",
      "name": "Piety's Pets",
      "act": 3,
      "required": true,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 0,
        "passive": false,
        "items": []
      },
      "zones": []
    },
    {
      "id": "act3-quest-3",
      "name": "A Fixture of Fate",
      "act": 3,
      "required": false,
      "objectives": [
        "Complete the quest objective"
      ],
      "rewards": {
        "skillPoints": 2,
        "passive": true,
        "items": []
      },
      "zones": []
    }
  ],
  "gems": [
    {
      "id": "gem-0",
      "name": "Cleave",
      "level": 1,
      "act": 1,
      "source": "vendor",
      "classes": [
        "Marauder",
        "Duelist",
        "Templar"
      ],
      "color": "str",
      "quest": null,
      "vendor": "Nessa",
      "questRewards": {
        "Marauder": true,
        "Duelist": true,
        "Templar": false
      },
      "vendorAvailability": {
        "Marauder": true,
        "Duelist": true,
        "Templar": true,
        "Ranger": false,
        "Shadow": false,
        "Witch": false
      }
    },
    {
      "id": "gem-1",
      "name": "Ground Slam",
      "level": 1,
      "act": 1,
      "source": "vendor",
      "classes": [
        "Marauder",
        "Duelist"
      ],
      "color": "str",
      "quest": null,
      "vendor": "Nessa"
    },
    {
      "id": "gem-2",
      "name": "Splitting Steel",
      "level": 1,
      "act": 1,
      "source": "vendor",
      "classes": [
        "Duelist",
        "Ranger",
        "Shadow"
      ],
      "color": "dex",
      "quest": null,
      "vendor": "Nessa"
    },
    {
      "id": "gem-3",
      "name": "Spectral Throw",
      "level": 1,
      "act": 1,
      "source": "vendor",
      "classes": [
        "Ranger",
        "Shadow",
        "Scion"
      ],
      "color": "dex",
      "quest": null,
      "vendor": "Nessa"
    },
    {
      "id": "gem-4",
      "name": "Freezing Pulse",
      "level": 1,
      "act": 1,
      "source": "vendor",
      "classes": [
        "Witch",
        "Templar",
        "Shadow"
      ],
      "color": "int",
      "quest": null,
      "vendor": "Nessa",
      "questRewards": {
        "Witch": true,
        "Templar": true,
        "Shadow": false
      },
      "vendorAvailability": {
        "Witch": true,
        "Templar": true,
        "Shadow": true,
        "Marauder": false,
        "Duelist": false,
        "Ranger": false
      }
    },
    {
      "id": "gem-5",
      "name": "Spark",
      "level": 1,
      "act": 1,
      "source": "vendor",
      "classes": [
        "Witch",
        "Shadow"
      ],
      "color": "int",
      "quest": null,
      "vendor": "Nessa"
    },
    {
      "id": "gem-6",
      "name": "Herald of Ash",
      "level": 16,
      "act": 2,
      "source": "vendor",
      "classes": [
        "Marauder",
        "Duelist",
        "Templar"
      ],
      "color": "str",
      "quest": null,
      "vendor": "Nessa"
    },
    {
      "id": "gem-7",
      "name": "Herald of Ice",
      "level": 16,
      "act": 2,
      "source": "vendor",
      "classes": [
        "Ranger",
        "Shadow",
        "Scion"
      ],
      "color": "dex",
      "quest": null,
      "vendor": "Nessa"
    },
    {
      "id": "gem-8",
      "name": "Herald of Thunder",
      "level": 16,
      "act": 2,
      "source": "vendor",
      "classes": [
        "Witch",
        "Templar",
        "Shadow"
      ],
      "color": "int",
      "quest": null,
      "vendor": "Nessa"
    }
  ]
};

export const credits = {
  "sources": [
    {
      "name": "exile-leveling",
      "author": "HeartofPhos",
      "url": "https://github.com/HeartofPhos/exile-leveling",
      "description": "Structured leveling data"
    },
    {
      "name": "poe-leveling.com",
      "url": "https://www.poe-leveling.com",
      "description": "Leveling guides and tips"
    },
    {
      "name": "Path of Exile Wiki",
      "url": "https://www.poewiki.net",
      "license": "CC BY-NC-SA 3.0",
      "description": "Community-maintained game data"
    }
  ],
  "generatedAt": "2026-02-19T10:58:16.316Z",
  "disclaimer": "Data compiled for educational purposes. Please support the original sources."
};

export default { data: acts123Data, credits };
