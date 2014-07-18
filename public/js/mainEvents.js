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
        $('#current-score').html('Games Played: '+data.totalBattles + '<p> Wins: ' + data.totalWins + ' Draws: ' + data.totalTies + ' Losses: '+data.totalLosses);
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
    
    io.on('getChatsSuccess', function(data){
        //I know this isn't the fastest way
        data.forEach(function(chat){
            addChat(chat.user.name, chat.comments, chat.chatDate);
        });
    });
          
    io.on('getChatsFailure', function(data){
        console.log('enter getChatsFailure');
        console.log(data);        
    });          
    
    io.on('getTurns', function(data){
        $('#error').html('');
        var rows = '';
        data.forEach(function(element){
            var turnDate = moment(element.turnDate);
            var oppHTML = element.opponents.reduce(function(previousValue, currentValue) {
                return previousValue + '<p>' + currentValue.name + ': ' + currentValue.result + '</p>';
            }, '');
            rows += '<tr><td data-label="Weapon">'+element.weapon+'</td><td data-label="Committed">'+turnDate.format("MMMM Do YYYY, h:mm:ss a")+'</td><td data-label="Results">'+oppHTML+'</td></tr>';
        });
        $('#table-rounds tr:last').after(rows);
    });
    
    io.on('getTurnsFailure', function(data){
        $('#error').html(data);
    });
}

var addChat = function(user, comments, chatDate){
    var niceDate = moment(chatDate);
    $("#the-shitcan").prepend('<p class="hideMe"><span>'+niceDate.fromNow()+'</span> <span class="user">' + user + ':</span> ' + comments + '</p>');
}

$(document).ready(function() {
    io.emit('getUserScore', {});    
    io.emit('getTurns', {});
    io.emit('getChats', {});
    $('#commit').click(function(){
		io.emit('selectWeapon', {weapon:$("[name=weapon]:checked").val()});
	});

    /* Create a taunt on the press of the Enter/Return key */
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
		addChat(daTaunter, daTaunt, new Date());
        setTimeout(function() {
            $("#taunt-box textarea").val('');
        }, 100);
  	});    
});