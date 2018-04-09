const spotify = () => {
  const genericRequest = (method, url, body) => (dispatch, getState) => {
    const { id } = getState().MainReducer.player._options
    const { accessToken } = getState().MainReducer
    const response = await fetch(`https://api.spotify.com/v1/${url}?device_id=${id}`, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    })
  }
  return {

    get(url, body) {
      return genericRequest('GET', url, body)
    },
    put(url, body) {
      return genericRequest('PUT', url, body)
    },
    post(url, body) {
      return genericRequest('POST', url, body)
    },
    delete(url, body) {
      return genericRequest('DELETE', url, body)
    }
  }
}

export default spotify()