/**
 * Created by shalin on 11/3/2016.
 */
var user_info = require('../models/user_info');
var advertisements = require('../models/advertisements');
var shoppingcart = require('../models/shoppingcart');
var bid = require('../models/bid');
var ObjectId = require('mongoose').Types.ObjectId;
exports.addToCart_request = function(msg, callback) {
    var res={};
    console.log("addToCart queue request");
    var cart = new shoppingcart();
    cart.u_id = msg.u_id;
    cart.p_id = msg.p_id;
    cart.quantity = msg.quantity;
    cart.total = msg.total;
    cart.save(function (err) {
        if (err) {
            callback(err,res);;
        }
        else {
            console.log("addToCart queue");
            res.code = 200;
            callback(null,res);
        }
    });
};
exports.placeBid_request = function(msg, callback) {
    var res={};
    console.log("placeBid queue request");
    var bidP = new bid();
    bidP.amount = msg.amount;
    bidP.time = msg.time;
    bidP.p_id = msg.p_id;
    bidP.u_id = msg.u_id;
    bidP.save(function (err) {
        if (err) {
            callback(err,res);
        }
        else {
            console.log("place bid queue");
            res.code = 200;
            callback(null,res);
        }
    });
};
exports.placeBidUpdate_request = function(msg, callback) {
    var res={};
    console.log("placeBidUpdate queue request");
    advertisements.update({_id: new ObjectId(msg.p_id)},{$set: {price: msg.price}},function (err,user) {
        if (err) {
            callback(err,res);
        }
        else if(user){
            console.log("placeBidUpdate queue");
            res.code = 200;
            callback(null,res);
        }
    });
};