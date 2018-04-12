import firebase from './firebase'

const db = firebase.database()

const DEFAULT_USER = {
  id: '',
  username: '',
  emoji: '🦊',
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
  if (_data.id && await getUser(_data.id)) {
    // If the user already exists, only update the email.
    return updateUser(_data.id, { email: _data.email })
  }

  const data = Object.assign({}, DEFAULT_USER, _data)

  if (data.username) {
    data.username = data.username.substring(0, 15)
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

export const startDancing = async (id) => {
  const user = await getUser(id)
  user.lastDanceAt = Date.now()
  await updateUser(id, user)
}

export const setUserRoom = async (userId, roomId) => updateUser(userId, { currentRoom: roomId })

export const watchUsers = (callback) => {
  db.ref('/users').on('value', (snapshot) => {
    const users = snapshot.val()
    callback(users)
  })
}
