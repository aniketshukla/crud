var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

/**
* Product Schema
*/
var ProductSchema = new Schema({
  name : {
    type : String,
    required : true,
    index : true
  },
  count : {
    type : Number,
    default : 1
  },
  product_data : {
    type:Object
  },
  created_on : {
    type : Date,
    default : Date.now
  },
  //admin--> is the user who added this product
  admin : { type: Schema.Types.ObjectId, ref: 'user' }
});

//Product model is initialised
mongoose.model('Product', ProductSchema);
