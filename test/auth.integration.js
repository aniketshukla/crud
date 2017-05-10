process.env.NODE_ENV = 'test';


var server = require('../app_grunt');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('/signup', function(){
  it('should return ', function(done){
    chai.request(server)
        .post('/signup')
        .send({username:'brucewayne1234568',password:'batman'})
        .end(function(err,res){
          should.not.exist(err);
          done();
        });
  });
});


describe('/sigin a user',function(){
  it('should return {err:null,token:token_value}',function(done){
    chai.request(server)
        .post('/signin')
        .send({username:'brucewayne1234568',password:'batman'})
        .end(function(err,res){
          should.not.exist(err);
          res.text=JSON.parse(res.text);
          res.text.token.should.be.a('String');
          done();
        });
  });
});
