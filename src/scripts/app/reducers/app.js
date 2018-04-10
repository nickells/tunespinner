import {
  INCREASE_CLICK,
  SET_CURRENT_ROOM,
  SET_ROOMS,
  SET_CURRENT_USER,
} from '../actions/app'

import {
  STORE_PLAYER_INSTANCE,
  ON_SONG_SEARCH,
  GET_CURRENT_SONG,
} from '../actions/spotifyAPI'

const initialState = {
  accessToken: '',
  clicks: 0,
  currentRoomId: null,
  rooms: {},
  currentUser: null,
  player: null,
  searchResults: [],
  currentSong: {},
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
    case GET_CURRENT_SONG:
      return {
        ...state,
        currentSong: action.data,
      }
    default:
      return state
  }
}
