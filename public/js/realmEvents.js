var loaded = false,
    ready = false;

if (typeof io !== 'undefined'){
	var io=io.connect();

    io.on('connect', function(data){
        if (!loaded) {
            if (ready) {
                io.emit('getNodes',{});

                //explore
                io.emit('navToLoc', {nodeID:null}); 
                loaded = true;
            } else {
                io.connect();
            }
        }
    });    
    
    io.on('getNodesFailure', function(data){
        error('get nodes failed with error:' + data.toString());
    }); 
    
	io.on('getNodesSuccess', function(data){
        var rows = '',
            options = '';

        data.forEach(function(row){
            rows += '<tr id=' + row.node._id + '><td><input type="submit" class="removeNodeButton" value="-"></td>';

            var connFrom = '';
            if (row.from.length > 0){
                connFrom += row.from.reduce(function(prev, curr){
                    if (prev != null)
                        return prev + '<br>' + curr.shortDesc;
                    else
                        return curr.shortDesc;
                }, null);            
            }
            rows += '<td>' + connFrom + '</td>';

            var connTo = '';
            if (row.to.length > 0){
                connTo += row.to.reduce(function(prev, curr){
                    if (prev != null)
                        return prev + '<br>' + curr.shortDesc;
                    else
                        return curr.shortDesc;
                }, null);
            }
            
            rows += '<td>'+row.node.shortDesc+'</td><td>'+row.node.description+'</td><td>' + connTo + '</td></tr>';
            options += '<option value="'+ row.node._id +'">'+ row.node.shortDesc +'</option>'
        });
        $('#design-blockbody').append(rows);
        $('#connectionTo').append(options);
        $('#connectionFrom').append(options);
        $('.removeNodeButton').on('click', removeNode);
    });

	io.on('createConnectionFailure', function(data){
        error('create node failed with error:' + data);
    });    
	io.on('createConnectionSuccess', function(data){       
        if (typeof data.node != 'undefined'){
            var row = '<tr id=' + data.node._id + '><td><input type="submit" class="removeNodeButton" value="-"></td><td>' + $('#connectionFrom option:selected').text()+ '</td><td>' + data.node.shortDesc + '</td><td>'+data.node.description+'</td><td></td</tr>';
            $('#design-block').append(row);
            $('#shortDesc').val('');
            $('#description').val('');
            $('.removeNodeButton').on('click', removeNode);
            
            var option = '<option value="'+ data.node._id +'">'+ data.node.shortDesc +'</option>'
            $('#connectionTo').append(option);
            $('#connectionFrom').append(option);
        } else{
            //find the other nodes and add the connections
        }
    });
    
    io.on('removeNodeFailure', function(data){
        error('remove node failed with error:' + data.toString());
    });

    io.on('removeNodeSuccess', function(data){
        var id = '#'+data.removeID;
        $(id).remove();
    });
    
//explore section events----------------------------------------------------------------
    io.on('navToLocFailure', function(data){
        error('navtoLoc failed with error:' + data);
    });
    
    
    io.on('navToLocSuccess', function(data){         
console.log(data);        
        $('#explore-node').html(data.node.description);
        exNode = data.node;
        
        var conns = '',
            exLog = '';
        
        if (data.conns.length > 0){
            exConnections = data.conns;
            conns = data.conns.reduce(connLink, '');
        }        
        
        if (data.history.length > 0) {
            exLog = data.history.reduce(buildLog, '');
        }
        
        $('#explore-connections').html('<ul>' + conns + '</ul>');
        $('#explore-blocklog').html(exLog);
    });
}
//------------------------------------------------------------End of IO


function error(err){
    console.log(err);    
    $('#error').html(err);
    setTimeout(function(){$('#error').html('');},5000);
};          

function removeNode(){
    if (confirm('Are you sure you want to delete this location and all associated connections?'))
        io.emit('removeNode', {nodeID:$(this).parent().parent().attr('id')});
};

var exConnections, exNode;
function connLink(prev, curr, index){
    var connDesc, destNode;
    if (curr.node1._id === exNode._id) {
        connDesc = curr.desc12;
        destNode = 2;
    } else {
        connDesc = curr.desc21;
        destNode = 1;
    }
    if (connDesc && connDesc != '')
        return prev + '<li data-index=' + index + ' data-destnode=' + destNode + '>' + connDesc + '</li>';
    else
        return prev;
}

function buildLog (prev, curr) {
console.log(curr);
    var to, via, from;
    if (curr.destNode === 1){
        from = curr.connUsed.node2.shortDesc;
        via = curr.connUsed.desc21;
        to = curr.connUsed.node1.shortDesc;
    } 
    else {
        from = curr.connUsed.node1.shortDesc;
        via = curr.connUsed.desc12;
        to = curr.connUsed.node2.shortDesc;
    }
    var row = '<tr><td data-label="Date">' + curr.createdDate + '</td>';
    row += '<td data-label="From">' + from + '</td>';  
    row += '<td data-label="Via">' + via+ '</td>';
    row += '<td data-label="To">' + to + '</td></tr>';
    
    return prev + row;
}

$(document).ready(function() {
    ready = true;
    /* Helpful Information for curious users */
    $('#createConnection').on('click', function(){
        var connection = {connection:{node1:$('#connectionFrom').val(),        
                                      node12Desc:$('#node12Desc').val(), 
                                      node2:$('#connectionTo').val(),
                                      node21Desc:$('#node21Desc').val()
                                     }, 
                          node:{shortDesc:$('#shortDesc').val(),
                                description:$('#description').val()
                            }
                         };
        
        io.emit('createConnection', connection);
    });
    
    $('#connectionTo').change(function(){
        if (this.value != '(new)'){
            $('#shortDesc').hide();
            $('#description').hide();
        } else {
            $('#shortDesc').show();
            $('#description').show();            
        }
        
    });
    
    $('#explore-connections').on('click', 'li', function(){
        io.emit('navToLoc', {conn: exConnections[$(this).data('index')],
                            destNode: $(this).data('destnode')});
    });
});