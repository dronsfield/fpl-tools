import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { persistWithLocalStorage } from "react-query/persist-localstorage-experimental"
import GlobalStyle from "src/style/global"
import PlayerSearch from "./components/PlayerSearch"
import { useGetLeagueQuery } from "./services/api"

const queryClient = new QueryClient()
persistWithLocalStorage(queryClient)

const XD: React.FC<{}> = () => {
  const { data } = useGetLeagueQuery()
  console.log("LEAGUE DATA", data)
  return <PlayerSearch />
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
