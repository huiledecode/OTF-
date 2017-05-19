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
    delete data.o.__proto;
    delete data.o.__v;
    var objectStruct = Object.getOwnPropertyNames(data.o); //.sort(); test sans le sort()
    console.log('objectStruct : ', objectStruct);
    var tabDataToAdd = [];
    for (var k = 0; k < objectStruct.length; k++) {
        tabDataToAdd.push(data.o[objectStruct[k]]);
    }
    $('#table_datas').dataTable().fnAddData(tabDataToAdd);
});

socket.on('deleteOk', function(data) {
    console.log('données supprimées en provenance du serveur : ', data);
    var table = $('#table_datas').dataTable();
    table.fnDeleteRow($('#' + data.o._id));
    table.draw(false);
});
/**
 * Created by sma on 12/09/14.
 */

/** STRUCTURE DE LA DATATABLE JQUERY DES USERS
    <th mData="nom">nom</th>
    <th mData="prenom">prenom</th>
    <th mData="login">login</th>
    <th mData="password">password</th>
    <th mData="role.code">role.code</th>
    <th mData="role.libelle">role.libelle</th>
    <th mData="telephone">telephone</th>
    <th mData="email">email</th>
**/

/**
  adresse1: "Rue des serveurs glances"
adresse2: "apt 42"
code_postal: "40000"
email: "jf@admin.fr"
login : "jf"
nom: "BROCA"
notes: ""
password: "otf"
prenom: "JF"
role
:
"57601801cbb47caf29000001"
telephone
:
"__-__-__-__-__"
titre
:
"Mr"
ville
:
"MONT-DE-MARSAN"
__v
:
0
_id
:
"590859b7be611ea02b000003"
**/
