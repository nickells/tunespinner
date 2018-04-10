import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setCurrentRoom } from '../actions/app'
import { getUser } from '../../db/user'

class Room extends React.Component {
  renderDJs() {
    if (!this.props.room) return null
    const { djs } = this.props.room
    if (!djs) return null
    return djs.map(user => <div className="user" key={user}>{user}</div>)
  }

  renderFans() {
    if (!this.props.room) return null
    const { fans } = this.props.room
    if (!fans) return null
    return fans.map(user => <div className="user" key={user}>{user}</div>)
  }

  render() {
    if (!this.props.room) {
      return (
        <div>
        YOU ARE NOT IN A ROOM
          <h1>sad</h1>
        </div>
      )
    }

    return (
      <div>
        YOU ARE IN A ROOM
        <h1>{this.props.room.name}</h1>
        <div className="djs">
          <h3>DJS:</h3>
          {this.renderDJs()}
        </div>
        <div className="fans">
          <h3>FANS:</h3>
          {this.renderFans()}
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  currentUser: state.MainReducer.currentUser,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  setCurrentRoom,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Room)
