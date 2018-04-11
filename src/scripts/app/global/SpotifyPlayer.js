import axios from 'axios'

class SpotifyPlayer {
  constructor(accessToken) {
    this.accessToken = accessToken
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

      this.player.addListener('ready', handleReady)
      this.player.connect()
      this.playerId = this.player._options.id
    })
  }

  async setSong(songURI) {
    return new Promise((resolve) => {
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
      )
    })
  }

  async getState() {
    return this.player.getCurrentState()
  }

  async setSongAt(songURI, seekTime = 0) {
    await this.setSong(songURI)
    const state = await this.getState()
    if (seekTime > state.duration) {
      console.log('ITS OVER YO')
      return
    }
    console.log(seekTime, state)
    this.player.seek(seekTime)
  }

  async pause() {
    return this.player.pause()
  }
}

module.exports = SpotifyPlayer
