// create connection
var socket = io.connect('http://localhost:3000');
// Attente Ack after connection
socket.on('ack', function(data) {
    console.log('WebSocket Client is connected \n Room is :' + data.sessionid + '\n User is :' + data.user);
});
// Opolog event
socket.on('insertOk', function(data) {
    console.log('données insérées en provenance du serveur : ', data);
    window.location.reload(true);
    var objectStruct = Object.getOwnPropertyNames(data.o).sort();
    console.log('objectStruct : ', objectStruct);
    var tabDataToAdd = [];
    for (var k = 0; k < objectStruct.length; k++) {
        tabDataToAdd.push(data.o[objectStruct[k]]);
    }
    $('#listereponses').dataTable().fnAddData(tabDataToAdd);
});

socket.on('deleteOk', function(data) {
    console.log('données supprimées en provenance du serveur : ', data);
    var table = $('#listereponses').dataTable();
    table.fnDeleteRow($('#' + data.o._id));
    table.draw(false);
});
/**
 * Created by sma on 12/09/14.
 */

/**
  <th mData="nom">Name</th>
  <th mData="prenom">Firstname</th>
  <th mData="login">Login</th>
  <th mData="password">Password</th>
  <th mData="role.code">Code</th>
  <th mData="role.libelle">Libellé</th>
  <th mData="telephone">Phone</th>
  <th mData="email">Email</th>
*/
