var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');


/**
* Creates new instance from Schema
* User Schema
*/
var UserSchema = new Schema({
  username : {
    type : String,
    required : true,
    index : true,
    unique : true
  },
  password : {
    type : String,
    required : true,
  },
  salt : {
    type : String,
  },
  session_key : {
    last_updated : {
      type : Date,
      default : Date.now
    },
    value:{
      type : String,
    }
  },
  created_on : {
    type : Date,
    default : Date.now
  },
  cart_products : [
    //products added by a specific user to cart
    {
      key : { type: Schema.Types.ObjectId, ref: 'product' },
      count : {type : Number}
    }
  ]
});


/**
* Pre Hook
*Function to run before a schema is saved
*/
UserSchema.pre('save' , function(next) {
    if (this.password && this.password.length > 6) {
        this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        this.password = this.hashPassword(this.password);
    }
    next();
});


/**
* Schema Method
* Class method to implement password hashing
*/
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	}
  else {
		return password;
	}
};


/**
*Schema Method
*Check and verify password and generate a token
*/
UserSchema.methods.tokenGenerator = function(user,unsalted_password,cb){
  var username = user.username;
  var salted_password = user.password;
  var salt = user.salt;
  if (salted_password == user.hashPassword(unsalted_password)){
    var random_token = new Buffer(crypto.randomBytes(16)).toString('hex');
    cb( null , random_token );
  }
  else{
    cb( {'err':'invalid password'} , null );
  }

}


//User model is initialised
mongoose.model('User',UserSchema );


module.exports={
  'UserSchema' : UserSchema
}
