export interface ChangelogEntry {
  version: string;
  date: string;
  changes: string[];
}

export const changelog: ChangelogEntry[] = [
  {
    version: "1.1",
    date: "2026-03-02",
    changes: [
      "Fixed: 'Use my location' feature now works correctly",
      "Fixed: Temperature unit toggle no longer causes loading or city changes",
      "Fixed: City disambiguation for same-named cities (Allen, TX vs Allen, IN)",
      "Added: Reverse geocoding API endpoint"
    ]
  },
  {
    version: "1.0",
    date: "2026-02-28",
    changes: [
      "Initial release with weather search, forecasts, and favorites",
      "Dark/light mode support",
      "Search history and popular cities tracking"
    ]
  }
];

export const currentVersion = changelog[0].version;
