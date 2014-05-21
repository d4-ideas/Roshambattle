// connect to the database
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/roshambattle');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback(){
   console.log('Connected to Mongo'); 
});
var expect = require("chai").expect;
var user = require("d4-user");
//var mongoose = require('mongoose');
//var userSchema = new mongoose.Schema({
//    email: String,
//    name: String,
//    password: String,
//    createdate: { type: Date, default: Date.now },
//});
//
//
//var userModel = mongoose.model('user', userSchema);

describe("d4-user", function() {
   describe(".register()", function() {
       it("should throw error when no user given", function(done){
            user.register(undefined, function(err, data){
                expect(err).to.not.be.undefined;
                done();
            });
       });
       it("should throw error when blank password given", function(done){
            var ourContent = {authentication:{type:'default',
                                      details: {emailAddress: 'BigTestUser@email.com',
                                      password: ''}},
                          displayName: 'BigTestUser',
                        createdOn: Date.now()};           
            user.register(ourContent, function(err, data){
                expect(err).to.not.be.undefined;
                done();
            });
       });   
       it("should create user", function(done){
            ourContent = {authentication:{type:'default',
                                      details: {emailAddress: 'BigTestUser@email.com',
                                      password: 'btu'}},
                          displayName: 'BigTestUser',
                        createdOn: Date.now()};           
            user.register(ourContent, function(err, data){
                var query = user.userModel.findOne({'email': ourContent.emailAddress});
                query.exec(function(err, foundUser){
                    expect(err).to.not.be.ok;
                    expect(foundUser).to.be.ok;
                    if(foundUser) foundUser.remove();
                    done();
                });
            });
       });       
   });
});

var testTurn = require('d4-roshamturn');

describe("d4-roshamturn", function() {
    describe('.takeTurn()', function() {
        it('should log return success', function(done){   
           testTurn.takeTurn({'userid':'5379651cc759b5480b56c8e6', 'weapon':'Rock'}, function(err, success){
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