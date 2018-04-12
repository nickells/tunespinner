import axios from 'axios'
import cookie from 'cookie'
import loginPromise from '../../auth'
import { createUser } from '../../db/user'

export const INCREASE_CLICK = 'INCREASE_CLICK'
export const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM'
export const LOGIN = 'LOGIN'
export const SET_CURRENT_USER = 'SET_CURRENT_USER'
export const SWITCH_TAB = 'SWITCH_TAB'

export const setCurrentRoom = (roomId) => {
  return {
    type: SET_CURRENT_ROOM,
    data: {
      roomId,
    },
  }
}

/* Auth */

export const login = () => async (dispatch, getState) => {
  const redirectURI = await loginPromise()
  window.location = redirectURI
}

export const setCurrentUser = () => async (dispatch) => {
  const cookies = cookie.parse(document.cookie)
  const { spotify_access_token, spotify_refresh_token } = cookies

  if (!spotify_access_token) return

  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${spotify_access_token}` },
  })

  const user = response.data

  let resolvedUser

  try {
    resolvedUser = await createUser({
      id: user.id,
      email: user.email,
      username: user.display_name || user.id,
    })
  } catch (e) {
    console.log('error creating user', e)
  }

  if (!resolvedUser) return

  dispatch({
    type: SET_CURRENT_USER,
    access_token: spotify_access_token,
    userId: resolvedUser.id,
  })

  if (resolvedUser.currentRoom) {
    dispatch({
      type: SET_CURRENT_ROOM,
      data: {
        roomId: resolvedUser.currentRoom,
      },
    })
  }
}


export const switchTab = (tab) => {
  return {
    type: SWITCH_TAB,
    tab,
  }
}

// this one just retrieves data
export const retrieveUserData = userId => (dispatch, getState) => {
  return getState().FirebaseReducer.users[userId]
}
