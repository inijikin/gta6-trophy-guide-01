// Renders the three roadmap steps from the trophies' roadmap stages.
// Story trophy names are masked here too while spoilers are on.
import { isMasked } from './render.js';

const STEPS = [
  {
    stage: 1,
    title: 'Step 1 — Finish the story',
    time: '60–80 hours · Chapters 1–5',
    text: 'Play the five chapters and take side content as it shows up. Do the Chapter 1 meditation for Positive Mental Attitude before Chapter 1 ends — it is the only thing that can be missed. Scan vehicles and study animals as you go (200 of 277 vehicles and 100 of 255 animals count toward 100%). Keep a manual save at the start and end of each chapter: there is no mission replay.',
  },
  {
    stage: 2,
    title: 'Step 2 — The 100% checklist',
    time: 'About 100 hours · after the story',
    text: 'After the credits, open Progress > Stats > 100% Completion and work through what is left: every robbery, underwater discovery, shooting range, drone race and Bret Target Deck, 70 of 80 challenges, and any 100 optional missions. Most miscellaneous trophies pop along the way.',
  },
  {
    stage: 3,
    title: 'Step 3 — Strangers & clean-up',
    time: 'About 10 hours · free-roam',
    text: 'Stranger strands are not part of 100%, so finish the 8 counting strands, then sweep up whatever is left — the UFO easter egg, the tank, the plane, the bike kicks. Every quest giver tied to a trophy is back in free-roam after the story.',
  },
];

export function renderRoadmapSteps(container, trophies, state) {
  container.replaceChildren();
  for (const step of STEPS) {
    const inStep = trophies.filter((t) => t.stage === step.stage);
    const got = inStep.filter((t) => state.isEarned(t.name)).length;
    const card = document.createElement('article');
    card.className = 'step';

    const title = document.createElement('h3');
    title.textContent = step.title;
    card.append(title);

    const time = document.createElement('p');
    time.className = 'step-time';
    time.textContent = step.time;
    card.append(time);

    const text = document.createElement('p');
    text.textContent = step.text;
    card.append(text);

    const list = document.createElement('ul');
    for (const trophy of inStep) {
      const item = document.createElement('li');
      if (state.isEarned(trophy.name)) item.className = 'earned-item';
      item.textContent = (state.isEarned(trophy.name) ? '✓ ' : '') +
        (isMasked(trophy, state) ? 'Hidden story trophy' : trophy.name);
      list.append(item);
    }
    card.append(list);

    const count = document.createElement('p');
    count.className = 'step-count';
    count.textContent = got + ' of ' + inStep.length + ' earned in this step';
    card.append(count);

    container.append(card);
  }
}
