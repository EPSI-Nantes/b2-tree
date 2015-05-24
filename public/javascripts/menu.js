
function DeleteTree(idToDelete) {
	var send = {id: idToDelete};

	$.ajax({
        url: 'http://localhost:3000/deletetree',
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
	        url: 'http://localhost:3000/addtree',
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

		dialog.dialog( "close" );
	}
});