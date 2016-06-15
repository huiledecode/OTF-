/**
 * jquery.toolsbox.js
 * @author Alexandre Ogé
 * @version 1.0
 *
 *
 */


function convertUndefined(value) {
    if (value == undefined || value == "undefined")
        return "";
    return value;
}

function isNullOrUndefined(value) {
    if(typeof(value)=="number")
        return false;

    if(typeof(value)=="object"){
        if(value === null)
            return true;
        return false;
    }

    if(convertUndefined(value) == "" || value.toUpperCase() == "NULL")
        return true;
    return false;
}

function isNull(value) {
    if(typeof(value)=="object"){
        if(value === null)
            return true;
        return false;
    }
    if(value.toUpperCase() == "NULL")
        return true;
    return false;
}

function convertEmptyToNumeric(value, numeric) {
    if(convertUndefined(value) == "")
        return numeric;
    return value;
}

function convertEmptyToZero(value) {
    return convertEmptyToNumeric(value, 0);
}

function convertUndefinedElementToZero(element) {
    if(convertUndefined(element) == "")
        return 0;
    if(convertUndefined(element.val()) != "")//c'est un input
        return element.val();
    else if(convertUndefined(element.text()) != "")//c'est un label
        return element.text();
    return 0;
}

function convertDate(inputFormat, locale) {
    if(!locale)
      locale = "fr";

    var d;
    if(!inputFormat)
      d = new Date();
    else
      d = new Date(inputFormat);

    moment.locale(locale);
    return moment(d).format('L');
}

function convertSageDate(inputFormat, locale) {
    if(!locale)
      locale = "fr";

    var d;
    if(!inputFormat)
      d = new Date();
    else
      d = new Date(inputFormat);

    if(d.getFullYear()*1 === 1899)
        return '';
    else{
      moment.locale(locale);
      return moment(d).format('L');
    }
}

function convertIsoDateToString(isoDate, format) {
  if(!format)
    format = 'DD/MM/YYYY';
  return moment(isoDate).format(format);
}

function changeDateFormatForSage (datestr, separator, new_separator, localeDisplayed){
    if(!new_separator)
      new_separator = '-';
    if(!localeDisplayed)
      localeDisplayed = "fr";

    var tab = datestr.split(separator);
    if(localeDisplayed === "fr")
      return [tab[2], tab[1], tab[0]].join(new_separator);
    else
      return [tab[2], tab[0], tab[1]].join(new_separator);
}

function replaceEmptyObjectValue(value, replace) {
    if(!replace)
        replace = '';

    if(typeof value === "object" && !(value instanceof Date)){//on supprime les {}
        value = replace;
    }
//  console.log("###### replaceEmptyObjectValue value returned : ",value);

    return value;
}

function replaceEmptyObjectValueMRender(value, decode) {
    if(decode)
        return decodeURI(replaceEmptyObjectValue(value));
    return replaceEmptyObjectValue(value);
}

function stringToBoolean(string){
//    console.log("### stringToBoolean, typeof : ", typeof string);
    if(typeof string == "boolean")
        return string;
	switch(string.toLowerCase()){
		case "true": case "yes": case "1": return true;
		case "false": case "no": case "0": return false;
		default: return Boolean(string);
	}
}

function isBoolean(string){
    if(typeof string == "boolean")
        return true;
    if(typeof string == "object")
        return false;
    if(convertUndefined(string) == "")
        return false;
    switch(string.toLowerCase()){
		case "true": case "yes": case "false": case "no": return true;
		default: false;
	}
}


var hasOwnProperty = Object.prototype.hasOwnProperty;
function isEmpty(obj) {

    // null and undefined are "empty"
    if (obj == null) return true;

    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;

    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9

    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }

    return true;
}

function ucFirst(string) {
	return string.substring(0, 1).toUpperCase() + string.substring(1).toLowerCase();
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isInt(n) {
    return isNumber(n) && n % 1 == 0;
}


function isValidHour(value){
    if(convertUndefined(value) == "" || isNaN(value) || value.indexOf(".")!=-1 || value*1>24 || value*1<0 ){
        return false;
    }
    return true;
}
function isValidMinute(value){
    if(convertUndefined(value) == "" || isNaN(value) || value.indexOf(".")!=-1 || value*1>59 || value*1<0 ){
        return false;
    }
    return true;
}

function setHtmlLang(lang){
    if(convertUndefined(lang) == ""){
        lang = eLanguage.substr(0,2);
    }
    document.documentElement.setAttribute('lang', lang);
}


//extending the attr function to return all attrs
(function ($) {
    // duck-punching to make attr() return a map
    var _old = $.fn.attr;
    $.fn.attr = function () {
        var a, aLength, attributes, map;
        if (this[0] && arguments.length === 0) {
            map = {};
            attributes = this[0].attributes;
            aLength = attributes.length;
            for (a = 0; a < aLength; a++) {
                map[attributes[a].name.toLowerCase()] = attributes[a].value;
            }
            return map;
        } else {
            return _old.apply(this, arguments);
        }
    }
}(jQuery));
