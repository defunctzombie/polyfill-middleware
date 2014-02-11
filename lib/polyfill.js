var fs = require('fs');
var path = require('path');
var after = require('after');
var semver = require('semver');

var debug = require('debug')('polyfill-middleware:polyfill');

// map of browser name (identified by user agent loop) -> fill details
var k_agent_fills = require('polyfill/agent.js.json');

// where the polyfill files live
var k_polyfill_base = __dirname + '/../node_modules/polyfill/source';

function generate(agent) {
    var version = agent.toVersion();

    var fills = k_agent_fills[agent.family];
    if (!fills) {
        return [];
    }

    // build up array of fills to use
    var use = [];
    fills.forEach(function(fill) {
        if (!fill.fill) {
            return;
        }

        // no version requirements, always use
        if (!fill.only && !fill.min && !fill.max) {
            use.push.apply(use, fill.fill.split(' '));
            return;
        }

        var start = fill.only || fill.min;
        var end = fill.only || fill.max;

        if (start && semver.lt(version, start)) {
            return;
        }
        else if (end && semver.gt(version, end)) {
            return;
        }

        use.push.apply(use, fill.fill.split(' '));
    });

    debug('using: %s', use);
    return use;
};

// load the polyfill files specified by _polyfills_ array
// from the polyfill source dir
function load(polyfills, cb) {
    var src = ['(function() {\n'];

    var done = after(polyfills.length, function(err) {
        if (err) {
            return cb(err);
        }

        src.push('})()');
        cb(null, src.join(''));
    });

    // now read the fill files
    polyfills.forEach(function(filename) {
        filename = path.join(k_polyfill_base, filename) + '.js';
        fs.readFile(filename, 'utf-8', function(err, content) {
            if (err) {
                return done(err);
            }

            src.push(content);
            done();
        });
    });
};

module.exports.generate = generate;
module.exports.load = load;
