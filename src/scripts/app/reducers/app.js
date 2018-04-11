import {
  INCREASE_CLICK,
  SET_CURRENT_ROOM,
  SET_ROOMS,
  SET_CURRENT_USER,
  SWITCH_TAB,
} from '../actions/app'
import { TAB_NAMES } from '../main';


const initialState = {
  accessToken: '',
  clicks: 0,
  currentRoomId: null,
  rooms: {},
  currentUserId: null,
  activeTab: TAB_NAMES.rooms,
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
        currentUserId: action.userId,
      }
    case SWITCH_TAB:
      return {
        ...state,
        activeTab: action.tab,
      }
    default:
      return state
  }
}
