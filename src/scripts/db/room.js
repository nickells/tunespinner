import firebase from './firebase'
import { getUser } from './user'

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

export const updateRoom = (id, data = {}) => {
  console.log('updating room with', data)
  db.ref(`/rooms/${id}`).update(data)
}

export const watchRooms = (callback) => {
  db.ref('/rooms').on('value', (snapshot) => {
    const rooms = snapshot.val()
    callback(rooms)
  })
}

export const watchRoom = (id, callback) => {
  db.ref(`/rooms/${id}`).on('value', (snapshot) => {
    const room = snapshot.val()
    callback(room)
  })
}

export const unwatchRoom = (id, callback) => {
  db.ref(`/rooms/${id}`).off('value', callback)
}

export const addUserToRoom = async (userId, roomId, key = 'fans') => {
  console.log('adding', userId, 'to room')
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

export const removeUserFromRoom = async (userId) => {
  const user = await getUser(userId)
  if (!user.currentRoom) return
  const roomId = user.currentRoom
  const room = await getRoom(roomId)

  if (!room) return

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

/* Makes a new object with specific fields from the first object */
const pick = (object, ...keys) => {
  return keys.reduce((newObject, key) => {
    if (!object[key]) console.warn(`Tried to get key ${key} from an object but it didn't exist.`)
    newObject[key] = object[key]
    return newObject
  }, {})
}

export const addSongToRoomQueue = async (song, roomId) => {
  const relevantSongInformation = pick(song, 'id', 'name', 'uri', 'duration_ms', 'artists')
  const randomKey = Math.floor(Math.random() * 999999)
  relevantSongInformation.key = relevantSongInformation.id + randomKey
  const room = await getRoom(roomId)
  room.queue = room.queue || []
  room.queue.push(relevantSongInformation)

  await updateRoom(roomId, room)
}

export const removeSongFromQueue = async (index, roomId) => {
  const room = await getRoom(roomId)
  room.queue.splice(index, 1)
  await updateRoom(roomId, room)
}

export const makeDJ = async (userId, roomId) => {
  const room = await getRoom(roomId)
  room.djs = room.djs || []

  if (room.djs.indexOf(userId) > -1) {
    return
  }

  room.djs.push(userId)
  await updateRoom(roomId, room)
}

export const advanceQueue = async (roomId) => {
  const room = await getRoom(roomId)

  if (!room.queue || room.queue.length === 0) {
    return
  }
  console.log('NEXT SONG IS:')
  const currentSong = room.queue.splice(0, 1)[0]
  room.currentSong = currentSong
  room.currentSongStartTime = Date.now()
  room.queue.push(currentSong)
  console.log(currentSong, room)
  await updateRoom(roomId, room)
}
