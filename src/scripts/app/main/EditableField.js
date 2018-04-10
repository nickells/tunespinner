import React from 'react'

export default class EditableField extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isEditing: false,
      value: this.props.initialValue,
    }

    this.onChange = this.onChange.bind(this)
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

  render() {
    return (
      <React.Fragment>
        <h3>{ this.props.label }</h3>
        { this.state.isEditing ?
          (
            <input placeholder={this.props.placeholder} onChange={this.onChange} value={this.state.value} />
          ) : (
            <p>{this.state.value}</p>
          )
        }
        <button onClick={this.toggleEdit}>{ this.state.isEditing ? 'Done' : 'Change'}</button>
      </React.Fragment>
    )
  }
}
