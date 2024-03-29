import NextLink from "next/link"

type Props = {
  href: string
  children: React.ReactNode
  className?: string
}
export default function Link({ href, children, className }: Props) {
  return (
    <NextLink href={ href }>
      <a className={ className }>{ children }</a>
    </NextLink>
  )
}
