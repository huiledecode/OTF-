/*
 * GET / POST inserter
 * Il s'agit ici d'un Bean générique qui en fonction des données dans
 * l'annuaire otf json est capable de faire un insert et d'insérer un
 * ou des objets json dans le model passé dans l'annuaire.
 */
var logger = require('log4js').getLogger('glances');
logger.setLevel(GLOBAL.config["LOGS"].level);
var mongoose = require('mongoose');
var glances = require('glances');
//var genericModel = require(__dirname + '/../../../ressources/models/mongooseGeneric');

/*
 * SET users datas into MongoDB.
 */

exports.glances = {
  getData : function (req, cb) {
    var _controler = req.session.controler;
    var client = glances.createClient({ host: GLOBAL.config["GLANCES"].host});
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


        var tabMem = new Array();
        tabMem.push(datas.mem);
        for (var j=0;j<tabMem.length;j++) {
          tabMem[j].available = FileConvertSize(tabMem[j].available);
          tabMem[j].used = FileConvertSize(tabMem[j].used);
          tabMem[j].cached = FileConvertSize(tabMem[j].cached);
          tabMem[j].free = FileConvertSize(tabMem[j].free);
          tabMem[j].inactive = FileConvertSize(tabMem[j].inactive);
          tabMem[j].active = FileConvertSize(tabMem[j].active);
          tabMem[j].buffers = FileConvertSize(tabMem[j].buffers);
          tabMem[j].total = FileConvertSize(tabMem[j].total);
        }
        datas.mem = tabMem;

        var tabMemswap = new Array();
        tabMemswap.push(datas.memswap);
        for (var j=0;j<tabMemswap.length;j++) {
          tabMemswap[j].used = FileConvertSize(tabMemswap[j].used);
          tabMemswap[j].free = FileConvertSize(tabMemswap[j].free);
          tabMemswap[j].sout = FileConvertSize(tabMemswap[j].sout);
          tabMemswap[j].sin = FileConvertSize(tabMemswap[j].sin);
          tabMemswap[j].total = FileConvertSize(tabMemswap[j].total);
        }
        datas.memswap = tabMemswap;

        var tabCpu = new Array();
        tabCpu.push(datas.cpu);
        for (var j=0;j<tabCpu.length;j++)
          datas.cpu = tabCpu;

        var tabAlert = datas.alert;
        var tabAlertModif = new Array();
        var tabAttributs = ["date1", "date2", "alert_level", "alert_type", "value1", "value2", "value3", "value4", "value5", "value6", "value7"];
        for (var j=0;j<tabAlert.length;j++) {
          var tabValuesAlert = tabAlert[j];
          var objAlert = {};
          for (var v=0;v<tabValuesAlert.length;v++) {
            if (tabAttributs[v] === "date1" || tabAttributs[v] === "date2") {
              var  ladate = (new Date(tabValuesAlert[v]* 1000).toString());
              objAlert[tabAttributs[v]] = ladate;
            } else {
              objAlert[tabAttributs[v]] = tabValuesAlert[v];
            }
          } // fin parcours tableau valeurs dans alert
          tabAlertModif.push(objAlert);
        } // fin parcours tableau alert
        console.log('tabAlertModif : ', tabAlertModif);
        datas.alert = tabAlertModif;

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
  },

  getDatanetwork : function (req, cb) {
    var _controler = req.session.controler;
    var client = glances.createClient({ host: GLOBAL.config["GLANCES"].host});
    client.call('getAll', function(error, value) {
      if (error) {
        console.log('Erreur : ' + error.faultString);
      }
      else {
        console.dir('valeur récupérer sur le serveur : ' + value);

        var datas = JSON.parse(value);

        for (var j = 0; j < datas.network.length; j++) {
          datas.network[j].cumulative_rx = FileConvertSize(datas.network[j].cumulative_rx);
          datas.network[j].rx = FileConvertSize(datas.network[j].rx);
          datas.network[j].cumulative_cx = FileConvertSize(datas.network[j].cumulative_cx);
          datas.network[j].cx = FileConvertSize(datas.network[j].cx);
          datas.network[j].cumulative_tx = FileConvertSize(datas.network[j].cumulative_tx);
          datas.network[j].tx = FileConvertSize(datas.network[j].tx);
        }
        return cb(null, {result: datas.network, "state": req.session.login_info.state, room: _controler.room});
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

    }
  }
};
