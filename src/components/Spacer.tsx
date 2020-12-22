import { bp, ResponsiveValue } from "src/style/breakpoints"
import styled from "styled-components"

interface SpacerProps {
  height?: ResponsiveValue<number>
  width?: ResponsiveValue<number>
  shrink?: boolean
  inline?: boolean
}

const Spacer = styled.div<SpacerProps>`
  flex-shrink: ${(props) => Number(Boolean(props.shrink))};
  ${(props) =>
    props.shrink
      ? `
  min-height: 0;
  min-width: 0;`
      : ``}
  ${(props) => (props.inline ? `display: inline-block;` : ``)}
  ${(props) => (props.width ? bp.each("width", props.width, "px") : ``)}
  ${(props) => (props.height ? bp.each("height", props.height, "px") : ``)}
`

export default Spacer
