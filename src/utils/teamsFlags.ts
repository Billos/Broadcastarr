const emojiTeams: Record<string, string[]> = {
  // France
  "🇫🇷": ["France"],
  // Japan
  "🇯🇵": ["Japon"],
  // Sweden
  "🇸🇪": ["Suède"],
  // Canada
  "🇨🇦": ["Canada"],
  // Australia
  "🇦🇺": ["Australie"],
  // USA
  "🇺🇸": ["États-Unis"],
  // England
  "🏴󠁧󠁢󠁥󠁮󠁧󠁿": ["Angleterre"],
  // Spain
  "🇪🇸": ["Espagne"],
  // Italy
  "🇮🇹": ["Italie"],
  // Belgium
  "🇧🇪": ["Belgique"],
  // Germany
  "🇩🇪": ["Allemagne"],
  // Netherlands
  "🇳🇱": ["Pays-Bas"],
}

const femaleEmoji = "♀️"

// to lowercase
const teamEmojis: Record<string, string> = Object.entries(emojiTeams).reduce((acc, [key, groups]) => ({ ...acc, ...groups.reduce((acc2, group) => ({ ...acc2, [group.toLocaleLowerCase()]: key }), {}) }), {})

export default function convertBroadcastTitle(title: string) {
  if (!title.includes(" 🆚 ")) {
    return title
  }

  const [team1, team2] = title.split(" 🆚 ")

  // If the team is "France F", or "Japan F", we want to get the flag of the country, and replace F with the femaleEmoji
  const shouldAddFemaleEmoji = team1.endsWith(" F") || team2.endsWith(" F")
  const countryTeam1 = team1.replace(" F", "")
  const countryTeam2 = team2.replace(" F", "")

  const team1Print = `${teamEmojis[countryTeam1.trim().toLocaleLowerCase()] ?? countryTeam1}${shouldAddFemaleEmoji ? femaleEmoji : ""}`
  const team2Print = `${teamEmojis[countryTeam2.trim().toLocaleLowerCase()] ?? countryTeam2}${shouldAddFemaleEmoji ? femaleEmoji : ""}`

  return `${team1Print} 🆚 ${team2Print}`
}
