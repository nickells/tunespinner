import axios from 'axios'
import loginPromise from '../../auth'
import { createUser } from '../../db/user'

import queryString from 'query-string'


export const INCREASE_CLICK = 'INCREASE_CLICK'
export const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM'
export const LOGIN = 'LOGIN'
export const SET_CURRENT_USER = 'SET_CURRENT_USER'

export const setCurrentRoom = roomId => ({
  type: SET_CURRENT_ROOM,
  data: {
    roomId,
  },
})

/* Auth */

export const login = () => async (dispatch, getState) => {
  const redirectURI = await loginPromise()
  window.location = redirectURI
}

export const setCurrentUser = () => async (dispatch) => {
  const { access_token, refresh_token } = queryString.parse(window.location.search)

  if (!access_token) return

  const response = await axios.get('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${access_token}` },
  })

  const user = response.data

  try {
    await createUser({
      id: user.id,
      email: user.email,
      username: user.display_name || user.id,
    })
  } catch (e) {
    console.log('error creating user', e)
  }

  dispatch({
    type: SET_CURRENT_USER,
    access_token,
    user,
  })
}
