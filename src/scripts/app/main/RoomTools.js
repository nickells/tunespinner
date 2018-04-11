import React from 'react'
import {
  makeDJ,
  removeDJ,
  advanceQueue,
  upvoteSong,
  downvoteSong,
} from '../../db/room'


class RoomTools extends React.Component {
  constructor(props) {
    super(props)

    this.becomeDJ = this.becomeDJ.bind(this)
    this.stopDJing = this.stopDJing.bind(this)
    this.skipSong = this.skipSong.bind(this)
    this.upvote = this.upvote.bind(this)
    this.downvote = this.downvote.bind(this)
  }

  becomeDJ() {
    const { roomId, userId } = this.props
    makeDJ(userId, roomId)
  }

  stopDJing() {
    const { roomId, userId } = this.props
    removeDJ(userId, roomId)
  }

  skipSong() {
    advanceQueue(this.props.roomId)
  }

  upvote() {
    upvoteSong(this.props.userId, this.props.roomId)
  }

  downvote() {
    downvoteSong(this.props.userId, this.props.roomId)
  }

  render() {
    const { isDJ, isSongOwner } = this.props
    const isOwnerDJ = isDJ && isSongOwner

    const renderTool = (name, callback, isActive) => {
      return (
        <div
          className="tool"
          data-is-active={isActive}
          onClick={isActive ? callback : null}
        >
          {name}
        </div>
      )
    }

    return (
      <div className="tools">
        <div className="group">
          {renderTool('START DJING', this.becomeDJ, !isDJ)}
          {renderTool('STOP DJING', this.stopDJing, isDJ)}
        </div>
        <div className="group">
          {renderTool('UPVOTE', this.upvote, !isSongOwner)}
          {renderTool('DOWNVOTE', this.downvote, !isSongOwner)}
        </div>
        <div className="group">
          {renderTool('SKIP', this.skipSong, isOwnerDJ)}
        </div>
      </div>
    )
  }
}

export default RoomTools
