import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { updateUser } from '../../db/user'
import EditableField from './EditableField'

class Profile extends React.Component {
  constructor(props) {
    super(props)
    this.updateEmoji = this.updateEmoji.bind(this)
    this.updateDisplayName = this.updateDisplayName.bind(this)
  }

  updateEmoji(emoji) {
    updateUser(this.props.currentUser.id, { emoji })
  }

  updateDisplayName(name) {
    updateUser(this.props.currentUser.id, { username: name })
  }

  render() {
    return (
      <React.Fragment>
        <div className="active-menu-header">
          <h2>Profile</h2>
        </div>
        <EditableField
          label="Display Name"
          initialValue={this.props.currentUser.username}
          placeholder="DJ Khaled 420"
          onComplete={this.updateDisplayName}
          maxLength={18}
        />
        <EditableField
          label="Avatar"
          initialValue={this.props.currentUser.emoji}
          placeholder="🦁"
          onComplete={this.updateEmoji}
          customEditor="emoji"
        />
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
