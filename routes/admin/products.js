var express = require('express');
var router = express.Router();
var multer = require('multer');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

Product = require('../../models/product');
Category = require('../../models/category');

router.get('/', ensureAuthenticated, function (req, res) {
    Product.find().sort('-_id').exec(function (err, products) {
        if(err){
            res.end(err);
        }else{
            res.render('admin/product/products', {title: 'Admin Area - Product', products: products});
        }
    });
});

router.get('/add', function (req, res) {
    Category.find().exec(function (err, category) {
        res.render('admin/product/addproduct', {title: "Admin Area - Add Product", category: category});
    });
});

router.post('/add', ensureAuthenticated, upload.single('image'), function (req, res) {
    var title = req.body.title;
    var description = req.body.description;
    var image = req.file.originalname;
    var price = req.body.price;
    var cate_id = req.body.category;
    Category.findOne({_id: cate_id}, function (err, cate) {
        var product = new Product({
            image: image,
            title: title,
            description: description,
            category: cate.title,
            price: price
        });
        product.save(function (err, result) {
            if(err){
                res.end(err);
            }else{
                var query = {_id: cate_id};
                Category.findOneAndUpdate(query,
                    {$push: {products: {product_title: title, product_image: image, product_price: price, product_description: description}}},
                    {safe: true, upsert: true}, function (err, result) {
                        if(err){
                            res.end(err);
                        }else{
                            res.redirect('/admin/products');
                        }
                    }
                );
            }
        });
    });
});

router.delete('/delete/:id', ensureAuthenticated, function (req, res) {
    var id = req.params.id;
    var query = { _id: id };
    Product.findOneAndRemove(query, function (err, result) {
        if(err){
            res.end(err);
        }else{
            res.send('ok');
        }
    });
});

router.get('/edit/:id', ensureAuthenticated, function (req, res) {
    var id = req.params.id;
    Product.findOne({ "_id": id }).exec(function (err, product) {
        if(err){
            res.end(err);
        }else{
            Category.find().exec(function (err, cate) {
                res.render('admin/product/editproduct', {title: "Admin Area - Edit Product", product: product, category: cate});
            });
        }
    });
});

router.post('/edit/:id', ensureAuthenticated, upload.single('image'), function (req, res) {
    var id = req.params.id;
    var query = { _id: id };
    var title = req.body.title;
    var price = req.body.price;
    var description = req.body.description;
    var cate_id = req.body.category;
    var image;
    if(req.file){
        image = req.file.originalname;
    }else{
        image = req.body.old_image;
    }
    Category.findOne({_id: cate_id}, function (err, cate) {
        Product.findOneAndUpdate(query, {
            title: req.body.title,
            category: cate.title,
            image: image,
            description: description,
            price: price
        }, function (err, result) {
            if(err){
                res.end(err);
            }else{
                res.redirect('/admin/products');
            }
        });
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