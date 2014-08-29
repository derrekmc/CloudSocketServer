var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var sticky = require('sticky-session');

sticky(require('http').createServer(function(req, res) {
    res.end('worker: ' + process.env.NODE_WORKER_ID);
    require('./index.js');
})).listen(8000, function() {
    console.log('server started on 3000 port');
});