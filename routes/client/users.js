var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var csrfProtection = csrf();
router.use(csrfProtection);

User = require('../../models/user');
Category = require('../../models/category');

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
        res.redirect('/users/signin');
    });
});

router.post('/signin', passport.authenticate('local.signin', {failureRedirect: '/users/signin', failureFlash: true}), function (req, res) {
    res.redirect('/');
});

router.get('/signout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;