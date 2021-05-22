import React, {
  createContext,
  useContext,
  useEffect,
  Component,
  useState,
  ReactChild,
  useMemo,
} from "react"
import type firebase from "firebase"
import { auth } from "../firebase"
type ProfileData = {
  displayName?: string | null
  photoURL?: string | null
}
type User = firebase.User & {
  isAdmin?: boolean
}
interface IAuth {
  user: User | null
  signup: (email: string, password: string) => Promise<firebase.User>
  signin: (email: string, password: string) => Promise<firebase.User>
  signout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateEmail: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  updateProfile: (data: ProfileData) => Promise<void>
}

export const AuthContext = createContext({} as IAuth)

export function useAuth() {
  return useContext(AuthContext)
}

type Props = {
  children: ReactChild
}
export function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    return auth.onIdTokenChanged(async (_user) => {
      // let user: User = null
      // if (_user) {
      //   const tokenResult = await _user.getIdTokenResult()
      //   user = { ..._user, isAdmin: tokenResult.claims.admin }
      // }

      setIsLoading(false)
      setUser(_user)
    })
  }, [])

  const value: IAuth = useMemo(
    () => ({
      user,
      signup: (email: string, password: string) =>
        auth.createUserWithEmailAndPassword(email, password).then((credential) => credential.user),
      signin: (email: string, password: string) =>
        auth.signInWithEmailAndPassword(email, password).then((credential) => credential.user),
      signout: () => auth.signOut(),
      updateEmail: (email: string) => user!.updateEmail(email),
      updateProfile: (data: ProfileData) => user!.updateProfile(data),
      resetPassword: (email: string) => auth.sendPasswordResetEmail(email),
      updatePassword: (password: string) => user!.updatePassword(password),
      // updateNumber: number=> user!.updatePhoneNumber(number)
    }),
    [user]
  )
  return <AuthContext.Provider value={value}>{!isLoading && children}</AuthContext.Provider>
}
