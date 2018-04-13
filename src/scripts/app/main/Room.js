import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom, setAccessToken } from '../actions/app'
import { advanceQueue, removeDJ, updateRoom, removeUserFromRoom, addUserToRoom } from '../../db/room'
import RoomTools from './RoomTools'

class Room extends React.Component {
  constructor(props) {
    super(props)

    this.firstUpdate = true
    this.addSpeaker = this.addSpeaker.bind(this)

    this.state = {
      songPosition: 0,
    }
  }

  componentDidMount() {
    window.addEventListener('beforeunload', () => {
      removeUserFromRoom(this.props.currentUserId, this.props.currentRoomId)
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

    if (this.firstUpdate) {
      addUserToRoom(this.props.currentUserId, room.id)
    }

    const now = Date.now()
    const shouldBumpSpeakersUp = !!room.lastUpvote && ((now - room.lastUpvote) < 1000)
    const shouldBumpSpeakersDown = !!room.lastDownvote && ((now - room.lastDownvote) < 1000)
    this.bumpSpeakers('up', shouldBumpSpeakersUp)
    this.bumpSpeakers('down', shouldBumpSpeakersDown)

    if (roomChanged || songChanged || kingDJChanged || this.firstUpdate) {
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

  addSpeaker(ref) {
    this.speakers = this.speakers || []
    this.speakers.push(ref)
  }

  bumpSpeakers(type = 'up', active) {
    const method = active ? 'add' : 'remove'
    this.speakers.forEach((speaker) => {
      const className = `bump-${type}`
      speaker.classList[method](className)
    })
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
      songPosition = currentSong.duration_ms
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
    let djs = room.djs || []
    djs = djs.slice()
    while (djs.length < 3) {
      djs.push('empty')
    }
    return this.renderUsers(djs, 'DJ ')
  }

  renderFans(room = {}) {
    const { fans } = room
    return this.renderUsers(fans)
  }

  renderUsers(users, title) {
    if (!users || users.length === 0) return null
    return users.map((userId) => {
      const EMPTY_DJ = {
        id: Math.floor(Math.random() * 999),
        emoji: '🕳',
      }

      const user = userId === 'empty' ? EMPTY_DJ : this.props.users[userId]
      if (!user) return null
      const isDancing = user.lastDanceAt && (user.lastDanceAt + 1000 > Date.now())
      return (
        <div className="user" key={user.id}>
          <div className={`emoji ${isDancing ? 'is-dancing' : ''}`}>{user.emoji}</div>
          <div className="info">
            <div className="username">
              {userId === 'empty' ? '' : title}{user.username}
            </div>
          </div>
          <div className="score">{user.score}</div>
        </div>
      )
    })
  }

  renderCurrentSong() {
    const { currentSong } = this.props.room

    if (!currentSong) return null

    const artists = currentSong.artists.map(a => a.name).join(', ')

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
            <div ref={this.addSpeaker} className="speaker left" />
            <div ref={this.addSpeaker} className="speaker right" />
          </div>

          {this.renderCurrentSong()}
        </div>
        <div className="fans">
          {this.renderFans(room)}
        </div>
        <RoomTools
          isDJ={this.isDJ()}
          currentDJs={this.props.room.djs}
          isSongOwner={this.isSongOwner()}
          roomId={this.props.currentRoomId}
          userId={this.props.currentUserId}
          onUpvote={() => this.bumpSpeakers('up')}
          onDownvote={() => this.bumpSpeakers('down')}
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
