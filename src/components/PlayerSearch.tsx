import React from "react"
import Select, { components } from "react-select"
import { Player, useInitQuery } from "src/services/api"
import { blarr } from "src/util/blanks"

const NullComp = () => null

const { Option } = components
const IconOption = (props: any) => {
  return (
    <Option {...props}>
      <img
        src={`https://fantasy.premierleague.com/dist/img/shirts/standard/shirt_${props.data.data.teamCode}-66.png`}
        style={{ width: 14, marginRight: 10 }}
        alt={props.data.label}
      />
      {props.data.label}
    </Option>
  )
}

const selectComponents = {
  DropdownIndicator: NullComp,
  IndicatorSeparator: NullComp,
  Option: IconOption
}

const PlayerSearch: React.FC<{
  onChange: (player: Player | null) => void
}> = (props) => {
  const { onChange } = props

  const { data } = useInitQuery()

  const players = data?.players || blarr
  const options = React.useMemo(() => {
    return players.map((player) => {
      return {
        value: player,
        label: player.webName,
        data: player
      }
    })
  }, [players])

  const [isOpen, setIsOpen] = React.useState(false)

  const handleInputChange = React.useCallback((query, { action }) => {
    if (action === "input-change") {
      const isLongEnough = Boolean(query && query.length >= 2)
      setIsOpen(isLongEnough)
    }
  }, [])
  const close = () => setIsOpen(false)
  const handleSelect = React.useCallback(
    (option) => {
      onChange(option?.value || null)
      close()
    },
    [onChange]
  )
  const filterOption = React.useCallback(
    (option: any, query: string): boolean => {
      return option.label
        .toLowerCase()
        .normalize("NFD")
        .startsWith(query.toLowerCase())
    },
    []
  )

  return (
    <Select
      options={options}
      onInputChange={handleInputChange}
      onChange={handleSelect}
      onBlur={close}
      menuIsOpen={isOpen}
      openMenuOnClick={false}
      components={selectComponents}
      isClearable={true}
      placeholder="Who has..."
      filterOption={filterOption}
    />
  )
}

export default PlayerSearch
