var express = require('express');
var router = express.Router();
var nodeMailer = require('nodemailer');

Product = require('../../models/product');
Category = require('../../models/category');

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

router.get('/about.htm', function (req, res) {
    res.render('client/about', { title: 'Shop Game - About' });
});

router.get('/contact.htm', function (req, res) {
    res.render('client/contact', { title: 'Shop Game - Contact' });
});

router.post('/contact.htm', function (req, res) {
    var transporter = nodeMailer.createTransport('smtps://tuunguyen2795@gmail.com:Tunguyen02071995@smtp.gmail.com');

    var mailOptions = {
        from: 'noreply@shop-game.herokuapp.com',
        to: 'tuunguyen2795@gmail.com',
        subject: 'Shop Game submission',
        text: 'You have a new submission from NodeBlog with the following details...Name: '+req.body.name+' Email: '+req.body.email+' Message: '+req.body.message+'',
        html: '<p>You have a new submission from Express Website with the following details...</p><ul><li>Name: '+req.body.name+'</li><li>Email: '+req.body.email+'</li><li>Message: '+req.body.message+'</li></ul>'
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
            res.redirect('/contact.htm');
        }else{
            req.flash('success', 'Message sent');
            console.log('Message sent ' + info.response);
            res.redirect('/contact.htm');
        }
    });
});

router.get('/categories/:id', function (req, res) {
    var cate_id = req.params.id;
    var query = {_id: cate_id};
    Category.findOne(query, function (err, category) {
        Category.find().exec(function (err, cate) {
            res.render('client/category', { title: 'Shop Game - '+ category.title, category: category, menu: cate });
        });
    });
});

module.exports = router;
