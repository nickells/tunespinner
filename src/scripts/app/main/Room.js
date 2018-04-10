import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'
import { makeDJ } from '../../db/room'

class Room extends React.Component {
  constructor(props) {
    super(props)
    this.becomeDJ = this.becomeDJ.bind(this)
  }

  becomeDJ() {
    const { currentRoomId, currentUserId } = this.props
    makeDJ(currentUserId, currentRoomId)
  }

  renderDJs(room = {}) {
    const { djs } = room
    return this.renderUsers(djs, 'DJ ')
  }

  renderFans(room = {}) {
    const { fans } = room
    return this.renderUsers(fans)
  }

  renderUsers(users, title) {
    if (!users || users.length === 0) return null
    return users.map((userId) => {
      const user = this.props.users[userId]
      if (!user) return null
      return (
        <div className="user" key={user.id}>
          <div className="emoji">{user.emoji}</div>
          <div className="info">{title}{user.username}</div>
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
        <button onClick={this.becomeDJ}>Be a DJ</button>
        <h1 className="room-name">{room.name}</h1>
        <div className="djs-wrapper">
          <div className="djs">
            {this.renderDJs(room)}
            <div className="speaker left" />
            <div className="speaker right" />
          </div>
        </div>
        <div className="fans">
          {this.renderFans(room)}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUserId: state.MainReducer.currentUserId,
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
