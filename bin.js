#!/usr/bin/env node

var open = require('open')
var path = require('path')
var argv = require('minimist')(process.argv.slice(2))

var hotreloadify = require('./hotreloadify')

var main = argv._[0]

if (main === undefined) {
  console.error('please specify main file')
  process.exit(1)
}

var opts = {
  bundle: argv.bundle || '/bundle.js',
  index: argv.index || path.resolve(__dirname, 'index.html'),
  port: process.env.PORT || argv.port || 3000,
  proxy: argv.proxy
}

hotreloadify(main, opts, function (err, addr) {
  if (err) {
    console.error(err)
  } else if (argv.open) {
    open('http://localhost:' + addr.port)
  }
})
