/**
 * Created by shalin on 10/2/2016.
 */
var ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs');
var mysql = require('./mysql');
var mongo = require('./mongo');
var userLogs = require('./userLogs');
var db_url = "mongodb://localhost:27017/ebay_db";
var advertisements = require('../models/advertisements');
var mq_client = require('../rpc/client');

exports.postAds = function (req, res, next) {
    if(req.session.uid == null){
        res.render('signinup');
    }else{
        setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" opened selling page");},0);
    res.render('postAdvertisement');
    }
};

exports.sellItem = function (req, res, next) {
    var quant = Number(req.param("quant"));
    if(quant == 0){
        var currentTime = Math.floor(Date.now()/1000);
        var isend = currentTime + (96*60*60) ;
        var msg_payload = {
            "p_name" : req.param("pName"),
            "p_desc" : req.param("pDescription"),
            "price" : req.param("price"),
            "source": req.param("from"),
            "isCreated" : currentTime,
            "isEnd" : isend,
            "isComplete" : 0,
            "ausel" : "auction",
            "quantity" : 1,
            "u_id" : req.session.uid
        };

        mq_client.make_request('postAdvertisement_queue', msg_payload, function (err, results) {
            if(err){
                res.send(err);
            }else{
                setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" posted item: "+req.param("pName")+" for auction");},0);
                res.send("done");
            }
        });
    }else if(quant > 0){
        var msg_payload = {
            "p_name" : req.param("pName"),
            "p_desc" : req.param("pDescription"),
            "price" : req.param("price"),
            "source": req.param("from"),
            "isCreated" : "",
            "isEnd" : "",
            "isComplete" : 0,
            "ausel" : "sell",
            "quantity" : Number(req.param("quant")),
            "u_id" : req.session.uid
        };

        mq_client.make_request('postAdvertisement_queue', msg_payload, function (err, results) {
            if(err){
                res.send(err);
            }else{
                setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" posted item: "+req.param("pName")+" for sell");},0);
                res.send("done");
            }
        });

    }

};