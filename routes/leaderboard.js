var leader = require('d4-roshamleader'); 

exports.getLeaderBoard = function(req){
    var input = { 
                    numScores: 25,
                    startAtRank: 1 
                };
    if(req.data.sortBy){
        input.scoreType = req.data.sortBy;
    }
    else{
        input.scoreType = 'totalWins';
    }
    
    leader.getScores(input, function(err, data){
        if (err)
            req.io.emit('getLeaderBoardFailure', err.error);
        else
            req.io.emit('getLeaderBoardSuccess', data);
    });
}