var chat = require('d4-chat'); 

exports.taunt = function(req){
    chat.addChat({user: req.session.userID, comments:req.data.taunt}, function(err,data){
	   req.io.broadcast('messageForYouSir', data);
        req.io.emit('messageForYouSir', data);
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

exports.addPlus = function(req){
    chat.addPlus({chatID:req.data.chatID, userID: req.session.userID}, function(err, data){
        req.io.broadcast('plusAdded', req.data.chatID);
        req.io.emit('plusAdded', req.data.chatID);
    });
};

exports.addMinus = function(req){
    chat.addMinus({chatID:req.data.chatID, userID: req.session.userID}, function(err, data){
        req.io.broadcast('minusAdded', req.data.chatID);
        req.io.emit('minusAdded', req.data.chatID);
    });
};
