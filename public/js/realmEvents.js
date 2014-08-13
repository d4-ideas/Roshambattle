if (typeof io !== 'undefined'){
	var io=io.connect();
	io.on('createNodeFailure', function(data){
        error('create node failed with error:' + data);
    });    
	io.on('createNodeSuccess', function(data){
        error('create node success:' + data);
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
        console.log('here');
        io.emit('createNode', {});
    });
});