/**
 * Created by shalin on 10/10/2016.
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

    /*var fetchBidTimeOverProducts = "SELECT p_id from advertisements WHERE isEnd<='" + currentTime + "' and ausel='auction' and isComplete='0'";
    console.log(fetchBidTimeOverProducts);
    mysql.fetchData(function (err, result1) {
        if (err) {
            console.log(err);
        } else if (result1 != null) {

            for (var i = 0; i < result1.length; i++) {
                /!*var selectBiddingRecords = "SELECT bid.u_id,MAX(bid.amount) as finalBid, bid.p_id from bid WHERE p_id='" + result1[i].p_id + "';";*!/
                var selectBiddingRecords = "SELECT bid.u_id, bid.amount as finalBid, bid.p_id FROM ebay.bid WHERE bid.amount IN(SELECT MAX(amount) as amount FROM ebay.bid) AND p_id='"+result1[i].p_id+"';";
                console.log(selectBiddingRecords);
                mysql.fetchData(function (err, result2) {
                    if (err) {
                        console.log(err);
                    } else if (result2 != null) {
                        for (var i = 0; i < result2.length; i++) {
                            var insertToOrder = "INSERT into orders (p_id,buyer_id,amount) VALUES ('" + result2[i].p_id + "','" + result2[i].u_id + "','" + result2[i].finalBid + "')";
                            console.log(insertToOrder);
                            mysql.storeData(function (err, result3) {
                                if (err) {
                                    console.log(err);
                                }
                                else if (result3 != null) {
                                    for (var i = 0; i < result1.length; i++) {
                                        var updateFlag = "UPDATE advertisements SET isComplete='1' where p_id='" + result1[i].p_id + "'";
                                        mysql.storeData(function (err, result4) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                console.log("Flag Updated");
                                            }

                                        }, updateFlag);
                                    }

                                }

                            }, insertToOrder);
                        }
                    }
                }, selectBiddingRecords);
            }

        }
    }, fetchBidTimeOverProducts);*/

});