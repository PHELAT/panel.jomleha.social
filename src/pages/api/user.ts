export type FirebaseUser = {
  id: string,
  credentials: any
}

export async function fetchUser(username: string): Promise<FirebaseUser> {
  const { getFirestore } = require('firebase-admin/firestore');

  const db = getFirestore();
  const snapshot = await db.collection('adminusers').doc(username).get();
  if (!snapshot.exists) {
      return Promise.reject()
  }
  const user: FirebaseUser = { id: snapshot.id, ...snapshot.data() }

  return user;
}
