console.log('user');
var expect = require("chai").expect;
var user = require("d4-user");
var existingUser = {emailAddress: 'RockUser@email.com',
                    password: 'testuser',
                    displayName: 'RockUser'},
    existingUser2 = {emailAddress: 'PaperUser@email.com',
                    password: 'testuser',
                    displayName: 'PaperUser'};

after(function(done){
    console.log('start user.js after()');
    user.userModel.remove ({password:existingUser.password}, function(err,res){
        if (err) throw new Error ('Failed to remove existingUser');
        else console.log('remove users');
        done();
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