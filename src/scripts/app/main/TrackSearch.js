import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
  searchForSongs,
  playSong
} from './actions'


class TrackSearch extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      query: ''
    }

    this.searchForSong = this.searchForSong.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.renderSearchResult = this.renderSearchResult.bind(this)
  }

  searchForSong(e){
    e.preventDefault()
    this.props.searchForSongs(this.state.query)
  }

  handleChange(e){
    this.setState({query: e.target.value})
  }

  renderSearchResult(song){
    return (
      <div key={song.id} onClick={() => this.props.playSong(song.uri)} >{song.name}</div>
    )
  }

  render() {
    return (
      <React.Fragment>
        <form onSubmit={this.searchForSong}>
          <h3>get a track</h3>
          <input type="text" placeholder="Search" onChange={this.handleChange}></input> 
        </form>
        {
          this.props.searchResults ? this.props.searchResults.map(this.renderSearchResult) : null
        }
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => ({
  searchResults: state.MainReducer.searchResults
})

const mapDispatchToProps = dispatch => bindActionCreators({
  searchForSongs,
  playSong
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TrackSearch)
