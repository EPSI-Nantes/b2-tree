function SaveTree() {
    $("#btn-save").text("Saved !");
    window.setTimeout(function () {
        $("#btn-save").html("<span class='glyphicon glyphicon-ok'></span>&nbsp Save");
    },2000);

$.ajax({
        url: '../savetree',
        data: JSON.stringify({tree: tree.vis, id: sendIdTree}),
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
}
