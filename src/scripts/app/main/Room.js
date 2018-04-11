import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'
import { makeDJ, advanceQueue } from '../../db/room'

class Room extends React.Component {
  constructor(props) {
    super(props)

    this.firstUpdate = true

    this.becomeDJ = this.becomeDJ.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (!this.props.room) return

    const room = this.props.room || {}
    const prevRoom = prevProps.room || {}
    const currentSong = room.currentSong || {}
    const prevSong = prevRoom.currentSong || {}
    const currentDJs = room.djs || []
    const prevDJs = prevRoom.djs || []

    const roomChanged = room.id !== prevRoom.id
    const songChanged = currentSong.key !== prevSong.key
    const kingDJChanged = currentDJs[0] !== prevDJs[0]

    if (roomChanged || songChanged || kingDJChanged || this.firstUpdate) {
      this.firstUpdate = false

      const { currentSongStartTime } = room
      const now = Date.now()
      const diff = now - currentSongStartTime

      window.spotifyPlayer.setSongAt(currentSong.uri, diff)

      if (this.kingDJInterval) clearInterval(this.kingDJInterval)

      if (this.isKingDJ(room)) {
        this.kingDJInterval = setInterval(() => {
          console.log('I AM KING DJ! and I say:')
          this.checkForNextSong(room)
        }, 800)
      }
    }
  }

  async checkForNextSong(room) {
    const { currentSong, currentSongStartTime } = room

    const _diff = Date.now() - currentSongStartTime
    console.log('TIME LEFT:', (currentSong.duration_ms - _diff) / 1000)
    if (_diff > currentSong.duration_ms) {
      console.log('NEXT SONG!', currentSong)
      advanceQueue(room.id)
      clearInterval(this.kingDJInterval)
    }
  }

  componentWillUnmount() {
    if (this.kingDJInterval) clearInterval(this.kingDJInterval)
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

    const { currentSong } = room
    const artists = currentSong.artists.map(a => a.name).join('')

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

          <div className="current-song">
            <h3 className="song-name">{currentSong.name}</h3>
            <h2 className="song-artist">{artists}</h2>
            {/* <div className="song-position">{format(min)}:{format(sec % 60)}</div> */}
          </div>
        </div>
        <div className="fans">
          {this.renderFans(room)}
        </div>
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
