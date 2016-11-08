/**
 * Created by shalin on 10/29/2016.
 */
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var user_info = require('../models/user_info');
var flash = require('connect-flash');
var bcrypt = require('bcrypt-nodejs');
var mq_client = require('../rpc/client');


module.exports = function (passport) {
    passport.use('login', new LocalStrategy({

        usernameField: 'username',
        passwordField: 'password'

    },function (username, password, done) {

        var msg_payload = {"username": username, "password": password};
        mq_client.make_request('login_queue', msg_payload, function (err, results) {
            if (err) {
                console.log(err);
            }
            else {
                done(null, results);
            }
        });
    }));
};

