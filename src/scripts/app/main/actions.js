import loginPromise from '../../auth'

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

export const setCurrentUser = () => (dispatch) => {
  const [domain, token] = window.location.href.split('access_token=')
  if (!token) return
  dispatch({
    type: SET_CURRENT_USER,
    token,
  })
}
