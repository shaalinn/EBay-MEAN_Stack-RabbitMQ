/**
 * Created by shalin on 11/6/2016.
 */
var ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs');


var userLogs = require('../../client/routes/userLogs');
var db_url = "mongodb://localhost:27017/ebay_db";
var advertisements = require('../models/advertisements');
var bids = require('../models/bid');
var user_info = require('../models/user_info');
var orders = require('../models/orders');
var shoppingcart = require('../models/shoppingcart');
var ObjectId = require('mongoose').Types.ObjectId;
var cron = require('node-cron');

cron.schedule('*/5 * * * * *', function (req, res, next) {


    "use strict";
    var currentTime = Math.floor(Date.now() / 1000);
    advertisements.find({isEnd: {$lte: currentTime}, ausel: 'auction', isComplete: '0'}, function (err, result1) {
        if (err) {
            throw err;
        }
        else {

            for (let i = 0; i < result1.length; i++) {

                bids.findOne({p_id: result1[i]._id}, 'amount').sort('-amount').exec(function (err, maxBid) {
                    var temp = [];
                    temp.push(maxBid.amount);
                    bids.find({amount: {$in: temp}, p_id: result1[i]._id}, function (err, result2) {
                        if (err) {
                            throw err;
                        }
                        else {
                            var order = new orders();
                            order.p_id = result2[i].p_id;
                            order.u_id = result2[i].u_id;
                            order.amount = result2[i].amount;
                            order.quantity = 1;


                            order.save(function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {

                                    var conditions = {_id: result1[i]._id};
                                    var update = {
                                        'isComplete':1

                                    };
                                    advertisements.update(conditions, update, function (err, result4) {

                                        if (err) {
                                            throw err;
                                        } else {
                                            console.log("Flag Updated");
                                        }
                                    });
                                }
                            });


                        }
                    });

                });
            }

        }
    });
});