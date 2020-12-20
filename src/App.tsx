import React from "react"
import { QueryClient, QueryClientProvider, useQuery } from "react-query"
import { populate } from "./services/api"
import GlobalStyle from "./style/global"

const queryClient = new QueryClient()

const XD: React.FC<{}> = () => {
  const { data } = useQuery(["POPULATE"], populate)
  return null
}

const App: React.FC<{}> = () => {
  return (
    <>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <XD />
      </QueryClientProvider>
      <div children="App" />
    </>
  )
}

export default App
