/**
 * Created by stephane on 03/12/14.
 */
function setDataTable(datas) {

  var aSelected = [];
  var clicked = false;
  var listIdSelected = "";
  var oldThis;
  var objectStruct = Object.getOwnPropertyNames(datas[datas.length - 1]).sort();
//var objectStruct = Object.keys(datas[datas.length - 1]).sort();
  console.log('---->> datas[0]', objectStruct);
  var tabJsonClient = new Array();
  var listColumns = new Array();
  for (var i=0; i<objectStruct.length;i++) {
    if (objectStruct[i] != '__v') listColumns.push({"sTitle" : objectStruct[i], "sClass": "center"});
  }
  /** Création de la table jquery pour afficher la liste des clients connectés sur le serveur */
  $("#monitor").html('<div class="panel-body"><div class="table-responsive"><table class="table table-striped table-bordered table-hover dataTable no-footer" id="listereponses"></table></div></div>');
  tabMonitor = $("#listereponses").dataTable({
    "bJQueryUI": true,
    "sPaginationType": "full_numbers",
    "aaData": tabJsonClient, //données du tableau datatable récupérer dans la listereponses
    "oTableTools": {
      "sRowSelect": "single"
    },
    "aoColumns": listColumns,
    "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
      //détecter un clic sur la ligne via un lien
      $('td:eq(0)', nRow).html('<a href="#" onclick="callDetail(\''+$.trim(aData[0])+'\')">' + aData[0] + '</a>');
      //return nRow;
    }
  });

  /* Click event handler */
  $(document).on("click", "#suppruve", function() {
    var reponse = confirm('ATTENTION : Voulez-vous vraiment supprimer l\'utilisateur N° : ' + aSelected);
    if (reponse) {
      for(var j=0;j<aSelected.length;j++) {
        $.get('/deletextrauser?_id='+aSelected[j], function (data) {
          window.location.href='/listextrauser';
        });
      }
    }
  });

  $(document).on("click", "#listereponses > tbody > tr", function() {
    var iPos = tabMonitor.fnGetPosition( this );
    var aData = tabMonitor.fnGetData( iPos );
    var iId = aData[0];  // colonne 3 c'est l'uuid_tablette à la place de l'id base.
    // permet de récupérer la position de la valeur iId de aSelected
    var index = jQuery.inArray(iId, aSelected);
    if ( index === -1 ) {
      aSelected.push( iId );
    } else {
      aSelected.splice( index, 1 );
    }
    if (typeof oldThis != 'undefined') oldThis.toggleClass('row_selected');
    oldThis = $(this);
    $(this).toggleClass('row_selected');
  });

  $(document).on("dblclick", "#listereponses > tbody > tr", function() {
    $(this).toggleClass('row_selected');
    if (typeof oldThis != 'undefined') oldThis.toggleClass('row_selected');
    var idUve = tabMonitor.fnGetData(tabMonitor.fnGetPosition(this))[0];
    window.location.href='/modifextrauser?_id='+idUve;
  });



  for (var i=0;i<datas.length;i++) {
    var objectDatas = new Array();
    var data =  datas[i];
    Object.keys(data).forEach(function (key) {
      console.log('Valeur pour ' + key + ' : ' + data[key]);
      if (key != '__v') objectDatas.push("\'"+data[key]+"\'");
    });
    tabJsonClient.push(objectDatas);
  }
  tabMonitor.fnAddData(tabJsonClient);
  tabMonitor.fnDraw(false);
}