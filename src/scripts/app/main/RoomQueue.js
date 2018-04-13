import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'
import { addSongToRoomQueue, removeSongFromRequests, removeSongFromQueue } from '../../db/room'
import SongListItem from './SongListItem';


class RoomQueue extends React.Component {
  isDJ() {
    if (!this.props.room || !this.props.room.djs) return false
    return this.props.room.djs.indexOf(this.props.currentUserId) > -1
  }

  async addSong(item, index) {
    await addSongToRoomQueue(item, this.props.currentRoomId)
    removeSongFromRequests(index, this.props.currentRoomId)
  }

  renderRequests() {
    if (!this.props.room.requests) return null

    return this.props.room.requests.map((item, index) => (
      <div className="queue-item is-request" key={`${item.id}${index}`}>
        <SongListItem song={item} isRequest />
        {this.isDJ() &&
          <div className="options">
            <span className="option remove" onClick={() => removeSongFromRequests(index, this.props.currentRoomId)}>decline</span>
            <span className="option accept" onClick={() => this.addSong(item, index)}>accept</span>
          </div>
        }
      </div>
    ))
  }

  canRemove(item) {
    return item.contributors &&
    item.contributors.includes(this.props.currentUserId) &&
    this.props.room.djs &&
    this.props.room.djs.includes(this.props.currentUserId)
  }

  render() {
    if (!this.props.room) return null
    return (
      <div className="room-queue">
        { !this.props.room.queue && <h2 style={{ marginBottom: '20px' }}>No songs in the queue. (Sad!)</h2>}
        { this.props.room.currentSong && (
          <div className="queue-item">
            <SongListItem song={this.props.room.currentSong} prefix="▸  " />
          </div>
        )}
        {
          this.props.room.queue && this.props.room.queue.map((item, index) => (
            <div className="queue-item" key={`${item.id}${index}`}>
              <SongListItem song={item} prefix={`${index + 1}. `} />
              { this.canRemove(item) && <span className="option remove" onClick={() => removeSongFromQueue(index, this.props.currentRoomId)}>remove</span> }
            </div>
          ))
        }
        {this.renderRequests()}
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
