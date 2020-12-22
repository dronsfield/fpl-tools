import { capitalCase } from "change-case"
import React from "react"
import { Player, useGetLeagueQuery } from "src/services/api"
import colors from "src/style/colors"
import { blarr } from "src/util/blanks"
import styled from "styled-components"

const List = styled.ol`
  margin: 0;
  padding: 0;
  list-style-type: none;
`

const Item = styled.li<{ isPicked: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  background-color: white;
  border: 1px solid ${colors.border};
  padding: 0.8em;
  border-top-width: 0;

  &:first-child {
    border-radius: 5px 5px 0 0;
    border-top-width: 1px;
  }
  &:last-child {
    border-radius: 0 0 5px 5px;
  }

  & span {
    opacity: ${(props) => (props.isPicked ? 1 : 0.25)};
  }
`

const NameSpan = styled.span``

const RankSpan = styled.span`
  color: #888;
  margin-left: 0.25em;
`

const PickTypeSpan = styled.span`
  margin-left: auto;
  text-transform: uppercase;
`

const OwnersList: React.FC<{ player: Player | null; showAll: boolean }> = (
  props
) => {
  const { player, showAll } = props

  const { data } = useGetLeagueQuery()

  const owners = React.useMemo(() => {
    const allManagers = data?.managers || blarr
    const relevantManagers = showAll
      ? allManagers
      : player
      ? allManagers.filter((manager) => !!manager.picks[player.id])
      : blarr
    const owners = relevantManagers.map((manager) => {
      const { name, teamName, rank } = manager
      return {
        name: capitalCase(name),
        teamName,
        rank,
        pickType: player ? manager.picks[player.id] : null
      }
    })
    return owners
  }, [player, data, showAll])

  return (
    <List>
      {owners.map((owner) => {
        return (
          <Item isPicked={Boolean(owner.pickType)} key={owner.rank}>
            <NameSpan children={owner.name} />
            <RankSpan children={`#${owner.rank}`} />
            <PickTypeSpan children={owner.pickType} />
          </Item>
        )
      })}
    </List>
  )
}

export default OwnersList
