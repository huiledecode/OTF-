 /**
* Created by epa on 09/03/15.
*/
//--
var util = require("util");
//
var fs = require('fs');
//--
//--

module.exports = {
   loadOtfLogo: function (file) {
       //--
       // try to Load File
       try {
            otf_logo = fs.readFileSync(file, 'utf8');
            //--
           //-- log
             console.log(otf_logo.toString());
           //--
       } catch (err) {
           console.error("OTF² Load OTF LOGO File ERROR mess [%s] ", util.inspect(err.message));
       }
   }


}
