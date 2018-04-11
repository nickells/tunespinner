import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'
import { removeSongFromQueue } from '../../db/room'
import SongListIem from './SongListItem';


class RoomQueue extends React.Component {
  constructor(props) {
    super(props)
  }


  render() {
    if (!this.props.room || !this.props.room.queue) return null
    const canRemove = (item) => {
      return item.contributors.includes(this.props.currentUserId) && this.props.room.djs.includes(this.props.currentUserId)
    }
    return (
      <React.Fragment>
        {
          this.props.room.queue.map((item, index) => (
            <div className="queue-item" key={`${item.id}${index}`}>
              <span>{index + 1}. </span>
              <SongListIem song={item} />
              { canRemove(item) && <span className="remove-item" onClick={() => removeSongFromQueue(index, this.props.currentRoomId)}>✕</span> }
            </div>
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
  currentUserId: state.MainReducer.currentUserId,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentRoom,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoomQueue)
