var server = require('../app_grunt');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);


describe('/signin and',function(){
  describe('/addProduct/:product_name a product to the cart' ,function(){
    describe('/editProductbyId edit product details' ,function(){
      it('should return {modified:1,err:null}',function(done){
        chai.request(server)
            .post('/signin')
            .send({username:'brucewayne1234568',password:'batman'})
            .end(function(err,res){
              should.not.exist(err);
              res.should.have.status(200);
              res.text=JSON.parse(res.text);
              res.text.token.should.be.a('String');
              var token=res.text.token;
              chai.request(server)
                  .post('/addProduct/testingproduct')
                  .send({token:token})
                  .end(function(err,res){
                    res.should.have.status(200);
                    should.not.exist(err);
                    res.text=JSON.parse(res.text);
                    should.not.exist(res.text.err);
                    res.text.product.should.be.a('String');
                    chai.request(server)
                        .put('/editProductbyId')
                        .send({
                          token:token,
                          product_data:JSON.stringify({
                            product_name:'testingproduct_new',
                            product_price: 4000
                          }),
                          _id:res.text.product
                        })
                        .end(function(err,res){
                          res.should.have.status(200);
                          should.not.exist(err);
                          res.text=JSON.parse(res.text);
                          res.text.modified.should.equal(1);
                          done();
                        });
                  });

            });
      });
    });
  });
});


describe('/signin and',function(){
  describe('/addProduct/:product_name a product to the cart' ,function(){
    describe('/changeProductCountbyId to change product count' ,function(){
      it('should return {modified:1,err:null}',function(done){
        chai.request(server)
            .post('/signin')
            .send({username:'brucewayne1234568',password:'batman'})
            .end(function(err,res){
              should.not.exist(err);
              res.should.have.status(200);
              res.text=JSON.parse(res.text);
              res.text.token.should.be.a('String');
              var token=res.text.token;
              chai.request(server)
                  .post('/addProduct/testingproduct')
                  .send({token:token})
                  .end(function(err,res){
                    res.should.have.status(200);
                    should.not.exist(err);
                    res.text=JSON.parse(res.text);
                    should.not.exist(res.text.err);
                    res.text.product.should.be.a('String');
                    chai.request(server)
                        .put('/changeProductCountbyId')
                        .send({
                          token:token,
                          count_change:1,
                          _id:res.text.product
                        })
                        .end(function(err,res){
                          res.should.have.status(200);
                          should.not.exist(err);
                          res.text=JSON.parse(res.text);
                          should.not.exist(res.text.err);
                          res.text.modified.should.equal(1);
                          done();
                        });
                  });
            });
      });
    });
  });
});


describe('/signin and',function(){
  describe('/addProduct/:product_name a product to the cart' ,function(){
    describe('/getAdminProducts get all admin products' ,function(){
      it('should return {data:[],err:null}',function(done){
        chai.request(server)
            .post('/signin')
            .send({username:'brucewayne1234568',password:'batman'})
            .end(function(err,res){
              should.not.exist(err);
              res.should.have.status(200);
              res.text=JSON.parse(res.text);
              res.text.token.should.be.a('String');
              var token=res.text.token;
              chai.request(server)
                  .post('/addProduct/testingproduct')
                  .send({token:token})
                  .end(function(err,res){
                    res.should.have.status(200);
                    should.not.exist(err);
                    res.text=JSON.parse(res.text);
                    should.not.exist(res.text.err);
                    res.text.product.should.be.a('String');
                    chai.request(server)
                        .get('/getAdminProducts')
                        .send({
                          token:token,
                        })
                        .end(function(err,res){
                          res.should.have.status(200);
                          should.not.exist(err);
                          res.text=JSON.parse(res.text);
                          should.not.exist(res.text.err);
                          res.text.data.length.should.be.at.least(1);
                          done();
                        });
                  });
            });
      });
    });
  });
});
