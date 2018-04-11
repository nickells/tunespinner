import React from 'react'

const getTime = (ms) => {
  const sec = Math.round(ms / 1000)
  const min = Math.floor(sec / 60)
  const moduloSeconds = (sec => sec % 60)
  const addZero = num => (num < 10 ? `${0}${num}` : `${num}`)
  return `${min}:${addZero(moduloSeconds(sec))}`
}

const SongListIem = ({ song }) => {
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
        contributors && (
          <div className="row">
            added by {contributors.join(', ')}
          </div>
        )
    }
    </div>
  )
}

export default SongListIem
