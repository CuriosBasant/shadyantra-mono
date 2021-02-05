import NextLink from "next/link"

type Props = {
  href: string
  children: ChildNode
}
export default function Link({ href, children }: Props) {
  return (
    <NextLink href={ href }>
      <a>{ children }</a>
    </NextLink>
  )
}
