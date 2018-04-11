import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { increaseClick, setCurrentUser, login, switchTab } from '../actions/app'
import { setRooms, setUsers } from '../actions/firebase'
import SpotifyPlayer from '../global/SpotifyPlayer'
import RoomCreator from './RoomCreator'
import RoomQueue from './RoomQueue'
import RoomList from './RoomList'
import Room from './Room'
import Profile from './Profile'
import TrackSearch from './TrackSearch'
import Tabs from './Tabs'
import { watchRooms } from '../../db/room'
import { watchUsers } from '../../db/user'

export const TAB_NAMES = {
  queue: 'Queue',
  rooms: 'Rooms',
  profile: 'Profile',
}

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
      activeTab: TAB_NAMES.rooms,
    }

    this.changeActiveTab = this.changeActiveTab.bind(this)
  }

  async componentWillMount() {
    await waitForSpotify()
    await this.props.setCurrentUser()
    if (this.props.accessToken) {
      window.spotifyPlayer = new SpotifyPlayer(this.props.accessToken)
      await window.spotifyPlayer.init()
    } else {
      console.log('Please log in!')
    }

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

  changeActiveTab(tab) {
    this.props.switchTab(tab)
  }

  renderRoomsTab() {
    return (
      <React.Fragment>
        <RoomList />
        <RoomCreator />
      </React.Fragment>
    )
  }

  renderQueueTab() {
    return (
      <React.Fragment>
        {this.renderActiveRoom()}
        {this.props.currentRoomId && <RoomQueue />}
        <TrackSearch />
      </React.Fragment>
    )
  }

  renderActiveRoom() {
    return (
      <div className="active-room-header">
        <h2 className="supertext">Current Room</h2>
        <h2>{this.props.rooms[this.props.currentRoomId] ? this.props.rooms[this.props.currentRoomId].name : 'None. Sad.'}</h2>
      </div>
    )
  }

  renderMenu() {
    if (this.props.accessToken) {
      return (
        <React.Fragment>
          { this.props.activeTab === TAB_NAMES.rooms && this.renderRoomsTab() }
          { this.props.activeTab === TAB_NAMES.queue && this.renderQueueTab() }
          { this.props.activeTab === TAB_NAMES.profile && <Profile /> }
          <Tabs
            labels={Object.values(TAB_NAMES)}
            activeTab={this.props.activeTab}
            onClick={this.changeActiveTab}
          />
        </React.Fragment>
      )
    }
    return (
      <Login onClick={this.props.login} />
    )
  }

  render() {
    return (
      this.state.ready && (
        <main>
          <Room />
          <menu className="menu">
            { this.renderMenu() }
          </menu>
        </main>
      )
    )
  }
}

const mapStateToProps = state => ({
  clicks: state.MainReducer.clicks,
  accessToken: state.MainReducer.accessToken,
  rooms: state.FirebaseReducer.rooms,
  currentRoomId: state.MainReducer.currentRoomId,
  activeTab: state.MainReducer.activeTab,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  increaseClick,
  setCurrentUser,
  setRooms,
  setUsers,
  login,
  switchTab,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main)
