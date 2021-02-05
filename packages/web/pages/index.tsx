import Axios from 'axios'
import React, { useCallback, useRef, useState } from 'react'
import { Page, AuthenticationForm } from '../components'
import { useAuth } from '../providers'
Axios.defaults.baseURL = process.env.BACKEND_URL


export default function Home() {
  const { user } = useAuth()
  if (!user) return <AuthenticationForm />

  return <Page title='Dashboard'>
    Board
  </Page>
}
