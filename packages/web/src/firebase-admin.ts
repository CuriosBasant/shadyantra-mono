import admin, { ServiceAccount } from 'firebase-admin'
import serviceAccount from './private/firebase-service-account.json'

const adminApp = admin.apps[0] ?? admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount)
})

export const adminAuth = adminApp.auth()
export default adminApp