var loaded = false,
    ready = false;

if (typeof io !== 'undefined') {
	var io = io.connect();
    io.on('connect', function (data) {
        if (!loaded) {
            if (ready) {
                loaded = true;
            } else {
                io.connect();
            }
        }
    });
    
    io.on('updateUserFailure', function (data) {
        console.log(data);
        error('update user failed with error:' + data.toString());
    });
    
	io.on('updateUserSuccess', function (data) {
        console.log(data);
    });
    
	io.on('changePasswordError', function (data) {
        console.log(data);
        error('update user failed with error:' + data.toString());
    });
    
	io.on('changePasswordNoMatch', function (data) {
        error('The old password entered is incorrect');
    });
    
	io.on('changePasswordSuccess', function (data) {
        error('Password updated successfully.');
        $('#oldpassword').val('');
        $('#newpassword1').val('');
        $('#newpassword2').val('');
        $('#usersettingstab').click();
    });
}
//------------------------------------------------------------End of IO
          

$(document).ready(function () {
    ready = true;
    $('#submitUserSettings').on('click', function () {
        var user = {name: $('#name').val(),
                    email: $('#email').val(),
                    mobile: $('#mobile').val()};

        console.log(user);
        io.emit('updateUser', user);
    });
    
    $('#submitUserPassword').on('click', function () {
        if (!$('#oldpassword').val()) {
            error('Your current password is empty.  Please enter your old password!');
            return false;
        }
        if (!$('#newpassword1').val()) {
            error('Your new password is empty.  Please enter your new password!.');
            return false;
        }
        if ($('#newpassword1').val() !== $('#newpassword2').val()) {
            error('Your new passwords do not match!  Please ensure the new password is entered correctly.');
            return false;
        }
        
        var user = {oldpassword: hex_md5($('#oldpassword').val()),
                    newpassword: hex_md5($('#newpassword1').val())};
        io.emit('changePassword', user);
    });
});