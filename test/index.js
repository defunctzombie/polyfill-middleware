var http = require('http');
var express = require('express');
var supertest = require('supertest');
var assert = require('assert');

var polyfill = require('../');

var app = express();
app.get('/polyfill.js', polyfill());

var request = supertest(app);

test('listen', function(done) {
    app.listen(done);
});

test('empty polyfill', function(done) {
    request
    .get('/polyfill.js')
    .expect('Content-Type', 'application/javascript')
    .expect(200)
    .end(function(err, res) {
        assert.ifError(err);
        assert.equal(res.text, ';');

        new Function(res.text); // valid syntax check
        done();
    });
});

test('basic polyfill', function(done) {
    var ua = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/32.0.1700.107 Safari/537.36';

    request
    .get('/polyfill.js')
    .set('User-Agent', ua)
    .expect('Content-Type', 'application/javascript')
    .expect(200)
    .end(function(err, res) {
        assert.ifError(err);
        assert(res.text.length > 10);

        new Function(res.text);
        done();
    });
});

