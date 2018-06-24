var server = require('http').createServer();
var io = require('socket.io')(server);
var port = 3000;

var iot_socket_id, user_socket_id;

var onlineDeviceId;

io.on('connection', function(socket){

  /* When has some client connected */
  socket.emit('response', 'This is response from server !');

    /* -- Check if IoT device connected -- */
    socket.on('iot', function(device_id){
      iot_socket_id = socket.id;
      onlineDeviceId = device_id;
      console.log('client connected ID ' + iot_socket_id + ' | type : ' + device_id);

        io.to(user_socket_id).emit('online_device', onlineDeviceId);

    });

    socket.on('dashboard', function(userid){
      user_socket_id = socket.id;
      console.log('client connected ID ' + user_socket_id + ' | type : ' + userid);

        if(iot_socket_id){
          io.to(user_socket_id).emit('online_device', onlineDeviceId);
        }else {
          // Do nothing
        }

    });
    /* -------------------------------- */

    /* -- Check if some disconnected -- */
    socket.on('disconnect', function(){
      var disconnected_id = socket.id;
        if(disconnected_id == iot_socket_id){

          io.to(user_socket_id).emit('offline_device', onlineDeviceId);
          iot_socket_id = "";
          console.log('Device disconnected id : ' + disconnected_id + ' | ' + onlineDeviceId);

        }else {
          // Do something
        }
    });
    /* -------------------------------- */

/* Set active on device */
  socket.on('ON', function(data){
    console.log('status ON');
    io.to(iot_socket_id).emit('led', '1');
  });

  socket.on('OFF', function(data){
    console.log('status OFF');
    io.to(iot_socket_id).emit('led', '0');
  });

});

server.listen(port, function(){
  console.log('socket running on port ' + port);
});
