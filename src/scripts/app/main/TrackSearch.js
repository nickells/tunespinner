import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  searchForSongs,
  playSong,
} from '../actions/spotifyAPI'
import { addSongToRoomQueue, addSongToRoomRequests } from '../../db/room'
import SongListItem from './SongListItem'


class TrackSearch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: '',
    }

    this.searchForSong = this.searchForSong.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.renderSearchResult = this.renderSearchResult.bind(this)
  }

  isDJ() {
    if (!this.props.room) return
    const djs = this.props.room.djs || []
    return djs.indexOf(this.props.currentUserId) > -1
  }

  searchForSong(e) {
    e.preventDefault()
    this.props.searchForSongs(this.state.query)
  }

  handleChange(e) {
    this.setState({ query: e.target.value })
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

  renderSearchResult(song) {
    return (
      <div key={song.id} style={{ borderBottom: '1px solid grey' }} onClick={() => this.handleSongClick(song)}>
        <SongListItem song={song} />
      </div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.searchForSong}>
          <h3>get a track</h3>
          <input type="text" placeholder="Search" onChange={this.handleChange} />
        </form>
        {
          this.props.searchResults ? this.props.searchResults.map(this.renderSearchResult) : null
        }
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
