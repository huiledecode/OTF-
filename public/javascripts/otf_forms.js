/**
 * Created by stephane on 05/12/14.
 */
function setFormUpdate(result, action_submit) {
  var listfields = Object.getOwnPropertyNames(result).sort();
  var containerform = $('#containerform');
  containerform.append('<form id="formupdate" class="form-horizontal" role="form" method="POST" accept-charset="utf-8" action="'+action_submit+'">');
  var formupdate = $('#formupdate');
  formupdate.append('<div id="rowfield" class="row-fluid">');
  var fluidblock = $('#rowfield');
  for (var i=0;i<listfields.length;i++) {
    fluidblock.append('<div id="col'+i+'" class="col-md-4">').append('<div class="form-group">')
      .append('<input type="text" class="form-control" placeholder="'+listfields[i]+'" id="'+listfields[i]+'" name="'+listfields[i]+'" value="'+ result[listfields[i]] +'">');
      var colonne = $('#col'+i);
      colonne.append('</div>');
    fluidblock.append('</div>');
  }
  formupdate.append('</div>');
  formupdate.append('<div id="rowbutton" class="row-fluid">');
  var rowbutton = $('#rowbutton');
  rowbutton.append('<div id="colbutton" class="col-md-4">');
  var buttoncol =  $('#colbutton');
  buttoncol.append('<div id="formbutton" class="form-group">');
  var formbutton = $('#formbutton');
  formbutton.append('<button type="submit" class="btn btn-primary">Enregistrer</button>');
}
// ******** ANCIEN FORMULAIRE HBS CI-DESSOUS GARDER POUR COMPARER LE RESULTAT DE LA CONSTUCTION DYNAMIQUE *********
/*
*<form class="form-horizontal" role="form" method="POST" accept-charset="utf-8" action="/setuser">
 <input type="hidden" class="form-control" placeholder="id" id="_id" name="_id" value="{{result._id}}">
 <div class="row-fluid">
   <div class="col-md-4">
     <div class="form-group">
      <input type="text" class="form-control" placeholder="Idenfiant" id="login" name="login" value="{{result.login}}">
     </div>
   </div>
   <div class="col-md-4">
     <div class="form-group">
        <input type="password" class="form-control" placeholder="Mot de passe" id="password" name="password" value="{{result.password}}">
     </div>
   </div>
 </div>
 <div id="rowbutton" class="row-fluid">
  <div id="button" class="col-md-4">
     <div class="form-group">
        <button type="submit" class="btn btn-primary">Enregistrer</button>
     </div>
   </div>
 </div>
 </form>
 */