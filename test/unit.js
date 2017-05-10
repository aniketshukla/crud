var chai = require('chai');
var should = chai.should();
var lib = require('../lib');
var mongoose = require('mongoose');
var auth = new lib['auth']['UserModel'](mongoose);
var product = new lib['product']['ProductModel'](mongoose);
var token = undefined;
//_id of the user
var _id = undefined;
//_id_other of other user
var product_id = undefined;
//console.log(auth);


describe('signup a user' ,function(){
  it('should sign up a user' ,function(done){
    var username = 'dummy';
    var password = 'account';
    auth.signup(username,password,function(err,res){
      should.not.exist(err);
      _id = res._id;
      done()
    })
  });
});


describe('signup a user' ,function(){
  it('should sign up another user' ,function(done){
    var username = 'dummy_new';
    var password = 'account_new';
    auth.signup(username,password,function(err,res){
      should.not.exist(err);
      _id_other = res._id;
      done()
    })
  });
});



describe('signin a user' ,function(){
  it('should signin a user' ,function(done){
    var username = 'dummy';
    var password = 'account';
    auth.signin(username,password,function(err,token_test){
      should.not.exist(err);
      token_test.should.be.a('String');
      token=token_test;
      done();
    })
  });
});


describe('add a product to product collection',function(){
  it('should add a product to the product collection' ,function(done){
    product.addProduct({product_name:'testing_product'} ,{'_id':_id} ,function(err,data){
      should.not.exist(err);
      should.exist(data['admin']);
      product_id =  data._id;
      done();
    });
  });
});


describe('edit product',function(){
  it('should edit a product' ,function(done){
  product.editProductbyId(product_id ,{product_name:'testing_product_new'} ,{_id:_id} ,function(err,data){
    should.not.exist(err);
    data.nModified.should.be.equal(1);
    done();
  });
  });
});


describe('increase count of product' ,function(){
  it('increase count of product' ,function(done){
    product.increaseCountbyId(product_id ,{_id:_id} ,function(err,data){
      should.not.exist(err);
      data.nModified.should.be.equal(1);
      done();
    });
  });
});


describe('increase count of product' ,function(){
  it('increase count of product' ,function(done){
    product.increaseCountbyId(product_id ,{_id:_id} ,function(err,data){
      should.not.exist(err);
      data.nModified.should.be.equal(1);
      done();
    });
  });
});


describe('decrease count of product' ,function(){
  it('decrease count of product' ,function(done){
    product.decreaseCountbyId(product_id ,{_id:_id} ,function(err,data){
      should.not.exist(err);
      data.nModified.should.be.equal(1);
      done();
    });
  });
});


describe('add product to cart' ,function(){
it('should add product to cart' ,function(done){
  auth.addProducttoCart({_id:_id_other} ,product_id ,function(err,data){
    should.not.exist(err);
    data.nModified.should.be.equal(1);
    done();
  });
});
});


describe('add product to cart' ,function(){
it('should add same product to cart' ,function(done){
  auth.addProducttoCart({_id:_id_other} ,product_id ,function(err,data){
    should.not.exist(err);
    data.nModified.should.be.equal(1);
    done();
  });
});
});


describe('remove a specific product from cart' ,function(){
it('should remove same product from cart' ,function(done){
  auth.deleteProductfromCart({_id:_id_other} ,product_id ,function(err,data){
    should.not.exist(err);
    data.nModified.should.be.equal(1);
    done();
  });
});
});


describe('view all product in the cart' ,function(){
  it('should view all the product in the cart' ,function(done){
    auth.findallProductinCart({_id:_id_other}  ,function(err,data){
      should.not.exist(err);
      done();
    });
  });
});


describe('buy all product in the cart' ,function(){
  it('should buy all the product in the cart' ,function(done){
    auth.buyall({_id:_id_other}  ,function(err,data){
      should.not.exist(err);
      data.nModified.should.be.equal(1);
      mongoose.connection.dropDatabase(function(err) {
        mongoose.connection.close()
        done();
      });
    });
  });
});
