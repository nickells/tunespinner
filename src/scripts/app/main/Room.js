import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'
import { makeDJ, advanceQueue } from '../../db/room'
import Ballot from './Ballot'

class Room extends React.Component {
  constructor(props) {
    super(props)

    this.firstUpdate = true

    this.becomeDJ = this.becomeDJ.bind(this)

    this.state = {
      songPosition: 0,
    }
  }

  componentDidUpdate(prevProps) {
    if (!this.props.room) return

    const room = this.props.room || {}
    const prevRoom = prevProps.room || {}
    const currentSong = room.currentSong || {}
    const prevSong = prevRoom.currentSong || {}

    const roomChanged = room.id !== prevRoom.id
    const songChanged = currentSong.key !== prevSong.key

    if (roomChanged || songChanged || this.firstUpdate) {
      this.firstUpdate = false

      const { currentSongStartTime } = room
      const now = Date.now()
      const diff = now - currentSongStartTime

      if (diff < currentSong.duration_ms) {
        window.spotifyPlayer.setSongAt(currentSong.uri, diff)
      } else {
        window.spotifyPlayer.pause()
      }

      if (this.songTicker) clearInterval(this.songTicker)

      this.songTicker = setInterval(() => {
        this.checkForNextSong(room)
      }, 800)
    }
  }

  checkForNextSong() {
    const { currentSong, currentSongStartTime } = this.props.room

    if (!currentSong) {
      if (this.isKingDJ(this.props.room)) {
        advanceQueue(this.props.room.id)
        clearInterval(this.songTicker)
      }
      return
    }

    const _diff = Date.now() - currentSongStartTime
    let songPosition = _diff

    if (_diff > currentSong.duration_ms) {
      songPosition = 0
      if (this.isKingDJ(this.props.room)) {
        advanceQueue(this.props.room.id)
        clearInterval(this.songTicker)
      }
    }

    this.setState({ songPosition })
  }

  componentWillUnmount() {
    if (this.songTicker) clearInterval(this.songTicker)
  }

  isKingDJ(room) {
    if (!room.djs || room.djs.length === 0) return false
    return this.props.currentUserId === room.djs[0]
  }

  becomeDJ() {
    const { currentRoomId, currentUserId } = this.props
    makeDJ(currentUserId, currentRoomId)
  }

  renderDJs(room = {}) {
    const { djs } = room
    return this.renderUsers(djs, 'DJ ')
  }

  renderFans(room = {}) {
    const { fans } = room
    return this.renderUsers(fans)
  }

  renderUsers(users, title) {
    if (!users || users.length === 0) return null
    return users.map((userId) => {
      const user = this.props.users[userId]
      if (!user) return null
      return (
        <div className="user" key={user.id}>
          <div className="emoji">{user.emoji}</div>
          <div className="info">{title}{user.username}</div>
        </div>
      )
    })
  }

  renderCurrentSong() {
    const { currentSong } = this.props.room

    if (!currentSong) return null

    const artists = currentSong.artists.map(a => a.name).join('')

    const { songPosition } = this.state

    const sec = Math.round(songPosition / 1000)
    const min = Math.floor(sec / 60)
    const format = num => (num < 10 ? `0${num}` : num)

    return (
      <div className="current-song">
        <h3 className="song-name">{currentSong.name}</h3>
        <h2 className="song-artist">{artists}</h2>
        <div className="song-position">{format(min)}:{format(sec % 60)}</div>
      </div>
    )
  }

  render() {
    const room = this.props.rooms[this.props.currentRoomId]

    if (!room) {
      return (
        <div className="room">
          YOU ARE NOT IN A ROOM
          <h1 className="room-name">sad</h1>
        </div>
      )
    }


    return (
      <div className="room">
        <button onClick={this.becomeDJ}>Be a DJ</button>
        <h1 className="room-name">{room.name}</h1>
        <div className="djs-wrapper">
          <div className="djs">
            {this.renderDJs(room)}
            <div className="speaker left" />
            <div className="speaker right" />
          </div>

          {this.renderCurrentSong()}
        </div>
        <div className="fans">
          {this.renderFans(room)}
        </div>
        <Ballot />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUserId: state.MainReducer.currentUserId,
  currentRoomId: state.MainReducer.currentRoomId,
  room: state.FirebaseReducer.rooms[state.MainReducer.currentRoomId],
  rooms: state.FirebaseReducer.rooms,
  users: state.FirebaseReducer.users,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentRoom,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Room)
