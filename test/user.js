console.log('user');
var expect = require("chai").expect;
var user = require("d4-user");
var testUser = {emailAddress: 'TestUser@email.com',
                    password: 'testuser',
                    displayName: 'TestUser'},
    upUserID;

before(function(done){
    var upUser = {name: 'Billy Bob',
              email: 'bb@test.com'}
    user.userModel.create(upUser, function(err, data){
        if (err)
            console.log('failed to add user');
        else{
            upUserID = data._id;
        }
        done();
    });
});

after(function(){
    user.userModel.findOneAndRemove({_id: upUserID}, function(err, data){
        if (err || data < 1)
            console.log('failed to remove test user');;
    });
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
            user.register(testUser, function(err, data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                done();
            });
       });        
       it('should throw an error for an existing user email', function(done){    
           user.register(testUser, function(err, data){
               expect(err).to.be.ok;
               expect(data).to.not.be.ok;
               done();
           });
       });       
   });
    
    describe('.getUser()', function() {
        it('should return a password for a valid emailAddress', function(done) {
            user.getUser({email: testUser.emailAddress}, function(err, data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                done();
            });
        });
    });
    
    describe('.getUserID()', function(){
        it('should return a userid', function(done){
            user.getUserID({email:testUser.emailAddress}, function(err, data){
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
    
    describe('.update()', function() {
        it('should update the user', function (done) {
            var update = {userID: upUserID,
                          name: 'Billy Bob Update',
                          email: 'bb@gmail.com',
                          mobile: '202-412-0502',
                          password: 'blah'}     
            user.update(update, function(err, data){
                expect(err).to.be.undefined;
                expect(data).to.be.ok;
                done();
           });
        });
    });
    
    describe('.verifyPassword', function() {
       it('should not verify', function (done) {
           var verify = {userID: upUserID,
                         password: 'nope'}
           user.verifyPassword(verify, function (err, data){
               expect(err).to.be.undefined;
               expect(data).to.be.false;
               done();
           })
       });
       it('should verify', function (done) {
           var verify = {userID: upUserID,
                         password: 'blah'}
           user.verifyPassword(verify, function (err, data){
               expect(err).to.be.undefined;
               expect(data).to.be.true;
               done();
           })
       });        
    });
});