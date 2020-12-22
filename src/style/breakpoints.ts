export const breakpoints = {
  mobile: { min: 0, max: 600 },
  medium: { min: 601, max: 1023 },
  large: { min: 1024, max: null }
}
export const bpSizes = ["mobile", "medium", "large"] as const

// --------------------------------------------------------------------

type NumberOrString = number | string

export type BPSize = keyof typeof breakpoints
export type ResponsiveValue<T extends NumberOrString> = Record<BPSize, T> | T

const getWidthCondition = (minMax: "min" | "max", size: BPSize | number) => {
  const pixels = typeof size === "number" ? size : breakpoints[size][minMax]
  return pixels ? `(${minMax}-width: ${pixels}px)` : null
}
const constructMediaQuery = (...conditions: Array<string | null>) => {
  const validConditions = conditions.filter(Boolean)
  return `@media ${validConditions.join(" and ")}`
}

const min = (size: BPSize) =>
  constructMediaQuery(getWidthCondition("min", size))

const max = (size: BPSize) =>
  constructMediaQuery(getWidthCondition("max", size))

const only = (size: BPSize) =>
  constructMediaQuery(
    getWidthCondition("min", size),
    getWidthCondition("max", size)
  )

const each = <T extends NumberOrString>(
  cssProperty: string,
  responsiveValue: ResponsiveValue<T>,
  suffix?: string,
  transform = (value: T): NumberOrString => value
) => {
  if (typeof responsiveValue === "object") {
    return bpSizes
      .map((bpSize) => {
        const mq = only(bpSize)
        const value = responsiveValue[bpSize]
        return `${mq} { ${cssProperty}: ${transform(value)}${suffix}; }`
      })
      .join(`\n`)
  } else {
    return `${cssProperty}: ${transform(responsiveValue)}${suffix};`
  }
}

export const bp = { min, max, only, each }

export const getSizeFromWidth = (widthPx: number): BPSize => {
  return bpSizes.reduce((matchingSize, bpSize) => {
    const breakpoint = breakpoints[bpSize]
    const min = breakpoint.min
    const max = breakpoint.max
    if ((!min || widthPx >= min) && (!max || widthPx <= max)) {
      return bpSize
    } else {
      return matchingSize
    }
  }, "large")
}
