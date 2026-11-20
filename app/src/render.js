// Renders the checklist, the trophy detail pane and the progress displays.
// A story trophy — and the one missable trophy, whose guide names a Chapter 1
// mission — is masked while spoilers are on and it is not earned yet:
// its name and description read "Hidden trophy" until it is ticked off.
import { gradeLabel, kindLabel, stageLabel, countLabel } from './data.js';

export function isMasked(trophy, state) {
  return state.spoiler && (trophy.kind === 'story' || trophy.missable) && !state.isEarned(trophy.name);
}

function gradeBadge(trophy) {
  const badge = document.createElement('span');
  badge.className = 'grade-badge grade-' + trophy.grade;
  badge.textContent = gradeLabel(trophy.grade);
  return badge;
}

function tag(text, extraClass) {
  const el = document.createElement('span');
  el.className = 'tag' + (extraClass ? ' ' + extraClass : '');
  el.textContent = text;
  return el;
}

export function renderTrophyList(listEl, visible, state, selectedName, callbacks) {
  listEl.replaceChildren();
  if (visible.length === 0) {
    const note = document.createElement('li');
    note.className = 'empty-note';
    note.textContent = 'No trophies match these filters. Try clearing the search or picking another kind — “Online” is always empty: all 55 trophies are offline.';
    listEl.append(note);
    return;
  }
  for (const trophy of visible) {
    const masked = isMasked(trophy, state);
    const li = document.createElement('li');
    li.className = 'trophy-row' + (state.isEarned(trophy.name) ? ' earned' : '') + (trophy.name === selectedName ? ' selected' : '');
    li.addEventListener('click', () => callbacks.onSelect(trophy.name));

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = state.isEarned(trophy.name);
    box.setAttribute('aria-label', 'Mark ' + trophy.name + ' earned');
    box.addEventListener('click', (event) => event.stopPropagation());
    box.addEventListener('change', () => callbacks.onToggleEarned(trophy.name));
    li.append(box);

    const nameEl = document.createElement('div');
    nameEl.className = 'trophy-name';
    if (masked) {
      const hidden = document.createElement('span');
      hidden.className = 'hidden-tag';
      hidden.textContent = 'Hidden trophy';
      nameEl.append(hidden);
    } else {
      nameEl.textContent = trophy.name;
    }
    li.append(nameEl);
    li.append(gradeBadge(trophy));

    const descEl = document.createElement('div');
    descEl.className = 'trophy-desc';
    descEl.textContent = masked ? 'Hidden until earned — tick it off to reveal it.' : trophy.description;
    li.append(descEl);

    const tags = document.createElement('div');
    tags.className = 'trophy-tags';
    tags.append(tag(kindLabel(trophy.kind)));
    if (trophy.hidden) tags.append(tag('Hidden on PSN', 'hidden-flag'));
    if (trophy.missable) tags.append(tag('⚠ Missable', 'missable'));
    if (!masked) {
      const count = countLabel(trophy);
      if (count) tags.append(tag(count, 'count'));
    }
    tags.append(tag(stageLabel(trophy.stage)));
    li.append(tags);
    listEl.append(li);
  }
}

export function renderTrophyDetail(panel, trophy, state, onToggleEarned) {
  panel.replaceChildren();
  const masked = isMasked(trophy, state);

  panel.append(gradeBadge(trophy));
  const title = document.createElement('h2');
  title.textContent = masked ? 'Hidden trophy' : trophy.name;
  panel.append(title);

  const official = document.createElement('p');
  official.className = 'official';
  official.textContent = masked
    ? 'Official name and description hidden until earned.'
    : '“' + trophy.description + '” — official description, PlayStation.';
  panel.append(official);

  const chips = document.createElement('div');
  chips.className = 'meta-chips';
  chips.append(tag(kindLabel(trophy.kind)));
  chips.append(tag(stageLabel(trophy.stage)));
  if (trophy.hidden) chips.append(tag('Hidden on PSN', 'hidden-flag'));
  if (trophy.missable) chips.append(tag('⚠ Missable — do it in Chapter 1', 'missable'));
  const count = countLabel(trophy);
  if (count && !masked) chips.append(tag('Target ' + count, 'count'));
  panel.append(chips);

  if (masked) {
    const note = document.createElement('p');
    note.className = 'spoiler-note';
    note.textContent = 'Spoiler hidden: this trophy reveals story details, and its guide names missions and chapters. Earn it on PlayStation, or turn “Hide story spoilers” off, to read the guide.';
    panel.append(note);
  } else {
    const guide = document.createElement('p');
    guide.className = 'guide-text';
    guide.textContent = trophy.guide;
    panel.append(guide);
  }

  const sources = document.createElement('div');
  sources.className = 'sources';
  const heading = document.createElement('h4');
  heading.textContent = 'Sources for this guide';
  sources.append(heading);
  const list = document.createElement('ul');
  for (const source of trophy.sources) {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.url;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = source.name;
    item.append(link);
    list.append(item);
  }
  sources.append(list);
  panel.append(sources);

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'earn-btn' + (state.isEarned(trophy.name) ? ' earned' : '');
  button.textContent = state.isEarned(trophy.name) ? '✓ Earned — click to unmark' : 'Mark as earned';
  button.addEventListener('click', () => onToggleEarned(trophy.name));
  panel.append(button);
}

const GRADE_ORDER = ['platinum', 'gold', 'silver', 'bronze'];

export function renderProgressCard(trophies, state) {
  const earned = state.earned.size;
  const total = trophies.length;
  document.getElementById('earnedCount').textContent = String(earned);
  document.getElementById('earnedPct').textContent =
    total === 0 ? '0% to the platinum' : Math.round((earned / total) * 100) + '% to the platinum';
  const fill = document.getElementById('progressFill');
  fill.style.width = (total === 0 ? 0 : (earned / total) * 100) + '%';
  document.getElementById('progressBarWrap').setAttribute('aria-valuenow', String(earned));

  const bars = document.getElementById('gradeBars');
  bars.replaceChildren();
  for (const grade of GRADE_ORDER) {
    const inGrade = trophies.filter((t) => t.grade === grade);
    const got = inGrade.filter((t) => state.isEarned(t.name)).length;
    const li = document.createElement('li');
    const label = document.createElement('span');
    label.textContent = gradeLabel(grade);
    const bar = document.createElement('span');
    bar.className = 'bar';
    const barFill = document.createElement('span');
    barFill.className = 'bar-fill';
    barFill.style.width = (inGrade.length === 0 ? 0 : (got / inGrade.length) * 100) + '%';
    bar.append(barFill);
    const count = document.createElement('b');
    count.textContent = got + '/' + inGrade.length;
    li.append(label, bar, count);
    bars.append(li);
  }
}

export function renderProgressDetail(container, trophies, state) {
  container.replaceChildren();
  const groups = [
    ...GRADE_ORDER.map((grade) => ({ label: gradeLabel(grade), items: trophies.filter((t) => t.grade === grade) })),
    { label: 'Story', items: trophies.filter((t) => t.kind === 'story') },
    { label: 'Missable', items: trophies.filter((t) => t.missable) },
    { label: 'Collectibles', items: trophies.filter((t) => t.kind === 'collectibles') },
    { label: 'Activities', items: trophies.filter((t) => t.kind === 'activities') },
    { label: 'Online', items: [] },
  ];
  for (const group of groups) {
    const got = group.items.filter((t) => state.isEarned(t.name)).length;
    const row = document.createElement('div');
    row.className = 'kind-row';
    const label = document.createElement('span');
    label.textContent = group.label;
    const bar = document.createElement('span');
    bar.className = 'bar';
    const barFill = document.createElement('span');
    barFill.className = 'bar-fill';
    barFill.style.width = (group.items.length === 0 ? 0 : (got / group.items.length) * 100) + '%';
    bar.append(barFill);
    const count = document.createElement('b');
    count.textContent = got + ' / ' + group.items.length;
    row.append(label, bar, count);
    container.append(row);
  }
}
