var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//- var schema = new mongoose.Schema({ name: 'string', size: 'string' });
//- var Tank = mongoose.model('Tank', schema);
function mongooseGeneric(_schemaName, _schema, collection) {
  this.documentSchema = mongoose.Schema(_schema);
  this.document = db.model(_schemaName, this.documentSchema, collection); // db global

};

mongooseGeneric.prototype.initDocument = function(_schema, _schemaName, _callback) {
  this.documentSchema = mongoose.Schema(_schema);
    this.document = db.model(_schemaName, this.documentSchema);
  _callback();
};

mongooseGeneric.prototype.getDocument = function(_condition, _callback) {

  this.document.findOne(_condition, function (err, result){
    if(err) {
      _callback(err, null);
    }
    else {
      _callback(null, result);
    }
  });

};

mongooseGeneric.prototype.getDocuments = function(_condition, _callback) {

  this.document.find(_condition, function (err, result){
    if(err) {
      _callback(err, null);
    }
    else {
      _callback(null, result);
    }
  });

};

mongooseGeneric.prototype.deleteDocument = function(_condition, _callback) {

  this.document.remove(_condition, function (err, result){
    if(err) {
      _callback(err, null);
    }
    else {
      _callback(null, _condition);
    }
  });

};

mongooseGeneric.prototype.createDocument = function(_values, _callback) {

  var m = new this.document(_values);
  m.save(function (err, result) {
    if (err) {
      _callback(err, null);
    }
    else {
      _callback(null, _values);
    }
  });

};

mongooseGeneric.prototype.updateDocuments = function(_conditions, _values, _callback) {

  this.document.update(_conditions, { $set : _values}, { multi: true }, function(err, numberAffected) {
    if(err) {
      _callback(err, null);
    }
    else {
      _callback(null, numberAffected);
    }
  });
};

mongooseGeneric.prototype.updateDocument = function(_conditions, _values, _callback) {

  this.document.update(_conditions, { $set : _values}, function(err, numberAffected) {
    if(err) {
      _callback(err, null);
    }
    else {
      _callback(null, numberAffected);
    }
  });
};

exports.mongooseGeneric = mongooseGeneric;