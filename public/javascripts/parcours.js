
var actualSize = 1;
var treeCopy = FindByParentId(0)[0];
console.log(treeCopy);

function FindByParentId(id) {
    var liste = [];
    sentNodes.forEach(function(n) {
        if(n.idParent == id) {
            console.log(n);
            var t = {v:actualSize++, l:n.question, r:n.answer, e:id, p:{}, c:[]}

            // Si l'enfant à au moins 1 fils également
            var findedSons = FindByParentId(n.idNode);
            if ( findedSons.length > 0)
                findedSons.forEach(function(f) {
                    t.c.push(f);
                });
            
            liste.push(t);
        }
    });

    return liste;
}

function tree(){
        var svgW=2000, svgH =460, vRad=12, tree={cx:screen.width/2, cy:80, w:40, h:70};
        treeCopy.p = {x:tree.cx, y:tree.cy};
        tree.vis=treeCopy;	
        tree.size=actualSize + 1;
        tree.glabels =[];
        var base;

        tree.getVertices =  function(){
                var v =[];
                function getVertices(t,f){	
                        v.push({v:t.v, l:t.l, p:t.p, f:f});	
                        t.c.forEach(function(d){ return getVertices(d,{v:t.v, p:t.p}); });
                }
                getVertices(tree.vis,{});
                return v.sort(function(a,b){ return a.v - b.v;});
        }

        tree.getEdges =  function(){
                var e =[];
                function getEdges(_){
                        _.c.forEach(function(d){ e.push({v1:_.v, l1:_.l, p1:_.p, v2:d.v, l2:d.l, p2:d.p});});
                        _.c.forEach(getEdges);
                }
                getEdges(tree.vis);
                return e.sort(function(a,b){ return a.v2 - b.v2;});	
        }

        tree.addLeaf = function(_){
                function addLeaf(t){
                        if(t.v==_){ t.c.push({v:tree.size++, l:'Question non définie', r:'Réponse non définie', e:t.v, p:{},c:[]}); return; }
                        t.c.forEach(addLeaf);
                }
                addLeaf(tree.vis);
                reposition(tree.vis);
                if(tree.glabels.length != 0){
                        tree.glabels =[]
                }
                else tree.incMatx = d3.range(0,tree.size-1).map(function(){ return 0;});
                redraw();
        }

        tree.deleteLeaf = function (nodeToDelete) {


            function traverse(o, myFather) {
                for (var i in o) {
                    if(i=='v' && o[i]==nodeToDelete) {
                        var index = myFather.indexOf(o);
                        myFather.splice(index,1);
                    }

                    if (o[i] !== null && typeof(o[i])=="object") {
                        //going on step down in the object tree!!
                        traverse(o[i], o);
                    }
                }
            }

            traverse(tree.vis, tree.vis);

            reposition(tree.vis);
            redraw();
        }

        tree.fix = function() {
            reposition(tree.vis);
            redraw();
        }


        redraw = function(){
         
                var edges = d3.select("#g_lines").selectAll('line').data(tree.getEdges());

                edges.exit().transition().duration(0).remove();

                edges.transition().duration(500)
                        .attr('x1',function(d){ return d.p1.x;}).attr('y1',function(d){ return d.p1.y;})
                        .attr('x2',function(d){ return d.p2.x;}).attr('y2',function(d){ return d.p2.y;})

                edges.enter().append('line')
                        .attr('x1',function(d){ return d.p1.x;}).attr('y1',function(d){ return d.p1.y;})
                        .attr('x2',function(d){ return d.p1.x;}).attr('y2',function(d){ return d.p1.y;})
                        .transition().duration(500)
                        .attr('x2',function(d){ return d.p2.x;}).attr('y2',function(d){ return d.p2.y;});

                var circles = d3.select("#g_circles").selectAll('circle').data(tree.getVertices());

                circles.exit().transition().duration(500).attr("r", 0).remove();

                circles.transition().duration(500).attr('cx',function(d){ return d.p.x;}).attr('cy',function(d){ return d.p.y;});

                circles.enter().append('circle').attr('cx',function(d){ return d.f.p.x;}).attr('cy',function(d){ return d.f.p.y;}).attr('r',vRad)
                        .on('click',function(d){ d3.selectAll("circle").style("fill", "steelblue"); d3.select(this).style("fill", "white"); return clickNode(d); }).transition().duration(500).attr('cx',function(d){ return d.p.x;}).attr('cy',function(d){ return d.p.y;});
               
        }

        getLeafCount = function(_){
                if(_.c.length ==0) return 1;
                else return _.c.map(getLeafCount).reduce(function(a,b){ return a+b;});
        }

        reposition = function(v){
                var lC = getLeafCount(v), left=v.p.x - tree.w*(lC-1)/2;
                v.c.forEach(function(d){
                        var w =tree.w*getLeafCount(d); 
                        left+=w; 
                        d.p = {x:left-(w+tree.w)/2, y:v.p.y+tree.h};
                        reposition(d);
                });		
        }	

        initialize = function(){

                var p0 = [tree.vis.p.x, tree.vis.p.y, 60],
                p1 = [1000, 100, 60];
           
                base = d3.select("body").append("svg").attr("width", svgW).attr("height", svgH).attr('id','treesvg')
                    .append('g');

                base.append('rect').attr('width','3000').attr('height','2000').attr("class", "overlay");

                base.append('g').attr('id','g_lines').selectAll('line').data(tree.getEdges()).enter().append('line')
                        .attr('x1',function(d){ return d.p1.x;}).attr('y1',function(d){ return d.p1.y;})
                        .attr('x2',function(d){ return d.p2.x;}).attr('y2',function(d){ return d.p2.y;});

                base.append('g').attr('id','g_circles').selectAll('circle').data(tree.getVertices()).enter()
                        .append('circle').attr('cx',function(d){ return d.p.x;}).attr('cy',function(d){ return d.p.y;}).attr('r',vRad)

                /*
                base.append('g').attr('id','g_labels').selectAll('text').data(tree.getVertices()).enter().append('text')
                        .attr('x',function(d){ return d.p.x;}).attr('y',function(d){ return d.p.y+5;}).text(function(d){return d.l;})
                        .on('click',function(d){return tree.addLeaf(d.v);});	  
                */              

                 base.attr("transform", "translate(-5800.502816217603,-364.73674363454006)scale(6.964404506368993)");

                //tree.addLeaf(1);
                //tree.addLeaf(1);
        }

      initialize();

    return tree;
}
var tree= tree();

tree.fix();

var p0 = [tree.vis.p.x, tree.vis.p.y, 60],
                p1 = [1000, 100, 60];


var currentNode = 1;
var currentNodeReal;
var oldNode;

function transition(svg, start, end) {
          var center = [2000 / 2, 460 / 2],
              i = d3.interpolateZoom(start, end);

          svg
              .attr("transform", transform(start))
            .transition()
              .delay(250)
              .duration(i.duration * 2)
              .attrTween("transform", function() { return function(t) { return transform(i(t)); }; })

          function transform(p) {
            var k = 460 / p[2];
            return "translate(" + (center[0] - p[0] * k) + "," + (center[1] - p[1] * k) + ")scale(" + k + ")";
          }
        }


function changeActiveNode(newNode) {
    //Actualiser les choix
    updateInfos(newNode);

    //Faire le zoom
    p0 = [oldNode.p.x, oldNode.p.y, 60];
    p1 = [currentNodeReal.p.x, currentNodeReal.p.y, 60];
    d3.select("g").call(transition,p0,p1);

    //Changer la couleur de la node
    d3.selectAll("[x2='"+currentNodeReal.p.x+"']").filter("[y2='"+currentNodeReal.p.y+"']").transition().duration(4000).style("stroke", "red");
    d3.selectAll("[cy='"+currentNodeReal.p.y+"']").filter("[cx='"+currentNodeReal.p.x+"']").transition().duration(5000).style("fill", "white");

    //Vérifier node finale
    if(currentNodeReal.c.length < 1)
        $('#reponses').text('Parcours terminé');
}

function updateInfos(node) {
    oldNode = currentNodeReal;
    currentNodeReal = findNodeById(node);

    $("#question").html(currentNodeReal.l);

    $('#reponses').text('');
    currentNodeReal.c.forEach(function(truc, i){
        $('#reponses').append('<button class="btn btn-primary" onClick="changeActiveNode($(this).attr(\'id\'))" id="'+truc.v+'">'+truc.r +'</button><br/><br/>');
    });
}


// Initialisation first node
$(document).ready(function() {
    updateInfos(currentNode);
    d3.selectAll("[cy='80']").filter("[cx='960'").style("fill", "white");
});


function findNodeById(id) {
    var nodeToReturn;

    function traverse(o, myFather) {
                for (var i in o) {

                    if(i=='v' && o[i]==id)
                        nodeToReturn = o;

                    if (o[i] !== null && typeof(o[i])=="object")
                        traverse(o[i], o);                    
                }
            }

            traverse(tree.vis, tree.vis);

    return nodeToReturn;
}


/*
$(document).ready(function() {
    $('#question').editable({
        defaultValue: '',
        emptytext: 'Question non définie',
        success: function(response, newValue) {
            clickedNodeReal.l = newValue;
        }
    });
});


$(document).ready(function() {
    $('#reponses').editable({
      selector: 'a',
      emptytext: 'Réponse non définie',
      url: '',
        success: function(response, newValue) {
                   var answerNode = findNodeById($(this).attr('id'));
                   answerNode.r = newValue;
                }
    });
});
*/
