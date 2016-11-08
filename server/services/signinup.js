/**
 * Created by shalin on 11/2/2016.
 */
var user_info = require('../models/user_info');
var bcrypt = require('bcrypt-nodejs');

exports.register_request = function(msg, callback) {

    var res={};
    console.log("register queue request");

    var user = new user_info();

    user.username = msg.username;
    user.password = msg.password;
    user.fn = msg.fn;
    user.ln = msg.ln;
    user.bdate = msg.bdate;
    user.phno = msg.phno;
    user.addr = msg.addr;
    user.city = msg.city;
    user.state = msg.state;
    user.email = msg.email;

    user.save(function (err) {
        if(err){
            console.log(err);
        }else{
            console.log("server side console");
            res.code = 200;
            console.log(res);
            callback(null,res);
        }


    });
}

exports.login_request = function(msg, callback) {
    var res={};
    console.log("login queue request");

    user_info.findOne({username: msg.username}, function (err, user) {
        if(err){
            return callback(err);
        }
        if(!user){
            return callback(null, false);
        }
        if(user){
            if(bcrypt.compareSync(msg.password, user.password)){
                console.log(user.username);
                callback(null, user);
            }else{
                return callback(null, false);
            }
        }

    });
}

exports.checkUser_request = function(msg, callback) {
    var res={};
    console.log("check user request");
    var username = msg.username;
    user_info.find({username: username}, function (err, user) {
        if(err){
            console.log("error occurred");
            res.code = 200;
            res.data = "unavailable";
            callback(null,res);
        }
        if(!user){
            console.log("user not found");
            res.code = 200;
            res.data = "available";
            callback(null, res);
        }
        if(user.length>0){
            console.log("user found");
            res.code = 200;
            res.data = "unavailable";
            callback(null, res);
        }

    });
}
exports.signOut_request = function(msg, callback) {
    var res = {};
    console.log("sign out request");
    var username = msg.username;
    var logintime = msg.logintime;
    user_info.update({username: username}, {$set: {last_login: logintime}}, function (err, user) {
        if (err) {
            callback(err);
        }
        else if (user) {
            res.code = 200;
            callback(null, res);
        }
    });
}