# polyfill-middleware [![Build Status](https://travis-ci.org/defunctzombie/polyfill-middleware.png)](https://travis-ci.org/defunctzombie/polyfill-middleware)

http and express middleware serves selective polyfills for javascript based on the requesting user-agent.

## which polyfills?

See the [polyfill](https://github.com/jonathantneal/polyfill) project for details about which polyfills and browsers are supported.

## install

```
npm install polyfill-middleware
```

## use with express

You can use the polyfill middleware with express by specifying which path to serve the dynamically generated js from.

The below examples assumes the following script tag `<script src="/assets/polyfill.js"></script>`

```js
var polyfill = require('polyfill-middleware');

app.use('/assets/polyfill.js', polyfill());

// alternatively you can limit to just `get` requests
app.get('/assets/polyfill.js', polyfill());
```

## use with node.js http server

The middleware function takes 3 arguments (request, response, done). `done` should be a function and will be called if the polyfill middleware encountered an error. If there was no error, polyfill middleware will respond to the request.

```js
var middleware = polyfill();

http.createServer(function(req, res) {
    // .. some logic to determine if the request should be handled by polyfill
    middleware(req, res, function(err) {
    });
});
```

## examples

More examples are available in the `examples` directory.
