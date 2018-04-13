import axios from 'axios'
import { refreshToken } from '../actions/app'

class SpotifyPlayer {
  constructor(accessToken) {
    this.accessToken = `${accessToken}`
  }

  async init() {
    return new Promise((resolve) => {
      this.player = new window.Spotify.Player({
        name: 'Tunespinner',
        getOAuthToken: (cb) => {
          cb(this.accessToken)
        },
      })

      const handleReady = () => {
        this.player.removeListener('ready', handleReady)
        resolve()
      }

      const onErr = async (err) => {
        const newC = await refreshToken()
        if (!newC) {
          resolve()
          return
        }
        this.accessToken = newC.spotify_access_token
        this.init()
          .then(resolve)
      }

      this.player.on('initialization_error', onErr)
      this.player.on('authentication_error', onErr)
      this.player.addListener('ready', handleReady)
      this.player.connect()
      this.playerId = this.player._options.id
    })
  }

  async setSong(songURI) {
    return new Promise((resolve, reject) => {
      const handleStateChange = (state) => {
        const { current_track } = state.track_window
        if (current_track && current_track.uri === songURI && state.duration) {
          resolve(state)
          this.player.removeListener('player_state_changed', handleStateChange)
        }
      }

      this.player.addListener('player_state_changed', handleStateChange)

      axios.put(
        `https://api.spotify.com/v1/me/player/play?device_id=${this.playerId}`,
        JSON.stringify({ uris: [songURI] }),
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
          },
        },
      ).catch((error) => {
        reject(error)
      })
    })
  }

  async getState() {
    return this.player.getCurrentState()
  }

  async setSongAt(songURI, seekTime = 0) {
    return this.setSong(songURI)
      .then(() => {
        this.getState().then((state) => {
          if (seekTime > state.duration) {
            console.log('ITS OVER YO')
            return
          }
          console.log(seekTime, state)
          this.player.seek(seekTime)
        })
      })
  }

  async pause() {
    return this.player.pause()
  }
}

module.exports = SpotifyPlayer
