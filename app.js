var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://tunguyen:123456@ds149557.mlab.com:49557/demo-shopping');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
require('./config/passport');
var MongoStore = require('connect-mongo')(session);

var indexRoutes = require('./routes/client/index');
var userRoutes = require('./routes/client/users');
var adminIndexRoutes = require('./routes/admin/index');
var adminProductRoutes = require('./routes/admin/products');
var adminCategoryRoutes = require('./routes/admin/categories');
var adminUserRoutes = require('./routes/admin/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(flash());
app.use(session({
    secret: 'tudeptrai',
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: { maxAge: 180 * 60 * 1000 }
}));

app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

//Global variable
app.use(function (req, res, next) {
    res.locals.session = req.session;
    if(req.url.indexOf('script') >= 0){
        res.redirect('/');
    }
    next();
});

app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    res.locals.messages = require('express-messages')(req, res);
    res.locals.moment = require('moment');
    next();
});

app.use('/', indexRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminIndexRoutes);
app.use('/admin/products', adminProductRoutes);
app.use('/admin/categories', adminCategoryRoutes);
app.use('/admin/users', adminUserRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
