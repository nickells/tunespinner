import React from 'react'
import {
  makeDJ,
  removeDJ,
  advanceQueue,
  upvoteSong,
  downvoteSong,
  updateRoom,
} from '../../db/room'

import { startDancing } from '../../db/user'

class RoomTools extends React.Component {
  constructor(props) {
    super(props)

    this.becomeDJ = this.becomeDJ.bind(this)
    this.stopDJing = this.stopDJing.bind(this)
    this.skipSong = this.skipSong.bind(this)
    this.upvote = this.upvote.bind(this)
    this.downvote = this.downvote.bind(this)
    this.dance = this.dance.bind(this)
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

  dance() {
    startDancing(this.props.userId)
  }

  render() {
    const { isDJ, isSongOwner, currentDJs } = this.props
    const isOwnerDJ = isDJ && isSongOwner


    const canDJ = (() => {
      if (isDJ) return false
      else if (!currentDJs) return true
      else if (currentDJs.length < 3) return true
      return false
    })()

    const renderTool = (name, callback, isActive) => {
      return (
        <div
          className="tool"
          data-name={name}
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
          {renderTool('START DJING', this.becomeDJ, canDJ)}
          {renderTool('STOP DJING', this.stopDJing, isDJ)}
        </div>
        <div className="group">
          {renderTool('UPVOTE', this.upvote, !isSongOwner)}
          {renderTool('DOWNVOTE', this.downvote, !isSongOwner)}
        </div>
        <div className="group">
          {renderTool('SKIP', this.skipSong, isOwnerDJ)}
          {renderTool('DANCE', this.dance, !!currentDJs)}
        </div>
      </div>
    )
  }
}

export default RoomTools
