var loaded = false,
    ready = false;

if (typeof io !== 'undefined'){
	var io=io.connect();

    io.on('connect', function(data){
        if (!loaded) {
            if (ready) {
                io.emit('join',{});

                loaded = true;
            } else {
                io.connect();
            }
        }
    });  
    
    io.on('joinFailure', function(data){
        error('get nodes failed with error:' + data.toString());
    }); 
    
	io.on('joinSuccess', function(data){
    });
    
    io.on('getRoshamWarUserViewSuccess', function(data){
        console.log(data);
        
        var connections = data.connections;
        var nodes = new Array();
        
        data.nodes.forEach(function(elem){
            elem.friend = true;
            nodes[elem._id] = elem;
        });
        
        if (connections.length > 0){
            connections = connections.map(function(elem){
                var mapNode = function(node){
                    if (!nodes[node._id]){
                        var newNode = node;
                        newNode.friend = false;
                        nodes[node._id] = newNode;
                    } 
                    return nodes[node._id];                
                }

                elem.source = mapNode(elem.node1);
                elem.target =  mapNode(elem.node2);
                return elem;
            });
        }
        console.log(connections);
        console.log(nodes);   
          
        var width = 960,
            height = 500;

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(connections)
            .size([width, height])
            .linkDistance(200)
            .charge(-300)
            .on("tick", tick)
            .start();

        var svg = d3.select("#mysvg").append("svg")
            .attr("width", width)
            .attr("height", height);

        // Per-type markers, as they don't inherit styles.
        svg.append("defs").selectAll("marker")
            .data(["suit", "licensing", "resolved"])
            .enter().append("marker")
            .attr("id", function(d) { return d; })
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", 15)
            .attr("refY", -1.5)
            .attr("markerWidth", 6)
            .attr("markerHeight", 6)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5");

        var path = svg.append("g").selectAll("path")
            .data(force.links())
            .enter().append("path")
            .attr("class", function(d) { return "link " + d.type; });
            // Removing the Arrow for now
            //.attr("marker-end", function(d) { return "url(#" + "suit"/*d.type*/ + ")"; });

        var circle = svg.append("g").selectAll("circle")
            .data(force.nodes())
            .enter().append("circle")
            .attr("r", 12)
            .classed('foe', function(d){
                console.log(d);
                return !d.friend;
            })
            .call(force.drag);

        var text = svg.append("g").selectAll("text")
            .data(force.nodes())
            .enter().append("text")
            .attr("x", 15)
            .attr("y", ".31em")
        //	.text(function(d) { return d.name; });
            .text(function(d) { return d.shortDesc; });

        // Use elliptical arc path segments to doubly-encode directionality.
        function tick() {
            path.attr("d", linkArc);
            circle.attr("transform", transform);
            text.attr("transform", transform);
        }

        function linkArc(d) {
            var dx = d.target.x - d.source.x,
                dy = d.target.y - d.source.y,
                dr = Math.sqrt(dx * dx + dy * dy);
            return "M" + d.source.x + "," + d.source.y + "A" + dr + "," + dr + " 0 0,1 " + d.target.x + "," + d.target.y;
        }

        function transform(d) {
            return "translate(" + d.x + "," + d.y + ")";
        } 
    });
};
          
function error(err){
    $('#error').html(err);
    setTimeout(function(){$('#error').html('');},5000);
};    

$(document).ready(function() {
    ready = true;
    io.emit ('getRoshamWarUserView', {});
});
