import '../styles/globals.css'
import { AppProps /*, AppContext */ } from 'next/app'
import { AuthProvider } from '../providers'
export default function MyApp({ Component, pageProps }): AppProps {
  // @ts-ignore
  return <>
    <AuthProvider>
      <Component { ...pageProps } />
    </AuthProvider>
  </>
}