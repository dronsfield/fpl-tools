// import {
//   Combobox,
//   ComboboxInput,
//   ComboboxList,
//   ComboboxOption,
//   ComboboxPopover
// } from "@reach/combobox"
// import "@reach/combobox/styles.css"
// import { matchSorter } from "match-sorter"
// import React from "react"
// import { useThrottle } from "react-use"
// import { useInitQuery } from "../services/api"

import React from "react"
import Select from "react-select"
import { useInitQuery } from "src/services/api"

const PlayerSearch: React.FC<{}> = (props) => {
  const { data } = useInitQuery()
  const players = data?.players || []
  const options = React.useMemo(() => {
    return players.map((player) => {
      return {
        value: player,
        label: `${player.firstName} ${player.lastName} | ${player.webName}`
      }
    })
  }, [players])
  return (
    <Select
      options={options}
      onChange={(x) => {
        console.log({ x })
      }}
    />
  )
}

// const PlayerSearch: React.FC<{}> = (props) => {
//   const [term, setTerm] = React.useState("")
//   const results = usePlayerMatch(term)
//   return (
//     <div>
//       <h4>Clientside Search</h4>
//       <Combobox
//         aria-label="Cities"
//         onSelect={(something) => {
//           console.log({ something })
//         }}
//       >
//         <ComboboxInput
//           className="city-search-input"
//           onChange={(event) => setTerm(event?.target?.value || "")}
//         />
//         {results && (
//           <ComboboxPopover className="shadow-popup">
//             {results.length > 0 ? (
//               <ComboboxList>
//                 {results.slice(0, 10).map((result, index) => (
//                   <ComboboxOption key={index} value={`${result.lastName}`} />
//                 ))}
//               </ComboboxList>
//             ) : (
//               <span style={{ display: "block", margin: 8 }}>
//                 No results found
//               </span>
//             )}
//           </ComboboxPopover>
//         )}
//       </Combobox>
//     </div>
//   )
// }
// function usePlayerMatch(term: string) {
//   const throttledTerm = useThrottle(term, 100)
//   const { data } = useInitQuery()
//   const players = data?.players || []
//   return React.useMemo(
//     () =>
//       term.trim() === ""
//         ? null
//         : matchSorter(players, term, {
//             keys: ["lastName"]
//           }),
//     [throttledTerm]
//   )
// }

export default PlayerSearch
