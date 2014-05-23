/*
 * Scan Lines Code sourced from http://www.wittworksproductions.com/2012/12/scan-lines-with-javascript/
 */

function initScanlines(){
    //var lineHeight = $('#line').height();
    //var dotWidth = $('#dot').width();
    //var lineStart = $('#line').css('top');
    //var dotStart = $('#dot').css('left');
    // Hardcoding these values to fix an issue when scanlines 
    // is not the theme loaded initially. 
    var lineHeight = 2;
    var dotWidth = 20;
    var lineStart = 0;
    var dotStart = 10;
    
    var desiredBottom = 0;
    var lineSpeed = 5000;
    var dotSpeed = lineSpeed / 2;

    var windowHeight = $(window).height();
    var windowWidth = $(window).width();
    var newPosition = windowHeight - (lineHeight + desiredBottom);
    var newPositionDot = windowWidth - dotWidth;

    function move() {
        $('#line').animate({
            top: newPosition
        }, lineSpeed);
        $('#line').animate({
            top: lineStart
        }, 0);
    };

    function dot_move() {
        $('#dot').animate({
            left: newPositionDot
        }, dotSpeed);
        $('#dot').animate({
            left: dotStart
        }, 0);
    }

    $(window).resize(function() {
        windowHeight = $(window).height();
        windowWidth = $(window).width();
        newPosition = windowHeight - (lineHeight + desiredBottom);
        newPositionDot = windowWidth - dotWidth;
        $("#cover").height(windowHeight);
    });

    $(".setfocus").focus();

    $("#cover").height(windowHeight);

    move();
    dot_move();
    setInterval(function() {
        move();
    }, lineSpeed);
    setInterval(function() {
        dot_move();
    }, dotSpeed);
}

function hideScanlines(){
    $('#line').hide().addClass('hidden');
    $('#dot').hide();
}

function showScanlines(){
    if ($('#line').hasClass('hidden')) {
        $('#line').show().removeClass('hidden');
        $('#dot').show();
    }
    else {
        initScanlines();
    }
}