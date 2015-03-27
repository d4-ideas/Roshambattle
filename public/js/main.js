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
        $('body').removeClass('theme-scanlines').removeClass('theme-scanlines amber');
        //hideScanlines();
    }
    else if (themeIndex == 1) {
        $('body').removeClass('theme-scanlines amber').addClass('theme-scanlines');
        //showScanlines();
    }
    else if (themeIndex == 2) {
        $('body').removeClass('theme-scanlines').addClass('theme-scanlines amber');
        //hideScanlines();
    }
}

$(document).ready(function() {
    /* Licking the paint */
    var cookieValue = readCookie('theme');
    var themeSetting = '#theme' + cookieValue;
    $(themeSetting).prop('checked',true);
    setTheme(cookieValue);
    
    $('#theme-widget input[type=radio][name=theme-options]').change(function() {
        var cbvalue = this.value;
        createCookie('theme',cbvalue,365);
        setTheme(cbvalue);
    });

    /* Tabs */
    $('#tabs-block li').on('click', function(){ 
        var that = this;
        var target = '#';
        if (!$(this).hasClass('active')) {
            target += $(this).data('tabid');

           $('#tabs-block li').each(function(){
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                }
                $(that).addClass('active');
            });
            
            $('.tab-block').each(function(){
                if ($(this).hasClass('active')) {
                    $(this).removeClass('active');
                }
            });
            $(target).addClass('active');
        }
    });
	
	/* RoshamWar Icons 
								<span class="warWeapon roshamRock" data-nodeID="1" title="Rock"></span>
								<span class="warWeapon roshamPaper" data-nodeID="1" title="Paper"></span>
								<span class="warWeapon roshamScissors" data-nodeID="1" title="Scissors"></span>
	
	*/
	$('.warWeapon').on('click',function(){
		if (!$(this).hasClass('active')) {
			var that = this;
			var target = $(that).attr('data-nodeID');
			console.log('nodeID='+target);
			$('.warWeapon[data-nodeID = "'+target+'"]').each(function(){
				if ($(this).hasClass('active')) {
					$(this).removeClass('active');
				}
			});
			$(that).addClass('active');
		}
	});
	
    /* Turns on the scan line bit */
    initScanlines();
    
    /* Setup the turn countdown */
    if (typeof moment != 'undefined'){
        var nextTurn = new moment($('#next-turn').data('date'));
        $('#next-turn').html('Next Turn Generation ' + nextTurn.fromNow());
    }
});