// Wires the guide together: loads the data, builds the tracker state,
// renders the list, detail pane, roadmap and progress, and handles every control.
import { loadTrophies, kindLabel } from './data.js';
import { createTrackerState } from './state.js';
import { filterTrophies, countByKind } from './filters.js';
import { renderTrophyList, renderTrophyDetail, renderProgressCard, renderProgressDetail } from './render.js';
import { renderRoadmapSteps } from './roadmap.js';

const KIND_ORDER = ['all', 'story', 'missable', 'collectibles', 'activities', 'online'];

const $ = (id) => document.getElementById(id);

async function init() {
  let trophies;
  try {
    trophies = await loadTrophies();
  } catch (error) {
    $('trophyList').innerHTML = '<li class="empty-note">Could not load data/trophies.json. This guide works offline from its own files — check that app/data/trophies.json is present.</li>';
    return;
  }
  const state = createTrackerState(trophies);
  const counts = countByKind(trophies);

  let kind = 'all';
  let grade = 'all';
  let query = '';
  let earnedOnly = false;
  let selectedName = 'Positive Mental Attitude';

  function currentFilters() {
    return { kind, grade, query, earnedOnly, earned: state.earned };
  }

  function refresh() {
    const visible = filterTrophies(trophies, currentFilters());
    renderTrophyList($('trophyList'), visible, state, selectedName, {
      onSelect: (name) => {
        selectedName = name;
        refresh();
      },
      onToggleEarned: (name) => {
        state.toggleEarned(name);
        refresh();
      },
    });
    const selected = trophies.find((t) => t.name === selectedName) ?? trophies[0];
    renderTrophyDetail($('detailPanel'), selected, state, (name) => {
      state.toggleEarned(name);
      refresh();
    });
    renderProgressCard(trophies, state);
    renderProgressDetail($('progressDetail'), trophies, state);
    renderRoadmapSteps($('roadmapSteps'), trophies, state);
    $('resultLine').textContent = 'Showing ' + visible.length + ' of ' + trophies.length + ' trophies'
      + (kind === 'online' ? ' — there are no online trophies; all 55 are offline.' : '');
    $('spoilerToggle').checked = state.spoiler;
  }

  function buildKindChips() {
    const wrap = $('kindChips');
    wrap.replaceChildren();
    for (const key of KIND_ORDER) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip' + (kind === key ? ' active' : '');
      button.dataset.kind = key;
      button.textContent = (key === 'all' ? 'All' : kindLabel(key)) + ' (' + counts[key] + ')';
      button.addEventListener('click', () => {
        kind = key;
        buildKindChips();
        refresh();
      });
      wrap.append(button);
    }
  }

  function showStatus(message) {
    $('ioStatus').textContent = message;
  }

  async function importChosen(file, statusTarget) {
    if (!file) return;
    try {
      const result = await state.importFile(file);
      refresh();
      const message = 'Imported ' + result.imported + ' earned trophies'
        + (result.ignored > 0 ? ' (' + result.ignored + ' unknown names ignored)' : '') + '.';
      showStatus(message);
      if (statusTarget) statusTarget.textContent = message;
    } catch {
      showStatus('That file is not a Leonida Legend progress export.');
    }
  }

  function confirmReset() {
    if (window.confirm('Reset all progress? This clears every ticked trophy in this browser. Export a backup first if you want to keep it.')) {
      state.resetAll();
      refresh();
      showStatus('Progress reset — 0 of ' + trophies.length + ' earned.');
    }
  }

  $('search').addEventListener('input', (event) => {
    query = event.target.value;
    refresh();
  });
  $('gradeFilter').addEventListener('change', (event) => {
    grade = event.target.value;
    refresh();
  });
  $('earnedOnly').addEventListener('change', (event) => {
    earnedOnly = event.target.checked;
    refresh();
  });
  $('spoilerToggle').addEventListener('change', (event) => {
    state.setSpoiler(event.target.checked);
    refresh();
  });
  $('exportBtn').addEventListener('click', () => {
    const count = state.exportFile();
    showStatus('Exported ' + count + ' earned trophies to leonida-legend-progress.json.');
  });
  $('exportBtn2').addEventListener('click', () => {
    const count = state.exportFile();
    showStatus('Exported ' + count + ' earned trophies to leonida-legend-progress.json.');
  });
  $('importFile').addEventListener('change', (event) => importChosen(event.target.files[0]));
  $('importFile2').addEventListener('change', (event) => importChosen(event.target.files[0]));
  $('resetBtn').addEventListener('click', confirmReset);
  $('resetBtn2').addEventListener('click', confirmReset);

  document.querySelectorAll('.view-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.view-tab').forEach((t) => t.classList.remove('active'));
      document.querySelectorAll('.view').forEach((v) => v.classList.remove('active'));
      tab.classList.add('active');
      $('view-' + tab.dataset.view).classList.add('active');
    });
  });

  buildKindChips();
  refresh();
}

init();
