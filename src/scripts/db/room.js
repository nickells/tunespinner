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

  return roomRef.set(roomData)
}

export const updateRoom = (id, _data = {}) => {
  const data = Object.assign({}, DEFAULT_ROOM, _data)
  db.ref(`/rooms/${id}`).update(data)
}
