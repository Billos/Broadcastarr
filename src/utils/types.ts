const emojiGroup: Record<string, string[]> = {
  // France
  "🇫🇷": [
    "Ligue 1",
    "Ligue 2",
    "Top 14",
    "Top14",
    "Pro D2",
    "ProD2",
    "Coupe de France",
    "Coupe de la Ligue",
  ],
  // England
  "🏴󠁧󠁢󠁥󠁮󠁧󠁿": [
    "Premiere League",
    "Premier League",
    "Championship",
    "FA Cup",
    "Carabao Cup",
    "Premiership",
    "Coupe de la Ligue anglaise",
  ],
  // Spain
  "🇪🇸": [
    "Liga",
    "La Liga",
    "Liga 2",
    "Primera Division",
    "Laliga",
  ],
  // Portugal
  "🇵🇹": ["Liga Portugal BWIN"],
  // Italy
  "🇮🇹": ["Serie A", "Coupe Italie"],
  // Belgium
  "🇧🇪": ["Jupiler Pro League"],
  // Germany
  "🇩🇪": [
    "Bundesliga",
    "Bundesliga 2",
    "Coupe Allemagne",
    "3.Liga",
  ],
  // Netherlands
  "🇳🇱": ["Eredivisie"],
  // Greece
  "🇬🇷": ["Super League"],
  // Europe
  "🇪🇺": [
    "Ligue des Champions",
    "Champions League",
    "Europa League",
    "Ligue Europa",
    "Europa Conference League",
    "Ligue Des Nations Uefa",
    "Ligue Europa Conférence",
    "Euro",
    "Euro U21",
    "Ligue des Nations",
    "UEFA Nations League",
    "Supercoupe Europe",
  ],
  // Turkey
  "🇹🇷": [
    "Super Lig",
  ],
  // International
  "🌍": [
    "Coupe du Monde",
    "Coupe du Monde feminine",
    "National Teams",
    "Formule 1",
    "MotoGP",
    "Moto2",
    "Moto3",
  ],
  "🌏": [
    "Pacific Nations Cup",
  ],
  // Rare
  // Argentina
  "🇦🇷": ["Torneo LPF", "Copa Argentina"],
  // Mexico
  "🇲🇽": ["Liga MX"],
  // Chile
  "🇨🇱": ["Copa Chile", "Campeonato PlanVital", "Chile Campeonato PlanVital"],
  // Peru
  "🇵🇪": ["Peru Liga 1 Movistar"],
  // Colombia
  "🇨🇴": ["Colombia Liga BetPlay DIMAYOR", "Copa Colombia"],
  // Ecuador
  "🇪🇨": ["Ecuador Liga Pro", "Ecuador LigaPro"],
  // Concacaf
  "🌎": [
    "Gold Cup",
    "Copa Sudamericana",
    "Leagues Cup",
    "Copa Libertadores",
    "Ungrouped",
  ],
  // Uruguay
  "🇺🇾": ["Campeonato Uruguayo"],
  // USA
  "🇺🇸": ["MLS"],
  // Friendly
  "🤝": [
    "Amical",
    "Test match",
  ],
  "❓": [
    "Null",
  ],
  // TV Channels
  "📺": [
    "TV Channels",
    "TVChannels",
  ],
}

// to lowercase
const groupsEmojis: Record<string, string> = Object.entries(emojiGroup)
  .reduce((acc, [key, groups]) => ({ ...acc, ...groups.reduce((acc2, group) => ({ ...acc2, [group.toLocaleLowerCase()]: key }), {}) }), {})

export default groupsEmojis
