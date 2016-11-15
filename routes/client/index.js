var express = require('express');
var router = express.Router();

Product = require('../../models/product');

/* GET home page. */
router.get('/', function(req, res) {
  Product.find().limit(4).exec(function (err, products) {
      Product.find().sort('-_id').limit(4).exec(function (err, latest) {
          if(err){
              res.end(err);
          }else{
              console.log(products);
              res.render('client/index', { title: 'Game Shop', products: products, latest: latest });
          }
      });
  });
});

module.exports = router;
