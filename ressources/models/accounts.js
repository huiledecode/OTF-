/**
 * Created by epa on 10/06/14.
 */

// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt');
console.log(" accounts call !!");
// define the schema for our account model
var accountSchema = mongoose.Schema({

    login        : String,
    password     : String
});

// methods ======================
// generating a hash
accountSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
accountSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for accounts and expose it to our app
//--h ttps://www.youtube.com/watch?v=5e1NEdfs4is
module.exports = mongoose.model('Accounts_User', accountSchema,'accounts');
//mongoose.model('Accounts', accountSchema,'Accounts');