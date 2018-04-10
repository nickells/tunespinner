import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'

class Room extends React.Component {
  renderDJs(room = {}) {
    const { djs } = room
    if (!djs || djs.length === 0) return null
    return djs.map((userId) => {
      const user = this.props.users[userId]
      if (!user) return null
      return <div className="user" key={user.id}>{user.username}</div>
    })
  }

  renderFans(room = {}) {
    const { fans } = room
    if (!fans || fans.length === 0) return null
    return fans.map((userId) => {
      const user = this.props.users[userId]
      if (!user) return null
      return <div className="user" key={user.id}>{user.username}</div>
    })
  }

  render() {
    const room = this.props.rooms[this.props.currentRoomId]

    if (!room) {
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
        <h1>{room.name}</h1>
        <div className="djs">
          <h3>DJS:</h3>
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
