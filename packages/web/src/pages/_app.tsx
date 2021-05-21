import "../styles/globals.css"
import { AppProps /*, AppContext */ } from "next/app"
export default function MyApp({ Component, pageProps }): AppProps {
  // @ts-ignore
  return (
    <div className="w-full min-h-screen overflow-auto">
      <div className="mx-auto max-w-8xl">
        <Component {...pageProps} />
      </div>
    </div>
  )
}
