import React from 'react'
import { Picker } from 'emoji-mart'

const emojiPickerStyleOverrides = {
  borderRadius: 0,
  width: '338px',
  transformOrigin: 'left',
  transform: 'scale(0.975)',
  marginTop: '10px',
}

export default class EditableField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
      value: this.props.initialValue,
    }

    this.onChange = this.onChange.bind(this)
    this.onChangeEmoji = this.onChangeEmoji.bind(this)
    this.toggleEdit = this.toggleEdit.bind(this)
  }

  toggleEdit() {
    if (this.state.isEditing) this.props.onComplete(this.state.value)
    this.setState({
      isEditing: !this.state.isEditing,
    })
  }

  onChange(e) {
    this.setState({ value: e.target.value })
  }

  onChangeEmoji(emoji) {
    this.setState({ value: emoji.native })
  }

  renderEditor() {
    if (this.props.customEditor === 'emoji') {
      return (
        <React.Fragment>
          <div className="preview">
            <h2>{this.state.value}</h2>
          </div>
          <Picker
            onSelect={this.onChangeEmoji}
            title="Pick your emoji"
            emoji="point_up"
            style={emojiPickerStyleOverrides}
          />
        </React.Fragment>
      )
    }

    return (
      <input
        placeholder={this.props.placeholder}
        onChange={this.onChange}
        value={this.state.value}
        maxLength={this.props.maxLength}
      />
    )
  }

  render() {
    return (
      <div
        className="editable-field"
        data-is-editing={this.state.isEditing}
        data-custom-editor={this.props.customEditor}
      >
        <h2 className="label">{ this.props.label }</h2>
        <div className="field">
          <div className="value">
            { this.state.isEditing ?
              this.renderEditor() : <h2>{this.state.value}</h2>
            }
          </div>
          <button onClick={this.toggleEdit}>{ this.state.isEditing ? 'Save' : 'Edit'}</button>
        </div>
      </div>
    )
  }
}
