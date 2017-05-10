/**
 * Module dependencies.
 */

var lib = require('./../lib');
var UserModel = lib['auth']['UserModel'];
var mongoose = require('mongoose');
var User = new UserModel(mongoose);

/**
* Controller for signing up
@function signup
@param req {Object} request object
@param res {Object} response object
@description controller: adds a new user
*/
exports.signup = function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  if (username == undefined || password == undefined){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  else if (username.length < 2){
    return res.status(401).send(JSON.stringify({'err':'Username should be atleast 2 characters'}));
  }
  else if (password.length < 4){
    return res.status(401).send(JSON.stringify({'err':'Password should be atleast 4 characters'}));
  }
  else{
    User.signup(username,password,function(err,data){
      if (err) {
        res.status(500).send(JSON.stringify({'err':username+" already exits"}));
      }
      else{
        res.send(JSON.stringify({'err':'none'}));
      }
    });
  }
}

/**
* Controller for signing in
@function signin
@param req {Object} request object
@param res {Object} response object
@returns res {Object} {err:"err",token:"String"}
@description controller: returns token after authenticating user
*/
exports.signin = function(req,res){
  var username = req.body.username;
  var password = req.body.password;
  if (username == undefined || password == undefined){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  else if (username.length < 2 || password.length < 4){
    return res.status(401).send(JSON.stringify({'err':'invalid users'}));
  }
  else{
    User.signin(username,password,function(err,data){
      if (err){
        return res.status(500).send(JSON.stringify({'err':err,'token':data}));
      }
      else{
        return res.send(JSON.stringify({'err':err,'token':data}));
      }
    });
  }
}

/**
*Controller for signing out
@function signout
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",update:"1"} for a logout
@description controller:logs off a user after deleting the token from collection
*/
exports.signout = function(req,res){
  var token = req.body.token;
  if (token == undefined){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  else{
    var User = new UserModel(mongoose,token);
    User.signout(function(err,data){
      if (err){
        return res.status(500).send(JSON.stringify({'err':err}));
      }
      else{
        return res.send(JSON.stringify({err:err,updated:data.nModified}));
      }
    });
  }
}

/**
@function verifyLogin
@param req {Object} request object
@param res {Object} response object
@param res {next} on execution passes operation to next
@description controller:verifies user by matching the token
*/
exports.verifyLogin = function(req,res,next){
  var token=req.body.token || req.query.token;
  if (token == undefined){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  else if (token == 'expired'){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  else{
    var User = new UserModel(mongoose,token);
    User.validateLogin(function(err,data){
      req.user = data;
      if (req.user == null){
        return res.status(401).send(JSON.stringify({'err':'Invalid token',data:null}));
      }
      next();
    });
  }
}

/**
*Controller for adding product to cart
@function addProducttoCart
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",update:"1"} for a successfull addition to cart
@description controller:adds product to user cart(cart_products in User collection)
*/
exports.addProducttoCart = function(req,res,next){
  var product_id = req.product_id;
  var user = req.user;
  User.addProducttoCart(user,product_id,function(err,data){
    if (err){
      return res.status(400).send(JSON.stringify({'err':err,data:null}));
    }
    else{
      if (err){
        return res.status(500).send(JSON.stringify({'err':err,data:null}));
      }
      else{
        return res.send(JSON.stringify({'err':err,modified:data.nModified}));
      }
       }
  });
}

/**
*Controller for deleting product from cart
@function deleteProductfromCart
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",update:"1"} for a successfull addition to cart
@description controller:delete product from cart (cart_products in user collection)
*/
exports.deleteProductfromCart = function(req,res,next){
  if (req.body._id == undefined){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  else{
    var product_id = mongoose.Types.ObjectId(req.body._id);
  }
  var user = req.user;
  User.deleteProductfromCart(user,product_id,function(err,data){
    if (err){
      return res.status(400).send(JSON.stringify({'err':err,data:null}));
    }
    else{
      if (data.nModified == 0){
        return res.status(400).send(JSON.stringify({'err':err,data:'no data updated'}));
      }
      else{
        next();
      }
    }
  });
}

/**
*Controller for buying all the products in the cart
@function buyallProducts
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",update:"1"} for successfully buying all the products
@description controller:buy all the products present in the cart (cart_products in user collection)
*/
exports.buyallProducts = function(req,res){
  var user=req.user;
  return User.buyall(user,function(err,data){
    if (err){
      return res.status(400).send(JSON.stringify({'err':err , data:null}));
    }
    else{
      return res.send(JSON.stringify({'err':err , modified:data.nModified}));
    }
  });
}

/**
*Controller for finding all the products in the cart
@function /findAllProductinCart
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",data:"Array"} for getting all the products in the cart
@description controller:get all the products present in the cart (cart_products in user collection)
*/
exports.findAllProductinCart = function(req ,res){
  var user=req.user;
  return User.findallProductinCart(user,function(err,data){
    if (err){
      return res.status(400).send(JSON.stringify({'err':err , data:null}));
    }
    else{
      return res.send(JSON.stringify({'err':err , data:data}));
    }
  });
}
