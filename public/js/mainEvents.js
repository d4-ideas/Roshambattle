if (typeof io !== 'undefined'){
	var io=io.connect();
	console.log(io);
	io.on('selectWeaponSuccess', function(data){
        $('#error').html('');
        $('#makeItEasyToFindMe').html('You have selected '+$("[name=weapon]:checked").val());
	});
    io.on('selectWeaponFailure', function(data){
        $('#error').html('selectWeapon failed with error: ' + data.reason);
    });
    io.on('UserScoreSuccess', function(data){
        $('#error').html('');
        $('#current-score').html('GP: '+data.totalBattles + ' Wins: ' + data.totalWins + ' Draws: ' + data.totalTies + ' Losses: '+data.totalLosses);
        if (data.weapon){
            $('#makeItEasyToFindMe').html('You have selected '+data.weapon);
        }
    });
    io.on('UserScoreFailure',function(data){
        $('#current-score').html(data.error);
    });
	io.on('messageForYouSir', function(data){
		$("#the-shitcan").append('<p><span class="user">' + data.who + ': </span> ' + data.what + '</p>');

	});
    io.on('getOneTurn', function(data){
        var row = '<tr><td data-label="Round">2</td><td data-label="Weapon">Paper</td><td data-label="Committed">04/29/2014 11:11:11</td><td data-label="Results"><p>@ 04/29/2014 12:22:22</p><p>Player 2: Win</p><p>Player 3: Loss</p><p>Player 4: Win</p><p>Score: 2 out of 3 (66.66% efficiency)</p></td></tr>'
        $('#table-rounds tr:last').after(row);
    });
}

$(document).ready(function() {
    io.emit('getUserScore', {});    
    io.emit('getTurns', {});
    $('#commit').click(function(){
		io.emit('selectWeapon', {weapon:$("[name=weapon]:checked").val()});
	});
    
	$('#commit').click(function(){
		io.emit('selectWeapon', {weapon:$("[name=weapon]:checked").val()});
	});

    /* I shall taunt you a second time! */
    $("#taunt-box textarea").keypress(function(e){
        if (e.which == 13) {
            $('[name=taunt]').click();
            event.preventDefault();
            event.stopPropagation();
            return false;
        }
    });
	$('[name=taunt]').click(function(){
		var daTaunt = $("#taunt-box textarea").val();
        var daTaunter = $('#welcome-block span').html();
        io.emit('taunt', {taunt : daTaunt});
		$("#the-shitcan").append('<p class="hideMe"><span class="user">' + daTaunter + ':</span> ' + daTaunt + '</p>');
        setTimeout(function() {
            $("#taunt-box textarea").val('');
        }, 100);
  	});    
});