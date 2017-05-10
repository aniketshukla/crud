/**
*Creates a UserModel constructor with @param mongoose
*UserModel is responsible for all user functionality
*/

/**
* @constructor UserModel
* @param mongoose {Object} mongoose
* @param token {String} String user token
* @description creates a new instance of the UserModel
*/
UserModel = function(mongoose,token){
  this.UserModel=mongoose.model('User');
  this.token=token;
}

/**
@memberof UserModel
@function signup
@param username {String} username
@param password {String} password
@param cb {function} callback function with parameters (error)
@description singup a new user
*/
UserModel.prototype.signup = function(username ,password ,cb){
    var new_user = this.UserModel({
      username : username,
      password : password
    });
    new_user.save(new_user ,cb);
}

/**
@memberof UserModel
@function signin
@param username {String} username
@param password {String} password
@param cb {function} callback function with parameters (error,token)
@description returns a token that is used for carrying out product related functionality
*/
UserModel.prototype.signin = function(username ,password ,cb){
    var _this = this;
    this.UserModel.findOneAndUpdate({username:username} ,{} ,function(err ,data){
    if (err){
        return cb(err ,null);
    }
    else{
        if (!data){
          return cb('no such user exists' ,null);
        }
        else{
          data.tokenGenerator(data ,password ,function(err ,token){
          _this.UserModel.update({username:username} ,{'session_key.value' :token}).exec(function(err ,data){});;
          return cb(err ,token);
          });
        }
    }
    });
}

/**
@memberof UserModel
@function signout
@param cb {function} callback function with (error,data)
@description signs out a user using a token. It requires this.token to be deifned
*/
UserModel.prototype.signout = function(cb){
  this.UserModel.update({'session_key.value':this.token},{'session_key.value':'expired'}).exec(function(err,data){
  cb(err,data);
    });
}

/**
@memberof UserModel
@function validatesLogin
@param cb {function} callback function with (error,data)
@description validateLogin require a UserModel with this.token!=undefined
*/
UserModel.prototype.validateLogin = function(cb){
  this.UserModel.findOne({'session_key.value':this.token},{salt:0}).exec(function(err,data){
    cb(err,data);
  });
}

/**
@memberof UserModel
@function addProducttoCart
@param user {Object} Instance of UserSchema
@param product_id {mongoose.type.ObjectId} _id(identifier index) of a product
@param cb {function} callback function with (error,data)
@description adds a product to cart (cart_products in User collection)
*/
UserModel.prototype.addProducttoCart = function(user,product_id,cb){
  this.UserModel.update({_id:user._id},{$push:{cart_products:product_id}}).exec(cb);
}

/**
@memberof UserModel
@function deleteProductfromCart
@param user {Object} Instance of UserSchema
@param product_id {mongoose.type.ObjectId} _id(identifier index) of a product
@param cb {function} callback function with (error,data)
@description deletes a prodcut from the cart (cart_products in User collection)
*/
UserModel.prototype.deleteProductfromCart = function(user,product_id,cb){
  var _this=this;
  this.UserModel.findOne({_id:user._id},{cart_products:1}).exec(function(err,data_user){
    if (err){
      cb(err,null);
    }
    else{
      data_user.cart_products.splice(data_user.cart_products.indexOf(product_id),1);
      _this.UserModel.update({_id:user._id},{cart_products:data_user.cart_products}).exec(cb);
    }
  });
}

/**
@memberof UserModel
@function buyall
@param user {Object} user object must contain {_id:String}
@param cb {function} callback function with  (error,data)
@description buy all product in the cart(cart_products in User collection)
*/
UserModel.prototype.buyall = function(user ,cb){
  this.UserModel.update({_id:user._id},{cart_products:[]}).exec(cb);
}

/**
@memberof UserModel
@function findallProductinCart
@param user {Object} user object must contain {_id:String}
@param cb {function} callback function with  (error,data)
@description find all product in the cart(cart_products in User collection)
*/
UserModel.prototype.findallProductinCart = function(user ,cb){
  this.UserModel.find({_id:user._id},{cart_products:1}).exec(cb);
}


module.exports={
UserModel : UserModel
}
