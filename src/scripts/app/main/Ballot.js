import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { upvoteSong, downvoteSong } from '../../db/room'


class Ballot extends React.Component {
  render() {
    return (
      <React.Fragment>
        <button onClick={() => upvoteSong(this.props.userId, this.props.roomId)}>GOOD SONg</button>
        <button onClick={() => downvoteSong(this.props.userId, this.props.roomId)}>bAD song!</button>
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => ({
  userId: state.MainReducer.currentUserId,
  roomId: state.MainReducer.currentRoomId,
})

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Ballot)
