import React from 'react'
import RoomQueue from './RoomQueue'
import TrackSearch from './TrackSearch'


export default class QueueTab extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeView: 'QUEUE',
    }

    this.setQueueView = this.setQueueView.bind(this)
    this.setSearchView = this.setSearchView.bind(this)
  }

  setSearchView() {
    this.setState({
      activeView: 'SEARCH',
    })
  }

  setQueueView() {
    this.setState({
      activeView: 'QUEUE',
    })
  }

  renderQueueView() {
    return (
      <div className="queue-view">
        <button className="add-song" onClick={this.setSearchView}>+ ADD</button>
        <RoomQueue />
      </div>
    )
  }

  renderSearchView() {
    return (
      <div className="search-view">
        <button className="back-to-queue" onClick={this.setQueueView}>BACK</button>
        <TrackSearch />
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="active-menu-header">
          <h2 className="supertext">Current Room</h2>
          <h2>{this.props.currentRoom ? this.props.currentRoom.name : 'None. Sad.'}</h2>
        </div>
        { this.state.activeView === 'QUEUE' ?
          this.renderQueueView() :
          this.renderSearchView()
        }
      </React.Fragment>
    )
  }
}
