/* eslint-disable import/prefer-default-export */
import { join } from "path"

import axios from "axios"

import env from "../config/env"

const instance = axios.create({
  baseURL: join(env.theSportsDb.url, env.theSportsDb.apiKey),
})

type Event = {
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  strLeague: string;
}

type EventQuery = {
  event: Event[];
}

export async function searchGame(teamA: string, teamB: string): Promise<Event | null> {
  // First we will retrieve the events for the first team
  const { data: { event: events }, status } = await instance.get<EventQuery>(`/searchevents.php?e=${encodeURIComponent(teamA)}`)
  if (status === 200 && events !== null && events?.length >= 0) {
    // If we find an event with the second team, we return it
    // The teamB may include FC, SC, AJ, RC, OGC... We want a regex that will check if strAwayTeam includes teamB
    const event = events.find((game) => game.strAwayTeam === teamB)
    if (event) {
      return event
    }
  }

  // If we don't find it, we will retrieve the events for the second team
  const { data: { event: events2 }, status: status2 } = await instance.get<EventQuery>(`/searchevents.php?e=${encodeURIComponent(teamB)}`)
  if (status2 === 200 && events !== null && events2?.length >= 0) {
    // If we find an event with the first team, we return it
    const event = events2.find((game) => game.strAwayTeam === teamA)
    if (event) {
      return event
    }
  }

  // If we don't find it, we return null
  return null
}
