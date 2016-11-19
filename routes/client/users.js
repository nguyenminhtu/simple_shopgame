var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

User = require('../../models/user');
Category = require('../../models/category');
Order = require('../../models/order');
Cart = require('../../models/cart');

router.get('/signup', function (req, res) {
    Category.find().exec(function (err, cate){
        res.render('client/signup', {title: 'Shop Game: Register User', menu: cate, csrfToken: req.csrfToken()});
    });
});

router.get('/signin', function (req, res) {
    Category.find().exec(function (err, cate){
        res.render('client/signin', {title: 'Shop Game: Sign In', menu: cate, csrfToken: req.csrfToken()});
    });
});

router.post('/signup', function (req, res) {
    var fullname = req.body.fullname;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var confirm = req.body.confirmpassword;

    var newUser = new User();
    newUser.fullname = fullname;
    newUser.email = email;
    newUser.username = username;
    newUser.password = newUser.encryptPassword(password);
    newUser.level = 1;
    newUser.save(function (err, result) {
        if(err){
            res.end(err);
        }
        if(req.session.oldUrl){
            var oldUrl = req.session.oldUrl;
            res.redirect(oldUrl);
            req.session.oldUrl = null;
        }else{
            res.redirect('/users/profile');
        }
    });
});

router.post('/signin', passport.authenticate('local.signin', {failureRedirect: '/users/signin', failureFlash: true}), function (req, res) {
    if(req.session.oldUrl){
        var oldUrl = req.session.oldUrl;
        res.redirect(oldUrl);
        req.session.oldUrl = null;
    }else{
        res.redirect('/users/profile');
    }
});

router.get('/signout', ensureAuthenticated, function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/check/:username', function (req, res) {
    var username = req.params.username;
    var query = {username: username};
    User.findOne(query, function (err, user) {
        if(user){
            res.send('match');
        }else{
            res.send('notMatch');
        }
    });
});

router.get('/profile', ensureAuthenticated, function (req, res) {
    var query = {user: req.user};
    Order.find(query).sort('-_id').exec(function (err, orders) {
        var cart;
        orders.forEach(function(order){
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('client/profile', {title: 'Shop Game - User Profile', orders: orders});
    });
});

module.exports = router;

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        return res.redirect('/users/signin');
    }
}