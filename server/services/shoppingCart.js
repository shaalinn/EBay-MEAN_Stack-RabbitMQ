/**
 * Created by shalin on 11/3/2016.
 */
var user_info = require('../models/user_info');
var advertisements = require('../models/advertisements');
var shoppingcart = require('../models/shoppingcart');
var bid = require('../models/bid');
var orders = require('../models/orders');
var ObjectId = require('mongoose').Types.ObjectId;

exports.cartData_request = function(msg, callback) {
    var res={};
    console.log("cartData request");
    console.log(msg.u_id);
    shoppingcart.find({u_id: new ObjectId(msg.u_id)}).populate('u_id').populate('p_id').exec(function (err, result) {
        if(err){
            callback(err,res);
        }else{
            console.log(result);
            console.log("cartData queue");
            res.code = 200;
            res.data = result;
            callback(null,res)
        }
    });
};

exports.updateCart_request = function(msg, callback) {
    var res={};
    console.log("updateCart request");
    shoppingcart.update({_id: new ObjectId(msg.s_id)}, {$set:{quantity:msg.quantity,total:msg.total}},function (err, result) {
        if(err){
            callback(err,res);
        }else{
            shoppingcart.find({u_id: new ObjectId(msg.u_id)}).populate('u_id').populate('p_id').exec(function (err, result) {
                if(err){
                    callback(err,res);
                }else{
                    console.log("updateCart queue");
                    res.code = 200;
                    res.data = result;
                    callback(null,res)

                }
            });
        }
    });
};