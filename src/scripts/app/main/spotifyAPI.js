import axios from 'axios'

export const STORE_PLAYER_INSTANCE = 'STORE_PLAYER_INSTANCE'
export const GET_CURRENT_SONG = 'GET_CURRENT_SONG'
export const ON_SONG_SEARCH = 'ON_SONG_SEARCH'

/* Spotify */
export const initPlayer = () => (dispatch, getState) => {
  const token = getState().MainReducer.accessToken
  const player = new window.Spotify.Player({
    name: 'Tunespinner',
    getOAuthToken: (cb) => {
      cb(token)
    },
  });

  // Error handling
  player.addListener('initialization_error', ({ message }) => { console.error(message); });
  player.addListener('authentication_error', ({ message }) => { console.error(message); });
  player.addListener('account_error', ({ message }) => { console.error(message); });
  player.addListener('playback_error', ({ message }) => { console.error(message); });

  // Playback status updates
  player.addListener('player_state_changed', (state) => { console.log('STATE CHANGE', state); })

  player.connect()

  return new Promise((resolve, reject) => {
    player.addListener('ready', ({ device_id }) => {
      dispatch({
        type: STORE_PLAYER_INSTANCE,
        player,
      })
      resolve()
    })
  })
}


// TODO: Abstract api layer

// This can also take an array of uris - maybe use this to enqueue? Or we should just keep it on the server.
export const playSong = spotify_uri => async (dispatch, getState) => {
  const { id } = getState().MainReducer.player._options
  const { accessToken } = getState().MainReducer
  const response = await axios.put(
    `https://api.spotify.com/v1/me/player/play?device_id=${id}`,
    JSON.stringify({ uris: [spotify_uri] }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  return response.data
}

export const getCurrentSong = () => async (dispatch, getState) => {
  const { accessToken } = getState().MainReducer
  const response = await axios.get(
    'https://api.spotify.com/v1/me/player',
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  dispatch({
    type: GET_CURRENT_SONG,
    data: response.data,
  })
}

export const searchForSongs = searchParameter => async (dispatch, getState) => {
  const { accessToken } = getState().MainReducer
  const types = ['track']
  const response = await axios.get(
    `https://api.spotify.com/v1/search?q=${searchParameter}&type=${types.join(',')}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  )
  dispatch({
    type: ON_SONG_SEARCH,
    searchResults: response.data.tracks.items,
  })
}
