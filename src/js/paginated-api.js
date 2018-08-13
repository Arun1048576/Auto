import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import CommonAPIFormatter from './CommonAPIFormatter'
import apiManifest from '../apiDetails/paginatedAPIManifest'
import { runTest, runAllTests } from './paginatedActions'

class StandaloneAPIContent extends React.Component {
  render () {
    return (
      <CommonAPIFormatter
        type='paginated'
        header='Paginated APIs'
        apiManifest={apiManifest}
        runTest={runTest}
        runAllTests={runAllTests}
        response={this.props.paginatedResponse}
        dispatch={this.props.dispatch}
      />
    )
  }
}

const mapDispatchToProps = (state) => {
  return {
    paginatedResponse: state.paginatedResponse
  }
}
export default withRouter(connect(mapDispatchToProps)(StandaloneAPIContent))
