import React from 'react'

export default class CommonAPIFormatter extends React.Component {
  constructor (props) {
    super(props)
    this.runAllTests = this.runAllTests.bind(this)
  }
  runAllTests () {
    this.props.runAllTests(this.props.dispatch)
  }
  render () {
    const apiContent = this.props.apiManifest.map((api) => {
      const response = this.props.response && this.props.response[api.id]
      return (
        <APIItem 
          api={api}
          dispatch={this.props.dispatch}
          response={response}
          runTest={this.props.runTest}
          type={this.props.type} />
      )
    })

    return (
      <div className='standalone-api section-content'>
        <div className='content-header'>{this.props.header}</div>
        <div className='content-main'>
          <div className='api-header'>
            <div className='api-name api-attr-header inline'>Name</div>
            <div className='api-method api-attr-header small inline'>Method</div>
            <div className='api-url api-attr-header inline'>URL</div>
            <div className='api-run-test api-attr-header inline'>
              <button className='api-run-all' onClick={this.runAllTests}>Run All Tests</button>
            </div>
            <div className='api-params api-attr-header small inline'>Test Result</div>
          </div>
          {apiContent}
        </div>
      </div>
    )
  }
}


class APIItem extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true
    }
    this.toggleItem = this.toggleItem.bind(this)
    this.runTest = this.runTest.bind(this)
  }
  toggleItem () {
    this.setState({ open: !this.state.open })
  }
  runTest (e) {
    e.stopPropagation()
    this.setState({ open: true })
    this.props.runTest(this.props.dispatch, { id: this.props.api.id })
  }
  render () {
    const { api } = this.props

    return (
      <div className={`api-item ${this.state.open ? 'open': ''}`}>
        <div className='api-item-header' onClick={this.toggleItem}>
          <div className='api-name api-attr inline'>{api.displayName}</div>
          <div className='api-method api-attr small inline'>{api.method}</div>
          <div className='api-url api-attr inline'>{api.url}</div>
          <div className='api-run-test api-attr-header inline'>
            <button className='api-run' onClick={this.runTest}>Run Test</button>
          </div>
          { this.props.type === 'standalone' && 
            this.props.response && 
            <div className={`api-test-result api-attr-header small inline ${this.props.response.errorResult.length ? 'error-item' : ''}`}>
              {this.props.response.errorResult.length ? 'Errors Present !' : 'All Okay !'}
            </div>
          }
          <div className='open-item' />
        </div>

        <div className='api-item-content'>
          <div className='api-details'>
            <div className='api-detail-item inline'>
              <div className='api-detail-header inline'>Name: </div>
              <div className='api-detail-value inline'>{api.displayName}</div>
            </div>
            <div className='api-detail-item inline'>
              <div className='api-detail-header inline'>Method: </div>
              <div className='api-detail-value inline'>{api.method}</div>
            </div>
            <div className='api-detail-item inline'>
              <div className='api-detail-header inline'>Params: </div>
              <div className='api-detail-value inline'>{api.params || '{ }'}</div>
            </div>
            <div className='api-detail-item inline'>
              <div className='api-detail-header inline'>URL: </div>
              <div className='api-detail-value inline'>{api.url}</div>
            </div>
            <div className='api-detail-item inline'>
              <div className='api-detail-header inline'>Cookies: </div>
              <div className='api-detail-value inline'>{api.cookies}</div>
            </div>
            <div className='api-detail-item inline'>
              <div className='api-detail-header inline'>Status Code: </div>
              <div className='api-detail-value inline'>{(this.props.response && this.props.response.status) || 'API not called yet'}</div>
            </div>
          </div>

          <div className='api-test-results'>
            {this.props.type === 'standalone' && this.props.response && 
              <Reporter response={this.props.response} />
            }
            {this.props.type === 'paginated' && this.props.response &&
              <Paginator data={this.props.response} />
            }
          </div>
        </div>
      </div>
    )
  }
}

class Paginator extends React.Component {
  render () {
    let pages = []
    for (var key in this.props.data) {
      pages.push(
        <Page data={this.props.data[key]} pageNum={key} />
      )
    }
    return (
      <div className='paginator'>
        <div className='paginator-header'>
          <span className='page-num page-attr inline'>Page No</span>
          <span className='page-url page-attr inline'>URL</span>
          <span className='page-status page-attr inline'>Test Result</span>
        </div>
        <div className='paginator-content'>{pages}</div>
      </div>
    )
  }
}

class Page extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false
    }
    this.toggle = this.toggle.bind(this)
  }
  toggle () {
    this.setState({ open: !this.state.open })
  }
  render () {
    const { data, pageNum } = this.props
    const hasError = (data.result.errorResult && data.result.errorResult.length)
    const result = hasError ? `${data.result.errorResult.length} Errors Present !` : 'All Okay !'
    const resultClass = hasError ? 'page-attr-error' : ''

    return (
      <div className={`page ${this.state.open ? 'open' : ''}`}>
        <div className='page-header' onClick={this.toggle}>
          <span className='page-num page-attr inline'>Page {pageNum}</span>
          <span className='page-url page-attr inline'>{data.url}</span>
          <span className={`page-status page-attr inline ${resultClass}`}>{result}</span>
          <div className='open-item' />
        </div>
        {this.state.open &&
          <div className='page-content'>
            <Reporter response={data.result} />
          </div>
        }
      </div>
    )
  }
}

class Reporter extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      type: 'final'
    }
    this.gotoFinal = this.gotoFinal.bind(this)
    this.gotoError = this.gotoError.bind(this)
  }
  gotoError () {
    this.setState({ type: 'error' })
  }
  gotoFinal () {
    this.setState({ type: 'final' })
  }
  render () {
    return (
      <div className='final-results inline-top'>
        <div className={`final-report inline ${this.state.type === 'final' ? 'active': ''}`} onClick={this.gotoFinal}>
          Detailed Report
        </div>
        <div className={`final-report inline ${this.state.type === 'error' ? 'active': ''}`}  onClick={this.gotoError}>
          Error Report
        </div>
        { this.state.type === 'final' && this.props.response.finalResult &&
          <JSONATER data={this.props.response.finalResult} />
        }
        { this.state.type === 'error' && this.props.response.errorResult &&
          <ErrorReport data={this.props.response.errorResult} />
        }
      </div>
    )
  }
}


class JSONATER extends React.Component {
  render () {
    let content = []
    for (var key in this.props.data) {
      content.push(
        <JSONATERITEM data={this.props.data[key]} objKey={key} />
      )
    }
    return (
      <div className='jsonater'>
        {content}
      </div>
    )
  }
}

class JSONATERITEM extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true
    }
    this.toggle = this.toggle.bind(this)
  }
  toggle () {
    this.setState({ open: !this.state.open })
  }
  render () {
    const { data } = this.props
    const isArray = Array.isArray(data.value)
    const isObject = !isArray && typeof data.value === 'object'
    return (
      <div className={`jsonater-item ${this.state.open ? 'open': ''}`}>
        { (isObject || isArray) && <span className='jsonater-triangle inline' /> }
        <div className='jsonater-key inline' onClick={this.toggle}>
          <span className='jsonater-key-value'>{this.props.objKey}: </span>
          {data.found &&
            <span className='jsonater-attr'>Key Found</span>
          }
          {!data.found &&
            <span className='jsonater-attr error'>Key Not Found</span>
          }
          {data.typeMatched &&
            <span className='jsonater-attr'>Type Matched</span>
          }
          {!data.typeMatched &&
            <span className='jsonater-attr error'>Type Not Matched</span>
          }
        </div>
        <div className={`jsonater-value ${this.state.open ? '' : 'hidden'}`}>
          { isArray &&
            data.value.map((item, i) => {
              return (
                <JSONATERARRAY data={item} index={i} />
              )
            })
          }
          { isObject &&
            <div className='jsonater-value'>
              <JSONATER data={data.value} />
            </div>
          }
        </div>
      </div>
    )
  }
}

class JSONATERARRAY extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      open: true
    }
    this.toggle = this.toggle.bind(this)
  }
  toggle () {
    this.setState({ open: !this.state.open })
  }
  render () {
    const { data, index } = this.props
    return (
      <div className={`jsonater-item inline-top ${this.state.open ? 'open': ''}`}>
        <span className='jsonater-triangle inline' />
        <div className='jsonater-key inline' onClick={this.toggle}>
          <span className='jsonater-key-value'>{index}:</span>
        </div>
        <div className={`jsonater-value ${this.state.open ? '' : 'hidden'}`}>
          <JSONATER data={data} />
        </div>
      </div>
    )
  }
}


class ErrorReport extends React.Component {
  render () {
    const errors = this.props.data && this.props.data.map((error, i) => {
      const path = error.path && error.path.map((pathItem) => {
        return (
          <span className='error-path-item inline'>{pathItem}</span>
        )
      })
      return (
        <div className='error inline-top'>
          <div className='error-index inline-top'>{i+1}</div>
          <div className='error-attr inline-top'>
            <div className='error-property'>
              <span className='error-header inline-top'>Message: </span>
              <span className='error-value inline-top'>{error.message}</span>
            </div>
            <div className='error-property'>
              <span className='error-header inline-top'>Path: </span>
              <span className='error-value inline-top'>{path}</span>
            </div>
          </div>
        </div>
      )
    })
    return (
      <div className='error-report'>
        {errors}
        {!errors.length && 
          <div className='no-error'>  
            No Errors !!!
          </div>
        }
      </div>
    )
  }
}