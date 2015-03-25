
// ######### INITIALISATION #########

var s = new sigma('container');
var c = s.camera;
var choices = {};

c.goTo({x:0,y:0,ratio:0.0050});

s.settings({
  edgeColor: 'default',
  defaultEdgeColor: '#fff',
  labelColor: 'node',
  defaultLabelColor: '#007acc',
  labelThreshold:'5', // taille mini affichage label
  nodeHoverColor:'default',
  defaultNodeHoverColor:'#fff',
  LabelHoverColor:'source',
  defaultHoverLabelBGColor:'#fff',
  fontStyle: 'bold',
  autoRescale: false,
  minArrowSize: 1,
  zoomMin: 0.0040,
  zoomMax: 0.0200

});

s.graph.addNode({
      id: '0',
      label: 'START',
      x: 0,
      y: 0,
      size: 1,
      color: '#fff'
    }).addNode({
      id: '1',
      label: 'Etape 1',
      x: 1,
      y: 1,
      size: 1,
      color: '#007acc'
    }).addEdge({
      id: 'e0',
      source: '0',
      target: '1'
    });

    s.refresh();
choices[0] = ['Point de départ'];
choices[1] = ['Non defini'];


// ########## CLICK MENU #########
var mouseX;
var mouseY;

var clickedNode;
var globalId = 1;

$(document).mousemove( function(e) {
   mouseX = e.pageX; 
   mouseY = e.pageY;
});

function onNodeDown(evt) {
    $('#menu').css({'top':mouseY,'left':mouseX}).fadeIn('slow');
    // restore last clicked
    if(clickedNode !== undefined) {
    clickedNode.size = 1;
    clickedNode.color = '#007acc';
    }
    
    // new clicked
    clickedNode = evt.data.node;
    clickedNode.size = 2;
    clickedNode.color = '#68217a';
    s.refresh();
    
    $("#node-name").text(clickedNode.label);
    $("#question").text(choices[clickedNode.id][0]);
}

s.bind('clickNode',onNodeDown);

$("#menu").hide();
$("#menu ul li").last().css("border-bottom","none");

$('#menu').mouseleave(function(){
  $('#menu').fadeOut('slow');
});


function AddNode() {
    globalId++;
    s.graph.addNode({
        id: globalId.toString(),
        label: 'Etape '+globalId,
        x: s.graph.degree(clickedNode.id)+1,
        y: s.graph.degree(clickedNode.id)+1,
        size: 1,
        color: '#007acc'
    }).addEdge({
        id : 'e'+globalId,
        source: clickedNode.id,
        target: globalId.toString()
    });
    choices[globalId] = ['Non defini'];
    s.refresh();
 
    c.goTo({x:globalId,y:globalId,ratio:0.0050});
}

// ########## END CLICK MENU #########

//s.startForceAtlas2({worker:true, barnesHutOptimize:false});


// ######### TEST MOUVEMENT ##########

function MoveCam(x, y) {
    var oldX = s.cameras[0].x;
    var oldY = s.cameras[0].y;
    
    var distanceX = x - oldX;
    var distanceY = x - oldY;
    
    var offsetX = (x - oldX)/1000;
    var offsetY = (x - oldY)/1000;
    
    while(distanceX > 0.06 && distanceY  > 0.06)
    {
        oldX += offsetX;
        oldY += offsetY;
        distanceX = x - oldX;
        distanceY = x - oldY;
        c.goTo({x:oldX,y:oldY,ratio:0.0050});
        s.refresh();
    }
}