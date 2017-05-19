var logger = require('log4js').getLogger('scheduler');
logger.setLevel(GLOBAL.config["LOGS"].level);
var mongoose = require('mongoose');
var genericModel = require('../otf_core/lib/otf_mongooseGeneric');
var cronJob = require('node-cron');

/** Initialisation du job, syntaxe identique à crontab sous linux */
var job = cronJob.schedule('*/5 * * * *', function() {
        // Runs every N mn all the days
        logger.debug('----> cron toute les 5 minutes ...');
        /** todo : écrire ici l'action qui permet d'appeler une url via un request http (wget ou module request)
         *  todo : pour déclencher une mise à jour de tarif
         */
    }, function() {
        // Dans cette fonction on peut mettre des traitements à réaliser lorsque le job s'arrête (stop)
    },
    false, /* si true démarre le job de suite */
    null /* Time zone du job. */
);

function startCron() {
    job.start();
}

exports.startCron = startCron;
