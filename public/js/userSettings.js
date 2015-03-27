var loaded = false,
    ready = false;

if (typeof io !== 'undefined'){
	var io=io.connect();
    io.on('connect', function(data){
        if (!loaded) {
            if (ready) {
                loaded = true;
            } else {
                io.connect();
            }
        }
    });    
    
    io.on('updateUserFailure', function(data){
        error('get nodes failed with error:' + data.toString());
    }); 
    
	io.on('updateUserSuccess', function(data){
console.log(data);        
    });
}
//------------------------------------------------------------End of IO
          

$(document).ready(function() {
    ready = true;    
    $('#submitUser').on('click', function(){
        io.emit('updateUser', {});
    });
});