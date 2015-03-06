/**
 * Created by epa on 12/09/14.
 */


/**
 *
 */
socket.on('user', function (message) {
    //alert(' WS user event \n Room is :' + message.room + '\n' + message.comment);
    console.log(' WS Server event \n Room is :' + message.room + '\n' + message.comment);
});

