var socket = io.connect('http://localhost:3000');
socket.on('ack', function (data) {
    console.log('WebSocket Client is connected \n Room is :' + data.sessionid + '\n User is :' + data.user);
});


/**
 * Created by epa on 12/09/14.
 */
