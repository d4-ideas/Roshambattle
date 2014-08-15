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

        node.model.create({owner:rockID}, function(err,data){
            if (err)
                throw "Failure to create node";
            else {
                nodeID = data._id;
            }
            
            done();
        });      
    });
    

});

after(function(){
    node.model.remove({owner:rockID}, function(err, data){
        if (err || data.length < 1)
            throw 'unable to cleanup nodes';
    });
});

describe('d4-realmnode', function(){
    describe('addNode', function(){
        it('should throw an error for a blank user', function(done){
            node.addNode({user:null}, function(err, data){
                expect(err).to.be.ok;
                expect(data).to.not.be.ok;
                done();
            });
        });        
        it('should create a node', function(done){
            node.addNode({user:rockID}, function(err, data){
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                expect(data.owner).to.be.ok;
                done();
            });
        });
    });

    describe('updateNode', function(){
        it('should update the node description', function(done){
            node.updateNode({nodeID: nodeID, description: 'An oasis consisting of a calm pool of water surrounded by lush palm trees.'}, function(err, data){
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                done();
            });
        });
    });
    
    describe('getNodes', function(){
        it('should get some nodes', function(done){
            node.getNodes(rockID, function(err, data){
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                done();
            });
        });
    });
});