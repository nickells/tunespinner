import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getCurrentRoom } from './RoomQueue'
import { initPlayer, playSong, getCurrentSong, seek } from '../actions/spotifyAPI'
import { advanceQueue } from '../../db/room';


class Player extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      playerIsLoaded: false,
    }
  }

  async componentWillMount() {
    await this.props.initPlayer()
    this.setState({
      playerIsLoaded: true,
    })
    this.play()
  }

  componentDidUpdate(prevProps) {
    if (!this.props.room || !prevProps.room) return
    if (this.props.room.id !== prevProps.room.id) {
      this.play()
    }
  }

  async play() {
    if (!this.state.playerIsLoaded) return
    if (!this.props.room) return

    const { room } = this.props

    if (!room.currentSong || !room.currentSongStartTime) {
      await advanceQueue(room.id)
      return
    }

    const now = Date.now()
    const diff = now - room.currentSongStartTime

    if (diff > room.currentSong.duration_ms) {
      await advanceQueue(room.id)
      return
    }

    await this.props.playSong(room.currentSong.uri)
    this.props.seek(diff)
  }

  render() {
    if (!this.state.playerIsLoaded) return null
    if (!this.props.room || !this.props.room.currentSong) return null
    return (
      <React.Fragment>
        <div className="currently-playing">Currently playing: {this.props.room.currentSong.name}</div>
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
