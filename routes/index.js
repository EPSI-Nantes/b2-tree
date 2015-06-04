var express = require('express');
var router = express.Router();
var flash = require('connect-flash');

var passport = require('../auth');

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'b2-tree'
});

/* GET home page. */
/*
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
*/

// Middleware to check if auth
var isAuthenticated = function (req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect('/');
}


router.get('/', function login(req, res) {
  res.render('index', { title: 'Login', message: req.flash('loginMessage') });
});


router.post('/', passport.authenticate('local', {
  failureRedirect: '/',
  successRedirect: '/trees',
  failureFlash: true
}));

router.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
 });


/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* GET List of trees created */
router.get('/trees', isAuthenticated, function(req, res) {
  connection.query('SELECT * FROM trees', function(err, rows, fields) {
    if (!err) {
      console.log(rows);
      res.render('trees', {trees: rows, name: req.user.username});
    }
    else
      console.log("Error while retrieving created trees !", err);

  });
});

router.get('/edition', function(req, res) {
    res.render('edition');
});

/* GET Edit a specific tree */
router.get('/edition/:id',isAuthenticated, function(req, res) {
  var id = req.params.id;
  var sql = 'SELECT * FROM node WHERE idTree=?'
  var inserts = [id];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, rows, fields) {
    if (!err) {
      res.render('edition', {nodes: JSON.stringify(rows), idTree: id});
      console.log("Sucess rendering saved tree");
      console.log(sql);
      console.log(rows);
    }
    else
      console.log('Fail rendering saved tree');
    });
});

/* GET Run a specific tree */
router.get('/parcours/:id',isAuthenticated, function(req, res) {
  var id = req.params.id;
  var sql = 'SELECT * FROM node WHERE idTree=?'
  var inserts = [id];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, rows, fields) {
    if (!err) {
      res.render('parcours', {nodes: JSON.stringify(rows)});
      console.log("Sucess rendering saved tree");
      console.log(sql);
      console.log(rows);
    }
    else
      console.log('Fail rendering saved tree :', err);

    });
});

/* SAVE Tree in database with its nodes */
router.post('/savetree',function(req,res){
  console.log('req.body:', req.body);

  var treeToSave = req.body.tree;
  var idTreeToSave = req.body.id;

      // Delete Old Nodes
      var sql = 'DELETE FROM node WHERE idTree=?';
      var inserts = [idTreeToSave];
      sql = mysql.format(sql, inserts);

      connection.query(sql, function(err, rows, fields) {
        if(!err) {
          console.log('Deleted nodes with tree id:', idTreeToSave);
        
        // Replace by inserting new nodes
        fullNodeSaving(treeToSave, idTreeToSave);
        }
        else
          console.log('Error while trying to delete nodes:', err);
      });


      res.writeHead(200, {"Content-Type": "text/plain"});
      res.end("Saving done");


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


router.post('/deletetree', function(req, res) {
  var treeIdToDelete = req.body.id;
  console.log(treeIdToDelete);

  var sql = 'DELETE FROM node WHERE idTree=?';
  var inserts = [treeIdToDelete];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, rows, fields) {
    if(!err)
      console.log('Deleted nodes with tree id:', treeIdToDelete);
    else
      console.log('Error while trying to delete nodes:', err);
  });

  sql = 'DELETE FROM trees WHERE id=?'
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, rows, fields) {
    if(!err)
      console.log('Deleted tree id:', treeIdToDelete);
    else
      console.log('Error while trying to tree:', err);
  });

});

router.post('/addtree', function(req, res) {
  var name = req.body.name;

  var sql = "INSERT INTO trees(name) VALUES (?)";
  var inserts = [name];
   sql = mysql.format(sql, inserts);
   var insId;

  connection.query(sql, function(err, rows, fields) {
    if(!err) {
      console.log('Added tree name:', name);
      insId = rows.insertId;
      console.log("INSID1:", rows.insertId);

      sql = 'INSERT INTO node (idTree, idNode, question, answer, idParent) VALUES (?, ?, ?, ?, ?)';
      inserts = [rows.insertId, 1, "Question non définie", "Réponse non définie", 0];
      sql = mysql.format(sql, inserts);

      connection.query(sql, function(err, rows, fields) {
        if(!err) {
          console.log('Added default node');
          res.writeHead(200, {"Content-Type": "application/json"});
          res.end(JSON.stringify({id: insId , nom: name}));
        }
        else
          console.log('Error while trying to add default node:', err);
      });

    }
    else
      console.log('Error while trying to add tree:', err);
  });

/*
  sql = 'INSERT INTO node (idTree, idNode, question, answer, idParent) VALUES (?, ?, ?, ?, ?)';
  inserts = [insId, 1, "Question non définie", "Réponse non définie", 0];
  sql = mysql.format(sql, inserts);

  connection.query(sql, function(err, rows, fields) {
    if(!err)
      console.log('Added default node');
    else
      console.log('Error while trying to add default node:', err);
  });
*/

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