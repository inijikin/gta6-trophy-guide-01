// Loads the trophy list from app/data/trophies.json once and caches it.
let cachedTrophies = null;

export async function loadTrophies() {
  if (cachedTrophies) return cachedTrophies;
  const response = await fetch('data/trophies.json');
  if (!response.ok) throw new Error('could not load data/trophies.json');
  const doc = await response.json();
  cachedTrophies = doc.trophies;
  return cachedTrophies;
}

export function gradeLabel(grade) {
  return grade.charAt(0).toUpperCase() + grade.slice(1);
}

export function kindLabel(kind) {
  const labels = {
    story: 'Story',
    missable: 'Missable',
    collectibles: 'Collectibles',
    activities: 'Activities',
    online: 'Online',
  };
  return labels[kind] ?? kind;
}

export function stageLabel(stage) {
  return { 1: 'Step 1 · Story', 2: 'Step 2 · 100% checklist', 3: 'Step 3 · Clean-up' }[stage] ?? '';
}

export function countLabel(trophy) {
  if (trophy.count === null || trophy.count === undefined) return null;
  if (trophy.count >= 1000) return '×' + trophy.count.toLocaleString('en-US');
  return '×' + trophy.count;
}
