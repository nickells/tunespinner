import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { increaseClick } from './actions'

const Button = ({ onClick }) => (
  <div className="button" onClick={onClick}>
    Click Me!
  </div>
)

const Main = props => (
  <div>
    <Button
      onClick={props.increaseClick}
    />
    you've clicked { props.clicks } times
  </div>
)

const mapStateToProps = state => ({
  clicks: state.MainReducer.clicks,
})

const mapDispatchToProps = dispatch => bindActionCreators({
  increaseClick,
}, dispatch)

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Main)
