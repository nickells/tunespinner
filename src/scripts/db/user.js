import firebase from './firebase'

const db = firebase.database()

const DEFAULT_USER = {
  id: '',
  username: '',
  email: '',
  songs_favorited: [],
  score: 0,
}

export const createUser = (_data = {}) => {
  const data = Object.assign({}, DEFAULT_USER, _data)
  const userRef = db.ref('/users').push()
  const userData = {
    ...data,
    id: userRef.key,
  }

  return userRef.set(userData)
}

export const updateUser = (id, _data = {}) => {
  const data = Object.assign({}, DEFAULT_USER, _data)
  db.ref(`/users/${id}`).update(data)
}
