const initialState = {
  rooms: {},
  users: {},
}

export default (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ROOMS':
      return {
        ...state,
        rooms: action.rooms,
      }
    case 'SET_USERS':
      return {
        ...state,
        users: action.users,
      }
    default:
      return state
  }
}
