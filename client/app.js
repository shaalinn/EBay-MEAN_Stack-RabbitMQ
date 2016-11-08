var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var assert = require('assert');
const session = require('express-session');
const MongoSessions = require('connect-mongo')(session);
var mongo = require('mongodb').MongoClient;
var db_url = 'mongodb://localhost:27017/ebay_db';
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ebay', {server:{poolSize:10}});
var passport = require('passport');
var flash = require('connect-flash');
require('./routes/passport')(passport);


var routes = require('./routes/index');
var users = require('./routes/users');
var signinup = require('./routes/signinup');
var header = require('./routes/header');
var postAd = require('./routes/postAdvertisement');
var profile = require('./routes/profile');
var product = require('./routes/product');
var shoppingCart = require('./routes/shoppingCart');
var pool = require("./routes/databasePool");
/*var cronBid = require('./routes/biddingChecker');*/
var checkout = require('./routes/checkout');
var userLogs = require('./routes/userLogs');
var bidLogs = require('./routes/bidLogs');

var app = express();
userLogs.initializeLogger();
bidLogs.initializeBidLogger();
app.use(passport.initialize());
app.use(passport.session());
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'login_test',
  resave: false,
  saveUninitialized: false,
  duration: 30*60 *1000,
  activeDuration: 5*60*1000,
  store: new MongoSessions({
    url: db_url
  })
}));
app.use(flash());


app.post('/login', function(req, res, next) {
  passport.authenticate('login', function(err, user, info) {
    if(err) {
      return next(err);
    }
    if(!user) {
      return res.send("invalid");
    }
    req.logIn(user, {session:false}, function(err) {
      if(err) {
        return next(err);
      }
      req.session.username = user.username;
      req.session.uid = user._id;
      setTimeout(function () {
        userLogs.insertLog("userID: " + req.session.uid + " logged in");
      }, 0);
      console.log("session initilized")
      return res.send("valid");
    })
  })(req, res, next);
});

app.get('/login', isAuthenticated, function(req, res) {
  res.send("valid");
});

function isAuthenticated(req, res, next) {
  if(req.session.username) {
    console.log(req.session.username);
    return next();
  }

  res.send("invalid");
};

app.get('/', routes.indexPage);
app.use('/users', users);
app.get('/signinup', signinup.loginpage);
app.post('/register', signinup.register);

app.get('/userData', header.userData);
app.get('/postAdvertisement', postAd.postAds);
app.get('/postAdvertisement/sellItem', postAd.sellItem);
app.get('/signout', signinup.signout);
app.get('/profile', profile.profile);
app.get('/productList', routes.productList);
app.get('/profileData', profile.profileData);
app.get('/itemForSale', profile.itemForSale);
app.get('/updateProfile', profile.updateProfile);
app.get('/product/:id', routes.productDetails);
app.get('/profile/:username', profile.seller);
app.get('/addToShoppingCart', product.addToCart);
app.get('/shoppingCart', shoppingCart.cart);
app.get('/cartData', shoppingCart.cartData);
app.get('/addToShoppingCartUpdate', shoppingCart.update);
app.get('/checkuser', signinup.checkuser);
app.get('/header', header.headerFile);
app.get('/search', header.search);
app.get('/placeBid', product.placeBid);
app.get('/checkoutPageData', shoppingCart.checkoutPageData);
app.get('/checkoutPage', checkout.checkout);
app.get('/checkoutData', checkout.checkoutData);
app.get('/checkout', checkout.checkoutFinal);
app.get('/allOrders', profile.allOrders);
app.get('/allBids', profile.allBids);
app.get('/allSolds', profile.allSolds);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/*pool.initializePool(15,50);*/

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
