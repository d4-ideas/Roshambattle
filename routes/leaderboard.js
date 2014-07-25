var leader = require('d4-roshamleader'); 

exports.getLeaderBoard = function(req){
    var input = { 
                    scoreType: 'winRate',
                    numScores: 25,
                    startAtRank: 1 
                };
    var boardTest = [{
                    effectiveDate: Date,
                    user: {_id:'123', displayName:'Dummy'}, 
                    score:  {
                        winRate: .0,
                        totalWins: 0
                    }
                }];
    
    leader.getScores(input, function(err, data){
        if (err)
            req.io.emit('getLeaderBoardFailure', err.error);
        else
            req.io.emit('getLeaderBoardSuccess', data);
    });
    
    req.io.emit('getLeaderBoardSuccess', boardTest);
}