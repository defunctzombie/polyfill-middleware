var express = require('express');
var polyfill = require('../../');

var app = express();

app.use('/poly/fill.js', polyfill());

app.get('/', function(req, res) {
    res.send('<script src="/poly/fill.js"></script>');
});

app.listen(4000);
