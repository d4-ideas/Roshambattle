var leader = require('d4-roshamleader'); 

exports.getLeaderBoard = function(req){
    var input = { 
                    scoreType: 'winRate',
                    numScores: 5,
                    startAtRank: 1 
                };
    
    leader.getScores(input, function(err, data){
        if (err)
            req.io.emit('getLeaderBoardFailure', err.error);
        else
            req.io.emit('getLeaderBoardSuccess', data);
    });
}