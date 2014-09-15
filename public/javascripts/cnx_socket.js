var socket = io.connect('http://localhost:3000');
var socket_id;
socket.on('ack', function (socket) {
    // socket_id=socket;
    // socket.emit('socket_id',socket_id);
    alert('Server OK socket_id :' + socket);
});


/**
 * Created by epa on 12/09/14.
 */
