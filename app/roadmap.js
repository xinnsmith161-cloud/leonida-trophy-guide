// Roadmap to the platinum: the order to earn the 55 trophies in, built from the
// official descriptions and the launch-week guides cited in each trophy's guide.
// Stages match the "stage" field in app/data/trophies.json.
const ROADMAP_STAGES = [
  {
    title: 'Before you start',
    text: 'Set up a save routine first: there is no mission replay and no New Game Plus, so the game gives you 15 manual save slots plus one autosave. Keep one save at the start of every chapter and one untouched save from just before the final mission. Never use cheats on your trophy save — they should switch off trophies and saving.',
    items: [
      'Turn on the spoiler setting in the tracker above if you want story trophies hidden until earned.',
      'Decide your pace: the platinum is long (around 200 hours reported), not hard — there are no difficulty trophies and no online trophies.',
    ],
    trophies: [],
  },
  {
    title: 'Chapter 1 — do the missable step',
    text: 'Play the opening mission Gone Fishing and finish Chapter 1. This chapter holds the only trophy that can be missed, so do it before the chapter ends.',
    items: [
      'After Lucia is home — a morning after the mission Down to Earth is the usual time — follow her to the balcony of Jason\u2019s house and accept the optional meditation. It feeds Positive Mental Attitude and is gone once Chapter 1 ends.',
      'Beat Cal in a fishing challenge and finish one arcade game while you are here.',
      'Keep your Chapter 1 save until Positive Mental Attitude pops.',
    ],
    trophies: ['Just Like Paradise', 'Paradise Lost', 'Baited My Tackle', 'Stick Fiddler', 'Positive Mental Attitude'],
  },
  {
    title: 'Chapter 2 — the world opens up',
    text: 'Switching between Jason and Lucia opens up during this chapter, and with it most of the list: partner trophies, garages, the Scooter Bros app and the first illegal operation.',
    items: [
      'Rob Kingpin Bowling (the Kolt & Associates bowling alley) with Sticky Bombs for Let\u2019s Go Bowling — take the watch, the shotgun and the safe.',
      'After the mission Daily Driver, buy garages in the Vice City Real Estate app (8 in total, about $160,000).',
      'After the mission Moses, register stolen cars to the Scooter Bros app (10 in total).',
      'Meditate at every spot you pass, bringing your partner so outdoor spots count twice.',
    ],
    trophies: ['T**s Ass Drug Money', 'Let\u2019s Go Bowling', 'Little Boxes', 'On the Spot'],
  },
  {
    title: 'Chapter 3 — robberies and the timed race',
    text: 'The robbery tools arrive in this chapter, and so does the list\u2019s only time-sensitive step.',
    items: [
      'Do Race Against Yago the moment it appears (hourglass icon). Save first, then race — its strand counts toward Strangers & Freaks.',
      'Play Yasmani\u2019s Jewelry Jobs for the Snap Gun, then rob a jewelry store unseen for Sneakthief (Richardson Jewelry & Diamonds, Vice City).',
      'With your partner, rob 3 shops back-to-back without losing your wanted level for Retail Therapy.',
    ],
    trophies: ['Vice City, Baby!', 'Sneakthief', 'Retail Therapy', 'Strangers & Freaks'],
  },
  {
    title: 'Chapter 4 and the finale',
    text: 'Finish Chapter 4, unlock the bank vaults, then play the final mission — keeping your untouched save from just before it.',
    items: [
      'Play the optional mission That\u2019s Where The Money Is near the end of Chapter 4 to unlock bank vaults.',
      'Rob 5 vaults with your partner for Maximum Withdrawal — each vault hands you a 4-star wanted level, so escaping one also earns Hot Together.',
      'Keep one untouched manual save from just before the final mission, then finish it for the gold.',
    ],
    trophies: ['Top Of The World, Ma', 'Maximum Withdrawal', 'Hot Together', 'A Classic Blitz Play', 'You Gotta Know When to Get Off'],
  },
  {
    title: 'After the story — the 100% checklist',
    text: 'Everything outside the story stays available after the credits, including the side-story finales and the 100% checklist (Progress > Stats > 100% Completion). Work you did earlier still counts.',
    items: [
      'Finish the six side-story finales (Andy, Kenton, Billy, Randy, Tyrone, Bret) and the 8 stranger strands for Strangers & Freaks.',
      'Grind the counts: 300 stunts, 70 of 80 Challenges, 200 of 277 vehicles discovered, all 8 vaults, all 39 illegal operations, 3 card sets, 100 WAiNK locations, 14 drone races, 42 shooting-range golds, 52 areas.',
      'Launder $250,000 of Marked Bills, spend $100,000 in shops, and let Actions Speak Louder (500 profile actions) fill up on the way.',
      'Pick up the free-roam trophies: the VCIA jet (gates E3/E4), the Rhino tank at Mile Zero Air Station, 5 kills in one Combat Focus, the Ocean Beach cocktail and the showroom smash.',
    ],
    trophies: ['A Long Road', 'Cunning Stunts', 'One Last Thing', 'Whip It Good', 'Pest Control', 'Dime on the Dollar', 'Treat Yo Self', 'Don\u2019t Touch My Deck', 'You WAiNKer!', 'The Shootist', 'Top Fun', 'The Goodtime State'],
  },
  {
    title: 'The platinum',
    text: 'When the other 54 are yours, Vice Got a Price! pops on its own. Check the tracker above: the progress bar is your platinum meter.',
    items: ['If one trophy is left, use the tracker\u2019s filters (kind, grade, still to earn) to find it and open its guide for the exact steps and sources.'],
    trophies: ['Vice Got a Price!'],
  },
];

function renderRoadmap() {
  const list = document.getElementById('roadmapList');
  if (!list) return;
  list.replaceChildren();
  for (const stage of ROADMAP_STAGES) {
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = stage.title;
    li.append(h);
    const p = document.createElement('p');
    p.textContent = stage.text;
    li.append(p);
    const ul = document.createElement('ul');
    for (const item of stage.items) {
      const itemLi = document.createElement('li');
      itemLi.textContent = item;
      ul.append(itemLi);
    }
    li.append(ul);
    if (stage.trophies.length > 0) {
      const refs = document.createElement('p');
      refs.className = 'trophy-refs';
      refs.textContent = 'Trophies: ' + stage.trophies.join(' · ');
      li.append(refs);
    }
    list.append(li);
  }
}
