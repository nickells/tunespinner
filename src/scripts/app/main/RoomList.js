import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setRooms, setCurrentRoom } from './actions'
import { watchRooms } from '../../db/room'

class RoomList extends React.Component {
  componentWillMount() {
    watchRooms((rooms) => {
      this.props.setRooms(rooms)
    })
  }

  renderRooms() {
    return this.props.rooms.map(room => (
      <div
        className="room"
        key={room.id}
        onClick={() => this.props.setCurrentRoom(room)}
      >
        {room.name || 'Untitled Room'}
      </div>
    ))
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
  currentRoom: state.MainReducer.currentRoom,
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
