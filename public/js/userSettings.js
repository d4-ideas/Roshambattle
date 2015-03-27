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
        console.log(data);
        error('update user failed with error:' + data.toString());
    }); 
    
	io.on('updateUserSuccess', function(data){
console.log(data);        
    });
}
//------------------------------------------------------------End of IO
          

$(document).ready(function() {
    ready = true;    
    $('#submitUser').on('click', function(){
        var user = {name: $('#name').val(),
                    email: $('#email').val(),
                    mobile: $('#mobile').val()};
//        if ($('newPassword1').val()  && $('newPassword2').val() && $('oldPassword').val()){
//            if (
//        }
        console.log(user);
        io.emit('updateUser', user);
    });
});