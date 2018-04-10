import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { initPlayer, playSong, getCurrentSong, seek } from '../actions/spotifyAPI'
import { advanceQueue } from '../../db/room';


class Player extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playerIsLoaded: false,
      songPosition: 0,
    }
  }

  async componentWillMount() {
    await this.props.initPlayer()
    this.setState({
      playerIsLoaded: true,
    }, () => {
      this.play()
    })

    this.interval = setInterval(this.setSongPosition.bind(this), 800)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.room) return
    if (this.props.room.id !== prevProps.room.id) {
      this.play()
    }
  }

  async setSongPosition() {
    const { room } = this.props
    if (!room.currentSongStartTime) return
    const now = Date.now()
    const diff = now - room.currentSongStartTime
    const songPosition = diff
    await this.setState({ songPosition })
  }

  async play() {
    if (!this.state.playerIsLoaded) return

    const { room } = this.props

    if (!room.currentSong || !room.currentSongStartTime) {
      await advanceQueue(room.id)
      return
    }

    await this.setSongPosition()
    if (this.state.songPosition > room.currentSong.duration_ms) {
      console.log('NEXT SONG!')
      await advanceQueue(room.id)
      return
    }

    await this.props.playSong(room.currentSong.uri)
    this.props.seek(this.state.songPosition, room.currentSong.id)
  }

  render() {
    if (!this.state.playerIsLoaded) return null
    if (!this.props.room.currentSong) return null

    const { songPosition } = this.state

    const sec = Math.round(songPosition / 1000)
    const min = Math.floor(sec / 60)
    const format = num => (num < 10 ? `0${num}` : num)

    const { currentSong } = this.props.room

    const artists = currentSong.artists.map(a => a.name).join('')

    return (
      <React.Fragment>
        <div className="current-song">
          <h3 className="song-name">{currentSong.name}</h3>
          <h2 className="song-artist">{artists}</h2>
          <div className="song-position">{format(min)}:{format(sec % 60)}</div>
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  player: state.SpotifyReducer.player,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  initPlayer,
  playSong,
  seek,
  getCurrentSong,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Player)
