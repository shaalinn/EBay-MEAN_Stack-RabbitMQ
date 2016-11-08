var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String},
    fn: {type: String},
    ln: {type: String},
    email: {type: String},
    phno: {type: Number, default:''},
    bdate: {type: String},
    password: {type: String},
    addr: {type: String,default:''},
    city: {type: String,default:''},
    state: {type: String,default:''},
    last_login: {type: String,default:''}
});
/*var user_info = mongoose.model('user_info', userSchema);*/
var user_info = mongoose.model('user_info', userSchema);

module.exports = user_info;