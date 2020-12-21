import React from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import PlayerSearch from "src/components/PlayerSearch"
import GlobalStyle from "src/style/global"

const queryClient = new QueryClient()

const XD: React.FC<{}> = () => {
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
