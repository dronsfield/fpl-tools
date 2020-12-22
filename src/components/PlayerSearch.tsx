import React from "react"
import Select from "react-select"
import { Player, useInitQuery } from "src/services/api"
import { blarr } from "src/util/blanks"

const NullComp = () => null

const selectComponents = {
  DropdownIndicator: NullComp,
  IndicatorSeparator: NullComp
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
        label: player.webName
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
    />
  )
}

export default PlayerSearch
