var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'b2-tree'
});

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

  treeToSave = req.body;

  //connection.connect();

  // Insert new tree
  connection.query('INSERT INTO trees (name, url) VALUES ("test1", "urlol")', function(err, rows, fields) {
    if (!err) {
      console.log('The solution is: ', rows);
      console.log('INSERTED ROW ID is :', rows.insertId);

      // Insert Nodes
      fullNodeSaving(treeToSave, rows.insertId);


      res.writeHead(200, {"Content-Type": "text/plain"});
      res.end("Saving done");
    }
    else
      console.log('Error while performing Query :', err);
  });

//connection.end();
});


function fullNodeSaving(o, treeID) {
  if (o.v !== undefined) {

        var sql = 'INSERT INTO node (idTree, idNode, question, answer, idParent) VALUES (?, ?, ?, ?, ?)';
        var inserts = [treeID, o['v'], o['l'], o['r'], o['e']];
        sql = mysql.format(sql, inserts);

        connection.query(sql, function(err, rows, fields) {
          if (!err)
            console.log('The solution is: ', rows);
          else
            console.log('Error while performing Query:', err);
        });
    }

    for (var i in o) {
        if (o[i] !== null && typeof(o[i])=="object") {
            fullNodeSaving(o[i], treeID);
        }
    }
}

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