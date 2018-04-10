import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { getCurrentRoom } from './RoomQueue'
import { initPlayer, playSong, getCurrentSong } from '../actions/spotifyAPI'


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
    const currentSong = this.props.room.queue[0]
    this.props.playSong(currentSong.uri)
  }

  componentWillReceiveProps(nextProps) {
    if (!this.state.playerIsLoaded) return
    if (!nextProps.room || !nextProps.room.queue) return

    // dont play a new song if the first tracks are the same, for now.
    // we should revisit this

    if (this.props.room.queue && (this.props.room.queue[0].uri === nextProps.room.queue[0].uri)) return
    const currentSong = nextProps.room.queue[0]
    this.props.playSong(currentSong.uri)
  }

  render() {
    if (!this.state.playerIsLoaded) return null
    if (!this.props.room.queue) return null
    return (
      <React.Fragment>
        <div>Currently playing: {this.props.room.queue[0].name}</div>
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
