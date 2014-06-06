// connect to the database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/roshambattle');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
   console.log('Connected to Mongo'); 
});
var expect = require("chai").expect;
var http = require('http');

var user = require("d4-user");
var existingUser = {emailAddress: 'RockUser@email.com',
                    password: '123',
                    displayName: 'RockUser'},
    existingUser2 = {emailAddress: 'PaperUser@email.com',
                    password: '123',
                    displayName: 'PaperUser'},
    existingUserID;

user.userModel.findOneAndRemove({email:existingUser.emailAddress},function(err,res){
    if (err) throw new Error ('Failed to remove existingUser');
    else console.log('remove 1');
    return true;
});
user.userModel.findOneAndRemove({email:existingUser2.emailAddress},function(err,res){
    if (err) throw new Error ('Failed to remove existingUser');
    else console.log('remove 2');
    return true;
});

describe("d4-user", function() {                         
    describe(".register()", function() {
       it("should throw error when no user given", function(done){
            user.register(undefined, function(err, data){
               expect(err).to.be.ok;
               expect(data).to.not.be.ok;
               done();
            });
       });
       it("should throw error when blank password given", function(done){       
            user.register({emailAddress: 'failForNoPasswordUser@email.com',
                    password: '',
                    displayName: 'failForNoPasswordUser'}, function(err, data){
               expect(err).to.be.ok;
               expect(data).to.not.be.ok;
               done();
            });
       });
       it("should create user", function(done){        
            user.register(existingUser, function(err, data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                existingUserID = data;
                done();
            });
       });        
       it('should throw an error for an existing user email', function(done){    
           user.register(existingUser, function(err, data){
               expect(err).to.be.ok;
               expect(data).to.not.be.ok;
               done();
           });
       });       
   });
    
    describe('.getUser()', function() {
        it('should return a password for a valid emailAddress', function(done) {
            user.getUser({email: existingUser.emailAddress}, function(err, data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                done();
            });
        });
    });
    
    describe('.getUserID()', function(){
        it('should return a userid', function(done){
            user.getUserID({email:existingUser.emailAddress}, function(err, data){
               expect(err).to.be.undefined;
               expect(data).to.be.ok;
               done();                
            });
        });
        it('should not return a userid', function(done){
            user.getUserID({email:'idonotalreadyexist'}, function(err, data){
               expect(err).to.be.ok;
               expect(data).to.not.be.ok;
               done();                
            });            
        });
    });
});

var ruser = require('d4-roshamuser');
describe('d4-roshamuser', function() {
    describe('.setWeapon()', function() {
        it('should log return success', function(done){   
           ruser.setWeapon({'userid':existingUserID, 'weapon':'Rock'}, function(err, success){
                if(err){
                    done(err);
                } 
                else {
                    done();
                }
            });
        });
    });
    describe('.getRoshamUser', function(){
        it('should return a roshamuser', function(done){
            ruser.getRoshamUser(existingUserID, function(err, data){
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                done();
            });
        });
    });
});

var testTurn = require('d4-roshamturn');
describe('d4-roshamturn', function() {
    describe('.generateTurn', function() {
        it('should create a new turn', function(done){
            user.register(existingUser2, function(err, data){
                expect(data).to.be.ok;
                ruser.setWeapon({'userid':data, 'weapon':'Paper'}, function(err, success){
                    expect(success).to.be.ok;
                    testTurn.generateTurn(function(err, data){
                        expect(err).to.be.undefined;
                        expect(data).to.be.ok;
                        ruser.getRoshamUser(existingUserID, function(err, data){
                            expect(data).to.be.ok;
                            done();
                        });
                    });
                });
            });
        });
    });
    
    describe('.getTurns', function() {
        it('should return an error', function(done){
            testTurn.getTurns(undefined, 
                              function(err,data){
                expect(err).to.be.ok;
                expect(data).to.be.undefined;
                done();
            });
        });
        
        it('should return an array of turns', function(done){
            testTurn.getTurns({startDate:undefined,
                               numberOfTurns:5,
                               userID:undefined}, 
                              function(err,data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                expect(data).to.be.an('array');
                expect(data).to.have.length.at.least(1);
                done();
            });
        });
        it('should return an empty array of turns', function(done){
            var startDate = new Date("October 13, 1975 11:13:00");
            testTurn.getTurns({startDate:startDate,
                               numberOfTurns:5,
                               userID:undefined}, 
                              function(err,data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                expect(data).to.be.an('array');
                expect(data).to.have.length.below(1);
                done();
            });
        });        
    });    
});


var testResult = require('d4-roshamresult');
describe('d4-roshamresult', function() {
    describe('.getTurnResults', function() {
        it('should return the results', function(done){
            var turnDate = new Date("2014-05-30T11:57:40.114Z");
            testResult.getTurnResults({turnDate:turnDate,
                               userID:'53757be81b180608167613cc'}, 
                               function(err,data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                console.log(data);                    
                done();
            });            
        });        
    });    
});
