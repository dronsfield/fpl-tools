import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { persistWithLocalStorage } from "react-query/persist-localstorage-experimental"
import GlobalStyle from "src/style/global"
import styled from "styled-components"
import Checkbox from "./components/Checkbox"
import OwnersList from "./components/OwnersList"
import PlayerSearch from "./components/PlayerSearch"
import Spacer from "./components/Spacer"
import { Player } from "./services/api"

const queryClient = new QueryClient()
persistWithLocalStorage(queryClient)

const Wrapper = styled.main`
  margin: 0 auto;
  padding: 40px;
  max-width: 500px;
  width: 100%;
`

const WhoHas: React.FC<{}> = () => {
  const [player, setPlayer] = React.useState<Player | null>(null)
  const [showAll, setShowAll] = React.useState(false)

  console.log({ showAll })

  const handleSelectPlayer = React.useCallback((player: Player | null) => {
    setPlayer(player)
  }, [])

  return (
    <Wrapper>
      <PlayerSearch onChange={handleSelectPlayer} />
      <Spacer height={10} />
      <OwnersList player={player} showAll={showAll} />
      <Spacer height={10} />
      <Checkbox
        name="show-all"
        checked={showAll}
        onChange={setShowAll}
        children="Show all managers"
      />
    </Wrapper>
  )
}

const App: React.FC<{}> = () => {
  return (
    <>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <WhoHas />
      </QueryClientProvider>
    </>
  )
}

export default App
