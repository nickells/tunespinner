import firebase from './firebase'

const db = firebase.database()

const DEFAULT_ROOM = {
  id: '',
  name: '',
  description: '',
  djs: [],
  fans: [],
  queue: [],
}

export const createRoom = (_data = {}) => {
  const data = Object.assign({}, DEFAULT_ROOM, _data)
  const roomRef = db.ref('/rooms').push()
  const roomData = {
    ...data,
    id: roomRef.key,
  }

  return new Promise((resolve) => {
    roomRef.set(roomData)
      .then(() => resolve(roomData))
  })
}

export const updateRoom = (id, _data = {}) => {
  const data = Object.assign({}, DEFAULT_ROOM, _data)
  db.ref(`/rooms/${id}`).update(data)
}

export const watchRooms = (callback) => {
  db.ref('/rooms').on('value', (snapshot) => {
    const rooms = []

    snapshot.forEach((childSnapshot) => {
      const room = childSnapshot.val()
      rooms.push(room)
    })

    callback(rooms)
  })
}
