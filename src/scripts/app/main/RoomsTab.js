import React from 'react'
import RoomCreator from './RoomCreator'
import RoomList from './RoomList'

const VIEWS = {
  list: 'list',
  creator: 'creator',
}

class RoomTabs extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      view: VIEWS.list,
    }
  }

  renderViewChangeButton(view, text) {
    return (
      <button
        className="change-view"
        onClick={() => this.setState({ view })}
      >
        {text}
      </button>
    )
  }

  render() {
    const { view } = this.state

    const creatorView = (
      <React.Fragment>
        <div className="active-room-header">
          <h2>Create a New Room</h2>
        </div>
        {this.renderViewChangeButton(VIEWS.list, '< BACK')}
        <RoomCreator />
      </React.Fragment>
    )

    const listView = (
      <React.Fragment>
        <div className="active-room-header">
          <h2>Browse all rooms</h2>
        </div>
        {this.renderViewChangeButton(VIEWS.creator, '+ CREATE NEW')}
        <RoomList />
      </React.Fragment>
    )

    return (
      <React.Fragment>
        {view === 'creator' && creatorView}
        {view === 'list' && listView}
      </React.Fragment>
    )
  }
}

module.exports = RoomTabs
