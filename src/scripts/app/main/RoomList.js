import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setRooms, setCurrentRoom } from '../actions/app'
import { setUserRoom } from '../../db/user'
import { watchRooms, addUserToRoom, removeUserFromRoom } from '../../db/room'

class RoomList extends React.Component {
  componentWillMount() {
    watchRooms((rooms) => {
      const roomsObj = {}
      rooms.forEach((room) => {
        roomsObj[room.id] = room
      })

      this.props.setRooms(roomsObj)
    })
  }

  async chooseRoom(id) {
    await removeUserFromRoom(this.props.currentUser.id)
    addUserToRoom(this.props.currentUser.id, id)
    setUserRoom(this.props.currentUser.id, id)
    this.props.setCurrentRoom(id)
  }

  renderRooms() {
    const roomIds = Object.keys(this.props.rooms)

    return roomIds.map((id) => {
      const room = this.props.rooms[id]
      return (
        <div
          className="room"
          key={room.id}
          onClick={() => this.chooseRoom(id)}
        >
          {room.name || 'Untitled Room'}
        </div>
      )
    })
  }

  render() {
    return (
      <div className="room-list">
        <h3>ROOMS</h3>
        {this.renderRooms()}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentRoomId: state.MainReducer.currentRoomId,
  currentUser: state.MainReducer.currentUser,
  rooms: state.MainReducer.rooms,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentRoom,
  setRooms,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoomList)
