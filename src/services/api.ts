// import { fetchBootstrap } from "fpl-api"
import {
  Array,
  Boolean,
  Number,
  Record,
  Runtype,
  Static,
  String,
  ValidationError
} from "runtypes"
import tough from "tough-cookie"
import betterFetch from "../util/betterFetch"

const BASE_URL =
  "https://cors-anywhere.herokuapp.com/https://fantasy.premierleague.com/api"
const LEAGUE_ID = 90271

const cookie = new tough.CookieJar()

// const originalFetch = window.fetch
// function monkeyFetch(input: string, init: RequestInit) {
//   return originalFetch(`https://cors-anywhere.herokuapp.com/${input}`, init)
// }
// // @ts-ignore
// window.fetch = monkeyFetch

async function runtypeFetch<T, R>(runtype: Runtype<R>, url: string) {
  try {
    const result = await betterFetch<T>(url, { contentType: "json" })
    const checkedResult = runtype.check(result)
    return checkedResult
  } catch (err) {
    if (err instanceof ValidationError) {
      console.error(err, { key: err.key, url })
    }
    throw err
  }
}

const Bootstrap = Record({
  events: Array(
    Record({
      id: Number,
      finished: Boolean,
      is_current: Boolean
    })
  )
})
type Bootstrap = Static<typeof Bootstrap>

const League = Record({
  league: Record({ name: String }),
  standings: Record({
    results: Array(
      Record({ entry: Number, entry_name: String, player_name: String })
    )
  })
})
type League = Static<typeof League>

export function fetchBootstrap() {
  const url = `${BASE_URL}/bootstrap-static/`
  return runtypeFetch(Bootstrap, url)
}
export function fetchLeague(opts: { leagueId: number }) {
  const url = `${BASE_URL}/leagues-classic/${opts.leagueId}/standings`
  return runtypeFetch(League, url)
}
export function fetchGameweek(opts: { teamId: number; eventId: number }) {
  const url = `${BASE_URL}/entry/${opts.teamId}/event/${opts.eventId}/picks/`
  return runtypeFetch(Record({}), url)
}

export async function populate() {
  const bootstrap = await fetchBootstrap()
  let currentEventId = 0
  for (let eventData of bootstrap.events) {
    if (eventData.is_current) {
      currentEventId = eventData.id
      break
    }
  }
  if (!currentEventId) throw new Error(`no currentEventId`)
  const league = await fetchLeague({ leagueId: LEAGUE_ID })
  const firstTeamId = league.standings.results[0]?.entry
  const gw = await fetchGameweek({
    teamId: firstTeamId,
    eventId: currentEventId
  })
  console.log({ league, bootstrap, currentEventId, firstTeamId, gw })
}
