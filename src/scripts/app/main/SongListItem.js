import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { retrieveUserData } from '../actions/app';


const getTime = (ms) => {
  const sec = Math.round(ms / 1000)
  const min = Math.floor(sec / 60)
  const moduloSeconds = (sec => sec % 60)
  const addZero = num => (num < 10 ? `${0}${num}` : `${num}`)
  return `${min}:${addZero(moduloSeconds(sec))}`
}


const SongListIem = ({ song, retrieveUserData, isRequest = false }) => {
  const {
    name, artists, contributors, duration_ms,
  } = song
  return (
    <div className="song-list-item">
      <div className="row bright" >
        <span>{ name }</span>
        <span>{ getTime(duration_ms) }</span>
      </div>
      <div className="row">
        { artists.map(artist => artist.name).join(', ') }
      </div>
      {
        !isRequest && contributors && (
          <div className="row">
            added by {contributors.map(retrieveUserData).map(user => user.username).join(', ')}
          </div>
        )
    }
    </div>
  )
}


const mapDispatchToProps = dispatch => bindActionCreators({
  retrieveUserData,
}, dispatch)

export default connect(
  null,
  mapDispatchToProps,
)(SongListIem)

