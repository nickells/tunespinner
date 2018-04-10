import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Picker } from 'emoji-mart'
import { updateUser } from '../../db/user'

const emojiPickerStyleOverrides = {
  width: 300,
  marginLeft: -10,
  borderRadius: 0,
}

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.updateEmoji = this.updateEmoji.bind(this)
  }

  updateEmoji(emoji) {
    updateUser(this.props.currentUser.id, { emoji: emoji.native })
  }

  render() {
    return (
      <React.Fragment>
        <Picker onSelect={this.updateEmoji} title="Pick your emoji" emoji="point_up" style={emojiPickerStyleOverrides} />
      </React.Fragment>
    )
  }
}


const mapStateToProps = state => ({
  currentUser: state.FirebaseReducer.users[state.MainReducer.currentUserId],
})

const mapDispatchToProps = dispatch => bindActionCreators({

}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Profile)
