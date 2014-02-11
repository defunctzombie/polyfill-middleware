var ua = require('useragent');
var debug = require('debug')('polyfill-middleware');

var polyfill = require('./lib/polyfill');

module.exports = function(opt) {
    return function polyfill_middleware(req, res, next) {
        var ua_string = req.headers['user-agent'];
        debug('user-agent: %s', ua_string);

        var agent = ua.lookup(ua_string);
        debug('agent: %j', agent);

        var fills = polyfill.generate(agent);
        if (fills.length === 0) {
            return render(null, ';');
        }

        polyfill.load(fills, render);

        function render(err, src) {
            if (err) {
                return next(err);
            }

            // TODO etag, cache, cache in memory?

            res.statusCode = 200;
            res.setHeader('Cache-Control', 'public');
            res.setHeader('Content-Type', 'application/javascript');
            res.end(src);
        };
    };
};
