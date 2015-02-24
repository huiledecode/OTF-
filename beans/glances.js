/*
 * GET / POST inserter
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un insert et d'insérer un
 * ou des objets json dans le model passé dans l'annuaire.
 */
var logger = require('log4js').getLogger('css');
var mongoose = require('mongoose');
var glances = require('glances');
//var genericModel = require(__dirname + '/../../../ressources/models/mongooseGeneric');

/*
 * SET users datas into MongoDB.
 */

exports.glances = {
    getData : function (req, cb) {
        var _controler = req.session.controler;
        var client = glances.createClient({ host: '10.40.0.40',password:'root' });
        client.call('getAll', function(error, value){
          if(error) {
            console.log('Erreur : ' + error.faultString);
            } 
            else {
                console.dir('valeur récupérer sur le serveur : ' + value);
                var datas = JSON.parse(value);
                for (var j=0;j<datas.fs.length;j++) {
                    datas.fs[j].used = FileConvertSize(datas.fs[j].used);
                    datas.fs[j].free = FileConvertSize(datas.fs[j].free);
                    datas.fs[j].size = FileConvertSize(datas.fs[j].size);
                }
                for (var j=0;j<datas.network.length;j++) {
                    datas.network[j].cumulative_rx = FileConvertSize(datas.network[j].cumulative_rx);
                    datas.network[j].rx = FileConvertSize(datas.network[j].rx);
                    datas.network[j].cumulative_cx = FileConvertSize(datas.network[j].cumulative_cx);
                    datas.network[j].cx = FileConvertSize(datas.network[j].cx);
                    datas.network[j].cumulative_tx = FileConvertSize(datas.network[j].cumulative_tx);
                    datas.network[j].tx = FileConvertSize(datas.network[j].tx);
                }
                for (var j=0;j<datas.processlist.length;j++) {
                    datas.processlist[j].memory_info[0] = FileConvertSize(datas.processlist[j].memory_info[0]);
                    datas.processlist[j].memory_info[0] = 'res :' + datas.processlist[j].memory_info[0]+'<br/>';
                    datas.processlist[j].memory_info[1] = FileConvertSize(datas.processlist[j].memory_info[1]);
                    datas.processlist[j].memory_info[1] = 'virt :' + datas.processlist[j].memory_info[1];
                }

                return cb(null, {result: datas , "state": req.session.login_info.state, room: _controler.room});
            }   
        });

        function FileConvertSize(aSize){
            if (aSize>0) {
                aSize = Math.abs(parseInt(aSize, 10));
                var def = [[1, 'octets'], [1024, 'ko'], [1024*1024, 'Mo'], [1024*1024*1024, 'Go'], [1024*1024*1024*1024, 'To']];
                for(var i=0; i<def.length; i++){
                    if(aSize<def[i][0]) return (aSize/def[i-1][0]).toFixed(2)+'&nbsp;'+def[i-1][1];
                }
            } else return '0&nbsp;Ko';
            
        };
    }

};