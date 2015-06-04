function tree(){
        var svgW=2000, svgH =460, vRad=12, tree={cx:screen.width/2, cy:-50, w:40, h:70};
        tree.vis={v:0, l:'', p:{x:tree.cx, y:tree.cy},c:[]};    
        tree.size=1;
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
                        if(t.v==_){ t.c.push({v:tree.size++, l:'Question non définie', r:'Réponse non définie', p:{},c:[]}); return; }
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
                        .on('click',function(d){ return clickNode(d); }).transition().duration(500).attr('cx',function(d){ return d.p.x;}).attr('cy',function(d){ return d.p.y;});


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

                base = d3.select("body").append("svg").attr("width", svgW).attr("height", svgH).attr('id','treesvg')
                    .append('g');

                base.append('g').attr('id','g_lines').selectAll('line').data(tree.getEdges()).enter().append('line')
                        .attr('x1',function(d){ return d.p1.x;}).attr('y1',function(d){ return d.p1.y;})
                        .attr('x2',function(d){ return d.p2.x;}).attr('y2',function(d){ return d.p2.y;});

                base.append('g').attr('id','g_circles').selectAll('circle').data(tree.getVertices()).enter()
                        .append('circle').attr('cx',function(d){ return d.p.x;}).attr('cy',function(d){ return d.p.y;}).attr('r',vRad);

                base.append('g').attr('id','g_labels').selectAll('text').data(tree.getVertices()).enter().append('text')
                        .attr('x',function(d){ return d.p.x;}).attr('y',function(d){ return d.p.y+5;}).text(function(d){return d.l;});

                tree.addLeaf(0);
                tree.addLeaf(0);
        }

        function zoom() {
          base.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
        }

      initialize();

    return tree;
}
var tree= tree();

var compteur = 0;

setInterval(function () {
    compteur++;
    if(compteur < 100)
        tree.addLeaf(Math.floor((Math.random() * compteur) + 1)); 
}, 1000);