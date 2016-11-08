/**
 * Created by shalin on 10/11/2016.
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
var orders = require('../models/orders');
var ObjectId = require('mongoose').Types.ObjectId;
var mq_client = require('../rpc/client');

"user strict";
exports.checkout = function (req, res, next) {
    res.render('checkout');
};

exports.checkoutData = function (req, res, next) {
    var msg_payload = {
        "username" : req.session.username,
    };
    mq_client.make_request('checkoutData_queue', msg_payload, function (err, results) {
        if(err){
            console.log(err);
        }else{
            results.data[0].grandTotal = req.session.grandTotal;
            console.log("checkoutttttttt daaaaaaataaaaaaaa");
            console.log(results);
            res.send(results.data);
        }
    });
};
exports.checkoutFinal = function (req, res, next) {

    var msg_payload = {
        "username" : req.session.username,
        "u_id" : req.session.uid,
        "grandTotal" : req.session.grandTotal
    };
    mq_client.make_request('checkoutFinal_queue', msg_payload, function (err, results) {
        if(err){
            console.log(err);
        }else{
            setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" bought items");},0);
            res.send("done");
        }
    });
};