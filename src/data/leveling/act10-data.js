/**
 * act10.js - Leveling data for Acts 10
 * Generated: 2026-02-19T10:20:03.191Z
 *
 * Data sources:
 * - exile-leveling by HeartofPhos (GitHub)
 * - poe-leveling.com leveling guides
 * - Path of Exile Wiki (CC BY-NC-SA 3.0)
 */

export const act10Data = {
  "acts": [
    10
  ],
  "areas": [
    {
      "id": "act10-area-0",
      "name": "Oriath Square",
      "act": 10,
      "level": 77,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in Oriath Square",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act10-area-1",
      "name": "The Ravaged Square",
      "act": 10,
      "level": 77,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Ravaged Square",
          "reward": null
        }
      ],
      "tips": [
        {
          "content": "Final Kitava fight - get resistances (-60% total after)",
          "category": "combat",
          "freshOnly": false
        }
      ],
      "craftingRecipes": []
    },
    {
      "id": "act10-area-2",
      "name": "The Torched Courts",
      "act": 10,
      "level": 78,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Torched Courts",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act10-area-3",
      "name": "The Desecrated Chambers",
      "act": 10,
      "level": 79,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Desecrated Chambers",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act10-area-4",
      "name": "The Ossuary",
      "act": 10,
      "level": 80,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Ossuary",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act10-area-5",
      "name": "The Feeding Trough",
      "act": 10,
      "level": 81,
      "hasWaypoint": false,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Feeding Trough",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    },
    {
      "id": "act10-area-6",
      "name": "The Canals",
      "act": 10,
      "level": 82,
      "hasWaypoint": true,
      "isOptional": false,
      "connections": [],
      "objectives": [
        {
          "type": "quest",
          "description": "Complete objectives in The Canals",
          "reward": null
        }
      ],
      "tips": [],
      "craftingRecipes": []
    }
  ],
  "quests": [
    {
      "id": "act10-quest-0",
      "name": "Safe Passage",
      "act": 10,
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
      "id": "act10-quest-1",
      "name": "Vilenta's Vengeance",
      "act": 10,
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
      "id": "act10-quest-2",
      "name": "An End to Hunger",
      "act": 10,
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
    }
  ],
  "gems": []
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
  "generatedAt": "2026-02-19T10:20:03.190Z",
  "disclaimer": "Data compiled for educational purposes. Please support the original sources."
};

export default { data: act10Data, credits };
