/**
 * jquery.toolsbox.datatables.js
 * @author Alexandre Ogé
 * @version 1.0
 *
 *
 */

//Remplace les libelle true/false par Oui/Non ou Yes/No (en fonction de la langue)
function convertBooleanValue(nRow){
    $(nRow).children().each(function(index, td) {
        var htmlText = $(td).html();
        if(isBoolean(htmlText)){
            var text_bool = "Oui";
            if(!stringToBoolean(htmlText))
                text_bool = "Non";
            $(td).html(text_bool);
        }
    });
}

//Methode qui initialise la propriété aoColumnDefs du datatable en fonction des attributs des <TH >
function aoColumnDefs(idTable){
    return aoColumn(idTable, true);
}


//Methode qui initialise la propriété aoColumn du datatable en fonction des attributs des <TH >
function aoColumn(idTable, isColumnDefs){
    var columns = [];

    if(convertUndefined(isColumnDefs) === "")
        isColumnDefs = false;

    var i=0;
    $('#'+idTable+' th').each(function () {
        var mData = $(this).attr("mData");
        if(convertUndefined(mData) !== ""){
            var sClass      = $(this).attr("sClass");
            var sType       = $(this).attr("sType");
            var sDatetime   = $(this).attr("sDatetime");
            var type        = $(this).attr("type");
            var bSortable   = $(this).attr("bSortable");
            var sName       = $(this).attr("sName");
            if(convertUndefined(sName) === "")
                sName = mData;
            if(convertUndefined(bSortable) === "")
                bSortable = true;
            else
                bSortable = stringToBoolean(bSortable);

            var obj = {};
            if(isColumnDefs){// attributs de aoColumnDef
                obj["sName"]    = sName;
                obj["aTargets"] = [i];
            }else{
                obj["mData"] = mData;
            }
            if(convertUndefined(sClass) !== "")
                obj["sClass"] = sClass;

            if(convertUndefined(sType) !== "")
                obj["sType"] = sType;
            else
                sType = "";

            obj["bSortable"] = bSortable;

            if(mData.indexOf("+") !== -1){//on concat les different element
                var elments = mData.split('+');
                obj["mRender"] = function( data, type, full ) {
                    var rerturnStr = "";
                    for (var k = 0; k < elments.length; k++) {
                      var value_str = elments[k].trim();
                      if(value_str.indexOf('.')!=-1){
                        var value_str_tab = value_str.split('.');
                        var obj_name = value_str_tab[0];
                        var obj_attr_name = value_str_tab[1];
                        if(full[obj_name][obj_attr_name]){
                          rerturnStr += full[obj_name][obj_attr_name]+" ";
                        }
                      }else{
                        if(full[value_str]){
                          rerturnStr += full[value_str]+" ";
                        }
                      }
                    }

                    return rerturnStr.trim();
                };
            }

            if(sType.indexOf("date") !== -1){//on formatte la date
                obj["mRender"] = function( data, type, full ) {
                    if(full[sName]){
                      if(sDatetime)
                        return convertIsoDateToString(full[sName], "DD/MM/YYYY HH:mm");//DD/MM/YYY HH:mm
                      return convertIsoDateToString(full[sName]);
                    }
                };
            }
//            else{
//                obj["mRender"] = function( data, type, full ) {
//                    return replaceEmptyObjectValueMRender(full[sName], sName.indexOf("notes") !== -1);
//                };
//            }

            if(sType.indexOf("statut") !== -1){//on css le libelle du statut
                obj["mRender"] = function( data, type, full ) {
//console.log("####### statut , full : ", full, " | type : ", type);
                    var css = "label label-warning";
                    if(data.toUpperCase().indexOf("REFUS") !== -1)
                        css = "label label-danger";
                    else if(data.toUpperCase().indexOf("ACCEPT") !== -1 || data.toUpperCase().indexOf("VALID") !== -1)
                        css = "label label-success";
                    else if(data.toUpperCase().indexOf("COURS") !== -1 || data.toUpperCase().indexOf("PROGRESS") !== -1 || data.toUpperCase().indexOf("SAISI") !== -1)
                        css = "label label-info";
                    return "<span class='"+ css +"'>"+data+"</span>";
                };
            }

            if(sType.indexOf("radio_oui_non") !== -1){
                obj["mRender"] = function( data, type, full ) {
//console.log("####### radio_oui_non , full : ", full, " | type : ", type);
                    var css    = "btn-default";
                    var css2   = "btn-danger active";
                    var input1 = "";
                    var input2 = "checked";
                    if(full["estCompte"]){
                        css    = "btn-success active";
                        css2   = "btn-default";
                        input1 = "checked";
                        input2 = "";
                    }

                    var element = "<div data-toggle='buttons' class='btn-group'>";
                    element += "<label class='btn btn-sm "+css+"'>";
                    element += "<input class='toggle' type='radio' name='aEstCompte_"+full["idLigneDetail"]+"'  id='aEstCompte_"+full["idLigneDetail"]+"_Oui' value='true' "+input1+">";
                    element += "Oui";
                    element += "</label>";

                    element += "<label class='btn btn-sm "+css2+"'>";
                    element += "<input class='toggle' type='radio' name='aEstCompte_"+full["idLigneDetail"]+"' id='aEstCompte_"+full["idLigneDetail"]+"_Non' value='false' "+input2+">";
                    element += "Non";
                    element += "</label>";
                    element += "</div>";

                    element += "<input type='hidden' name='aOidDetailComptage' value='"+full["idLigneDetail"]+"'>";
                    element += "<input type='hidden' name='codeProduit_"+full["idLigneDetail"]+"' value='"+full["codeProduit"]+"'>";

                    return element;
                };
            }

            if(sType.indexOf("textearea") !== -1){
                obj["mRender"] = function( data, type, full ) {
                    return "<textarea class='form-control' type='text' id='aNotes_"+full["idLigneDetail"]+"' name='aNotes_"+full["idLigneDetail"]+"' value='"+replaceEmptyObjectValue(full["notes"])+"'>"+replaceEmptyObjectValue(full["notes"])+"</textarea>";
                };
            }


            if(sType.indexOf("input_text") !== -1){
                obj["mRender"] = function( data, type, full ) {
                    var qteComptee = "0";
                    if(full["qteComptee"] && replaceEmptyObjectValue(full["qteComptee"]) !== "")
                        qteComptee = full["qteComptee"];
                    return "<input class='form-control' style='width:80px' type='text' id='aQteComptee_"+full["idLigneDetail"]+"' name='aQteComptee_"+full["idLigneDetail"]+"' value='"+qteComptee+"'/>";
                };
            }

            if(sType.indexOf("select_unite") !== -1){
                obj["mRender"] = function( data, type, full ) {
                    var element = "<select class='form-control' id='aOidUniteComptee_"+full["idLigneDetail"]+"' name='aOidUniteComptee_"+full["idLigneDetail"]+"' required>";

                    for(var i=0; i<full["unitesStock"].length; i++){
                        var unite = full["unitesStock"][i];
                        var selected = "";
                        if(full["idUniteComptee"] === unite.idUnite)
                            selected = "selected=true";

                        element += "<option id='"+unite.idUnite+"' value='"+unite.idUnite+"' "+selected+">"+unite.libelle+"</option>";
                    }
                    element += "</select>";
                    return element;
                };
            }

            columns.push(obj);
        }
        i++;
    });
    return columns;
}

var idName = "_id";

function getUpdateIconPng(label, route, idField, nameField){
  var sep = "?";
  if(route.indexOf('?') !== -1)
    sep = "&";

  console.log("## getUpdateIconPng !!!");
    if(convertUndefined(idField) === "")
        idField = idName;
    if(convertUndefined(nameField) === "")
        nameField = idField;

    var updateIconPng = {
        "sClass": "btn-text-right",
        "mData": function (x) {
            if (isNullOrUndefined(x[idField]) || x[idField] === 0)
                return '</div>';
            else
                return '<a href="'+route+sep+nameField+'='+x[idField]+'" title="'+label+'" class="btn btn-xs btn-default"><i class="fa fa-pencil fa-2x"></i></a>';
        },
        "bSortable": false
    };
    return updateIconPng;
}

function getDetailIconPng(label, route, idField, nameField){
    var sep = "?";
    if(route.indexOf('?') !== -1)
      sep = "&";

    if(convertUndefined(idField) === "")
        idField = idName;
    if(convertUndefined(nameField) === "")
        nameField = idField;

    var detailIconPng = {
        "sClass": "btn-text-right",
        "mData": function (x) {
            if (isNullOrUndefined(x[idField]) || x[idField] === 0)
                return '</div>';
            else
                return '<a href="'+route+sep+nameField+'='+x[idField]+'" title="'+label+'" class="btn btn-sm btn-default"><i class="fa fa-search"></i></a>';
        },
        "bSortable": false
    };
    return detailIconPng;
}


function getSelectIconPng(label, name, idField){
    if(convertUndefined(idField) === "")
        idField = idName;

    var selectIconPng = {
        "sClass": "btn-text-right",
        "mData": function (x) {
            if (isNullOrUndefined(x[idField]) || x[idField] === 0)
                return '</div>';
            else
                return '<span id="select_'+name+ '_' + x[idField] + '" class="btn btn-success btn-sm" title="' + label + '"><i class="glyphicon glyphicon-ok"></i></span>';
        },
        "bSortable": false
    };
    return selectIconPng;
}


function getDeleteIconPng(label, route, idField, nameField){
    var sep = "?";
    if(route.indexOf('?') !== -1)
      sep = "&";

    if(convertUndefined(idField) === "")
        idField = idName;
    if(convertUndefined(nameField) === "")
        nameField = idField;

    var deleteIconPng = {
        "sClass": "btn-text-right",
        "mData": function (x) {
            if(route.indexOf("supprimer_contact_usager") ){
              if(x["cloneextrauser"] && x["cloneextrauser"] != "")
                return '</div>';
            }

            if (isNullOrUndefined(x[idField]) || x[idField] === 0)
                return '</div>';
            else
                return '<a href="'+route+sep+nameField+'='+x[idField]+'" title="'+label+'" class="btn btn-sm btn-default"><i class="fa fa-trash-o"></i></a>';
        },
        "bSortable": false
    };
    return deleteIconPng;
}



function populateGenericDatatableJson(route, path_json_result, id_datatable, rowIdName, nbRowDisplay, listIndexColumnToHide, tabButtons, listColumnToSort){
//  console.log("##### populateGenericDatatableJson !! route : ", route);
  return populateGenericDatatable(route, id_datatable, rowIdName, nbRowDisplay, listIndexColumnToHide, tabButtons, path_json_result, listColumnToSort);
}

function populateGenericDatatable(route, id_datatable, rowIdName, nbRowDisplay, listIndexColumnToHide, tabButtons, path_json_result, listColumnToSort){
    //App.blockUI({target: $('#'+id_datatable)});
console.log("################## id_datatable : ", id_datatable);
    if(!listIndexColumnToHide)
       listIndexColumnToHide = [];

    if(!nbRowDisplay)
       nbRowDisplay = 10;

    var aoColumnTab     = aoColumn(id_datatable);

    if(!tabButtons)
        tabButtons = [];

    for(var idx in tabButtons.buttons){
        obj_btn = tabButtons.buttons[idx];
        if(obj_btn.edit_btn)
          aoColumnTab.push(getUpdateIconPng("Modifier", obj_btn.name, obj_btn.id_name, obj_btn.id_param));
        if(obj_btn.remove_btn)
            aoColumnTab.push(getDeleteIconPng("Supprimer", obj_btn.name, obj_btn.id_name, obj_btn.id_param));
        if(obj_btn.select_btn)
            aoColumnTab.push(getSelectIconPng("Sélectionner", obj_btn.name, obj_btn.id_name, obj_btn.id_param));
        if(obj_btn.detail_btn)
            aoColumnTab.push(getDetailIconPng(obj_btn.title, obj_btn.name, obj_btn.id_name, obj_btn.id_param));
    }
    var settings = {
        "aoColumns": aoColumnTab,
        "aoColumnDefs": aoColumnDefs(id_datatable),
        "aaSorting": [],
        "fnInitComplete": function() {
            this.fnAdjustColumnSizing(true);

            for(i=0;i<listIndexColumnToHide.length;i++){
                this.fnSetColumnVis(listIndexColumnToHide[i]*1, false);
            }
          if(listColumnToSort){
            this.fnSort( listColumnToSort );
          }
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex) {
            convertBooleanValue(nRow);
            $(nRow).attr("id", aData[rowIdName]); // Change row ID attribute to match database row id
            return nRow;
        },
        "sAjaxSource": "/json"+route,
        "fnServerData": function ( sSource, aoData, fnCallback ) {
            $.getJSON( sSource, aoData, function (json) {
//                App.unblockUI($('#'+id_datatable));
                //qd chargement des datas d'un datatable dans un tabpanel active le datatable se rempli mais ne s'affiche pas -> forcer le click
 // console.log("###### fnCallback 11 : ", json);
                var li = $('#'+id_datatable+'_tabs').parent();
                if(li.attr("class") && li.attr("class").indexOf("active") !== -1){
                    $('#'+id_datatable+'_tabs').parent().removeClass('active');
                    $('#'+id_datatable+'_tabs').click();
                }
 // console.log("###### fnCallback 22 : ", json);
                if(!json)
                  json = [];
                if(path_json_result){
                  json = eval("json."+path_json_result);
                  if(!json)
                    json = [];
                }
 // console.log("###### datatable JSON : ", json);
                fnCallback(json);
            } );

        },
//        "pagingType": "bootstrap_extended",
        "sPaginationType": "full_numbers",
        "sDom": '<"top"<"actions">lf<"clear">><"clear">rtpi<"bottom">',
        "sAjaxDataProp": "",
        'iDisplayLength': nbRowDisplay,
        "bLengthChange": true,
        "bAutoWidth": false,
        "autoWidth": false,
//        "oLanguage": oLanguageDatatable(),
        "language": languageDatatable(),
    };

    if($('#'+id_datatable).parent().parent().attr("class")){
        if($('#'+id_datatable).parent().parent().attr("class").indexOf("portlet") !== -1){
            settings["sDom"] = '<"top"<"actions">p<"clear">><"clear">rt<"bottom">';
            if(id_datatable.indexOf("stocks_table_") !== -1)
              settings["sDom"] = '<"top"<"actions">lpf<"clear">><"clear">rt<"bottom">';
            else if(id_datatable.indexOf("detail_dossier") !== -1 || id_datatable.indexOf("comptage_table") !== -1 )
              settings["sDom"] = '<"top"<"actions">lpf<"clear">><"clear">rt<"bottom"p>';
        }else{
          if($('#'+id_datatable).parent().parent().parent().parent().attr("class")){
              if($('#'+id_datatable).parent().parent().parent().parent().attr("class").indexOf("tab-content") !== -1){
                  settings["sDom"] = '<"top"<"actions"><"clear">><"clear">rt<"bottom"p>';
              }
          }
        }
    }

    var oTable = $('#'+id_datatable).dataTable(settings);

    //liste des nb par page transformé en select2
    var tableWrapper = $('#'+id_datatable+'_wrapper'); // datatable creates the table wrapper by adding with id {your_table_jd}_wrapper
//    tableWrapper.find('.dataTables_length select').select2();
//    $(".select2-container").addClass("form-control input-xsmall input-inline");

    //move  paginate and filter element to portlet header
    if(tableWrapper.parent().parent().attr("class")){
        if(tableWrapper.parent().parent().attr("class").indexOf("portlet") !== -1){
            var paginateWrapper = $('.dataTables_paginate');
            paginateWrapper.removeClass("dataTables_paginate paging_simple_numbers paging_bootstrap_extended");
            paginateWrapper.addClass("tablepagination-dropdown-on-portlet");
            if($(".portlet-body > div > div > div.bottom").length > 0){
                $(".portlet-body > div > div > div.bottom").parent().parent().parent().css("padding-bottom", "50px");
                $(".portlet-body > div > div > div.bottom > div.tablepagination-dropdown-on-portlet").css("float", "right");
                $(".portlet-body > div > div > div.bottom > div.tablepagination-dropdown-on-portlet").removeClass("tablepagination-dropdown-on-portlet");
            }
        }
    }

    //skin bootstrap search input
    var filterWrapper = $('#'+id_datatable+'_filter');
    filterWrapper.children().children().addClass("form-control input-small input-inline");


    /* Remplissage du dataTable de façon générique */
//    var tabJsonClient = new Array();
//    for (var i=0;i<datas.length;i++) {
//      var objectDatas = new Array();
//      var data =  datas[i];
//      Object.keys(data).forEach(function (key) {
//console.log('Valeur pour ' + key + ' : ' + data[key]);
//        if (key != '__v') objectDatas.push(data[key]);
//      });
//      tabJsonClient.push(objectDatas);
//    }
//    oTable.fnAddData(tabJsonClient);
//    oTable.fnDraw(false);

    return oTable;
}


function oLanguageDatatable(){
    var obj = {
        "sSearch": "Chercher :",
        "oPaginate": {
            "sFirst": "1ère page",
            "sLast": "Dern.",
            "sNext": "Suiv.",
            "sPrevious": "Préc."
        },
        "sLengthMenu": 'Afficher <select>'+
        '<option value="10">10</option>'+
        '<option value="20">20</option>'+
        '<option value="30">30</option>'+
        '<option value="40">40</option>'+
        '<option value="50">50</option>'+
        '<option value="-1">Tous</option>'+
        '</select> lignes',
        "sZeroRecords": "Pas de résultats trouvés, désolé",
        "sInfo": "Affichage de _START_ à _END_ des _TOTAL_ enregistrements",
        "sInfoEmpty": "Affichage de 0 à 0 des 0 enregistrements",
        "sInfoFiltered": "(_MAX_ enregistrements filtrés)"
    }
    return obj;
}

function languageDatatable(){
  return {
        processing:     "Traitement en cours...",
        search:         "Rechercher&nbsp;:",
        lengthMenu:    "Afficher _MENU_ &eacute;l&eacute;ments",
        info:           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
        infoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
        infoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
        infoPostFix:    "",
        loadingRecords: "Chargement en cours...",
        zeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
        emptyTable:     "Aucune donnée disponible dans le tableau",
        paginate: {
          first:      "1er",
          previous:   "Pr&eacute;c.",
          next:       "Suiv.",
          last:       "Dernier"
        },
        aria: {
          sortAscending:  ": activer pour trier la colonne par ordre croissant",
          sortDescending: ": activer pour trier la colonne par ordre décroissant"
        }
      };
}

/*
function languageDatatable(){
    var obj = {
        // metronic spesific
        "customGroupActions": "_TOTAL_ enregistrements séléctionnés:  ",
        "customAjaxRequestGeneralError": "Requête sans réponse. Vérifiez votre connexion Internet svp",

        // data tables spesific
        "lengthMenu": "Afficher _MENU_ lignes",
//        "info": "<span class='seperator'>|</span>_TOTAL_ enregistrements trouvés",
        "info": "Showing page _PAGE_ of _PAGES_",
        "infoEmpty": "Pas de résultats trouvés, désolé",
        "infoFiltered": "(_TOTAL_ enregistrements filtrés)",
        "emptyTable": "Pas de résultats trouvés, désolé",
        "zeroRecords": "Pas de résultats trouvés, désolé",
        "paginate": {
            "previous": "Préc.",
            "next": "Suiv.",
            "last": "Dern.",
            "first": "1ère",
            "page": "Page",
            "pageOf": "sur"
        }
    }
    return obj;
}*/


/************************   SHIFT+CLIC  CTRL+CLIC ROWS DATATABLE   ***********************/

/* Qd selection multiple autorisé sur un datatable, methodes qui select/deselect
les lignes par un ctrl+clic ou shift+clic */

var mySelectList = myDeselectList = null;

function catchCtrlShiftClick(e, nodes, isSelect, row, oTable){
    if (e) {
        mySelectList = myDeselectList = null;
        if (e.shiftKey && nodes.length == 1) {
            myDeselectList = row.fnGetSelected();
            mySelectList = myGetRangeOfRows(oTable, myLastSelection, nodes[0]);
//console.log("#### shiftKey mySelectList : ", mySelectList);
//console.log("#### shiftKey myDeselectList : ", myDeselectList);
        } else {
            myLastSelection = nodes[0];
            if (!e.ctrlKey) {
                myDeselectList = row.fnGetSelected();
                if (!isSelect) {
                    mySelectList = nodes;
                }
            }
//console.log("#### ctrlKey mySelectList : ", mySelectList);
//console.log("#### ctrlKey myDeselectList : ", myDeselectList);
        }
    }
    return true;
}

function mySelectEventHandler(row, nodes) {
//console.log("######## mySelectEventHandler !! mySelectList : ", mySelectList);
    if (myDeselectList) {
        var nodeList = myDeselectList;
        myDeselectList = null;
        row.fnDeselect(nodeList);
    }
    if (mySelectList) {
//console.log("######## mySelectEventHandler mySelectList : ", mySelectList);
        var nodeList = mySelectList;
        mySelectList = null;
        row.fnSelect (nodeList);
    }
}

function myGetRangeOfRows(oDataTable, fromNode, toNode) {
    var
        fromPos = oDataTable.fnGetPosition(fromNode),
        toPos = oDataTable.fnGetPosition(toNode);
        oSettings = oDataTable.fnSettings(),
        fromIndex = $.inArray(fromPos, oSettings.aiDisplay),
        toIndex = $.inArray(toPos, oSettings.aiDisplay),
        result = [];

    if (fromIndex >= 0 && toIndex >= 0 && toIndex != fromIndex) {
        for (var i=Math.min(fromIndex,toIndex); i < Math.max(fromIndex,toIndex); i++) {
            var dataIndex = oSettings.aiDisplay[i];
            result.push(oSettings.aoData[dataIndex].nTr);
        }
    }
    return result.length>0?result:null;
}
/*****************************************************************************************/



$.editable.addInputType('spinnerhour', {
   element : function(settings, original) {
        var div = $('<div />');
        var input = $('<input />');
        input.addClass("shedule_spinner_h");
        if (settings.width  != 'none') { input.width(settings.width);  }
        if (settings.height != 'none') { input.height(settings.height); }
        input.attr('autocomplete','off');
//                    $(this).append(input);
        div.append(input);

        var label = $('<label />');
        label.text(":");
        label.css({"margin-left":"2px", "margin-right":"4px"});
        div.append(label);

        var input2 = $('<input />');
        input2.addClass("shedule_spinner_m");
        if (settings.width  != 'none') { input2.width(settings.width);  }
        if (settings.height != 'none') { input2.height(settings.height); }
        input2.attr('autocomplete','off');
//                    $(this).append(input2);
        div.append(input2);

        $(this).append(div);

        return(div);
    },
    plugin : function(string, settings, original) {
        uiSpinnerHour(".shedule_spinner_h");
        uiSpinnerMinute(".shedule_spinner_m");
    }
});

$.editable.addInputType('spinner', {
   element : function(settings, original) {
        var input = $('<input />');
        input.addClass("spinner");
        if (settings.width  != 'none') { input.width(settings.width);  }
        if (settings.height != 'none') { input.height(settings.height); }
        input.attr('autocomplete','off');

        $(this).append(input);

        return(input);
    },
    plugin : function(string, settings, original) {
        uiSpinner(".spinner");
    }
});

$.editable.addInputType('datepicker', {
   element : function(settings, original) {
        var input = $('<input />');
        input.addClass("datepicker");
        if (settings.width  != 'none') { input.width(settings.width);  }
        if (settings.height != 'none') { input.height(settings.height); }
        input.attr('autocomplete','off');

        $(this).append(input);

        return(input);
    },
    plugin : function(string, settings, original) {
        var form = this;
        uiDatePickerEditable(".datepicker", form);
    }
});

var inputEditable = {
    cssclass: 'required',
    event: "dblclick",
    placeholder: '-'
}
var inputEditableSimpleClick = {
    cssclass: 'required',
    event: "click",
    placeholder: '-'
}

function spinnerHourEditable(common_label, event){
    if(convertUndefined(event) == "")
        event = "dblclick";
    var obj = {
        event: event,
        type: 'spinnerhour',
        submit: "Ok",
        cancel: "Annuler",
        width: "25px",
        height: "15px",
        placeholder: '-'
    }
    return obj;
}

function spinnerEditable(common_label, event){
    if(convertUndefined(event) == "")
        event = "dblclick";
    var obj = {
        event: event,
        type: 'spinner',
        submit: "Ok",
        cancel: "Annuler",
        width: "25px",
        height: "15px",
        placeholder: '-'
    }
    return obj;
}

function datePickerEditable(common_label, event){
    if(convertUndefined(event) == "")
        event = "dblclick";
    var obj = {
        event: event,
        type: 'datepicker',
//        submit: common_label.common_ok.label_value,
//        cancel: common_label.common_cancel.label_value,
//        width: "25px",
//        height: "15px",
        placeholder: '-'
    }
    return obj;
}


function selectTrueFalseEditable(event){
    return selectEditable('{"true":"Oui","false":"Non"}', event);
}

function selectEditable(list, event){
    if(convertUndefined(event) == "")
        event = "dblclick";
    var obj = {
        indicator: "Activé ?",
        tooltip: "Cliquez pour changer le statut",
        loadtext: "Chargement" + '...',
        type: 'select',
        onblur: "Annuler",
        event: event,
        placeholder: '-',
        submit: "Ok",
        cancel: "Annuler",
        data: list
    }
    return obj;
}


//Met à jour la ligne du datatable lors d'un submit du formulaire de modification (updateform)
function updateRow($acTable, nRow, prefixName, moduleName) {
    if(!isNull($acTable)){
        var $inputs = $('#updateform'+moduleName+' :input');
        $inputs.each(function () {
            var type = $(this).attr("type");
            var id   = $(this).attr("id");
            var name = $(this).attr("name");

//    console.log("### id : ", id);
            if(id!=undefined && name!=undefined){
                if(convertUndefined(prefixName) !="" && name.indexOf(prefixName)!=-1)
                    name = name.substr(prefixName.length,name.length);
    //            var sName = id.substr(3,id.length);
                var sName = name;
                if(type == "text" || type == "hidden"){
                    if(sName!="id"){//on ne touche pas à la colonne id du datatable
                        if($acTable.fnGetColumnIndex(sName)!=-1)
                            $acTable.fnUpdate($("#"+id).attr("value"), nRow, $acTable.fnGetColumnIndex(sName), false);
                    }
                }else if(type == "radio"){
                    var idRadio = id.substring(0,id.length-1);

    //console.log("##########VALEUR DU RADIO CLIC : ", $('input[id^='+idRadio+']:checked').val(), ", idRadio : ", idRadio,", name : ", name, "fnGetColumnIndex : ", $acTable.fnGetColumnIndex(sName));
                    if($acTable.fnGetColumnIndex(sName) != -1)
                        $acTable.fnUpdate($('input[id^='+idRadio+']:checked').val(), nRow, $acTable.fnGetColumnIndex(sName), false);
                }else if(type == undefined){
                    if($("#"+id).is("textarea"))
                        $acTable.fnUpdate($("#"+id).val(), nRow, $acTable.fnGetColumnIndex(sName), false);
                }
            }
        });

        var $selects = $('#updateform'+moduleName+' :selected');
        $selects.each(function () {
            var id     = $(this).parent().attr("id");
            var desc   = $(this).parent().attr("desc");

            if($(this).parent().is("optgroup")){
                id     = $(this).parent().parent().attr("id");
                desc   = $(this).parent().parent().attr("desc");
            }
//console.log("### id : ", id);
            if(id!=undefined){
                var sName = id.substr(3,id.length);
                var formValue = $("#"+id+" option:selected").attr("value");
                var formText  = $("#"+id+" option:selected").text();
//console.log("### sName : ", sName);
//console.log("### formValue : ", formValue);
//console.log("### formText : ", formText);
                if(formValue!=undefined){
                    if($acTable.fnGetColumnIndex(sName) != -1)
                        $acTable.fnUpdate(formValue, nRow, $acTable.fnGetColumnIndex(sName), false);
                }
                if(desc!=undefined){
                    if($acTable.fnGetColumnIndex(desc) != -1)
                        $acTable.fnUpdate(formText, nRow, $acTable.fnGetColumnIndex(desc), false);
                }
            }
        });
        $acTable.fnDraw();
    }
}

function makeEditable(tdThis, value, settings, oTable, route, method, callbackFunction){
    var id          = tdThis.parent()[0].id;
    var cellIndex   = tdThis[0].cellIndex;
    var columnName  = oTable.fnGetColumnSName(cellIndex);
    var methodParam = "";

    var tabParams       = new Array();
    var currentParams   = new Object();

    if(columnName.indexOf(".") !=-1){// exemple de mData ou sName du style : category_type._id (retour de find().populate() mongoose)
        columnName = columnName.split('.')[0];
    }

    currentParams.name = columnName;
    currentParams.value = value;
    currentParams.type = "text";
    tabParams.push(currentParams);

    currentParams = new Object();
    currentParams.name = "_id";
    currentParams.value = id;
    currentParams.type = "text";
    tabParams.push(currentParams);

    if(convertUndefined(method) == "")
        method = "update";

    var parameters = {
        method: method,
        params: tabParams
    };
//console.log("####### makeEditable settings : ", settings);
    $(this).sendProcess(route, parameters, function (result) {
//console.log("####### makeEditable result : ", result);
        if (result.error != null) {
            $(tdThis).css({color: 'red'});
            showErrorNotificationPopup(result.error.message, 3000);
        } else {
            $(tdThis).css({color: ''});
            showSuccessNotificationPopup("Modification validée", 1000);
            if ($.isFunction(callbackFunction)){callbackFunction();}
        }
    });

    return returnMakeEditableValue(settings, value);
}

function makeEditableOnName(tdThis, value, settings, oTable, route, method, callbackFunction){
    var id          = tdThis.parent()[0].id;
    var cellIndex   = tdThis[0].cellIndex;
    var columnName  = oTable.fnGetColumnSName(cellIndex);
    var methodParam = "";

    if(columnName.indexOf("_name") !=-1){
        columnName = columnName.replace("_name", "_id");
    }

    if(columnName.indexOf(".") !=-1){// exemple de mData ou sName du style : category_type._id (retour de find().populate() mongoose)
        columnName = columnName.split('.')[0];
    }


    var tabParams       = new Array();
    var currentParams   = new Object();

    currentParams.name = columnName;
    currentParams.value = value;
    currentParams.type = "text";
    tabParams.push(currentParams);

    currentParams = new Object();
    currentParams.name = "_id";
    currentParams.value = id;
    currentParams.type = "text";
    tabParams.push(currentParams);

    if(convertUndefined(method) == "")
        method = "update";

    var parameters = {
        method: method,
        params: tabParams
    };

    $(this).sendProcess(route, parameters, function (result) {
        if (result.error != null) {
            $(tdThis).css({color: 'red'});
            showErrorNotificationPopup($.dump(result.error.message), 3000);
        } else {
            $(tdThis).css({color: ''});
            if ($.isFunction(callbackFunction)){callbackFunction();}
            showSuccessNotificationPopup("Modification validée", 1000);
        }
    });

    return returnMakeEditableValue(settings, value);
}

function returnMakeEditableValue(settings, value){
    var data;
    try{
        data = $.parseJSON(settings.data);
    }catch(err){
        console.log(err.message);
    }
    if(settings.type == 'select')
        return data[value];
    else
        return value;
}

//function deleteRow(route, idName, idValue, oTable, nRow){
function deleteRow(route, tab, oTable, nRow, method, callbackFunction){

    var tabParams       = new Array();
    var currentParams   = new Object();

    for (var prop in tab) {
        currentParams = new Object();
        currentParams.name = prop;
        currentParams.value = tab[prop];
        currentParams.type = "text";
        tabParams.push(currentParams);
    }

    if(convertUndefined(method) == "")
        method = "delete";

    var parameters = {
        method: method,
        params: tabParams
    };

    $(this).sendProcess(route, parameters, function (result) {
        if (result.error != null) {
            showErrorNotificationPopup(result.error.message, 3000);
        } else {
            if ($.isFunction(callbackFunction)){callbackFunction();}
            showSuccessNotificationPopup("Supression validée", 1000);
            oTable.fnDeleteRow(nRow);
        }
    });
}


function deleteSelectFilters(id_table, position){
    var myTr = $("#"+id_table+" "+position+" tr");
    if(myTr.length>1){
        myTr.first().remove();
    }
}


function addSelectFilters(oTable, id_table, position){
    var myElement = $("#"+id_table+" "+position);
    var myTr = $("#"+id_table+" "+position+" tr");
    if(myTr.length<2){
        var myTrClone = myTr.clone();
        myTrClone.prependTo(myElement).find("th").each(function(i) {

            if( $(this).attr("nofilter") == undefined ){
                var columnData = oTable.fnGetColumnData(i);//somtimes fnGetColumnData(i) return an empty tab
                var htmltext = fnCreateSelect( columnData );
                $(this).html(htmltext);
                $('select', this).change( function () {
                    var sNameColumn = oTable.fnGetColumnSName(i);
                    var j = oTable.fnGetColumnIndex(sNameColumn);
                    oTable.fnFilter( $(this).val(), j );
    //                    oTable.fnFilter( "0176766606|0176766607", j, true );//equivalent de recherche avec operateurr OR, mettre true pour activer les regular expressions
                } );
            }else{
                $(this).html("");
            }
        } );
    }
    $('.select_filter').select2();
//    activeChosen(".select_filter");
}

function fnCreateSelect( aData )
{
    if(aData.length == 0)
        return null;

    aData.sort();
    var r='<select class=\"select_filter\"><option value="">Tous</option>', i, iLen=aData.length;
    for ( i=0 ; i<iLen ; i++ )
    {
        var text = aData[i];
        if(isBoolean(text)){
            var text_bool = "Oui";
            if(!stringToBoolean(text))
                text_bool = "Non";
            text = text_bool;
        }

        r += '<option value="'+text+'">'+text+'</option>';
    }
    return r+'</select>';
}


//Deselectionne toutes les lignes du datatable
function rowSelectNone(id_table){
    var oTT = TableTools.fnGetInstance(id_table);
    if(oTT)
        oTT.fnSelectNone();
}

//extending Datatable API to return index by sName column
$.fn.dataTableExt.oApi.fnGetColumnIndex = function ( oSettings, sCol )
{
    var cols = oSettings.aoColumns;
    for ( var x=0, xLen=cols.length ; x<xLen ; x++ )
    {
        if(cols[x].sName != undefined && sCol != undefined){
            if ( cols[x].sName.toLowerCase() == sCol.toLowerCase() )
            {
                return x;
            };
        }
    }
    return -1;
};

//extending Datatable API to return sName by index column
$.fn.dataTableExt.oApi.fnGetColumnSName = function ( oSettings, cellIndex )
{
console.log("####### oSettings : ", oSettings);
    var cols                = oSettings.aoColumns;
    var cellIndexVisible    = oSettings.oApi._fnVisibleToColumnIndex( oSettings, cellIndex );
    var sName;
    if(cols[cellIndexVisible] != undefined)
        sName = convertUndefined(cols[cellIndexVisible].sName);

    return sName;
};

//$.fn.dataTableExt.oApi.fnGetColumnIndexVisible = function ( oSettings, cellIndex )
//{
//    return oSettings.oApi._fnVisibleToColumnIndex( oSettings, cellIndex );
//};


//extending Datatable API to return sName by indexVisible column
$.fn.dataTableExt.oApi.fnGetColumnVisibleSName = function ( oSettings, cellIndexVisible )
{
    var cols        = oSettings.aoColumns;
    var cellIndex   = oSettings.oApi._fnColumnIndexToVisible( oSettings, cellIndexVisible );
    var sName;
    if(cols[cellIndex] != undefined)
        convertUndefined(cols[cellIndex].sName);

    return sName;
};

$.fn.dataTableExt.oApi.fnGetHiddenNodes = function ( settings )
{
    var nodes;
    var display = $('tbody tr', settings.nTable);

    if ( $.fn.dataTable.versionCheck ) {
        // DataTables 1.10
        var api = new $.fn.dataTable.Api( settings );
        nodes = api.rows().nodes().toArray();
    }
    else {
        // 1.9-
        nodes = this.oApi._fnGetTrNodes( settings );
    }

    /* Remove nodes which are being displayed */
    for ( var i=0 ; i<display.length ; i++ ) {
        var iIndex = $.inArray( display[i], nodes );

        if ( iIndex != -1 ) {
            nodes.splice( iIndex, 1 );
        }
    }

    return nodes;
};

(function($) {
/*
 * Function: fnGetColumnData
 * Purpose:  Return an array of table values from a particular column.
 * Returns:  array string: 1d data array
 * Inputs:   object:oSettings - dataTable settings object. This is always the last argument past to the function
 *           int:iColumn - the id of the column to extract the data from
 *           bool:bUnique - optional - if set to false duplicated values are not filtered out
 *           bool:bFiltered - optional - if set to false all the table data is used (not only the filtered)
 *           bool:bIgnoreEmpty - optional - if set to false empty values are not filtered from the result array
 * Author:   Benedikt Forchhammer <b.forchhammer /AT\ mind2.de>
 */
    $.fn.dataTableExt.oApi.fnGetColumnData = function ( oSettings, iColumn, bUnique, bFiltered, bIgnoreEmpty ) {

        // check that we have a column id
        if ( typeof iColumn == "undefined" ) return new Array();

        // by default we only want unique data
        if ( typeof bUnique == "undefined" ) bUnique = true;

        // by default we do want to only look at filtered data
        if ( typeof bFiltered == "undefined" ) bFiltered = true;

        // by default we do not want to include empty values
        if ( typeof bIgnoreEmpty == "undefined" ) bIgnoreEmpty = true;

        // list of rows which we're going to loop through
        var aiRows;

        // use only filtered rows
        if (bFiltered == true) aiRows = oSettings.aiDisplay;
        // use all rows
        else aiRows = oSettings.aiDisplayMaster; // all row numbers

        // set up data array
        var columnSName = this.fnGetColumnSName(iColumn);
    //console.log("####### fnGetColumnData iColumn : ", iColumn, " | columnSName : ", columnSName, " | aiRows : ", aiRows, " | aiRows.length : ", aiRows.length);
        var asResultData = new Array();
        if(columnSName!=undefined){
            for (var i=0,c=aiRows.length; i<c; i++) {
                var iRow = aiRows[i];
                var aData = this.fnGetData(iRow);
    //console.log("####### fnGetColumnData aData : ", aData);
                var sValue = aData[columnSName];

                if(sValue == undefined) continue;

                // ignore empty values?
                if (bIgnoreEmpty == true && sValue.length == 0) continue;
                // ignore unique values?
                else if (bUnique == true && jQuery.inArray(sValue, asResultData) > -1) continue;

                // else push the value onto the result data array
                else asResultData.push(sValue);
            }
        }

        return asResultData;
    }

    jQuery.extend( jQuery.fn.dataTableExt.oSort, {
        "date-euro-pre": function ( a ) {
//          console.log("### a :",a);
            if ($.trim(a) != '') {
                var x;
                if($.trim(a).indexOf(" ") !== -1){
                    var frDatea = $.trim(a).split(' ');
                    var frTimea = frDatea[1].split(':');
                    var frDatea2 = frDatea[0].split('/');
                    x = (frDatea2[2] + frDatea2[1] + frDatea2[0] + frTimea[0] + frTimea[1] + frTimea[2]) * 1;
                }else{
                    var frDatea2 = $.trim(a).split('/');
                    x = (frDatea2[2] + frDatea2[1] + frDatea2[0]) * 1;
                }

            } else {
                var x = 10000000000000; // = l'an 1000 ...
            }

            return x;
        },

        "date-euro-asc": function ( a, b ) {
            return a - b;
        },

        "date-euro-desc": function ( a, b ) {
            return b - a;
        }
    } );


    jQuery.fn.dataTableExt.oSort['statut-pre']  = function(a) {
        //use text()
        var statuta = $(a).text().toUpperCase();

        return statuta;
    };

    jQuery.fn.dataTableExt.oSort['statut-asc']  = function(a,b) {
        if (a < b){
          return -1;
        }else if (a > b){
          return  1;
        }else{
          return 0;
        }
    };

    jQuery.fn.dataTableExt.oSort['statut-desc'] = function(a,b) {
        if (b < a){
          return -1;
        }else if (b > a){
          return  1;
        }else{
          return 0;
        }
    }
}(jQuery));
