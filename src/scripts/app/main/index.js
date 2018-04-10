import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { increaseClick, setCurrentUser, login } from '../actions/app'
import { setRooms, setUsers } from '../actions/firebase'
import RoomCreator from './RoomCreator'
import RoomQueue from './RoomQueue'
import RoomList from './RoomList'
import Player from './Player'
import Room from './Room'
import TrackSearch from './TrackSearch'
import { watchRooms } from '../../db/room'
import { watchUsers } from '../../db/user'

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
  constructor(props) {
    super(props)
    this.state = {
      ready: false,
    }
  }

  async componentWillMount() {
    await waitForSpotify()
    await this.props.setCurrentUser()
    this.setState({
      ready: true,
    })
    watchRooms((rooms) => {
      this.props.setRooms(rooms)
    })

    watchUsers((users) => {
      this.props.setUsers(users)
    })
  }

  render() {
    return (
      this.state.ready && (
        <div>
          You are {this.props.accessToken}
          <Room />
          <Player />
          <menu className="menu">
            <Login onClick={this.props.login} />
            <RoomList />
            <RoomCreator />
            { this.props.currentRoomId && <RoomQueue /> }
            <TrackSearch />
          </menu>
        </div>
      )
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
  setRooms,
  setUsers,
  login,

}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main)
