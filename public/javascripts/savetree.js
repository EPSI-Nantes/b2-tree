function SaveTree() {
    $("#btn-save").text("Saved !");
    window.setTimeout(function () {
        $("#btn-save").html("<span class='glyphicon glyphicon-ok'></span>&nbsp Save");
    },2000);


/*
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'b2-tree'
});


connection.connect();

connection.query('INSERT INTO `trees` (`name`) VALUES (`test`)')
*/

function traverse(o) {

            // o['v'] => ID
            // o['l'] => Question
            // myFather['v'] => ID Parent
            // o['r'] => reponse (pas encore implémenté)

                if (o.v !== undefined) {
                    console.log(o['v'] + ' ' + o['l'] + ' ' + o['e'] + ' ' + o['r']);
/*
                    connection.query('INSERT INTO `node`(`idTree`, `idNode`, `question`, `answer`, `idParent`) VALUES (1,'+ o['v'] +','+ o['l'] +','+ o['r'] +','+ o['e'] +')', function(err, rows, fields) {
                      if (!err)
                        console.log('The solution is: ', rows);
                      else
                        console.log('Error while performing Query.');
                    });
*/
                }

                for (var i in o) {
                    if (o[i] !== null && typeof(o[i])=="object") {
                        //going on step down in the object tree!!
                        traverse(o[i]);
                    }
                }
            }

            traverse(tree.vis);


//connection.end();

$.ajax({
        url: 'http://localhost:3000/savetree',
        data: tree.vis,
        type: 'POST',
        success: function(response, code, xhr) {
            console.log('success');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });
}
