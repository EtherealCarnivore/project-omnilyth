export const cleanCategoryName = (category) => category
  .replace(/suffix_?/, "Suffix")
  .replace(/prefix_?/, "Prefix")
  .replace("adjudicator", " Warlord")
  .replace("basilisk", " Hunter")
  .replace("crusader", " Crusader")
  .replace("eyrie", " Redeemer")
  .replace("elder", " Elder")
  .replace("shaper", " Shaper");

export const categoryOrder = (a, b) => {
  const priorityMap = {
    '': -1,
    'shaper': 0,
    'elder': 1,
    'basilisk': 2,
    'crusader': 3,
    'eyrie': 4,
    'adjudicator': 5,
  };
  const getPriority = (group) => {
    const name = group.replace(/(prefix|suffix)_?/, "");
    return priorityMap[name] ?? Infinity;
  };
  return getPriority(a.category) - getPriority(b.category);
};

export function groupedCategory(categories) {
  return categories.reduce((acc, category) => {
    const key = category.category.replace(/(suffix|prefix)_?/, "");
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(category);
    return acc;
  }, {});
}
