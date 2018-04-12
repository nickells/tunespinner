import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import debounce from 'lodash/debounce'
import {
  searchForSongs,
  playSong,
} from '../actions/spotifyAPI'
import { addSongToRoomQueue, addSongToRoomRequests } from '../../db/room'
import SongListItem from './SongListItem'

function isTrackInQueue(songId, queue) {
  if (!queue) return false
  for (let i = 0; i < queue.length; i++) {
    if (queue[i].id === songId) return true
  }
  return false
}

function isTrackInRequests(songId, requests) {
  if (!requests) return false
  for (let i = 0; i < requests.length; i++) {
    if (requests[i].id === songId) return true
  }
  return false
}


class TrackSearch extends React.Component {
  constructor(props) {
    super(props)

    this.handleChange = this.handleChange.bind(this)
    this.delayedCallback = debounce(this.props.searchForSongs)
    this.renderSearchResult = this.renderSearchResult.bind(this)
  }

  isDJ() {
    if (!this.props.room) return
    const djs = this.props.room.djs || []
    return djs.indexOf(this.props.currentUserId) > -1
  }

  handleChange(e) {
    e.persist()
    e.target.value && this.delayedCallback(e.target.value)
  }

  handleSongClick(_song) {
    const song = Object.assign({}, _song)
    song.contributors = [this.props.currentUserId]

    if (this.isDJ()) {
      addSongToRoomQueue(song, this.props.currentRoomId)
    } else {
      addSongToRoomRequests(song, this.props.currentRoomId)
    }
  }

  renderAddSongButton(song) {
    if (isTrackInQueue(song.id, this.props.room.queue)) {
      return <span className="button-check">✓</span>
    } else if (isTrackInRequests(song.id, this.props.room.requests)) {
      return <span className="button-requested">•</span>
    }
    return <span className="button-plus" onClick={() => this.handleSongClick(song)}>+</span>
  }

  renderSearchResult(song) {
    return (
      <div className="search-item" key={song.id} >
        <div className="song-button">{ this.renderAddSongButton(song) }</div>
        <SongListItem song={song} />
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <input className="search-input" type="text" placeholder="Search for Tracks" onChange={this.handleChange} />
        <div className="search-results">
          {
          this.props.searchResults ? this.props.searchResults.map(this.renderSearchResult) : null
        }
        </div>
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  searchResults: state.SpotifyReducer.searchResults,
  currentRoomId: state.MainReducer.currentRoomId,
  currentUserId: state.MainReducer.currentUserId,
  room: state.FirebaseReducer.rooms[state.MainReducer.currentRoomId],
})

const mapDispatchToProps = dispatch => bindActionCreators({
  searchForSongs,
  playSong,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrackSearch)
