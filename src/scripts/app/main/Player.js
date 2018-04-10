import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getCurrentRoom } from './RoomQueue'
import { initPlayer, playSong, getCurrentSong } from '../actions/spotifyAPI'


class Player extends React.Component {
  constructor(props) {
    super(props)
    this.onClickPlayPause = this.onClickPlayPause.bind(this)
    this.state = {
      ready: false,
    }
  }

  async componentWillMount() {
    await this.props.initPlayer()
    this.setState({
      ready: true,
    })
    const currentSong = this.props.room.queue[0]
    this.props.playSong(currentSong.uri)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.ready) return
    if (!nextProps.room || !nextProps.room.queue) return

    // dont play a new song if the first tracks are the same, for now.
    if (this.props.room.queue[0].uri === nextProps.room.queue[0].uri) return
    const currentSong = nextProps.room.queue[0]
    this.props.playSong(currentSong.uri)
  }

  onClickPlayPause() {
    this.props.player.togglePlay()
  }

  render() {
    if (!this.state.ready) return null
    if (!this.props.room || !this.props.room.queue) return null
    return (
      <React.Fragment>
        <div>Currently playing: {this.props.room.queue[0].name}</div>
        <button onClick={this.onClickPlayPause}>Play/Pause</button>
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => ({
  player: state.SpotifyReducer.player,
  room: getCurrentRoom(state),
})

const mapDispatchToProps = dispatch => bindActionCreators({
  initPlayer,
  playSong,
  getCurrentSong,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Player)
