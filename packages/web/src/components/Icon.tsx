import { TailwindIcons } from "./IconSet"

export type IconNames = keyof typeof TailwindIcons.solid

type Props = {
  name: IconNames
  outline?: boolean
  className?: string
}

export function Icon({ name, outline = false, ...props }: Props) {
  const config = outline
    ? {
        type: "outline",
        size: "24",
        stroke: "currentColor",
        fill: "none",
      }
    : {
        type: "solid",
        size: "20",
        stroke: "none",
        fill: "currentColor",
      }
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${config.size} ${config.size}`}
      fill={config.fill}
      stroke={config.stroke}
      aria-hidden="true"
      {...props}
    >
      {TailwindIcons[config.type][name]}
    </svg>
  )
}
