import _ from 'underscore'
import axios from 'axios'
import apiMeta from '../apiDetails/paginatedAPIManifest'
import testJSONStructure from './testJSONStructure'

export function runAllTests (dispatch, payload) {
  for (let i = 0; i < apiMeta.length; i++) {
    makeAPICall(apiMeta[i], dispatch, 0)
  }
}

export function runTest (dispatch, payload) {
  const selectedAPI = _.findWhere(apiMeta, { id: payload.id })
  if (selectedAPI) {
    makeAPICall(selectedAPI, dispatch, 0)
  }
}

function makeAPICall(selectedAPI, dispatch, pageNum) {
  return axios({
    url: (selectedAPI.nextURL || selectedAPI.url),
    method: selectedAPI.method,
    params: selectedAPI.params,
    headers: {
      Cookie: selectedAPI.cookies
    },
    withCredentials: true
  }).then((result) => {
    const status = result.status
    const data = result.data
    console.log("Data for page", pageNum, data)

    testJSONStructure(selectedAPI.json, data)
      .then(({finalResult, errorResult}) => {
        dispatch({
          type: 'TESTS_RUN_PAGINATED',
          payload: {
            id: selectedAPI.id,
            url: (selectedAPI.nextURL || selectedAPI.url),
            pageNum: pageNum,
            result: {
              finalResult, errorResult, status
            }
          }
        })
      })


    const nextURL = selectedAPI.paginationUrl(selectedAPI.url, data, pageNum + 1)
    if (!nextURL) { return }

    const newParams = Object.assign({}, selectedAPI, { nextURL: nextURL })
    makeAPICall(newParams, dispatch, pageNum + 1)
  }).catch((err) => {
    const status = err.status
    dispatch({
      type: 'TESTS_RUN_PAGINATED',
      payload: {
        id: selectedAPI.id,
        url: (selectedAPI.nextURL || selectedAPI.url),
        pageNum: pageNum,
        result: {
          status
        }
      }
    })
  })  
}
