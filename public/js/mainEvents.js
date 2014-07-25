if (typeof io !== 'undefined'){
	var io=io.connect();
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
		addChat(data);
	});
    
    io.on('getChatsSuccess', function(data){
        //I know this isn't the fastest way
        data.forEach(function(chat){
            addChat(chat);
        });
    });
          
    io.on('getChatsFailure', function(data){
        console.log('enter getChatsFailure');
        console.log(data);        
    });  
    
    io.on('plusAdded', function(data){
        var count = $("#"+data+"").children('.plusChat').html();
        $("#"+data+"").children('.plusChat').html(++count);
    });
    io.on('minusAdded', function(data){
        var count = $("#"+data+"").children('.minusChat').html();
        $("#"+data+"").children('.minusChat').html(++count);
    });
    io.on('plusFailed', function(data){
        $('#error').html('Plus failed with reason: ' + data);
        setTimeout(function(){$('#error').html('');},5000);
    });
    io.on('minusFailed', function(data){
        $('#error').html('Plus failed with reason: ' + data);
        setTimeout(function(){$('#error').html('');},5000);
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
    
    io.on('getLeaderBoardSuccess', function(data){
        var rows = '';
        data.forEach(function(element){
            rows +=  '<tr><td data-label="Name">' + element.user.displayName + '</td><td data-label="WinRate">' + element.score.winRate + '</td><td data-label="TotalWins">' + element.score.totalWins + '</td></tr>'
        });
        $('#leader-block tr:last').after(rows);
    });
}
//------------------------------------------------------------End of IO


$(document).on('click', '.plusChat', function () {
    var target = this,
        chatID = $(target).parent().attr('id'),
        chatUser = $(target).parent().data('uid'),
        clientUser = $('body').data('uid');
    if (chatUser == clientUser) {
        $('#error').html('Stop playing with yourself');
    }
    else {
        io.emit('addPlus', {chatID:chatID});
        $('#error').html(''); 
    }
    return false;
});

$(document).on('click', '.minusChat', function () {
    var target = this,
        chatID = $(target).parent().attr('id'),
        chatUser = $(target).parent().data('uid'),
        clientUser = $('body').data('uid');
    if (chatUser == clientUser) {
        $('#error').html('Stop touching yourself');
    }
    else {
        io.emit('addMinus', {chatID:chatID});
        $('#error').html('');
    }
    return false;
});

var addChat = function(chat){
    var niceDate = moment(chat.chatDate);
    var plusHTML = '<span class="count plusChat">'+chat.pluses.length+'</span>';
    var minusHTML = '<span class="count minusChat">'+chat.minuses.length+'</span>';

    $("#the-shitcan").prepend('<div class="chat-row"><div id="' + chat._id + '" data-uid="' + chat.user._id + '" class="karma-machine"><span class="time-machine">' + niceDate.fromNow() + '</span>' + plusHTML + minusHTML + '</div><p><span class="user">' + chat.user.name + ':</span>' + chat.comments + '</p></div>');
}

$(document).ready(function() {
    io.emit('getUserScore', {});    
    io.emit('getTurns', {});
    io.emit('getChats', {});
    io.emit('getLeaderBoard', {});
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
        setTimeout(function() {
            $("#taunt-box textarea").val('');
        }, 100);
  	});    
});