var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
var sticky = require('sticky-session');

sticky(require('http').createServer(function(req, res) {
    res.end('Server is running in...');
    require('./index.js');
})).listen(8000, function() {
    console.log('server started on 3000 port');
});


// WEB RTC Code
//https://github.com/cavedweller/webRTC.io

// Demo
// git clone https://github.com/dennismartensson/webrtc.io-demo/

//getAuth
//getMessages
//getUsers
//make roster an event


// THIS IS THE WHOLE THING!!!
//https://github.com/guille/weplay
//https://www.npmjs.org/package/rtmp-download