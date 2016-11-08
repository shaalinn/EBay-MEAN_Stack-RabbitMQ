/**
 * Created by shalin on 10/6/2016.
 */
var ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs');
var mysql = require('./mysql');
var userLogs = require('./userLogs');
var bidLogs = require('./bidLogs');
var user_info = require('../models/user_info');
var advertisements = require('../models/advertisements');
var shoppingcart = require('../models/shoppingcart');
var bid = require('../models/bid');
var ObjectId = require('mongoose').Types.ObjectId;
var mq_client = require('../rpc/client');

exports.addToCart = function (req, res, next) {
    var msg_payload = {
        "p_id" : req.param("p_id"),
        "u_id" : req.session.uid,
        "quantity" : req.param("quantity"),
        "total": req.param("total"),
    };
    mq_client.make_request('addToCart_queue', msg_payload, function (err, results) {
        if(err){
            console.log(err);
        }else{
            setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" added item: "+req.param("p_id")+" in shopping cart");},0);
            res.send("done");
        }
    });
};

exports.placeBid = function (req, res, next) {
    var msg_payload = {
        "amount" : req.param("bidPrice"),
        "time" : Math.floor(Date.now()/1000),
        "p_id" : req.param("p_id"),
        "u_id": req.session.uid
    };
    mq_client.make_request('placeBid_queue', msg_payload, function (err, results) {
        if(err){
            console.log(err);
        }else{
            setTimeout(function(){bidLogs.insertBidLog("userID: "+req.session.uid+" placed bid on: "+req.param("p_id")+" of price: "+req.param("bidPrice"));},0);
            console.log("Data Inserted");
        }
    });
    var msg_payload1 = {
        "p_id": req.param("p_id"),
        "price": req.param("bidPrice")
    };
    mq_client.make_request('placeBidUpdate_queue', msg_payload1, function (err, results) {
        if(err){
            console.log(err);
        }else{
            res.send("done");
        }
    });
};