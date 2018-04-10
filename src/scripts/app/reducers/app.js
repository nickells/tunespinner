import {
  INCREASE_CLICK,
  SET_CURRENT_ROOM,
  SET_ROOMS,
  SET_CURRENT_USER,
} from '../actions/app'


const initialState = {
  accessToken: '',
  clicks: 0,
  currentRoomId: null,
  rooms: {},
  currentUser: null,
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
        currentRoomId: action.data.roomId,
      }
    case SET_ROOMS:
      return {
        ...state,
        rooms: action.data.rooms,
      }
    case SET_CURRENT_USER:
      return {
        ...state,
        accessToken: action.access_token,
        currentUser: action.user,
      }

    default:
      return state
  }
}
