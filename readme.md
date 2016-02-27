# hotloadify

A thin wrapper around `livereactload`. It adds on an http server and a
basic `index.html` to bootstrap development with less configuration.

## install

    npm i --save-dev hotloadify

## usage

To start `hotloadify`, do:

    hotloadify [options] main.js

or to also open a browser window, do:

    hotloadify --open main.js

## options

The following are the list of options taken by `hotloadify` and their
respective defaults.

- bundle - specify the bundle path for server (/bundle.js)
- index - specify the file path be served as index.html (__dirname/index.html)
- port - port the server should listen on (3000)
- open - open browser to dev page (false)

## License

MIT
