import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { increaseClick, setCurrentUser, login } from '../actions/app'
import { initPlayer, playSong, getCurrentSong } from '../actions/spotifyAPI'
import RoomCreator from './RoomCreator'
import RoomList from './RoomList'
import Room from './Room'
import TrackSearch from './TrackSearch'

const waitForSpotify = () => new Promise((resolve) => {
  if (window.Spotify) {
    resolve()
  } else {
    window.onSpotifyWebPlaybackSDKReady = resolve;
  }
})

const Login = ({ onClick }) => (
  <div className="button" onClick={onClick}>
    Login
  </div>
)

class Main extends React.Component {
  async componentDidMount() {
    await waitForSpotify()
    await this.props.setCurrentUser()
    await this.props.initPlayer()
    await this.props.playSong('spotify:track:1oOD1pV43cV9sHg97aBdLs')
    const thisSong = await this.props.getCurrentSong()
    console.log(thisSong)
  }

  render() {
    const room = this.props.rooms[this.props.currentRoomId]
    console.log('curr room', room)
    return (
      <div>
        You are {this.props.accessToken}
        <Room room={room} />
        <menu className="menu">
          <Login onClick={this.props.login} />
          <RoomList />
          <RoomCreator />
          <TrackSearch />
        </menu>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  clicks: state.MainReducer.clicks,
  accessToken: state.MainReducer.accessToken,
  rooms: state.MainReducer.rooms,
  currentRoomId: state.MainReducer.currentRoomId,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  increaseClick,
  setCurrentUser,
  login,
  initPlayer,
  playSong,
  getCurrentSong,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main)
