/**
 * Created by shalin on 10/15/2016.
 */
"use strict";
const winston = require('winston');
const fs = require('fs');
const env = process.env.NOV_ENV || 'development';
const logDir = 'log';
var logger;


exports.initializeBidLogger = function () {
    console.log("inside initialize");
    if (!fs.existsSync(logDir)) {
        fs.mkdirSync(logDir);
    }else{

    }

    const tsFormat = () => (new Date()).toLocaleString();

    logger = new (winston.Logger)({
        transports: [
            new(winston.transports.File)({
                filename : `${logDir}/BidLogs.log`,
                timestamp: tsFormat,
                level: env === 'development' ? 'debug' : 'info'
            })
        ]
    });

}



exports.insertBidLog = function (msg) {

    logger.info(msg);
}
