import React, { createContext, useCallback, useContext, useMemo, useReducer, useRef, useState } from 'react'
import FindAccountForm from './FindAccount'
import SignInForm from './SignInForm'
import SignUpForm from './SignUpForm'

const ACTIONS = {
  'sign-in': SignInForm,
  'sign-up': SignUpForm,
  'find-account': FindAccountForm,
}
type ActionType = keyof typeof ACTIONS
export default function AuthenticationForm() {
  const [page, setPage] = useState<ActionType>('sign-in')
  const FormToShow = ACTIONS[page]
  return <FormToShow setPage={ setPage } />
}
