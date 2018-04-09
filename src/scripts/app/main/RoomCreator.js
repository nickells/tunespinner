import React from 'react'
import { createRoom } from '../../db/room'

class RoomCreator extends React.Component {
  constructor(props) {
    super(props)

    this.handleInputChange = this.handleInputChange.bind(this)
    this.createRoom = this.createRoom.bind(this)

    this.state = {
      name: '',
      description: '',
    }
  }

  createRoom() {
    createRoom(this.state)
  }

  handleInputChange(e) {
    const { name, value } = e.target
    const state = {}
    state[name] = value
    this.setState(state)
  }

  render() {
    return (
      <div>
        <input
          name="name"
          type="text"
          placeholder="Room Name"
          onChange={this.handleInputChange}
          value={this.state.name}
        />
        <textarea
          name="description"
          placeholder="Room Description"
          onChange={this.handleInputChange}
        >
          {this.state.description}
        </textarea>
        <button
          onClick={this.createRoom}
        >
          Create Room
        </button>
      </div>
    )
  }
}

export default RoomCreator
