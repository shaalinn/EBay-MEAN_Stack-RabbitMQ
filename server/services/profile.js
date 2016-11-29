/**
 * Created by shalin on 11/3/2016.
 */
var user_info = require('../models/user_info');
var advertisements = require('../models/advertisements');
var shoppingcart = require('../models/shoppingcart');
var bid = require('../models/bid');
var orders = require('../models/orders');
var ObjectId = require('mongoose').Types.ObjectId;
exports.profileData_request = function(msg, callback) {
    var res={};
    console.log("profileData queue request");
    user_info.find({username: msg.username}, function (err, user) {
        if (err) {
            callback(err,res);
        }
        else {
            console.log("profileData queue");
            res.code = 200;
            res.data = user;
            callback(null,res)
        }
    });
};

exports.itemForSale_request = function(msg, callback) {
    var res={};
    console.log("itemForSale request");
    advertisements.find({u_id: new ObjectId(msg.u_id)},function (err, user) {
        if(err){
            callback(err,res);
        }else{
            console.log("itemForSale queue");
            res.code = 200;
            res.data = user;
            callback(null,res)
        }
    });
};

exports.allOrders_request = function(msg, callback) {
    var res={};
    console.log("allOrders request");
    orders.find({u_id: new ObjectId(msg.u_id)}).populate('p_id').exec(function (err, order) {
        if(err){
            callback(err,res);
        }else{
            console.log("allOrders queue");
            res.code = 200;
            res.data = order;
            callback(null,res)
        }
    });
};

exports.allBids_request = function(msg, callback) {
    var res={};
    console.log("allBids request");
    bid.find({u_id: new ObjectId(msg.u_id)}).populate('p_id').exec(function (err, bid) {
        if(err){
            callback(err,res);
        }else{
            console.log("allBids queue");
            res.code = 200;
            res.data = bid;
            callback(null,res)
        }
    });
};

exports.allSolds_request = function(msg, callback) {
    var res={};
    console.log("allSolds request");
    advertisements.find({u_id: new ObjectId(msg.u_id)},function (err, products) {
        if(err){
            callback(err,res);
        } else{
            orders.find({p_id: {$in : products}}).populate('u_id').populate('p_id').exec(function (err, sold) {
                if(err){
                    callback(err,res);
                }else{
                    console.log("allSolds queue");
                    res.code = 200;
                    res.data = sold;
                    callback(null,res);
                }
            });
        }
    });
};

exports.updateProfile_request = function(msg, callback) {
    var res={};
    console.log("updateProfile request");
    user_info.update({username:msg.username},{$set:{fn:msg.fn,ln:msg.ln,phno:msg.phno,bdate:msg.bdate,addr:msg.addr,city:msg.city,state:msg.state}},function (err,user) {
        if (err) {
            callback(err,res);
        }
        else if(user){
            console.log("updateProfile queue");
            res.code = 200;
            callback(null,res);
        }
    });
};
exports.seller_request = function(msg, callback) {
    var res={};
    console.log("seller request");
    user_info.find({username: msg.username}, function (err, user) {
        if (err) {
            callback(err,res);
        }
        else {
            console.log("seller queue");
            res.code = 200;
            res.data = user;
            callback(null,res);
        }
    });
};