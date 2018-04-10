export const SET_ROOMS = 'SET_ROOMS'
export const SET_USERS = 'SET_USERS'

export const setRooms = rooms => ({
  type: SET_ROOMS,
  rooms,
})

export const setUsers = users => ({
  type: SET_USERS,
  users,
})
