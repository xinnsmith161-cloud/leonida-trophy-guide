# leonida-trophy-guide

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/xinnsmith161-cloud/leonida-trophy-guide/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/xinnsmith161-cloud/leonida-trophy-guide/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

Leonida Trophy Guide — an offline tracker and guide for the 55 PlayStation 5 trophies of Grand Theft Auto VI: the official names, descriptions and grades, a sourced guide for every trophy written in our own words, a roadmap to the platinum, missable flags, and a checklist that saves in the browser.

## Run it

```sh
node serve.ts   # serves app/ on http://localhost:8080
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=be7crr5f&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>

## What it does

- **Tracker** — tick trophies off; progress is saved in `localStorage` and can
  be exported to a file and imported back. Counters track the counted trophies
  (250 stunts, 42 shooting-range golds, 100 vehicles, …).
- **Filters** — by kind (story, missable, stranger strands, collectibles,
  activities, combat, robbery, exploration, money), by grade, by earned /
  still to earn, plus full-text search.
- **Spoiler setting** — hides the names and descriptions of the 28 hidden
  story trophies until they are earned.
- **Roadmap to the platinum** — seven stages from the first mission to the
  100% checklist, with the one missable step (Lucia's balcony meditation in
  Chapter 1) called out at the top.
- **A guide for every trophy** — what to do, where, and when it can be missed,
  with the sources named beside each guide. Where launch-week sources had no
  confirmed method yet, the guide says so instead of inventing one.

## The list

55 trophies: 1 platinum, 2 gold, 6 silver, 46 bronze. 28 are hidden on
PlayStation until earned. All are single-player; there are no online trophies.
Names, descriptions and grades are PlayStation's own, as listed by Exophase
(reported by Push Square, 18 Nov 2026). The full data lives in
`app/data/trophies.json`.

## Run it (detail)

Serve `app/` with any static server and open `index.html` — it works with the
network off and makes no network requests. For a quick local try:

```sh
node serve.ts   # serves app/ on http://localhost:8080
```

## Sources

- Official trophy list, PlayStation (via Exophase)
- OutputLag — GTA 6 Trophy List: All 55 Trophies and Achievements
- EGamers.io — GTA 6 Trophy List (GTABase & PowerPyx)
- KeenGamer — GTA 6 Trophy Guide & Platinum Roadmap
- GTA Vice City Hub — GTA 6 Achievements
- Rockstar Games — Grand Theft Auto VI (official site & trailers)

Grand Theft Auto VI is developed and published by Rockstar Games. This is an
unofficial fan-made guide with no affiliation to Rockstar Games, Sony or
PlayStation, and it contains no Rockstar logo, artwork or game screenshots.

## Entry

Built for make.fun's **gta6-trophy-guide-01** ("Build the best GTA 6 trophy guide") bounty — see the [bounty page](https://make.fun/bounty/gta6-trophy-guide-01).
