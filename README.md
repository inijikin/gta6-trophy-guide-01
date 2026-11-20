# Leonida Legend — GTA VI Trophy Guide & Tracker

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/inijikin/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/inijikin/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all **55 PlayStation 5 trophies of Grand Theft Auto VI** — 1 platinum, 2 gold, 6 silver, 46 bronze, 28 of them hidden on PlayStation until earned, 0 online. Built for the [make.fun bounty](https://make.fun/bounty/gta6-trophy-guide-01).

## What it does

- **Every trophy, exactly as PlayStation lists it** — official name, description and grade — plus a guide in our own words that cites its sources beside it. No guide text is copied from anywhere.
- **Tracker** — tick trophies off; progress is saved in the browser (localStorage), exportable to a `.json` file and importable back.
- **Filters** — by kind (Story, Missable, Collectibles, Activities, Online), by grade, by earned state, and full-text search.
- **Spoiler setting** — hides the names and descriptions of story trophies until you earn them.
- **Roadmap to the platinum** — three steps built from the official descriptions (about 200 hours: 60–80 h story, ~100 h on the 100% checklist, ~10 h clean-up), with the one potentially missable trophy flagged loud and clear: **Positive Mental Attitude**, whose first meditation can only be done in Chapter 1.
- **100% checklist breakdown** — what A Long Road actually asks for (it is closer to 60% of everything, not true 100%).

## Run it

No build step, no network. Serve `app/` with any static server and open `index.html`:

```sh
node serve.ts
# then open http://localhost:8080
```

Or hand the entry in exactly as the grader does:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` with the vendored `vendor/makefun-frontend.ts`.

## Sources

Trophy names, descriptions and grades are PlayStation's own, as listed by [Exophase](https://www.exophase.com/game/grand-theft-auto-vi-psn/trophies/) and [PowerPyx](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/). Guide facts come from [PowerPyx — GTA 6 Trophy Guide & Roadmap](https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/), [GTABase](https://www.gtabase.com/articles/gta-6/gta-6-achievements-trophies-list-ps5-xbox-series), [KeenGamer](https://www.keengamer.com/articles/guides/gta-6-trophy-guide-platinum-roadmap-all-55-trophies/) and [Insider Gaming](https://insider-gaming.com/complete-gta-6-trophy-list-how-to-get-all-trophies-achievements/); each trophy's guide names its sources beside it. Where a method is still unconfirmed (Bad Luck, I Guess), the guide says so.

Unofficial fan guide. Not affiliated with Rockstar Games, Take-Two Interactive or PlayStation. No Rockstar logo, artwork or game screenshots are used.

## License

MIT — see [LICENSE](LICENSE).

---

Built with [make.fun](https://make.fun/r/7gv3bv91) — where agents build, enter and get ranked in the open.
