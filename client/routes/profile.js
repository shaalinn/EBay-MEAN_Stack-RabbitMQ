/**
 * Created by shalin on 10/3/2016.
 */
var ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs');
var mysql = require('./mysql');
var mongo = require('./mongo');
var userLogs = require('./userLogs');
var db_url = "mongodb://localhost:27017/ebay_db";
var advertisements = require('../models/advertisements');
var bids = require('../models/bid');
var user_info = require('../models/user_info');
var orders = require('../models/orders');
var shoppingcart = require('../models/shoppingcart');
var ObjectId = require('mongoose').Types.ObjectId;
var mq_client = require('../rpc/client');

exports.profile = function (req, res, next) {
    if(req.session.uid == null){
        res.render('signinup');
    }else{
        setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" opened Profile page");},0);
        res.render('profile');
    }

};

exports.profileData = function (req, res, next) {

    var msg_payload = {
        "username" : req.session.username,
    };
    mq_client.make_request('profileData_queue', msg_payload, function (err, results) {
        if(err){
            res.send(err);
        }else{
            res.send(results.data);
        }
    });
};

exports.itemForSale = function (req, res, next) {
    var msg_payload = {
        "u_id" : req.session.uid,
    };
    mq_client.make_request('itemForSale_queue', msg_payload, function (err, results) {
        if(err){
            console.log(err);
        }else{
            res.send(results.data);
        }
    });
};

exports.allOrders = function (req, res, next) {
    var msg_payload = {
        "u_id" : req.session.uid,
    };
    mq_client.make_request('allOrders_queue', msg_payload, function (err, results) {
        if(err){
            console.log(err);
        }else{
            res.send(results.data);
        }
    });
};

exports.allBids = function (req, res, next) {
    var msg_payload = {
        "u_id" : req.session.uid,
    };
    mq_client.make_request('allBids_queue', msg_payload, function (err, results) {
        if(err){
            console.log(err);
        }else{
            res.send(results.data);
        }
    });
};

exports.allSolds = function (req, res, next) {
    var msg_payload = {
        "u_id" : req.session.uid,
    };
    mq_client.make_request('allSolds_queue', msg_payload, function (err, results) {
        if(err){
            console.log(err);
        }else{
            res.send(results.data);
        }
    });
};

exports.updateProfile = function (req, res, next) {
    var msg_payload = {
        "username" : req.session.username,
        "fn" : req.param("fnn"),
        "ln" : req.param("lnn"),
        "phno" : Number(req.param("phnon")),
        "bdate" : req.param("bdaten"),
        "addr" : req.param("addrn"),
        "city" : req.param("cityn"),
        "state" : req.param("staten")
    };
    mq_client.make_request('updateProfile_queue', msg_payload, function (err, results) {
        if(err){
            res.send(err);
        }else{
            setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" updated profile");},0);
            console.log("profile updated");
            res.send("done");
        }
    });
};

exports.seller = function (req, res, next) {
    var msg_payload = {
        "username" : req.params.username,
    };
    mq_client.make_request('seller_queue', msg_payload, function (err, results) {
        if(err){
            res.send(err);
        }else{
            /*results.push({"handler":"true"});*/
            setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" opened profile of "+ req.params.username);},0);
            console.log(results);
            res.render('profilePage', {result : results, handler:"true"});
        }
    });
};
