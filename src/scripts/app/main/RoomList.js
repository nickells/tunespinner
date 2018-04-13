import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom, switchTab } from '../actions/app'
import { setUserRoom } from '../../db/user'
import { addUserToRoom, removeUserFromRoom } from '../../db/room'
import { TAB_NAMES } from './index';

class RoomList extends React.Component {
  async chooseRoom(id) {
    if (id === this.props.currentRoomId) {
      return
    }

    if (this.props.currentRoomId) {
      await removeUserFromRoom(this.props.currentUserId, this.props.currentRoomId)
    }

    addUserToRoom(this.props.currentUserId, id)
    setUserRoom(this.props.currentUserId, id)
    this.props.setCurrentRoom(id)
    this.props.switchTab(TAB_NAMES.queue)
  }

  renderRooms() {
    const roomIds = Object.keys(this.props.rooms)

    const roomsArray = Object.values(this.props.rooms)
    const orderedRooms = roomsArray.sort((a, b) => {
      const aFans = a.fans || []
      const bFans = b.fans || []

      if (aFans.length === bFans.length) {
        return 0
      }

      return aFans.length > bFans.length ? -1 : 1
    })

    window.rooms = this.props.rooms
    return orderedRooms.map((room) => {
      const isActive = room.id === this.props.currentRoomId

      return (
        <div
          className="room-preview"
          data-is-active={isActive}
          key={room.id}
          onClick={() => this.chooseRoom(room.id)}
        >
          {room.name || 'Untitled Room'} {room.fans && `(${room.fans.length})`}
        </div>
      )
    })
  }

  render() {
    return (
      <div className="room-list">
        {this.renderRooms()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentRoomId: state.MainReducer.currentRoomId,
  currentUserId: state.MainReducer.currentUserId,
  rooms: state.FirebaseReducer.rooms,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentRoom,
  switchTab,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoomList)
