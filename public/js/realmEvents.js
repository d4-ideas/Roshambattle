if (typeof io !== 'undefined'){
	var io=io.connect();
	io.on('getNodesFailure', function(data){
        error('get nodes failed with error:' + data.toString());
    });    
	io.on('getNodesSuccess', function(data){
        var rows = '',
            options = '';
        
        data.forEach(function(row){
            rows += '<tr><td></td><td></td><td>'+row.shortDesc+'</td><td>'+row.description+'</td><td></td></tr>';
            options += '<option value="'+ row._id +'">'+ row.shortDesc +'</option>'
        });
        $('#design-block').append(rows);
        $('#connectionTo').append(options);
        $('#connectionFrom').append(options);
    });
    
	io.on('createConnectionFailure', function(data){
        error('create node failed with error:' + data);
    });    
	io.on('createConnectionSuccess', function(data){
console.log(data);        
        
        if (typeof data.node != 'undefined'){
            var row = '<tr><td></td><td>' + $('#connectionFrom option:selected').text()+ '</td><td>' + data.node.shortDesc + '</td><td>'+data.node.description+'</td><td></td></tr>';
            $('#design-block').append(row);
            $('#shortDesc').val('');
            $('#description').val('');
            //find node2 and add the from connection
        } else{
            //find the other nodes and add the connections
        }
    });
}
//------------------------------------------------------------End of IO


function error(err){
    $('#error').html(err);
    setTimeout(function(){$('#error').html('');},5000);
};          



$(document).ready(function() {
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
//
//    $('#connectionFrom').change(function(){
//        alert('connectionTo changed');
//    });
    
    io.emit('getNodes',{});
});