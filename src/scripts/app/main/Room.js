import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from './actions'
import { getUser } from '../../db/user'
import { createRoom, addUserToRoom, removeUserFromRoom } from '../../db/room'

class Room extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      djs: [],
      fans: [],
    }
  }

  componentWillReceiveProps(props) {
    if (!props.currentUser || this.props.currentRoom === props.currentRoom) return

    if (this.props.currentRoom) {
      removeUserFromRoom(this.props.currentUser.id, this.props.currentRoom.id)
    }

    if (props.currentRoom) {
      addUserToRoom(props.currentUser.id, props.currentRoom.id)
    }
  }

  componentDidUpdate() {
    if (!this.props.currentRoom) return
    this.getDJs()
    this.getFans()
  }

  getDJs() {
    const { djs } = this.props.currentRoom
    if (!djs || djs.length === 0) return null

    const promises = djs.map(id => getUser(id))
    Promise.all(promises).then((users) => {
      this.setState({ djs: users })
    })
  }

  getFans() {
    const { fans } = this.props.currentRoom
    if (!fans || fans.length === 0) return null

    const promises = fans.map(id => getUser(id))
    Promise.all(promises).then((users) => {
      this.setState({ fans: users })
    })
  }

  renderDJs() {
    const { djs } = this.state
    return djs.map(user => <div className="user" key={user.id}>{user.username}</div>)
  }

  renderFans() {
    const { fans } = this.state
    return fans.map(user => <div className="user" key={user.id}>{user.username}</div>)
  }

  render() {
    if (!this.props.currentRoom) {
      return (
        <div>
        YOU ARE NOT IN A ROOM
          <h1>sad</h1>
        </div>
      )
    }

    return (
      <div>
        YOU ARE IN A ROOM
        <h1>{this.props.currentRoom.name}</h1>
        <div className="djs">
          <h3>DJS:</h3>
          {this.renderDJs()}
        </div>
        <div className="fans">
          <h3>FANS:</h3>
          {this.renderFans()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentRoom: state.MainReducer.currentRoom,
  currentUser: state.MainReducer.currentUser,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentRoom,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Room)
