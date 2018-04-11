import React from 'react'
import RoomQueue from './RoomQueue'
import TrackSearch from './TrackSearch'


export default (currentRoom) => {
  return (
    <React.Fragment>
      <div className="active-room-header">
        <h2 className="supertext">Current Room</h2>
        <h2>{currentRoom ? currentRoom.name : 'None. Sad.'}</h2>
      </div>
      <RoomQueue />
      <TrackSearch />
    </React.Fragment>
  )
}
