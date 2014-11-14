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



var addNodes = function(user){
    for(var i=0;i<numNodes; i++){
        node.model.create({   owner: user._id, 
                shortDesc: 'Fist',
                description: 'A lonely island',
                type: 'roshamwar'},
            function(err, newNode){
                console.log(newNode);
            }
        );
    };
};

var newUser = function(err, user){
    if(user){    
        console.log(user);
        node.model.remove({owner:user._id}, function(err){
            addNodes(user);
        });
    }
};

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




    
  