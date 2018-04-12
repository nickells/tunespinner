import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'
import { advanceQueue, removeDJ, updateRoom } from '../../db/room'
import RoomTools from './RoomTools'

class Room extends React.Component {
  constructor(props) {
    super(props)

    this.firstUpdate = true

    this.state = {
      songPosition: 0,
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', () => {
      if (this.isDJ()) {
        removeDJ(this.props.currentUserId, this.props.currentRoomId)
      }
    })
  }

  componentDidUpdate(prevProps) {
    if (!this.props.room) return

    const room = this.props.room || {}
    const prevRoom = prevProps.room || {}
    const currentSong = room.currentSong || {}
    const prevSong = prevRoom.currentSong || {}
    const djs = room.djs || []
    const prevDjs = prevRoom.djs || []

    const kingDJChanged = djs[0] !== prevDjs[0]
    const roomChanged = room.id !== prevRoom.id
    const songChanged = currentSong.key !== prevSong.key

    if (roomChanged || songChanged || kingDJChanged || this.firstUpdate) {
      console.log('TRY PLAYING')
      this.firstUpdate = false

      if (roomChanged || songChanged || this.firstUpdate) {
        this.playSong()
      }

      if (this.songTicker) clearInterval(this.songTicker)

      this.songTicker = setInterval(() => {
        this.checkForNextSong(room)
      }, 800)
    }
  }

  playSong() {
    const { currentSong, currentSongStartTime } = this.props.room

    if (!currentSong || !currentSongStartTime) {
      window.spotifyPlayer.pause()
      return
    }

    const now = Date.now()
    const diff = now - currentSongStartTime

    if (diff < currentSong.duration_ms) {
      window.spotifyPlayer.setSongAt(currentSong.uri, diff)
    } else {
      window.spotifyPlayer.pause()
    }
  }

  checkForNextSong() {
    const { room } = this.props
    const { currentSong, currentSongStartTime } = room

    if (!currentSong) {
      if (this.isKingDJ(room)) {
        advanceQueue(room.id)
        clearInterval(this.songTicker)
      }
      return
    }

    const now = Date.now()
    const _diff = now - currentSongStartTime
    let songPosition = _diff

    // currentSong.wasVotedToSkip is true if the song was downvoted by a majority of fans
    if (_diff > currentSong.duration_ms || currentSong.wasVotedToSkip) {
      songPosition = 0
      if (this.isKingDJ(room)) {
        advanceQueue(room.id)
        clearInterval(this.songTicker)
      }

      // If you're king DJ but you've been waiting for over 2s
      // and there ARE djs in the room and it's KING DJ's fault:
      else if (
        room.djs &&
        room.lastKingDJAppointment &&
        now - room.lastKingDJAppointment > 5000 &&
        _diff - currentSong.duration_ms > 5000 &&
        room.queue &&
        room.queue.length > 0
      ) {
        const djs = room.djs.slice()

        // Impeach the king!
        djs.splice(0, 1)
        updateRoom(room.id, { djs })
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

  isDJ() {
    if (!this.props.room || !this.props.currentUserId) return false
    const { room } = this.props
    if (!room.djs || room.djs.length === 0) return false
    return room.djs.indexOf(this.props.currentUserId) > -1
  }

  isSongOwner() {
    if (!this.props.room || !this.props.currentUserId) return false
    const { currentSong } = this.props.room
    if (!currentSong) return false
    if (!currentSong.contributors || currentSong.contributors.length === 0) return false
    return currentSong.contributors.indexOf(this.props.currentUserId) > -1
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
        <div className="room" />
      )
    }

    return (
      <div className="room">
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
        <RoomTools
          isDJ={this.isDJ()}
          isSongOwner={this.isSongOwner()}
          roomId={this.props.currentRoomId}
          userId={this.props.currentUserId}
        />
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
