import axios from 'axios'

const CLIENT_ID = 'f308f0a3bacf4047a41d2b48eff54115'

const login = async () => {
  const response = await axios.get('/login')
  return response.data
  // const response = await axios.get(`https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}`)
}

export default login
