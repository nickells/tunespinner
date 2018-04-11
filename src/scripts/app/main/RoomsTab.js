import React from 'react'
import RoomCreator from './RoomCreator'
import RoomList from './RoomList'

export default () => {
  return (
    <React.Fragment>
      <RoomList />
      <RoomCreator />
    </React.Fragment>
  )
}
