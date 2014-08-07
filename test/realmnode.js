console.log('realmnode');
var expect = require("chai").expect;
var node = require('d4-realmnode');
var user = require('d4-user');
var rockID, nodeID;

before(function(done){
    user.userModel.findOne({email:'rockuser@email.com'}, function (err, data) {
        if (err)
            throw "Couldn't find rock user";
        else
            rockID = data._id;

        node.model.create({user:rockID}, function(err,data){
            if (err)
                throw "Failure to create node";
            else 
                nodeID = data._id;
            
            done();
        });      
    });
    

});

after(function(){
    node.model.remove(null, function(err, data){
        if (err || data < 1)
            throw 'unable to cleanup nodes';
    });
});

describe('d4-realmnode', function(){
    describe('addNode', function(){
        it('should create a node', function(done){
            node.addNode({user:rockID}, function(err, data){
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                done();
            });
        });
    });
});

describe('d4-realmnode', function(){
    describe('updateNode', function(){
        it('should update the node description', function(done){
            node.updateNode({nodeID: nodeID, description: 'An oasis consisting of a calm pool of water surrounded by lush palm trees.'}, function(err, data){
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                done();
            });
        });
    });
});