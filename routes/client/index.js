var express = require('express');
var router = express.Router();
var nodeMailer = require('nodemailer');

Product = require('../../models/product');
Category = require('../../models/category');
Cart = require('../../models/cart');
Order = require('../../models/order');

/* GET home page. */
router.get('/', function(req, res) {
  Product.find().limit(4).exec(function (err, products) {
      Product.find().sort('-_id').limit(4).exec(function (err, latest) {
          Category.find().exec(function (err, cate) {
              if(err){
                  res.end(err);
              }else{
                  res.render('client/index', { title: 'Game Shop', products: products, latest: latest, menu: cate });
              }
          });
      });
  });
});

router.get('/about.express', function (req, res) {
    res.render('client/about', { title: 'Shop Game - About' });
});

router.get('/contact.express', function (req, res) {
    res.render('client/contact', { title: 'Shop Game - Contact' });
});

router.post('/contact.htm', function (req, res) {
    var transporter = nodeMailer.createTransport('smtps://tuunguyen2795@gmail.com:Tunguyen02071995@smtp.gmail.com');

    var mailOptions = {
        from: 'noreply@shop-game.herokuapp.com',
        to: 'tuunguyen2795@gmail.com',
        subject: 'Shop Game submission',
        text: 'You have a new submission from your Shp Game with the following details...Name: '+req.body.name+' Email: '+req.body.email+' Message: '+req.body.message+'',
        html: '<p>You have a new submission from your Shop Game with the following details...</p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Message: '+req.body.message+'</li></ul>'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.redirect('/contact.express');
        }else{
            req.flash('success', 'Message sent');
            console.log('Message sent ' + info.response);
            res.redirect('/contact.express');
        }
    });
});

router.get('/categories/:id', function (req, res) {
    var cate_id = req.params.id;
    var query = {_id: cate_id};
    Category.find().exec(function (err, cate) {
        Category.findOne(query, function (err, category) {
            var query1 = {category: category.title};
            Product.find(query1, function (err, products) {
                res.render('client/category', { title: 'Shop Game - '+ category.title, category: category, menu: cate, products: products });
            });
        });
    });
});

router.get('/add-to-cart/:id', function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    Product.findById(productId, function (err, product) {
        if(err){
            res.end(err);
        }else{
            cart.add(product, product.id);
            req.session.cart = cart;
            res.redirect('/');
        }
    });
});

router.get('/remove/:id', function (req, res) {
    var id = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(id);
    req.session.cart = cart;
    res.redirect('/shopping-cart.express');
});

router.get('/update/:id/:num', function (req, res) {
    var id = req.params.id;
    var num = req.params.num;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.update(id, num);
    req.session.cart = cart;
    res.send('ok');
});

router.get('/shopping-cart.express', function (req, res) {
    Category.find().exec(function (err, cate) {
        if(!req.session.cart){
            res.render('client/shopping-cart', { title: 'Shop Game - Shopping Cart', products: null, menu: cate });
        }else{
            var cart = new Cart(req.session.cart ? req.session.cart : {});
            res.render('client/shopping-cart', {title: 'Shop Game - Your Shopping Cart', menu: cate, products: cart.generateArray(), totalPrice: cart.totalPrice});
        }
    });
});

router.get('/checkout.express', ensureAuthenticated, function (req, res) {
    if(!req.session.cart){
        res.render('client/shopping-cart', { title: 'Shop Game - Shopping Cart', products: null, menu: cate });
    }
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    res.render('client/checkout', { title: 'Shop Game - Checkout Your Order', totalPrice: cart.totalPrice });
});

router.post('/checkout.htm', function (req, res) {
    if(!req.session.cart){
        res.render('client/shopping-cart', { title: 'Shop Game - Shopping Cart', products: null, menu: cate });
    }

    var cart = new Cart(req.session.cart ? req.session.cart : {});

    var stripe = require("stripe")(
        "sk_test_CTbnrRp89bfKVeQjgcIdRcmM"
    );

    stripe.charges.create({
        amount: cart.totalPrice * 100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Charge demo from Shop Game"
    }, function(err, charge) {
        if(err){
            req.flash('error', err.message);
            return res.redirect('/checkout.express');
        }
        var order = new Order({
            user: req.user,
            cart: cart,
            address: req.body.address,
            name: req.body.name,
            paymentId: charge.id,
            paymentDate: new Date()
        });
        order.save(function (err, result) {
            if(err){
                res.end(err);
            }
            req.flash('success', 'Successfully bought products.');
            req.session.cart = null;
            res.redirect('/');
        });
    });
});

module.exports = router;


function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        req.session.oldUrl = req.url;
        res.redirect('/users/signin');
    }
}
