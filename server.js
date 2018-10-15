// require rethinkdb
var r = require("rethinkdb");

// Setup basic express server
var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;





server.listen(port, () => {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(path.join(__dirname, 'public')));

// Chatroom

var numUsers = 0;

// rethinkdb
r.connect({ host: 'localhost', port: 28015 }, function(err, conn) {
  if(err) throw err;



io.on('connection', (socket) => {
  var addedUser = false;
console.log("connection")



////////////////////////////////////////////////////////////////////////////////////////////
r.table('markers').run(conn, function(err, cursor) {
    if (err) throw err;
    cursor.toArray(function(err, result) {
        if (err) throw err;
      //  console.log(JSON.stringify(result, null, 2));
        var allMarkers = result

        for(var i = 0; i < result.length; i++) {
    var marker = result[i];

    console.log(JSON.stringify(marker));

  socket.emit('populate', marker);
}
    });
});




  // when the client emits 'add user', this listens and executes
  socket.on('add user', (username) => {

    if (addedUser) return;

    // we store the username in the socket session for this client
    socket.username = username;
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
      console.log(username + ' joined')
  });

  // when the client emits 'typing', we broadcast it to others
  socket.on('typing', () => {
    socket.broadcast.emit('typing', {
      username: socket.username
    });
  });



  // when the user disconnects.. perform this
  socket.on('disconnect', () => {
    if (addedUser) {
      --numUsers;



      // echo globally that this client has left
      socket.broadcast.emit('user left', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




    // user add
    socket.on('user addition', (userAdd) => {
         console.log(socket.username + ': server: user add');
      // Then passes the map click json data to rethinkdb >>
      r.table('markers').insert(userAdd).run(conn, function(err, res)
      {
        if(err) throw err;
      });
    });

    // db
     r.table('markers')
     .changes()
     .run(conn)
     .then(cursor => {
       cursor.each((err, data) => {

         const dbAdd = data.new_val;
         const dbEdit = data.new_val;
         const dbRemove = data.old_val;
         // db add
         if (dbRemove !== null && dbAdd == null ) {
           socket.broadcast.emit('database removal', dbRemove);
           //   console.log('database removed ' + dbRemove.name);
         }
         // db edit
         if (dbRemove !== null && dbAdd !== null ) {
           socket.broadcast.emit('database edit', dbEdit);
           //   console.log('database removed ' + dbRemove.name);
         }

         // db remove
         if (dbAdd !== null && dbRemove == null)  {
           socket.broadcast.emit('database addition', dbAdd);
           //   console.log('database added, server side');
         }
       });
     });

    //rethinkdb
    });

// socket.io
});

console.log( server.address().address );
