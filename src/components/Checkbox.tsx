import React from "react"
import styled from "styled-components"

const Container = styled.div`
  cursor: pointer;
`

const OuterBox = styled.div`
  display: inline-block;
  padding: 4px;
  cursor: pointer;
`

// const Box = styled.div<{
//   checked?: boolean
//   disabled?: boolean
// }>`
//   width: 24px;
//   height: 24px;
//   border-radius: 4px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   ${(props) => `
//   ${props.checked ? "" : `border: 2px solid ${colors.primary.purple};`}
//   background-color: ${
//     props.disabled
//       ? colors.shade[4]
//       : props.checked
//       ? colors.primary.pink
//       : colors.shade.white
//   };
//   `}
// `

const Input = styled.input.attrs({ type: "checkbox" })``

// const CheckedIcon = styled(CheckedSvg)<{ visible: boolean }>`
//   color: ${colors.shade.white};
//   visibility: ${(props) => (props.visible ? "visible" : "hidden")};
// `

interface CheckboxProps {
  checked: boolean
  className?: string
  disabled?: boolean
  name: string
  onChange: (checked: boolean) => void
}
const Checkbox: React.FC<CheckboxProps> = (props) => {
  const { checked, name, className, disabled, children, onChange } = props

  const labelProps = { as: "label", htmlFor: name } as {
    as: "label"
    htmlFor: string
  }

  const handleChange = React.useCallback(
    (evt: React.ChangeEvent<any>) => {
      onChange(evt.target.checked)
    },
    [onChange]
  )

  return (
    <Container className={className} {...labelProps}>
      <OuterBox>
        <Input
          id={name}
          name={name}
          checked={checked}
          disabled={disabled}
          onChange={handleChange}
        />
      </OuterBox>
      {children}
    </Container>
  )
}

export default Checkbox
