import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'

class Room extends React.Component {
  renderDJs(room = {}) {
    const { djs } = room
    return this.renderUsers(djs)
  }

  renderFans(room = {}) {
    const { fans } = room
    return this.renderUsers(fans)
  }

  renderUsers(users) {
    if (!users || users.length === 0) return null
    return users.map((userId) => {
      const user = this.props.users[userId]
      if (!user) return null
      return (
        <div className="user" key={user.id}>
          <div className="emoji">{user.emoji}</div>
          <div className="info">{user.username}</div>
        </div>
      )
    })
  }

  render() {
    const room = this.props.rooms[this.props.currentRoomId]

    if (!room) {
      return (
        <div className="room">
          YOU ARE NOT IN A ROOM
          <h1 className="room-name">sad</h1>
        </div>
      )
    }

    return (
      <div className="room">
        <h1 className="room-name">{room.name}</h1>
        <div className="djs">
          {this.renderDJs(room)}
        </div>
        <div className="fans">
          <h3>FANS:</h3>
          {this.renderFans(room)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentRoomId: state.MainReducer.currentRoomId,
  rooms: state.FirebaseReducer.rooms,
  users: state.FirebaseReducer.users,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentRoom,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Room)
