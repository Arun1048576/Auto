import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CommonAPIFormatter from './CommonAPIFormatter'
import apiManifest from '../apiDetails/apiManifest'
import { runTest, runAllTests } from './actions'

class StandaloneAPIContent extends React.Component {
  render () {
    return (
      <CommonAPIFormatter
        type='standalone'
        header='Standalone APIs'
        apiManifest={apiManifest}
        runTest={runTest}
        runAllTests={runAllTests}
        response={this.props.testResponse}
        dispatch={this.props.dispatch}
      />
    )
  }
}

const mapDispatchToProps = (state) => {
  return {
    testResponse: state.testResponse
  }
}
export default withRouter(connect(mapDispatchToProps)(StandaloneAPIContent))
