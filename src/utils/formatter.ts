import { DateTime } from "luxon"

export default function convertTimeToEmoji(rawTime: Date): string {
  // Format is HH:MM
  const startTime = DateTime.fromJSDate(rawTime)
  const time = startTime.toFormat("HH:mm")
  const [hour, min] = time.split(":").map((value) => value)
  const emoji: Record<string, string> = {
    0: "0️⃣",
    1: "1️⃣",
    2: "2️⃣",
    3: "3️⃣",
    4: "4️⃣",
    5: "5️⃣",
    6: "6️⃣",
    7: "7️⃣",
    8: "8️⃣",
    9: "9️⃣",
  }
  return `${emoji[hour[0]]}${emoji[hour[1]]}:${emoji[min[0]]}${emoji[min[1]]}`
}
