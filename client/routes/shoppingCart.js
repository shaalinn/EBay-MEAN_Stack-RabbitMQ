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

exports.cart = function (req, res, next) {
    if(req.session.uid == null){
        res.render('signinup');
    }else{
        setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" opened cart");},0);
        res.render('shoppingCart');
    }
};

exports.cartData= function (req, res, next) {
    var msg_payload = {
        "u_id" : req.session.uid
    };
    mq_client.make_request('cartData_queue', msg_payload, function (err, results) {
        if(err){
            console.log(err);
        }else{
            setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" opened shopping cart");},0);
            console.log("mongo shopping cart");
            console.log(results);
            res.send(results.data);
        }
    });
};

exports.update = function (req, res, next) {
    var msg_payload = {
        "p_id" : req.param("p_id"),
        "quantity" : req.param("quantity"),
        "total" : req.param("total"),
        "s_id" : req.param("s_id"),
        "u_id" : req.session.uid
    };
    mq_client.make_request('updateCart_queue', msg_payload, function (err, results) {
        if(err){
            console.log(err);
        }else{
            setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" opened shopping cart");},0);
            console.log("mongo shopping cart");
            res.send(results.data);
        }
    });
};

exports.checkoutPageData = function (req, res, next) {
    var grandTotal = Number(req.param("grandTotal"));
    req.session.grandTotal = grandTotal;
    setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" opened checkout page");},0);
    res.send("success");
};