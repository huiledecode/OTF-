// create connection
var socket = io.connect('http://localhost:3000');
// Attente Ack after connection
socket.on('ack', function (data) {
    console.log('WebSocket Client is connected \n Room is :' + data.sessionid + '\n User is :' + data.user);
});
// Opolog event
socket.on('insertOk', function (data) {
    console.log('données insérées en provenance du serveur : ', data);
    delete data.o.__proto;
    delete data.o.__v;
    var objectStruct = Object.getOwnPropertyNames(data.o).sort();
    console.log('objectStruct : ', objectStruct);
    var tabDataToAdd = [];
    for (var k = 0; k < objectStruct.length; k++) {
        tabDataToAdd.push(data.o[objectStruct[k]]);
    }
    $('#listereponses').dataTable().fnAddData(tabDataToAdd);
});

socket.on('deleteOk', function (data) {
    console.log('données supprimées en provenance du serveur : ', data);
    var table = $('#listereponses').dataTable();
    table.fnDeleteRow($('#' + data.o._id));
    table.draw(false);
});
/**
 * Created by epa on 12/09/14.
 */
