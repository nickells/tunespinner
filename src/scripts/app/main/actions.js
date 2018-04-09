export const INCREASE_CLICK = 'INCREASE_CLICK'
export const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM'
export const SET_ROOMS = 'SET_ROOMS'


export const setCurrentRoom = room => ({
  type: SET_CURRENT_ROOM,
  data: {
    room,
  },
})

export const setRooms = rooms => ({
  type: SET_ROOMS,
  data: {
    rooms,
  },
})
