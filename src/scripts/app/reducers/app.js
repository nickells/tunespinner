import {
  INCREASE_CLICK,
  SET_CURRENT_ROOM,
  SET_ROOMS,
  SET_CURRENT_USER,
} from '../main/actions'

import {
  STORE_PLAYER_INSTANCE,
  ON_SONG_SEARCH,
} from '../main/spotifyAPI'

const initialState = {
  clicks: 0,
  currentRoomId: null,
  rooms: {},
  currentUser: null,
}

export default (state = initialState, action) => {
  console.log(action)

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
    case STORE_PLAYER_INSTANCE:
      return {
        ...state,
        player: action.player,
      }
    case ON_SONG_SEARCH:
      return {
        ...state,
        searchResults: action.searchResults,
      }
    default:
      return state
  }
}
