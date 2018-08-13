import React from 'react'
import { NavLink } from 'react-router-dom'

export default class Sidebar extends React.Component {
  render () {
    return (
      <div className='sidebar'>
        <div className='app-header'>MX API Checker</div>
        <div className='section-header'>
          <NavLink to="/" activeClassName="active-sidebar" exact>
            <div className='section-item'>Standalone APIs</div>
          </NavLink>
          <NavLink to="/paginated-api" activeClassName="active-sidebar" exact>
            <div className='section-item'>Paginated APIs</div>
          </NavLink>
          <NavLink to="/flow-based-api" activeClassName="active-sidebar" exact>
            <div className='section-item'>Flow Based APIs</div>
          </NavLink>            
        </div>
      </div>
    )
  }
}