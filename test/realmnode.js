console.log('realmnode');
var expect = require("chai").expect;
var node = require('d4-realmnode');
var user = require('d4-user');
var rockID;

before(function(done){
    user.userModel.findOne({email:'rockuser@email.com'}, function (err, data) {
        if (err)
            throw "Couldn't find rock user";
        else
            rockID = data._id;
        
        done();
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