
function DeleteTree(idToDelete) {
	var send = {id: idToDelete};

	$.ajax({
        url: 'deletetree',
        data: JSON.stringify(send),
        type: 'POST',
        processData: false,
        contentType: "application/json; charset=UTF-8",
        success: function(response, code, xhr) {
            console.log('success');
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.log('error ' + textStatus + " " + errorThrown);
        }
    });


	$('#'+ idToDelete +'').remove();
}

$(function() {
	var dialog = $( "#dialog-form" ).dialog({
	      autoOpen: false,
	      height: 200,
	      width: 350,
	      resizable: false,
	      modal: true,
	      buttons: {
	        "Ajouter": AddTree,
	        Cancel: function() {
	          dialog.dialog( "close" );
	        }
	      },
	      close: function() {
	        form[ 0 ].reset();
	      }
	    });

	var form = dialog.find( "form" ).on( "submit", function( event ) {
	      event.preventDefault();
	      AddTree();
	    });

	$( "#add" ).button().on( "click", function() {
	      dialog.dialog( "open" );
	});

	$( "#add" ).attr("class", "box");


	function AddTree() {
		var send = {name: $("#name").val()};

		$.ajax({
	        url: 'addtree',
	        data: JSON.stringify(send),
	        type: 'POST',
	        processData: false,
	        contentType: "application/json; charset=UTF-8",
	        success: function(response, code, xhr) {
	        	var chain = "<div class='box' id='"+response.id+"'><h3>"+response.nom+"</h3>" +
				"<button onclick='location.href=\"/parcours/"+response.id+"\"' class='btn btn-primary run'>Parcourir</button><br/>" +
     			"<button onclick='location.href=\"/edition/"+response.id+"\"' class='btn btn-primary'><span class='glyphicon glyphicon-edit'></span>&nbsp; Modifier</button>" +
        		"<button onclick='DeleteTree("+response.id+")' class='btn btn-primary'><span class='glyphicon glyphicon-trash'></span></button></div>";


	        	$(chain).insertBefore("#add");

	            console.log(response.id);
	            console.log(response.nom);
	        },
	        error: function(jqXHR, textStatus, errorThrown) {
	            console.log('error ' + textStatus + " " + errorThrown);
	        }
    	});

		dialog.dialog( "close" );
	}
});