var express = require('express');
var router = express.Router();
var passport = require('passport');
var csrf = require('csurf');

var csrfProtection = csrf();
router.use(csrfProtection);

Product = require('../../models/product');

router.get('/', ensureAuthenticated, function (req, res) {
    res.render('admin/index', {title: 'Admin Area'});
});

router.get('/login', function (req, res) {
    res.render('admin/login', {title: 'Admin Area - Login', csrfToken: req.csrfToken()});
});

module.exports = router;

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated() && req.user.level === 0){
        next();
    }else{
        res.redirect('/admin/login');
    }
};