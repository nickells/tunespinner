import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'

class RoomQueue extends React.Component {
  render() {
    if (!this.props.room || !this.props.room.queue) return null
    return (
      <React.Fragment>
        Queue:
        {
          this.props.room.queue.map(item => (
            <div key={item.id}>{item.name}</div>
          ))
        }
      </React.Fragment>
    )
  }
}

const getCurrentRoom = (state) => {
  const thisRoomId = state.MainReducer.currentRoomId
  return state.FirebaseReducer.rooms[thisRoomId]
}

const mapStateToProps = state => ({
  room: getCurrentRoom(state),
  currentRoomId: state.MainReducer.currentRoomId,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentRoom,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoomQueue)
