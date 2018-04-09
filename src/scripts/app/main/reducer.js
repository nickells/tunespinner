import {
  INCREASE_CLICK,
  SET_CURRENT_ROOM,
} from './actions'

const initialState = {
  clicks: 0,
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
    default:
      return state
  }
}
