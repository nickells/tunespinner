import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'
import { removeSongFromQueue } from '../../db/room'

class RoomQueue extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    if (!this.props.room || !this.props.room.queue) return null
    return (
      <React.Fragment>
        Queue:
        {
          this.props.room.queue.map((item, index) => (
            <div onClick={() => removeSongFromQueue(index, this.props.currentRoomId)} key={index}>{item.name}</div>
          ))
        }
      </React.Fragment>
    )
  }
}

export const getCurrentRoom = (state) => {
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
