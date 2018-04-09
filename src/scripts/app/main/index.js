import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { increaseClick, setCurrentUser, login, initPlayer, playSong } from './actions'
import RoomCreator from './RoomCreator'
import RoomList from './RoomList'
import Room from './Room'


const Login = ({ onClick }) => (
  <div className="button" onClick={onClick}>
    Login
  </div>
)

class Main extends React.Component {
  async componentDidMount() {
    this.props.setCurrentUser()
    await this.waitForPlayerReady()
    this.props.playSong('spotify:track:1oOD1pV43cV9sHg97aBdLs')
  }

  waitForPlayerReady() {
    return new Promise((resolve, reject) => {
      window.onSpotifyWebPlaybackSDKReady = async () => {
        await this.props.initPlayer()
        resolve()
      }
    })
  }
  render() {
    return (
      <div>
        You are {this.props.token}
        <Room />
        <menu className="menu">
          <Login onClick={this.props.login} />
          <RoomList />
          <RoomCreator />
        </menu>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  clicks: state.MainReducer.clicks,
  token: state.MainReducer.accessToken,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  increaseClick,
  setCurrentUser,
  login,
  initPlayer,
  playSong,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main)
