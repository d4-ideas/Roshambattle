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
    }
}
          
function error(err){
    $('#error').html(err);
    setTimeout(function(){$('#error').html('');},5000);
};    

$(document).ready(function() {
    ready = true;

    
    });
    
    $('#explore-connections').on('click', 'li', function(){
        io.emit('getNode', {nodeID:$(this).data('connid')});
    });
});