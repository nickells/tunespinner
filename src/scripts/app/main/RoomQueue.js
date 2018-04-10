import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'

class RoomQueue extends React.Component {
  render() {
    return (
      <React.Fragment>
        Queue:
        {
          this.props.roomQueue.map(item => (
            <div key={item.id}>{item.name}</div>
          ))
        }
      </React.Fragment>
    )
  }
}

const getCurrentQueue = (state) => {
  const thisRoom = state.MainReducer.currentRoomId
  const thisRoomQueue = state.FirebaseReducer.rooms[thisRoom].queue || null
  return thisRoomQueue || []
}

const mapStateToProps = state => ({
  roomQueue: getCurrentQueue(state),
  currentRoomId: state.MainReducer.currentRoomId,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentRoom,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoomQueue)
