// import { fetchBootstrap } from "fpl-api"
import { useQuery } from "react-query"
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

const ElementRT = Record({
  id: Number,
  first_name: String,
  second_name: String,
  web_name: String,
  team: Number,
  team_code: Number,
  selected_by_percent: String
})
type ElementRT = Static<typeof ElementRT>

const TeamRT = Record({
  code: Number,
  id: Number,
  name: String,
  short_name: String
})
type TeamRT = Static<typeof TeamRT>

const EventRT = Record({
  id: Number,
  finished: Boolean,
  is_current: Boolean
})
type EventRT = Static<typeof EventRT>

const BootstrapRT = Record({
  events: Array(EventRT),
  elements: Array(ElementRT),
  teams: Array(TeamRT)
})
type BootstrapRT = Static<typeof BootstrapRT>

const LeagueRT = Record({
  league: Record({ name: String }),
  standings: Record({
    results: Array(
      Record({ entry: Number, entry_name: String, player_name: String })
    )
  })
})
type LeagueRT = Static<typeof LeagueRT>

export function fetchBootstrap() {
  const url = `${BASE_URL}/bootstrap-static/`
  return runtypeFetch(BootstrapRT, url)
}
export function fetchLeague(opts: { leagueId: number }) {
  const url = `${BASE_URL}/leagues-classic/${opts.leagueId}/standings`
  return runtypeFetch(LeagueRT, url)
}
export function fetchGameweek(opts: { teamId: number; eventId: number }) {
  const url = `${BASE_URL}/entry/${opts.teamId}/event/${opts.eventId}/picks/`
  return runtypeFetch(Record({}), url)
}

export interface Player {
  id: number
  firstName: string
  lastName: string
  webName: string
  teamId: number
  teamCode: number
  selectedBy: string
}
export interface Team {
  id: number
  code: number
  name: string
  shortName: string
}
const playersCache: { [id: number]: Player } = {}

// function populatePlayersCache(elements: Element[]) {
//   console.log({ elements })
//   ;(elements || []).forEach((element) => {
//     const { id, second_name, team, team_code, selected_by_percent } = element
//     playersCache[id] = {
//       id,
//       lastName: second_name,
//       teamId: team,
//       teamCode: team_code,
//       selectedBy: selected_by_percent
//     }
//   })
// }

export async function populate() {
  const bootstrap = await fetchBootstrap()
  let currentEventId = 0
  for (let eventData of bootstrap.events) {
    if (eventData.is_current) {
      currentEventId = eventData.id
      break
    }
  }
  // populatePlayersCache(bootstrap.elements)
  if (!currentEventId) throw new Error(`no currentEventId`)
  const league = await fetchLeague({ leagueId: LEAGUE_ID })
  const firstTeamId = league.standings.results[0]?.entry
  const gw = await fetchGameweek({
    teamId: firstTeamId,
    eventId: currentEventId
  })
  console.log({
    league,
    bootstrap,
    currentEventId,
    firstTeamId,
    gw,
    playersCache
  })
}

function parseCurrentEventId(events: EventRT[]): number {
  let currentEventId = 0
  for (let eventData of events) {
    if (eventData.is_current) {
      currentEventId = eventData.id
      break
    }
  }
  return currentEventId
}
function parsePlayerFromElement(element: ElementRT): Player {
  const {
    id,
    first_name,
    web_name,
    second_name,
    team,
    team_code,
    selected_by_percent
  } = element
  return {
    id,
    firstName: first_name,
    lastName: second_name,
    webName: web_name,
    teamId: team,
    teamCode: team_code,
    selectedBy: selected_by_percent
  }
}
function parseTeam(team: TeamRT): Team {
  const { id, code, name, short_name } = team
  return {
    id,
    code,
    name,
    shortName: short_name
  }
}

export async function init() {
  const bootstrap = await fetchBootstrap()
  console.log(bootstrap)
  const players = bootstrap.elements.map(parsePlayerFromElement)
  const teams = bootstrap.teams.map(parseTeam)
  const currentEventId = parseCurrentEventId(bootstrap.events)
  return { players, teams, currentEventId }
}

export function useInitQuery() {
  return useQuery("INIT", init)
}
