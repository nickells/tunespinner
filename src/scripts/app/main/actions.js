import axios from 'axios'
import loginPromise from '../../auth'
import { createUser } from '../../db/user'

import queryString from 'query-string'

export const INCREASE_CLICK = 'INCREASE_CLICK'
export const SET_CURRENT_ROOM = 'SET_CURRENT_ROOM'
export const SET_ROOMS = 'SET_ROOMS'
export const LOGIN = 'LOGIN'
export const SET_CURRENT_USER = 'SET_CURRENT_USER'


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

  await createUser({
    id: user.id,
    email: user.email,
    username: user.display_name || user.id,
  })

  dispatch({
    type: SET_CURRENT_USER,
    access_token,
    user,
  })
}
