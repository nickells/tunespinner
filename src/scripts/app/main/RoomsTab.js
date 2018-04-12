import React from 'react'
import RoomCreator from './RoomCreator'
import RoomList from './RoomList'

// class RoomCreator extends React.Component {
//   constructor(props) {
//     super(props)
//   }
// }


export default () => {
  return (
    <React.Fragment>
      <RoomList />
      <RoomCreator />
    </React.Fragment>
  )
}
