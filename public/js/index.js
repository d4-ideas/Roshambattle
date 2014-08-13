$(document).ready(function() {
    /* Helpful Information for curious users */
    $('.wtf').on('click', function(){
        console.log('here');
        $.get('/about');
    });
});