// Setup basic express server
var express = require('express');
var app = new express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var redis = require('socket.io-redis');
var Hotel =  Hotel = require('socket.io-hotel');
var port = process.env.PORT || 3000;

io.adapter(redis({ host: 'localhost', port: 6379 }));

var hotel = new Hotel(io.sockets.adapter);

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Chatroom

// usernames which are currently connected to the chat
var usernames = {};
var numUsers = 0;
var webRTC = require('webrtc.io').listen(8001);

io.on('connection', function (socket) {
  var addedUser = false;

  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    // we tell the client to execute 'new message'
      var message = {
          username: socket.username,
          message: data
      };

      hotel.getPropertiesRoom('lobby', function(room){
          var room = room || {};
          var messageLog = room.messageLog || [];
          if(messageLog){
              messageLog.push(message);
              //console.log(room);
              hotel.setPropertyRoom('lobby', 'messageLog', messageLog);
          }
      });

      socket.broadcast.emit('new message', message);
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {

    // we store the username in the socket session for this client
    socket.username = username;

    // add the client's username to the global list
    usernames[username] = username;
    ++numUsers;
    addedUser = true;
    socket.emit('login', {
      numUsers: numUsers
    });

    // echo globally (all clients) that a person has connected
    socket.broadcast.emit('user joined', {
      username: socket.username,
      numUsers: numUsers
    });

    // Show Chat History
    hotel.getPropertiesRoom('lobby', function(room){
      if(room){
          var messageLog = room.messageLog;
          messageLog.forEach(function(element){
              socket.emit('new message', element);
          });
      }
    });

  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', function () {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });

  // when the client emits 'stop typing', we broadcast it to others
  socket.on('stop typing', function () {
    socket.broadcast.emit('stop typing', {
      username: socket.username
    });
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;

      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});
