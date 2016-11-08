/**
 * Created by shalin on 11/3/2016.
 */
var user_info = require('../models/user_info');
var advertisements = require('../models/advertisements');
var shoppingcart = require('../models/shoppingcart');
var bid = require('../models/bid');
var ObjectId = require('mongoose').Types.ObjectId;

exports.productList_request = function(msg, callback) {
    var res={};
    console.log("productList request");
    var u_id = msg.u_id;
    advertisements.find({u_id: {$ne: new ObjectId(u_id)}, isComplete: {$ne: 1}, quantity: {$gt: 0}}, function (err, result) {
        if (err) {
            callback(err,res);
        }
        else {
            console.log("productList queue");
            res.code = 200;
            res.data = result;
            callback(null,res);
        }
    });
};
exports.searchQ_request = function(msg, callback) {
    var res={};
    console.log("searchQ request");
    advertisements.find({p_name: {"$regex":msg.searchQ}, isComplete: {$ne: 1}, quantity: {$gt: 0}}, function (err, result) {
        if (err) {
            callback(err,res);
        }
        else {
            console.log("searchQ queue");
            res.code = 200;
            res.data = result;
            callback(null,res);
        }
    });
};

exports.productDetails_request = function(msg, callback) {
    var res={};
    console.log("productDetails request");
    var p_id = msg.p_id;
    advertisements.find({_id: p_id}).populate('u_id').exec(function (err, user) {
        if (err) {
            callback(err,res);
        }
        else {
            console.log("productDetails queue");
            res.code = 200;
            res.data = user;
            callback(null,res);
        }
    });
};