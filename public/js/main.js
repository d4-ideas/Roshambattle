function createCookie(name, value, days) {
    if (days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = "; expires=" + date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}

function setTheme(themeIndex){
    if (themeIndex == 0) {
        $('body').removeClass('theme-scanlines').removeClass('theme-lcd');
        //hideScanlines();
    }
    else if (themeIndex == 1) {
        $('body').removeClass('theme-lcd').addClass('theme-scanlines');
        //showScanlines();
    }
    else if (themeIndex == 2) {
        $('body').removeClass('theme-scanlines').addClass('theme-lcd');
        //hideScanlines();
    }
}

if (typeof io !== 'undefined'){
	var io=io.connect();
	io.on('result', function(data){
        $('#makeItEasyToFindMe').html('You have selected '+$("[name=weapon]:checked").val());
	});
    io.on('UserScoreSuccess', function(data){
        $('#current-score').html('GP: '+data.totalBattles + ' Wins: ' + data.totalWins + ' Draws: ' + data.totalTies + ' Losses: '+data.totalLosses);
    });
    io.on('UserScoreFailure',function(data){
        $('#current-score').html(data.error);
    });
	io.on('messageForYouSir', function(data){
		console.log(data);
		$("#the-shitcan").append('<p><span class="user">' + data.who + '</span> ' + data.what + '</p>');

	});
}

$(document).ready(function() {
    var cookieValue = readCookie('theme');
    var themeSetting = '#theme' + cookieValue;
    $(themeSetting).prop('checked',true);
    setTheme(cookieValue);
    
    $('#theme-widget input[type=radio][name=theme-options]').change(function() {
        var cbvalue = this.value;
        createCookie('theme',cbvalue,365);
        setTheme(cbvalue);
    });
	$('#commit').click(function(){
		io.emit('selectWeapon', {weapon:$("[name=weapon]:checked").val()});
	});
	$('[name=taunt]').click(function(){
		io.emit('taunt', {taunt : $("#taunt-box textarea").val()});
		$("#the-shitcan").append('<p><span class="user">Me:</span> ' + $("#taunt-box textarea").val() + '</p>');
	});

    initScanlines();
});