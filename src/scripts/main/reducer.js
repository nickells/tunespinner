import { INCREASE_CLICK } from './actions'

const initialState = {
  clicks: 0,
}

export default (state = initialState, action) => {
  console.log('inside reducer', action.type)
  switch (action.type) {
    case INCREASE_CLICK:
      return {
        ...state,
        clicks: state.clicks + 1,
      }
    default:
      return state
  }
}
