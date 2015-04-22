var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' })
});


router.get('/edition', function(req, res) {
    res.render('edition')
});

router.post('/savetree',function(req,res){
  console.log('req.body:', req.body);
});

module.exports = router;
/*
router.get('/database',function(req,res){
	res.render('database',{title: 'Tentative de connection à la bdd'})
});




router.get('/userlist', function(req, res) {
    var db = req.connection;
    var collection = db.places.toArray();


    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});


/*
db.createDatabase('tree', function(err, newdb) {
  if (err) {
    console.log('Failed to create database: %j',
      err);
  } else {
    console.log('Database created: %j', newdb.name);
    tree = newdb;
  }
});
*/