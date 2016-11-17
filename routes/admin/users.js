var express = require('express');
var router = express.Router();
var passport = require('passport');

User = require('../../models/user');

router.get('/', ensureAuthenticated, function (req, res) {
    User.find().exec(function (err, users) {
        if(err){
            res.end(err);
        }else{
            res.render('admin/user/users', {title: 'Admin Area - User', users: users});
        }
    });
});

router.post('/login', passport.authenticate('local.signin', {failureRedirect: '/admin/login', failureFlash: true}), function (req, res) {
    if(req.user.level === 0){
        res.redirect('/admin');
    }else{
        res.redirect('/admin/login');
    }
});

router.get('/logout', ensureAuthenticated, function (req, res) {
    req.logout();
    res.redirect('/admin/login');
});

router.delete('/delete/:id', ensureAuthenticated, function (req, res) {
    var id = req.params.id;
    var query = { _id: id };
    User.findOneAndRemove(query, function (err, result) {
        if(err){
            res.end(err);
        }else{
            res.send('ok');
        }
    });
});

module.exports = router;

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated() && req.user.level === 0){
        next();
    }else{
        res.redirect('/admin/login');
    }
};