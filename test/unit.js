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
var _id_other = undefined;
var product_id = undefined;
//console.log(auth);


describe('unit testing' ,function(){
  it('should sign up a user' ,function(done){
    var username = 'dummy';
    var password = 'account';
    auth.signup(username,password,function(err,res){
      should.not.exist(err);
      _id = res._id;
      done();
    })
  });

  it('should sign up another user' ,function(done){
    var username = 'dummy_new';
    var password = 'account_new';
    auth.signup(username,password,function(err,res){
      should.not.exist(err);
      _id_other = res._id;
      done()
    })
  });

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

it('should add a product to the product collection' ,function(done){
    product.addProduct({product_name:'testing_product'} ,{'_id':_id} ,function(err,data){
      should.not.exist(err);
      should.exist(data['admin']);
      product_id =  data._id;
      done();
    });
  });

it('should edit a product' ,function(done){
  product.editProductbyId(product_id ,{product_name:'testing_product_new'} ,{_id:_id} ,function(err,data){
    should.not.exist(err);
    data.nModified.should.be.equal(1);
    done();
  });
  });

it('increase count of product' ,function(done){
    product.increaseCountbyId(product_id ,{_id:_id} ,function(err,data){
      should.not.exist(err);
      data.nModified.should.be.equal(1);
      done();
    });
  });

it('increase count of product' ,function(done){
    product.increaseCountbyId(product_id ,{_id:_id} ,function(err,data){
      should.not.exist(err);
      data.nModified.should.be.equal(1);
      done();
    });
  });

it('decrease count of product' ,function(done){
    product.decreaseCountbyId(product_id ,{_id:_id} ,function(err,data){
      should.not.exist(err);
      data.nModified.should.be.equal(1);
      done();
    });
  });

it('should add product to cart' ,function(done){
  auth.addProducttoCart({_id:_id_other} ,product_id ,function(err,data){
    should.not.exist(err);
    data.nModified.should.be.equal(1);
    done();
  });
});

it('should add same product to cart' ,function(done){
  auth.addProducttoCart({_id:_id_other} ,product_id ,function(err,data){
    should.not.exist(err);
    data.nModified.should.be.equal(1);
    done();
  });
});

it('should remove same product from cart' ,function(done){
  auth.deleteProductfromCart({_id:_id_other} ,product_id ,function(err,data){
    should.not.exist(err);
    data.nModified.should.be.equal(1);
    done();
  });
});

it('should view all the product in the cart' ,function(done){
    auth.findallProductinCart({_id:_id_other}  ,function(err,data){
      should.not.exist(err);
      done();
    });
  });

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
