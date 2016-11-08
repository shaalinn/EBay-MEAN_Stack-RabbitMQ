/**
 * Created by shalin on 10/26/2016.
 */
var mongoose = require('mongoose');

var user_info = require('../models/user_info');
var advertisements = require('../models/advertisements');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
    quantity: {type: Number},
    grandTotal: {type: Number},
    amount: {type: Number},
    p_id: {
        type: Schema.Types.ObjectId,
        ref: 'advertisements'},
    u_id:{
        type: Schema.Types.ObjectId,
        ref: 'user_info'
    }
});

var orders = mongoose.model('orders', orderSchema);

module.exports = orders;