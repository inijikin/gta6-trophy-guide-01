// Filtering for the checklist: by kind, grade, search text and earned state.
// Kind "missable" matches the missable flag (only one trophy carries it);
// kind "online" matches nothing — all 55 trophies are offline, which the
// empty state in the list says out loud.
export function filterTrophies(trophies, filters) {
  const query = (filters.query ?? '').trim().toLowerCase();
  return trophies.filter((t) => {
    if (filters.kind !== 'all') {
      if (filters.kind === 'missable' && !t.missable) return false;
      if (filters.kind === 'online') return false;
      if (filters.kind !== 'missable' && filters.kind !== 'online' && t.kind !== filters.kind) return false;
    }
    if (filters.grade !== 'all' && t.grade !== filters.grade) return false;
    if (filters.earnedOnly && !filters.earned.has(t.name)) return false;
    if (query) {
      const haystack = (t.name + ' ' + t.description + ' ' + t.guide).toLowerCase();
      if (!haystack.includes(query)) return false;
    }
    return true;
  });
}

export function countByKind(trophies) {
  const counts = { all: trophies.length, story: 0, missable: 0, collectibles: 0, activities: 0, online: 0 };
  for (const t of trophies) {
    counts[t.kind] += 1;
    if (t.missable) counts.missable += 1;
  }
  return counts;
}
