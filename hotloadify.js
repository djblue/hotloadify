var browserify = require('browserify')
var watchify = require('watchify')
var errorify = require('errorify')
var livereactload = require('livereactload')
var http = require('http')
var httpProxy = require('http-proxy')
var fs = require('fs')
var path = require('path')
var devnull = require('dev-null')

module.exports = function (main, opts, cb) {
  var done = cb || function () {}

  var proxy = httpProxy.createProxyServer()

  proxy.on('error', function (e) {
    console.error('http-proxy:', JSON.stringify(e))
  })

  // TODO: figure out how to pass opts options to browserify
  var b = function (entry) {
    return browserify({
      entries: [ entry ],
      plugin: [ livereactload, errorify ],
      debug: true,
      cache: {},
      packageCache: {},
      // If hotloadify is installed globally, browserify can't find
      // livereactload/client. By adding the local node_modules to the
      // paths, we enable browserify to find the client.
      paths: ['./node_modules', path.join(__dirname, 'node_modules')]
    })
  }

  var watcher = watchify(b(main))

  watcher.on('update', function () {
    // rebuild bundle but don't save it anywhere, this is
    // needed so the livereactload will push updates to client
    watcher.bundle().pipe(devnull())
  })

  var server = http.createServer(function (req, res) {
    if (req.url === opts.bundle) {
      watcher.bundle().pipe(res)
    } else if (req.url === '/') {
      fs.createReadStream(opts.index).pipe(res)
    } else if (opts.proxy) {
      proxy.web(req, res, {
        target: opts.proxy,
        secure: false // because it's dev
      })
    } else {
      res.writeHead(404)
      res.end()
    }
  })

  server.listen(opts.port, function () {
    done(null, server.address())
  })
}
