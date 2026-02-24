/**
 * Playbook Registry
 *
 * Central index for all leveling playbooks
 */

import lightningArrowRangerPlaybook from './lightning-arrow-ranger.js';

// Registry of all playbooks
export const playbooks = [
  lightningArrowRangerPlaybook
  // Add more playbooks here as they're created
];

// Helper to get playbook by ID
export const getPlaybookById = (id) => {
  return playbooks.find(p => p.id === id);
};

// Helper to get playbooks by class
export const getPlaybooksByClass = (className) => {
  return playbooks.filter(p => p.class === className);
};

// Helper to get playbooks by tag
export const getPlaybooksByTag = (tag) => {
  return playbooks.filter(p => p.tags.includes(tag));
};

// Helper to get playbooks by difficulty
export const getPlaybooksByDifficulty = (difficulty) => {
  return playbooks.filter(p => p.difficulty === difficulty);
};

export default playbooks;
