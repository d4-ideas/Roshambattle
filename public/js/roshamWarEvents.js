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
        console.log('yep');
        console.log(data);
        
        var links = [ { __v: 0,
            _id: '54110510d1902664ba8cbafc',
            desc12: 'A dusty road heads east',
            desc21: 'A dusty road heads west',
            source: { owner: '54110510d1902664ba8cbae6',
                 shortDesc: 'You',
                 _id: '54110510d1902664ba8cbaf6',
                 __v: 0 },

            target: { owner: '54110510d1902664ba8cbae6',
                 shortDesc: 'Me',
                 _id: '54110510d1902664ba8cbaf7',
                 __v: 0 } } ]

        var nodes = new Array();
        
        // Compute the distinct nodes from the links.
        links.forEach(function(link) {    
          link.source = nodes[link.source._id] || (nodes[link.source._id] = link.source);
          link.target = nodes[link.target._id] || (nodes[link.target._id] = link.target);
        });        

        var width = 960,
            height = 500;

        var force = d3.layout.force()
            .nodes(d3.values(nodes))
            .links(links)
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
