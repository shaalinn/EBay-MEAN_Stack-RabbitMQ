/**
 * Created by shalin on 9/30/2016.
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

exports.userData = function (req, res, next) {
    var json_response = {
        username: req.session.username
    }
    res.send(json_response);
}

exports.profile = function (req, res, next) {
    setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" clicked on profile Link");},0);
    res.render('profile');
}

exports.headerFile = function (req, res, next) {
    res.render('header');
};

exports.search = function (req, res, next) {
    var msg_payload = {
        "searchQ" : req.param("searchQ"),
    };
    mq_client.make_request('searchQ_queue', msg_payload, function (err, results) {
        if(err){
            console.log(err);
        }else{
            setTimeout(function(){userLogs.insertLog("userID: "+req.session.uid+" searched query: "+req.param("searchQ") );},0);
            res.send(results.data);
        }
    });
};