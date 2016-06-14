/**
 * Created by stephane on 03/12/14.
 */
function setDataTable(datas, idmonitor, dblclick_action, suppr_action) {

  // Ajout fonction startsWith sur les String Javascript
  if (typeof String.prototype.startsWith != 'function') {
    // see below for better implementation!
    String.prototype.startsWith = function (str){
      return this.indexOf(str) == 0;
    };
  }

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
  $("#"+idmonitor).html('<div class="panel-body"><div class="table-responsive"><table class="table table-striped table-bordered table-hover dataTable no-footer" id="listereponses"></table></div></div>');
    var tabMonitor = $("#listereponses").dataTable({
    "bJQueryUI": true,
    "sAjaxDataProp": "",
    "sPaginationType": "full_numbers",
    "aaData": tabJsonClient, //données du tableau datatable récupérer dans la listereponses
    "oTableTools": {
      "sRowSelect": "single"
    },
    "aoColumns": listColumns,
    "fnRowCallback": function( nRow, aData, iDisplayIndex ) {
      //détecter un clic sur la ligne via un lien
      $('td:eq(0)', nRow).html('<a href="#" onclick="callDetail(\''+$.trim(aData[0])+'\')">' + aData[0] + '</a>');
    },
    "fnCreatedRow": function( nRow, aData, iDataIndex ) {
      $(nRow).attr('id', aData[0]);
    }

  });

  /* Click event handler */
  $(document).on("click", "#suppr", function() {
    var reponse = confirm('ATTENTION : Voulez-vous vraiment supprimer la ligne N° : ' + aSelected);
    if (reponse) {
      for(var j=0;j<aSelected.length;j++) {
        $.get(suppr_action+'?_id='+aSelected[j], function (data) {
          document.location = document.location;
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
if (typeof dblclick_action != 'undefined') {
  $(document).on("dblclick", "#listereponses > tbody > tr", function () {
    $(this).toggleClass('row_selected');
    if (typeof oldThis != 'undefined') oldThis.toggleClass('row_selected');
    var id = tabMonitor.fnGetData(tabMonitor.fnGetPosition(this))[0];
    window.location.href = dblclick_action + '?_id=' + id;
  });
}

  /* Remplissage du dataTable de façon générique */
  for (var i=0;i<datas.length;i++) {
    var objectDatas = new Array();
    var data =  datas[i];
    Object.keys(data).forEach(function (key) {
      console.log('Valeur pour ' + key + ' : ' + data[key]);
      if (key != '__v') objectDatas.push(data[key]);
    });
    tabJsonClient.push(objectDatas);
  }
  tabMonitor.fnAddData(tabJsonClient);
  tabMonitor.fnDraw(false);
}