const {createServer} = require('http')
const {join} = require('path')
const {parse} = require('url')
const next = require('next')

const app = next({dev: process.env.NODE_ENV !== 'production'})

module.exports = app.prepare().then(() => {
  return createServer((req, res) => {
    global.HOST = req.headers.host

    res.setHeader('Cache-Control', 'public')

    const parsedUrl = parse(req.url, true)
    const {pathname, query} = parsedUrl

    if (['/favicon.ico'].indexOf(pathname) > -1) {
      // serve static files
      app.serveStatic(req, res, join(__dirname, 'static', pathname))
    } else if (['/signup'].includes(pathname)) {
      // pass pages straight through to next.js
      app.getRequestHandler()(req, res, parsedUrl)
    } else if (/\/\d{4}\/\d{2}\/.+/.test(pathname)) {
      // regular post urls
      // this should match wordpress's permalink setting
      // e.g., /year/month/slug
      app.render(req, res, '/post', query)
    } else if (pathname === '/' && query.p) {
      // when previewing an unsaved draft post
      app.render(req, res, '/post', query)
    } else if (pathname && pathname !== '/') {
      // regular page urls
      app.render(req, res, '/page', query)
    } else {
      app.getRequestHandler()(req, res, parsedUrl)
    }
  })
})
