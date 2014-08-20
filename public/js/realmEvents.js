var loaded = false,
    ready = false;

if (typeof io !== 'undefined'){
console.log('connect' + new Date().getSeconds()+ '.' + new Date().getMilliseconds());    
	var io=io.connect();

    io.on('connect', function(data){
        console.log('connection made' + new Date().getSeconds()+ '.' + new Date().getMilliseconds());
        if (!loaded) {
            if (ready) {
console.log('first emit' + new Date().getSeconds()+ '.' + new Date().getMilliseconds());    
                io.emit('getNodes',{});

                //explore
                io.emit('getNode', {nodeID:null}); 
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
        $('#design-block').append(rows);
        $('#connectionTo').append(options);
        $('#connectionFrom').append(options);
        $('.removeNodeButton').on('click', removeNode);
    });
    
	io.on('createConnectionFailure', function(data){
        error('create node failed with error:' + data);
    });    
	io.on('createConnectionSuccess', function(data){ 
        if (typeof data.node != 'undefined'){
            var row = '<tr><td></td><td>' + $('#connectionFrom option:selected').text()+ '</td><td>' + data.node.shortDesc + '</td><td>'+data.node.description+'</td><td>' + $('#connectionTo option:selected').text()+ '</td</tr>';
            $('#design-block').append(row);
            $('#shortDesc').val('');
            $('#description').val('');
            //find node2 and add the from connection
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
    
    //explore section events
    io.on('getNodeFailure', function(data){
        error('get node failed with error:' + data);
    });
    
    io.on('getNodeSuccess', function(data){
console.log(data);        
        $('#explore-node').html(data.node.description);
        
        var conns = '';
        var connLink = function (item){
            return '<li data-connID="' + item.node._id + '">' + item.shortDesc + '</li>';
        }
        
        if (data.to.length > 0){
            conns += data.to.reduce(function(prev, curr){
                return prev + connLink(curr);
            }, '');
        }
        
        if (data.from.length > 0){
            conns += data.from.reduce(function(prev, curr){
                return prev + connLink(curr);
            }, '');
        }
        $('#explore-connections').html('<ul>' + conns + '</ul>');
    });
}
//------------------------------------------------------------End of IO


function error(err){
    $('#error').html(err);
    setTimeout(function(){$('#error').html('');},5000);
};          

function removeNode(){
    io.emit('removeNode', {nodeID:$(this).parent().parent().attr('id')});
};


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
        io.emit('getNode', {nodeID:$(this).data('connid')});
    });
});