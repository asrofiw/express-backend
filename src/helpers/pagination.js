const qs = require('querystring')
const { APP_URL } = process.env

module.exports = (req, count, id, route, access = 'public') => {
  let { page, limit } = req.query

  if (!limit) {
    limit = 5
  } else {
    limit = parseInt(limit)
  }

  if (!page) {
    page = 1
  } else {
    page = parseInt(page)
  }

  const pageInfo = {
    count: 0,
    pages: 0,
    currentPage: page,
    limitPerPage: limit,
    nextLink: null,
    prevLink: null
  }

  pageInfo.count = count
  pageInfo.pages = Math.ceil(count / limit)

  const { pages, currentPage } = pageInfo

  if (currentPage < pages) {
    pageInfo.nextLink = id ? `${APP_URL}${access}/${route}/${id}?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
      : `${APP_URL}${access}/${route}?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
  }

  if (currentPage > 1) {
    pageInfo.prevLink = id ? `${APP_URL}${access}/${route}/${id}?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
      : `${APP_URL}${access}/${route}?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
  }

  return pageInfo
}
