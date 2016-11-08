/**
 * Created by shalin on 11/3/2016.
 */
var user_info = require('../models/user_info');
var advertisements = require('../models/advertisements');
var shoppingcart = require('../models/shoppingcart');
var bid = require('../models/bid');
var orders = require('../models/orders');
var ObjectId = require('mongoose').Types.ObjectId;

exports.checkoutData_request = function(msg, callback) {
    var res={};
    console.log("checkoutData request");
    console.log(msg.u_id);
    user_info.find({username: msg.username}, function (err, user) {
        if(err){
            callback(err,res);
        }else{
            console.log(user);
            console.log("checkoutData queue");
            res.code = 200;
            res.data = user;
            callback(null,res)
        }
    });
};

exports.checkoutFinal_request = function(msg, callback) {
    var res={};
    console.log("checkoutFinal request");
    console.log(msg.u_id);
    shoppingcart.find({u_id: new ObjectId(msg.u_id)}, function (err, result1) {
        if(err){
            callback(err,res);
        }else if(result1 != null){
            for(let i=0;i<result1.length;i++){
                var order = new orders();
                order.p_id = result1[i].p_id;
                order.u_id = result1[i].u_id;
                order.amount = result1[i].total;
                order.grandTotal = msg.grandTotal;
                order.quantity = result1[i].quantity;
                order.save(function (err, results2) {
                    if(err){
                        callback(err,res);
                    }else{
                        advertisements.find({_id: new ObjectId(result1[i].p_id)},function (err, quantPr) {
                            if(err){
                                callback(err,res);
                            }else{
                                advertisements.update({_id: new ObjectId(result1[i].p_id)}, {$set: {quantity: quantPr[0].quantity - result1[i].quantity}},function (err, result) {
                                    if(err){
                                        callback(err,res);
                                    }else{
                                        shoppingcart.find({u_id: new ObjectId(msg.u_id), p_id: new ObjectId(result1[i].p_id)},function (err, removeRes) {
                                            if(err){
                                                callback(err,res);
                                            }else{
                                                shoppingcart.remove(removeRes._id,function (err) {
                                                    if(err){
                                                        callback(err,res);
                                                    }else{
                                                        console.log("cart flushed");
                                                    }
                                                });
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
            res.code = 200;
            callback(null,res)
        }
    });
};