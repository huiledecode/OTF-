 /**
* Created by ao on 22/08/15.
*/
var _ = require("underscore");
var moment = require('moment');
var uuid = require('node-uuid');
var crypto = require('crypto');
var util = require('./otf_util');


module.exports = {
  convertIsoDateToString: convertIsoDateToString,
  convertStringToIsoDate: convertStringToIsoDate,
  convertStringToBoolean: convertStringToBoolean,
  convertFrStringToBoolean: convertFrStringToBoolean,
  generateRandomKey: generateRandomKey,
  generatePassword: generatePassword,
  formatFieldsFromMultipart: formatFieldsFromMultipart,
  formatFields: formatFields,
  toTitleCase: toTitleCase,
  toUpperCaseValues: toUpperCaseValues,
  verifyUploadImagePathVmsExist: verifyUploadImagePathVmsExist
}

function toUpperCaseValues(obj){
  var objUpperCase = {};
  for(var name in obj) {
    name_low = name.toLowerCase();
    if(name_low.indexOf("password") == -1 && name_low.indexOf("email") == -1
      && name_low.indexOf("actif") == -1 && name_low.indexOf("visiteur") == -1 && name_low.indexOf("visite") == -1
      && name_low.indexOf("_id") == -1 && name_low.indexOf("id_") == -1){
      objUpperCase[name] = obj[name].toUpperCase();
    }else{
      objUpperCase[name] = obj[name];
    }
  }
  return objUpperCase;
}

function convertIsoDateToString (isoDate, format) {
  if(!format)
    format = 'DD/MM/YYYY';
  moment.locale("fr");
  return moment(isoDate).format(format);
}

function convertStringToIsoDate (datestr, format) {
  if(!format)
    format = 'DD/MM/YYYY';
  moment.locale("fr");
  return moment(datestr, format).toDate();
}

function convertStringToBoolean (string) {
  //Si string peut être converti en Boolean retourne Boolean, la string sinon
  return string === 'true' ? true : (string === 'false' ? false : string);
}

function convertFrStringToBoolean (string) {
  //Si string peut être converti en Boolean retourne Boolean, la string sinon
  if(!string)
    return false;
  return string.toLowerCase() === 'oui' ? true : (string.toLowerCase() === 'non' ? false : string);
}

function generateRandomKey () {
  // Generate a v1 (time-based) id
  return uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
}

function toTitleCase (str) {
  if(!str)
    return "";

  return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function generatePassword (howMany, chars) {
  howMany = howMany || 10;
  chars = chars
    || "abcdefghijklmnopqrstuwxyzABCDEFGHIJKLMNOPQRSTUWXYZ0123456789";
    var rnd = crypto.randomBytes(howMany)
        , value = new Array(howMany)
        , len = chars.length;

    for (var i = 0; i < howMany; i++) {
        value[i] = chars[rnd[i] % len];
    };

    return value.join('');
}

function formatFieldsFromMultipart (params, model){
  var result = {};
// console.log("######## params : ", params);
  for (var field in params) {
// console.log("######## field : ", field);
    if(params[field]){
      if(model.isArray(field) && params[field] ){
        if(typeof params[field] === "string")
          params[field] = [params[field]];
        else
          result[field] = params[field][0];
      }else
        result[field] = params[field][0];
    }
  }
  return result;
}

function formatFields (values, schema){
// console.log("## formatFields avant INSERT");
  var result = {};
  var schema_fields = schema.paths;
  for (var field in values) {
// console.log("## UTIL field : ", field);
// console.log("## UTIL schema_fields[field] : ", schema_fields[field]);
    if(schema_fields[field]){//cet attribut existe dans le schéma
// console.log("## field : ", field);
// console.log("## schema_fields[field] : ", schema_fields[field]);
// console.log("## schema_fields[field].options.type : ", schema_fields[field].options.type);
      if(schema_fields[field].options.type === "Date"){
        //if(field.toLowerCase().indexOf("heure") !== -1)//TODO: trouver un meilleur moyen pour savoir si la date est un datetime...

          /*if(field.indexOf("_noformat") != -1){// la date est envoyé sans formattage (moment ou date brute)
            result[field] = values[field];
          }
          else
            result[field] = convertStringToIsoDate(values[field], "DD/MM/YYYY HH:mm");*/
          result[field] = values[field];
        /*else
          result[field] = convertStringToIsoDate(values[field]);*/
      }
      else if(schema_fields[field].options.type === "Boolean"){
        result[field] = convertStringToBoolean(values[field]);
      }
      else if(typeof schema_fields[field].options.type === "object" && _.isArray(schema_fields[field].options.type)){
        if(!values[field] || !values[field] === "")
          result[field] = [];
        else{
          if(typeof values[field] === "string")
            result[field] = [values[field]];
          else
            result[field] = values[field];
        }
      }
      else if(schema_fields[field].options.type === "ObjectId"){
        if(!values[field] || !values[field] === "")
          result[field] = undefined;
        else
          result[field] = values[field];
      }
      else{
// console.log("## UTIL ELSE ");
        result[field] = values[field];
      }
    }
  }
  return result;
}

function verifyUploadImagePathVmsExist(){
  var fs = require('fs');
  
  if (!fs.existsSync('./public/uploads')) {
      fs.mkdirSync('./public/uploads', [0777]);
  }
  if (!fs.existsSync('./public/uploads/images')) {
      fs.mkdirSync('./public/uploads/images', [0777]);
  }
  if (!fs.existsSync('./public/uploads/images/signature')) {
      fs.mkdirSync('./public/uploads/images/signature', [0777]);
  }
  if (!fs.existsSync('./public/uploads/images/photo')) {
      fs.mkdirSync('./public/uploads/images/photo', [0777]);
  }
}
