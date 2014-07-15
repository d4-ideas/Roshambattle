var expect = require("chai").expect;
var ruser = require('d4-roshamuser');
var user = require('d4-user');
var testChat = require('d4-chat');
var rockID;

before(function(){
    user.userModel.findOne({email:'RockUser@email.com'}, function (err, data) {
        if (err)
            throw "Couldn't find rock user";
        else
            rockID = data._id;
    });
});

after(function(){
    testChat.model.remove({user:rockID}, function(err){
    }); 
});

describe('d4-chat', function() {
    describe('.addChat', function() {
        it('should throw a user required error', function(done){
            testChat.addChat({user:null, comments:'Nothing'}, function(err,data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });
        });
        
        it('should create a new chat', function(done){
            testChat.addChat({user:rockID, comments:'Here is a comment'}, function(err, data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                testChat.model.findOne({user:rockID}).exec(function(err, data){
                    expect(data).to.be.ok;
                    expect(data.comments).to.be.string('Here is a comment');
                    done();
                });
            });
        });
    });
    
    describe('.getChats', function() {
        it('should give me the chat we just added', function(done){
            testChat.getChats({startDate: new Date()}, function(err, data){
                console.log(err);
                console.log(data);
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                done();
            });
        });
    });
});