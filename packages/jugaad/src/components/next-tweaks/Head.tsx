import NextHead from "next/head"

type Props = {
  title: string
  keywords: string[]
}
export default function Head({ title, keywords }: Props) {
  return (
    <NextHead>
      <title>{ title }</title>
      {/* <meta keywords={ keywords } /> */ }
    </NextHead>
  )
}
