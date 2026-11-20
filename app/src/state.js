// Saved progress: which trophies are earned and whether story spoilers are hidden.
// Stored in localStorage only; export/import moves the same JSON between browsers.
const STORAGE_KEY = 'leonida-legend-v1';

export function createTrackerState(trophies) {
  const knownNames = new Set(trophies.map((t) => t.name));
  let earned = new Set();
  let spoiler = true;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      if (Array.isArray(saved.earned)) {
        earned = new Set(saved.earned.filter((name) => knownNames.has(name)));
      }
      if (typeof saved.spoiler === 'boolean') spoiler = saved.spoiler;
    }
  } catch {
    earned = new Set();
    spoiler = true;
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      app: 'leonida-legend',
      version: 1,
      earned: [...earned].sort(),
      spoiler,
    }));
  }

  function toggleEarned(name) {
    if (earned.has(name)) earned.delete(name);
    else earned.add(name);
    save();
  }

  function setSpoiler(value) {
    spoiler = value;
    save();
  }

  function resetAll() {
    earned = new Set();
    save();
  }

  function exportFile() {
    const payload = {
      app: 'leonida-legend',
      version: 1,
      exportedAt: new Date().toISOString(),
      earned: [...earned].sort(),
      spoiler,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'leonida-legend-progress.json';
    a.click();
    URL.revokeObjectURL(url);
    return payload.earned.length;
  }

  async function importFile(file) {
    const text = await file.text();
    const data = JSON.parse(text);
    const names = Array.isArray(data) ? data : data.earned;
    if (!Array.isArray(names)) throw new Error('not a progress file');
    const valid = names.filter((name) => knownNames.has(name));
    earned = new Set(valid);
    if (typeof data.spoiler === 'boolean') spoiler = data.spoiler;
    save();
    return { imported: valid.length, ignored: names.length - valid.length };
  }

  return {
    get earned() { return earned; },
    get spoiler() { return spoiler; },
    isEarned: (name) => earned.has(name),
    toggleEarned,
    setSpoiler,
    resetAll,
    exportFile,
    importFile,
  };
}
