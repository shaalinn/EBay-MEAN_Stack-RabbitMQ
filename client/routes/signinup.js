var ejs = require('ejs');
var bcrypt = require('bcrypt-nodejs');
var mysql = require('./mysql');
/*var mongo = require('./mongo');
var userLogs = require('./userLogs');
var db_url = "mongodb://localhost:27017/ebay_db";*/
var userLogs = require('./userLogs');
var user_info = require('../models/user_info');
var mq_client = require('../rpc/client');

exports.loginpage = function (req, res, next) {
    res.render('signinup');
};

exports.signout = function (req, res, next) {
    var logintime = getDateTime();
    console.log(logintime);
    var msg_payload = {
        "username" : req.session.username,
        "logintime" : logintime
    }
    mq_client.make_request('signOut_queue', msg_payload, function (err, results) {
        if(err){
            res.send(err);
        }else{
            userLogs.insertLog("userID: "+req.session.uid+" Signed out");
            req.session.destroy();
            res.render('signinup');
        }
    });


}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;

}

exports.login = function (req, res, next) {


    var username = req.param("username");
    var password = req.param("password");

    if(username != null && password != null){
        user_info.find({username: username}, function (err, user) {
            if (err) {
                res.send("invalid");
            }else{
                if(user.length > 0){
                    if (bcrypt.compareSync(password, user[0].password)) {
                        req.session.username = user[0].username;
                        req.session.uid = user[0]._id;
                        setTimeout(function () {
                            userLogs.insertLog("userID: " + req.session.uid + " logged in");
                        }, 0);
                        res.send("valid");
                        console.log('user found');
                    } else {
                        res.send("invalid");
                    }
                }else{
                    res.send("invalid");
                }
            }
        });

    }
}

exports.register = function(req, res, next) {
    if(req.param("username") != null && req.param("password") != null){
        var msg_payload = {
            "username" : req.param("username"),
            "password" : bcrypt.hashSync(req.param("password")),
            "fn" : req.param("fn"),
            "ln": req.param("ln"),
            "email" : req.param("email"),
            "phno" : req.param("phno"),
            "bdate" : req.param("bdate"),
            "addr" : req.param("addr"),
            "city" : req.param("city"),
            "state" : req.param("state")
        };

        mq_client.make_request('register_queue', msg_payload, function (err, results) {
            if(err){
                console.log(err);
            }else{
                res.send("right");
            }
        });
    }
};

exports.checkuser = function (req, res, next) {

    var msg_payload = {
        "username" : req.param("username")
    }
    mq_client.make_request('checkUser_queue', msg_payload, function (err, results) {
        if(err){
            res.send("unavailable");
        }else{
            if(results.data == "unavailable"){
                res.send("unavailable");
            }else if(results.data == "unavailable"){
                res.send("available");
            };

        }
    });
}
