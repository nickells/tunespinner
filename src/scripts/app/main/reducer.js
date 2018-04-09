import {
  INCREASE_CLICK,
  SET_CURRENT_ROOM,
  SET_ROOMS,
} from './actions'

const initialState = {
  clicks: 0,
  currentRoom: null,
  rooms: [],
}

export default (state = initialState, action) => {
  switch (action.type) {
    case INCREASE_CLICK:
      return {
        ...state,
        clicks: state.clicks + 1,
      }
    case SET_CURRENT_ROOM:
      return {
        ...state,
        currentRoom: action.data.room,
      }
    case SET_ROOMS:
      return {
        ...state,
        rooms: action.data.rooms,
      }
    default:
      return state
  }
}
