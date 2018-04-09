import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { increaseClick, setCurrentUser, login } from './actions'
import RoomCreator from './RoomCreator'
import RoomList from './RoomList'
import Room from './Room'

const Login = ({ onClick }) => (
  <div className="button" onClick={onClick}>
    Login
  </div>
)

class Main extends React.Component {
  componentDidMount() {
    this.props.setCurrentUser()
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
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main)
