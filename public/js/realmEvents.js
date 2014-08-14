if (typeof io !== 'undefined'){
	var io=io.connect();
	io.on('getNodesFailure', function(data){
        error('get nodes failed with error:' + data.toString());
    });    
	io.on('getNodesSuccess', function(data){
        var rows = ''
        data.forEach(function(row){
            rows += '<tr><td></td><td>'+row.shortDesc+'</td><td>'+row.description+'</td><td>Lobby</td></tr>';
        });
        $('#design-block').append(rows);
    });
    
	io.on('createNodeFailure', function(data){
        error('create node failed with error:' + data);
    });    
	io.on('createNodeSuccess', function(data){
        var row = '<tr><td></td><td>'+data.shortDesc+'</td><td>'+data.description+'</td><td>Lobby</td></tr>';
        $('#design-block').append(row);
        $('#shortDesc').val('');
        $('#description').val('');
    });
}
//------------------------------------------------------------End of IO


function error(err){
    $('#error').html(err);
    setTimeout(function(){$('#error').html('');},5000);
};          
          
$(document).ready(function() {
    /* Helpful Information for curious users */
    $('#createNode').on('click', function(){
        io.emit('createNode', {shortDesc:$('#shortDesc').val(), description:$('#description').val()});
    });
    
    io.emit('getNodes',{});
});