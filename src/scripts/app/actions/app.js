import axios from 'axios'
import cookie from 'cookie'
import loginPromise from '../../auth'
import { createUser } from '../../db/user'

export const INCREASE_CLICK = 'INCREASE_CLICK'
export const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM'
export const LOGIN = 'LOGIN'
export const SET_CURRENT_USER = 'SET_CURRENT_USER'
export const SET_ACCESS_TOKEN = 'SET_ACCESS_TOKEN'
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

export const refreshToken = async () => {
  const cookies = cookie.parse(document.cookie)
  const { spotify_refresh_token } = cookies

  if (!spotify_refresh_token) {
    return null
  }

  const response = await axios.get(`/refresh_token?refresh_token=${spotify_refresh_token}`)
  console.log('refreshed:', response)

  const newCookies = cookie.parse(document.cookie)
  return newCookies
}

export const setAccessToken = () => async (dispatch) => {
  const cookies = await refreshToken()
  if (!cookies) {
    console.log('No access!')
    window.location = '/'
    return
  }

  const { spotify_access_token, spotify_refresh_token } = cookies

  dispatch({
    type: SET_ACCESS_TOKEN,
    access_token: spotify_access_token,
  })
}

export const setCurrentUser = () => async (dispatch) => {
  let cookies = cookie.parse(document.cookie)
  let { spotify_access_token, spotify_refresh_token } = cookies

  if (!spotify_access_token) {
    cookies = await refreshToken()
    if (!cookies) {
      console.log('still nothing')
      return
    }

    spotify_access_token = cookies.spotify_access_token

    if (!spotify_access_token) {
      console.log('still nothing')
      return
    }
  }

  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${spotify_access_token}` },
  })

  const user = response.data

  let resolvedUser

  try {
    const username = `${user.display_name || user.id || ''}`
    resolvedUser = await createUser({
      id: user.id,
      email: user.email,
      username: username.substring(0, 15),
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
