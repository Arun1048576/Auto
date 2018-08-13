import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import AppContent from './app-content'
import Sidebar from './sidebar'

class App extends React.Component {
  render () {
    return (
      <div className='main'>
        <Sidebar />
        <AppContent />
      </div>
    )
  }
}

const mapStateToProps = (store) => {
  return {
    apiMeta: store.apiMeta
  }
}

export default withRouter(connect(mapStateToProps)(App))