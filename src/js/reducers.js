export default {
  TESTS_RUN (state, payload) {
    const newState = Object.assign({}, state)
    newState.testResponse = Object.assign({}, newState.testResponse)
    newState.testResponse[payload.id] = payload.result
    return newState
  },
  TESTS_RUN_PAGINATED (state, payload) {
    const newState = Object.assign({}, state)
    newState.paginatedResponse = Object.assign({}, newState.paginatedResponse)
    newState.paginatedResponse[payload.id] = Object.assign({}, newState.paginatedResponse[payload.id])

    newState.paginatedResponse[payload.id][payload.pageNum] = {
      url: payload.url,
      result: payload.result
    }
    return newState    
  }
}