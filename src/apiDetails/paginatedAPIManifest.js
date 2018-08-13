import homeSection from '../apiFormat/homeSection'

var apis = [{
  id: 1,
  displayName: 'Home Sections',
  url: 'https://api.mxplay.com/v1/home/tab/1',
  cookies: "userId=123;platform=com.mxplay.mobile",
  json: homeSection,
  method: 'GET',
  paginationUrl: function (url, prevData, pageNum) {
    return prevData.next ? `${url}?${prevData.next}` : null
  }
}, {
  id: 2,
  displayName: 'Buzz Sections',
  url: 'https://api.mxplay.com/v1/home/tab/3',
  cookies: "userId=123;platform=com.mxplay.mobile",
  json: homeSection,
  method: 'GET',
  paginationUrl: function (url, prevData, pageNum) {
    return prevData.next ? `${url}?${prevData.next}` : null
  }
}]

module.exports = apis