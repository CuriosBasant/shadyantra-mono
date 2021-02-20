// import admin, { ServiceAccount } from 'firebase-admin'
// import serviceAccount from './private/firebase-service-account.json'
import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// export const adminApp = admin.apps[0] ?? admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount as ServiceAccount)
// })

// export const adminAuth = adminApp.auth()

export const app = firebase.apps[0] ?? firebase.initializeApp({
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,   // imp
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID, // imp
  appId: process.env.FIREBASE_APP_ID, // imp
  authDomain: `${ process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID }.firebaseapp.com`,
  storageBucket: `${ process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID }.appspot.com`,
  messagingSenderId: process.env.FIREBASE_PROJECT_NUMBER,
})

export const auth = app.auth()
export const firestore = app.firestore()
export const database = {
  boards: firestore.collection("boards"),
  // files: firestore.collection("files"),
  formatDoc: (doc: firebase.firestore.DocumentData) => {
    return { id: doc.id, ...doc.data() }
  },
  getServerTimestamp: firebase.firestore.FieldValue.serverTimestamp,
}