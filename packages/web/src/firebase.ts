import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"
// import 'firebase/functions'
// import 'firebase/storage'

const projectId = "shadyantra-a75f0"
firebase.apps.length ||
  firebase.initializeApp({
    projectId,
    apiKey: "AIzaSyDoAvvKyFhYws6L_NxsmSDLPXTbMW8MgVY",
    authDomain: `${projectId}.firebaseapp.com`,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId: "81471457170",
    appId: "1:81471457170:web:13c3b8aab1dec89461a34b",
  })

// Auth exports
export const auth = firebase.auth()
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()
export const facebookAuthProvider = new firebase.auth.FacebookAuthProvider()

// Storage exports
// export const storage = firebase.storage()
// export const STATE_CHANGED = firebase.storage.TaskEvent.STATE_CHANGED

// Firestore exports
export const firestore = firebase.firestore()
export const FieldValue = firebase.firestore.FieldValue
export const Timestamp = firebase.firestore.Timestamp

try {
  // @ts-ignore
  if (window.location.hostname == "localhost") {
    console.info("localhost detected!")
    // functions.useEmulator("localhost", 5001)
    firestore.settings({
      host: "localhost:8080",
      ssl: false,
    })
    let config = {
      databaseURL: `http://localhost:4001?ns=${projectId}`,
    }
  }
} catch (err) {
  console.log(err)
}

export const database = {
  users: firestore.collection("users"),
  devs: firestore.collection("developers"),
  // files: firestore.collection("files"),
  formatDoc: (doc: firebase.firestore.DocumentData) => {
    return { id: doc.id, ...doc.data() }
  },
  getServerTimestamp: FieldValue.serverTimestamp,
}

/// Helper functions
// export const functions = firebase.functions()
/* functions.httpsCallable('function-name')({data}) */

/** Gets a users/{uid} document with username */
export function getUserWithUsername(username: string) {
  return database.users.where("username", "==", username).limit(1).get()
}

/** Converts a firestore document to JSON */
export function documentToJSON(doc: any) {
  const data = doc.data()
  return {
    ...data,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: data.createdAt.toMillis() || 0,
    updatedAt: data.updatedAt.toMillis() || 0,
  }
}
