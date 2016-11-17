var express = require('express');
var router = express.Router();

Category = require('../../models/category');

router.get('/', ensureAuthenticated, function (req, res) {
    Category.find().sort('-_id').exec(function (err, categories) {
        if(err){
            res.end(err);
        }else{
            res.render('admin/category/categories', {title: 'Admin Area - Category', categories: categories});
        }
    });
});

router.get('/add', ensureAuthenticated, function (req, res) {
    res.render('admin/category/addcategory', {title: "Admin Area - Add Category"});
});

router.post('/add', ensureAuthenticated, function (req, res) {
    var title = req.body.title;
    var category = new Category({
        title: title
    });
    category.save(function (err, result) {
        if(err){
            res.end(err);
        }else{
            res.redirect('/admin/categories');
        }
    });
});

router.delete('/delete/:id', ensureAuthenticated, function (req, res) {
    var id = req.params.id;
    var query = { _id: id };
    Category.findOneAndRemove(query, function (err, result) {
        if(err){
            res.end(err);
        }else{
            res.send('ok');
        }
    });
});

router.get('/edit/:id', ensureAuthenticated, function (req, res) {
    var id = req.params.id;
    Category.findOne({ "_id": id }).exec(function (err, cate) {
        if(err){
            res.end(err);
        }else{
            res.render('admin/category/editcategory', {title: "Admin Area - Edit Category", category: cate});
        }
    });
});

router.post('/edit/:id', ensureAuthenticated, function (req, res) {
    var id = req.params.id;
    var query = { _id: id };
    Category.findOneAndUpdate(query, { title: req.body.title }, function (err, result) {
        if(err){
            res.end(err);
        }else{
            res.redirect('/admin/categories');
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