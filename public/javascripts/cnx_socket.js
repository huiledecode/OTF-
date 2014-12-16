var socket = io.connect('http://localhost:3000');
socket.on('ack', function (data) {
    console.log('WebSocket Client is connected \n Room is :' + data.sessionid + '\n User is :' + data.user);
});

socket.on('insertOk', function(data) {
  console.log('données en provenance du serveur : ' , data);
  delete data.o.__proto;
  delete data.o.__v;
  var objectStruct = Object.getOwnPropertyNames(data.o).sort();
  console.log('objectStruct : ' , objectStruct);
  var tabDataToAdd = [];
  for (var k=0; k < objectStruct.length; k++) {
    tabDataToAdd.push(data.o[objectStruct[k]]);
  }
  $('#listereponses').dataTable().fnAddData(tabDataToAdd);
});


/**
 * Created by epa on 12/09/14.
 */
