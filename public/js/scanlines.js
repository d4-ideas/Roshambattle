/*
 * Scan Lines Code sourced from http://www.wittworksproductions.com/2012/12/scan-lines-with-javascript/
 */

function initScanlines(){
    var lineHeight = $('#line').height();
    var dotWidth = $('#dot').width();
    var desiredBottom = 0;
    var lineStart = $('#line').css('top');
    var dotStart = $('#dot').css('left');
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
    //$('#line').stop(true,true);
    //$('#dot').stop(true,true);
    $('#line').hide().addClass('hidden');
    $('#dot').hide();
}

function showScanlines(){
    if ($('#line').hasClass('hidden')) {
        $('#line').show();
        $('#dot').show();
    }
    else {
        initScanlines();
    }
}

$(document).ready(function() {
    if ($('body').hasClass('theme-scanlines')) {
        initScanlines();   
    }
});