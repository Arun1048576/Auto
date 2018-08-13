import React from 'react'
import { Route, Switch } from 'react-router-dom'

import StandaloneAPIContent from './standalone-api'
import PaginatedAPIContent from './paginated-api'
import FlowBasedAPIContent from './flowbased-api'

export default class AppContent extends React.Component {
  render () {
    return (
      <div className='app-content'>
        <Switch>
          <Route exact path='/' component={StandaloneAPIContent} />
          <Route exact path='/paginated-api' component={PaginatedAPIContent} />
          <Route exact path='/flow-based-api' component={FlowBasedAPIContent} />
        </Switch>
      </div>
    )
  }
}
