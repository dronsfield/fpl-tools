import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { persistWithLocalStorage } from "react-query/persist-localstorage-experimental"
import GlobalStyle from "src/style/global"
import PlayerSearch from "./components/PlayerSearch"
import { Player, useGetLeagueQuery } from "./services/api"

const queryClient = new QueryClient()
persistWithLocalStorage(queryClient)

const XD: React.FC<{}> = () => {
  const { data } = useGetLeagueQuery()
  console.log("LEAGUE DATA", data)

  const [player, setPlayer] = React.useState<Player | null>(null)

  const handleSelectPlayer = React.useCallback((player: Player | null) => {
    setPlayer(player)
  }, [])

  const owners = React.useMemo(() => {
    if (!player) return []
    const managers = data?.managers || []
    const owners = managers
      .filter((manager) => {
        return !!manager.picks[player.id]
      })
      .map((manager) => {
        return {
          name: manager.name,
          teamName: manager.teamName,
          pickType: manager.picks[player.id]
        }
      })
    return owners
  }, [player, data])

  const ownersList = (
    <ol>
      {owners.map((owner) => {
        return (
          <li>
            {owner.name}, {owner.pickType}
          </li>
        )
      })}
    </ol>
  )

  return (
    <>
      <PlayerSearch onChange={handleSelectPlayer} />
      {ownersList}
    </>
  )
}

const App: React.FC<{}> = () => {
  return (
    <>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <XD />
      </QueryClientProvider>
    </>
  )
}

export default App
