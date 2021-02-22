import Axios from 'axios'
// import { useCallback, useRef, useState } from 'react'
import { Page, AuthenticationForm, Link } from '../components'
import { useAuth } from '../providers'
Axios.defaults.baseURL = process.env.BACKEND_URL


export default function Home() {
  const { user } = useAuth()
  if (!user) return <AuthenticationForm />

  return <Page title='Dashboard'>
    <Link href='/games/offline' className='font-medium text-indigo-600 hover:text-indigo-500'>Play Offline</Link>
  </Page>
}
