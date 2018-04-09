import loginPromise from '../../auth'

import queryString from 'query-string'

export const INCREASE_CLICK = 'INCREASE_CLICK'
export const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM'
export const SET_ROOMS = 'SET_ROOMS'
export const LOGIN = 'LOGIN'
export const SET_CURRENT_USER = 'SET_CURRENT_USER'
export const STORE_PLAYER_INSTANCE = 'STORE_PLAYER_INSTANCE'

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

/* Auth */

export const login = () => async (dispatch, getState) => {
  const redirectURI = await loginPromise()
  window.location = redirectURI
}

export const setCurrentUser = () => (dispatch) => {
  const { access_token, refresh_token } = queryString.parse(window.location.search)
  if (!access_token) return
  dispatch({
    type: SET_CURRENT_USER,
    token: access_token,
  })
}

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

export const playSong = spotify_uri => (dispatch, getState) => {
  const { id } = getState().MainReducer.player._options
  const { accessToken } = getState().MainReducer
  fetch(`https://api.spotify.com/v1/me/player/play?device_id=${id}`, {
    method: 'PUT',
    body: JSON.stringify({ uris: [spotify_uri] }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  })
}
