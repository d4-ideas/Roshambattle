var chat = require('d4-chat'); 

exports.taunt = function(req){
    chat.addChat({user: req.session.userID, comments:req.data.taunt}, function(err,data){
	   req.io.broadcast('messageForYouSir', { 'who' : req.session.displayName, 'what' : req.data.taunt});
    });
}

exports.getChats = function(req){
    chat.getChats({startDate: new Date()}, function(err, data){
        if(err)
            req.io.emit('getChatsFailure', 'Failed to get the chats for you: ' +  err.error);
        else{
            req.io.emit('getChatsSuccess', data);
        }
    });
}