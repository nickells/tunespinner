import {
  STORE_PLAYER_INSTANCE,
  ON_SONG_SEARCH,
  GET_CURRENT_SONG,
} from '../actions/spotifyAPI'

const initialState = {
  player: null,
  searchResults: [],
  currentSong: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
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
