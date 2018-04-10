import firebase from './firebase'

const db = firebase.database()

const DEFAULT_USER = {
  id: '',
  username: '',
  email: '',
  songs_favorited: [],
  score: 0,
}

export const getUser = id => new Promise((resolve) => {
  db.ref(`/users/${id}`).once('value', (snapshot) => {
    if (!snapshot) {
      return resolve(null)
    }
    resolve(snapshot.val())
  })
})

export const updateUser = (id, data = {}) => {
  return db.ref(`/users/${id}`).update(data)
    .then(() => getUser(id))
}

export const createUser = async (_data = {}) => {
  const data = Object.assign({}, DEFAULT_USER, _data)

  if (data.id && await getUser(data.id)) {
    return updateUser(data.id, data)
  }

  let userRef
  const userData = { ...data }

  if (data.id) {
    userRef = db.ref(`/users/${data.id}`)
    userData.id = data.id
  } else {
    userRef = db.ref('/users').push()
    userData.id = userRef.key
  }
  return new Promise((resolve) => {
    userRef.set(userData)
      .then(() => resolve(userData))
  })
}

export const setUserRoom = async (userId, roomId) => updateUser(userId, { currentRoom: roomId })

export const watchUsers = (callback) => {
  db.ref('/users').on('value', (snapshot) => {
    const users = snapshot.val()
    callback(users)
  })
}
