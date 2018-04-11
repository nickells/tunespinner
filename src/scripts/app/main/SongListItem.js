import React from 'react'

const getTime = (ms) => {
  const sec = Math.round(ms / 1000)
  const min = Math.floor(sec / 60)
  const format = num => (num < 10 ? `0${num}` : num)
  return `${format(min)}:${format(sec)}`
}

const SongListIem = ({ song }) => {
  const {
    name, artists, contributors, duration_ms,
  } = song
  return (
    <div className="song-list-item">
      <div className="row bright" />
      { name }
      { getTime(duration_ms) }
      <div className="row">
        { artists.join(', ') }
      </div>
      {
        contributors.length && (
          <div className="row">
            added by {contributors.join(', ')}
          </div>
        )
    }
    </div>
  )
}

export default SongListIem
