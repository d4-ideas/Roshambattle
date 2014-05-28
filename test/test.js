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
var existingUser = {emailAddress: 'BigTestUser@email.com',
                    password: '123',
                    displayName: 'BigTestUser'},
    existingUserID;

user.userModel.findOneAndRemove({email:existingUser.emailAddress},function(err,res){
    console.log('remove');
    if (err) throw new Error ('Failed to remove existingUser');
    else console.log('removed');
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
                expect(err).to.not.be.ok;
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
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                done();
            });
        });
    });
    
    describe('.getUserID()', function(){
        it('should return a userid', function(done){
            user.getUserID({email:existingUser.emailAddress}, function(err, data){
               expect(err).to.not.be.ok;
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
});

var testTurn = require('d4-roshamturn');
describe('d4-roshamturn', function() {
//    describe('.takeTurn()', function() {
//        it('should log return success', function(done){   
//           testTurn.takeTurn({'userid':existingUserID, 'weapon':'Rock'}, function(err, success){
//                if(err){
//                    done(err);
//                } 
//                else {
//                    done();
//                }
//            });
//        });
//    });
    describe('.generateTurn', function() {
        it('should create a new turn', function(done){
            testTurn.generateTurn(function(err, data){
                expect(err).to.not.be.ok;
                expect(data).to.be.ok;
                console.log(data);
                done();
            });
        });
    });
});


