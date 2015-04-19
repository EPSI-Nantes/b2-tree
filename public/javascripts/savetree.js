function SaveTree() {
    $("#btn-save").text("Saved !");
    window.setTimeout(function () {
        $("#btn-save").html("<span class='glyphicon glyphicon-ok'></span>&nbsp Save");
    },2000);

    function traverse(o, myFather) {

            // o['v'] => ID
            // o['l'] => Question
            // myFather['v'] => ID Parent
            // o['r'] => reponse (pas encore implémenté)

                if (typeof(o)!=="array") {
                // INSERT INTO ICI
                }

                for (var i in o) {
                    if (o[i] !== null && typeof(o[i])=="object") {
                        //going on step down in the object tree!!
                        traverse(o[i], o);
                    }
                }
            }

            traverse(tree.vis, tree.vis);
}