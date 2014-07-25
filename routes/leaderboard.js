var leader = require('d4-roshamleader'); 

exports.getLeaderBoard = function(req){
    var input = { 
                    scoreType: 'totalWins',
                    numScores: 5,
                    startAtRank: 1 
                };
    
    leader.getScores(input, function(err, data){
        console.log(err);
        console.log(data);
        if (err)
            req.io.emit('getLeaderBoardFailure', err.error);
        else
            req.io.emit('getLeaderBoardSuccess', data);
    });
}