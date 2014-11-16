// connect to the database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/roshambattle');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
   console.log('Connected to Mongo'); 
});
var conn = require('d4-realmconnection');
var node = require('d4-realmnode');
var user = require('d4-user');
var realmuser = require('d4-realmuser');



var playerPassword = 'test';
var numPlayers = 2;
var numNodes = 2;


var addPlayers = function (){
    var newname;
    for(var i=1;i<=numPlayers; i++){
        newname = 'Player' + i;

        user.userModel.findOneAndUpdate(
            {name: newname},
            {email: newname + '@d4.com',
            name: newname,
            password: playerPassword},
            {upsert:true},
            newUser
        );
    };
};

var newUser = function(err, user){
    if(user){    
        console.log(user);
        addRealmUser(user);
        node.model.remove({owner:user._id}, function(err){
            addNodes(user);
        });
    };
};


var addRealmUser = function(user){
    realmuser.model.findOneAndUpdate(
        {user: user._id},
        {user: user._id},
        {upsert:true},
        function(err, newRU){
            console.log(newRU);
        }
    );
};

var addNodes = function(user){
    var numReturned = 0;
    var userNodes = [];
    var nodeReturns = function(err, newNode){
        console.log(newNode);
        numReturned++;
        if(newNode){
            userNodes.push(newNode);    
        }
        if(numReturned === numNodes){
            addConns(userNodes);
        }
    };
    
    
    for(var i=0;i<numNodes; i++){
        node.model.create({   owner: user._id, 
            shortDesc: 'Fist',
            description: 'A lonely island',
            type: 'roshamwar'},
            nodeReturns
        );
    };
};


var addConns = function(userNodes){
    
    
    
};



// and now run the whole damn thing
addPlayers();




    
  