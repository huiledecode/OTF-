/**
 * Created by epa on 17/06/14.
 */

//--
// Profil [User,Trainning Cyto, Cyto, Patho,Admin]
//-- Specific Rights :


// load the things we need
var mongoose = require('mongoose');
// define the schema for our account model
var profileSchema = mongoose.Schema({

    login: String,
    password: String
});

// methods ======================

// create the model for accounts and expose it to our app
//--h ttps://www.youtube.com/watch?v=5e1NEdfs4is
module.exports = mongoose.model('Profiles', accountSchema, 'Profiles');
//mongoose.model('Accounts', accountSchema,'Accounts');