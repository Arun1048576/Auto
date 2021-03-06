import _ from 'underscore'
import axios from 'axios'
import apiMeta from '../apiDetails/apiManifest'
import testJSONStructure from './testJSONStructure'

export function runAllTests (dispatch, payload) {
  for (let i = 0; i < apiMeta.length; i++) {
    makeAPICall(apiMeta[i], dispatch)
  }
}

export function runTest (dispatch, payload) {
  const selectedAPI = _.findWhere(apiMeta, { id: payload.id })
  if (selectedAPI) {
    makeAPICall(selectedAPI, dispatch)
  }
}

function makeAPICall(selectedAPI, dispatch) {
  return axios({
    url: selectedAPI.url,
    method: selectedAPI.method,
    params: selectedAPI.params,
    headers: {
      Cookie: selectedAPI.cookies
    },
    withCredentials: true
  }).then((result) => {
    const status = result.status
    const data = result.data

    testJSONStructure(selectedAPI.json, data)
      .then(({finalResult, errorResult}) => {
        dispatch({
          type: 'TESTS_RUN',
          payload: {
            id: selectedAPI.id,
            result: {
              finalResult, errorResult, status
            }
          }
        })
      })
  }).catch((err) => {
    const status = err.status
    dispatch({
      type: 'TESTS_RUN',
      payload: {
        id: selectedAPI.id,
        result: {
          status
        }
      }
    })
  })  
}
