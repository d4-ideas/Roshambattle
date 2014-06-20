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
        $('#error').html('');
        var turnDate = moment(data.turnDate);
        var oppHTML = data.opponents.reduce(function(previousValue, currentValue) {
            return previousValue + '<p>' + currentValue.name + ': ' + currentValue.result + '</p>';
        }, '');
        var row = '<tr><td data-label="Weapon">'+data.weapon+'</td><td data-label="Committed">'+turnDate.format("MMMM Do YYYY, h:mm:ss a")+'</td><td data-label="Results">'+oppHTML+'</td></tr>';
        $('#table-rounds tr:last').after(row);
    });
    
    io.on('getTurnsFailure', function(data){
        $('#error').html(data);
    });
}

$(document).ready(function() {
    io.emit('getUserScore', {});    
    io.emit('getTurns', {});
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