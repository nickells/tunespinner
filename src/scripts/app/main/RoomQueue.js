import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'
import { removeSongFromQueue } from '../../db/room'
import SongListItem from './SongListItem';


class RoomQueue extends React.Component {
  constructor(props) {
    super(props)
  }

  shouldShowRequests() {
    return this.props.room.djs && this.props.room.djs.includes(this.props.currentUserId) && this.props.room.requests
  }

  render() {
    if (!this.props.room) return null
    const canRemove = (item) => {
      return item.contributors && item.contributors.includes(this.props.currentUserId) && this.props.room.djs && this.props.room.djs.includes(this.props.currentUserId)
    }
    return (
      <div className="room-queue">
        { !this.props.room.queue && <h2 style={{ marginBottom: '20px' }}>There is nothing in the queue. (Sad!)</h2>}
        { this.props.room.currentSong && (
          <div className="queue-item">
            <span>▸  </span>
            <SongListItem song={this.props.room.currentSong} />
          </div>
        )}
        {
          this.props.room.queue && this.props.room.queue.map((item, index) => (
            <div className="queue-item" key={`${item.id}${index}`}>
              <span>{index + 1}. </span>
              <SongListItem song={item} />
              { canRemove(item) && <span className="remove-item" onClick={() => removeSongFromQueue(index, this.props.currentRoomId)}>✕</span> }
            </div>
          ))
        }
      </div>
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
