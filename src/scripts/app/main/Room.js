import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from './actions'
import { createRoom } from '../../db/room'

class Room extends React.Component {
  render() {
    if (!this.props.currentRoom) {
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
        <h1>{this.props.currentRoom.name}</h1>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentRoom: state.MainReducer.currentRoom,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentRoom,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Room)
