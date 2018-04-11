import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Picker } from 'emoji-mart'
import { updateUser } from '../../db/user'
import EditableField from './EditableField'

const emojiPickerStyleOverrides = {
  width: 350,
  borderRadius: 0,
}

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.updateEmoji = this.updateEmoji.bind(this)
    this.updateDisplayName = this.updateDisplayName.bind(this)
  }

  updateEmoji(emoji) {
    updateUser(this.props.currentUser.id, { emoji: emoji.native })
  }

  updateDisplayName(name) {
    updateUser(this.props.currentUser.id, { username: name })
  }


  render() {
    return (
      <React.Fragment>
        <EditableField
          label="Display Name"
          initialValue={this.props.currentUser.username}
          placeholder="your name of choice"
          onComplete={this.updateDisplayName}
        />
        <h3>Avatar</h3>
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
