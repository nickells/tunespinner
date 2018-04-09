export const INCREASE_CLICK = 'INCREASE_CLICK'
export const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM'


export const increaseClick = () => ({
  type: INCREASE_CLICK,
})

export const setCurrentRoom = room => ({
  type: SET_CURRENT_ROOM,
  data: {
    room,
  },
})
