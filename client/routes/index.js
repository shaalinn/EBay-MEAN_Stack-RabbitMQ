var ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs');
var mysql = require('./mysql');
/*var mongo = require('./mongo');
 var userLogs = require('./userLogs');
 var db_url = "mongodb://localhost:27017/ebay_db";*/
var userLogs = require('./userLogs');
var user_info = require('../models/user_info');
var advertisements = require('../models/advertisements');
var ObjectId = require('mongoose').Types.ObjectId;
var mq_client = require('../rpc/client');

/* GET home page. */
exports.indexPage = function(req, res, next) {

    if(req.session.uid == null){
        res.render('signinup');
    }else{
        setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" opened home page");},0);
        res.render('index');
    }
};

exports.productList = function (req, res, next) {
    var msg_payload = {
            "u_id" : req.session.uid,
    };
    mq_client.make_request('productList_queue', msg_payload, function (err, results) {
        if(err){
            console.log(err);
        }else{
            res.send(results.data);
        }
    });
};

exports.productDetails = function (req, res, next) {
    if(req.session.uid == null){
        res.render('signinup');
    }else{
        var msg_payload = {
            "p_id" : req.params.id
        };
        mq_client.make_request('productDetails_queue', msg_payload, function (err, results) {
            if(err){
                console.log(err);
            }else{
                console.log("request reeeeeeeeepppppppppllllllllyyyyyyy");
                var isend = results.data[0].isEnd;
                console.log(Math.floor(Date.now()/1000));
                var currenttime = Math.floor(Date.now()/1000);
                isend = isend - currenttime;
                var remain = convertTime(Number(isend));
                setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" open ProductID: "+req.params.id);},0);
                res.render('product', {result : results.data, remain: remain});
            }
        });
    };
};


function convertTime(isend) {
    var totalSec = isend;
    var days =  Math.floor(totalSec / 86400);
    var hours = parseInt( totalSec / 3600 ) % 24;
    var minutes = parseInt( totalSec / 60 ) % 60;
    var seconds = totalSec % 60;
    console.log("from function" + days+ " Days "+hours+ ":" +minutes+ ":"+seconds);
    return days+ " Days "+hours+ ":" +minutes+ ":"+seconds ;
}