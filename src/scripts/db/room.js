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

export const getRoom = id => new Promise((resolve) => {
  db.ref(`/rooms/${id}`).once('value', (snapshot) => {
    if (!snapshot) {
      resolve(null)
    } else {
      resolve(snapshot.val())
    }
  })
})

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

export const addUserToRoom = async (userId, roomId, key = 'fans') => {
  const room = await getRoom(roomId)
  const roomCopy = { ...room }
  const group = room[key] ? room[key].slice() : []

  if (group.indexOf(userId) !== -1) {
    return
  }

  group.push(userId)
  roomCopy[key] = group

  await updateRoom(roomId, roomCopy)
}

export const removeUserFromRoom = async (userId, roomId) => {
  const room = await getRoom(roomId)
  const roomCopy = { ...room }
  const keys = ['djs', 'fans']

  keys.forEach((key) => {
    const group = room[key] ? room[key].slice() : []
    const index = group.indexOf(userId)
    if (index === -1) {
      return
    }

    group.splice(index, 1)
    roomCopy[key] = group
  })

  await updateRoom(roomId, roomCopy)
}
