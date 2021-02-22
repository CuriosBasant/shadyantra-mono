import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const projectId = 'shadyantra-a75f0'
firebase.apps.length || firebase.initializeApp({
  projectId,
  apiKey: 'AIzaSyDoAvvKyFhYws6L_NxsmSDLPXTbMW8MgVY',
  authDomain: `${ projectId }.firebaseapp.com`,
  storageBucket: `${ projectId }.appspot.com`,
  messagingSenderId: '81471457170',
  appId: '1:81471457170:web:13c3b8aab1dec89461a34b',
})

// Auth exports
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider()

// Firestore exports
export const firestore = firebase.firestore()
export const serverTimestamp = firebase.firestore.FieldValue.serverTimestamp
export const fromMillis = firebase.firestore.Timestamp.fromMillis
export const increment = firebase.firestore.FieldValue.increment

// Storage exports
export const storage = firebase.storage()
export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED

/// Helper functions

/** Gets a users/{uid} document with username */
export function getUserWithUsername(username: string) {
  return firestore.collection('users').where('username', '==', username).limit(1).get()
}

/** Converts a firestore document to JSON */
export function documentToJSON(doc: any) {
  const data = doc.data()
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data?.createdAt.toMillis() || 0,
    updatedAt: data?.updatedAt.toMillis() || 0,
  }
}
export const database = {
  boards: firestore.collection("boards"),
  // files: firestore.collection("files"),
  formatDoc: (doc: firebase.firestore.DocumentData) => {
    return { id: doc.id, ...doc.data() }
  },
  getServerTimestamp: firebase.firestore.FieldValue.serverTimestamp,
}