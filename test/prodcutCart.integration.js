var server = require('../app_grunt');
var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);


describe('/signin and',function(){
  describe('/addProduct/:product_name a product to the cart' ,function(){
    describe('/getAllProducts get all  products' ,function(){
      describe('/addProducttoCart add a product to cart' , function(){
        describe('/buyall buy all product from cart' , function(){
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
                            .get('/getAllProducts')
                            .send({
                              token:token,
                            })
                            .end(function(err,res){
                              res.should.have.status(200);
                              should.not.exist(err);
                              res.text=JSON.parse(res.text);
                              should.not.exist(res.text.err);
                              res.text.data.length.should.be.at.least(1);
                              var product_to_buy=res.text.data[0];
                              chai.request(server)
                                  .put('/addProducttoCart')
                                  .send({_id:product_to_buy._id,token:token})
                                  .end(function(err,res){
                                    res.should.have.status(200);
                                    should.not.exist(err);
                                    res.text=JSON.parse(res.text);
                                    should.not.exist(res.text.err);
                                    res.text.modified.should.equal(1);
                                    chai.request(server)
                                    .put('/buyall')
                                    .send({token:token})
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
      });
    });
  });
});


describe('/signin and',function(){
  describe('/addProduct/:product_name a product to the cart' ,function(){
    describe('/getAllProducts get all  products' ,function(){
      describe('/addProducttoCart add a product to cart' , function(){
        describe('/buyall buy all product from cart' , function(){
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
                            .get('/getAllProducts')
                            .send({
                              token:token,
                            })
                            .end(function(err,res){
                              res.should.have.status(200);
                              should.not.exist(err);
                              res.text=JSON.parse(res.text);
                              should.not.exist(res.text.err);
                              res.text.data.length.should.be.at.least(1);
                              var product_to_buy=res.text.data[0];
                              chai.request(server)
                                  .put('/addProducttoCart')
                                  .send({_id:product_to_buy._id,token:token})
                                  .end(function(err,res){
                                    res.should.have.status(200);
                                    should.not.exist(err);
                                    res.text=JSON.parse(res.text);
                                    should.not.exist(res.text.err);
                                    res.text.modified.should.equal(1);
                                    chai.request(server)
                                    .put('/deleteProductfromCart')
                                    .send({token:token,_id:product_to_buy._id})
                                    .end(function(err,res){
                                      console.log(res.text);
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
      });
    });
  });
});
