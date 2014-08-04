var expect = require("chai").expect;
var ruser = require('d4-roshamuser');
var user = require('d4-user');
var testChat = require('d4-chat');
var rockID;
var paperID;
var chatID;

before(function(){
    user.userModel.findOne({email:'rockuser@email.com'}, function (err, data) {
        if (err)
            throw "Couldn't find rock user";
        else
            rockID = data._id;
    });
    user.userModel.findOne({email:'paperuser@email.com'}, function (err, data) {
        if (err)
            throw "Couldn't find paper user";
        else
            paperID = data._id;
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
                chatID = data._id;
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
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                done();
            });
        });
    });
    
    describe('.addPlus', function(){
        it('should throw an error', function(done){
            testChat.addPlus(undefined, function(err, data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });
        });     
        it('should throw an error2', function(done){
            testChat.addPlus({chatID:undefined, userID:'aa'}, function(err, data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });
        });
        it('should throw an error3', function(done){
            testChat.addPlus({chatID:'aa', userID:undefined}, function(err, data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });
        });        
        it('should fail due to same user as creator', function(done){
            testChat.addPlus({chatID:chatID, userID:rockID}, function(err, data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });
        });
        it('should succeed', function(done){
            testChat.addPlus({chatID:chatID, userID:paperID}, function(err, data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                done();
            });            
        });    
        it('should fail as user has plused already', function(done){
            testChat.addPlus({chatID:chatID, userID:paperID}, function(err, data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });            
        });         
    });
    
    describe('.addMinus', function(){
        it('should throw an error', function(done){
            testChat.addMinus(undefined, function(err, data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });
        });     
        it('should throw an error2', function(done){
            testChat.addMinus({chatID:undefined, userID:'aa'}, function(err, data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });
        });
        it('should throw an error3', function(done){
            testChat.addMinus({chatID:'aa', userID:undefined}, function(err, data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });
        });        
        it('should fail due to same user as creator', function(done){
            testChat.addMinus({chatID:chatID, userID:rockID}, function(err, data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });
        });
        it('should succeed', function(done){
            testChat.addMinus({chatID:chatID, userID:paperID}, function(err, data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                done();
            });            
        });      
        it('should fail as user has minused already', function(done){
            testChat.addMinus({chatID:chatID, userID:paperID}, function(err, data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });            
        });         
    });    
});