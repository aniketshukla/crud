/**
*Creates a ProductModel constructor with @param mongoose
*ProductModel is responsible for all product fnctionality
*/

/**
* @constructor ProductModel
* @param mongoose {Object} mongoose
*/
ProductModel = function(mongoose){
  this.ProductModel = mongoose.model('Product');
}

/**
* @memberof ProductModel
* @function addProduct
* @param product_data {Object} must contain {product_name:product_name}
* @param user_info {Object} must contain {_id:'unique identifier'}
* @param cb {function} callback with parameters (err,data)
* @description adds a product
*/
ProductModel.prototype.addProduct = function(product_data ,user_info ,cb){
    var product_name = product_data.product_name;
    var new_product = new this.ProductModel({
      name : product_name,
      product_data : product_data,
      admin : user_info._id
    });
    new_product.save(cb);
  }

/**
* @memberof ProductModel
* @function getProductbyId
* @param _id {Mongoose.Types.ObjectId} _id of the product
* @param cb {function} callback with @param (error,data)
* @description gets product using it's _id
*/
ProductModel.prototype.getProductbyId = function(_id ,cb){
    this.ProductModel.findOne({_id:_id},{}).exec(cb);
  }

/**
* @memberof ProductModel
* @function getProductbyAdmin
* @param admin_id {Mongoose.Types.ObjectId} _id of the repective user
* @param cb {function} callback with  (error,data)
* @description gets the list of product added by the user
*/
ProductModel.prototype.getProductbyAdmin = function(admin_id ,cb){
    this.ProductModel.find({admin:admin_id},{}).exec(cb);
  }

/**
* @memberof ProductModel
* @function getAllProducts
* @param cb {function} callback with  (err,data)
* @description get all products available in the product collection
*/
ProductModel.prototype.getAllProducts = function(cb){
    this.ProductModel.find({count:{'$gt':0}} ,{}).exec(cb);
}

/**
* @memberof ProductModel
* @function searchAllProducts
* @param query {String} text for search query
* @param cb {function} callback with  (err,data)
* @description search all products available in the product collection
*/
ProductModel.prototype.searchAllProducts = function(query,cb){
  this.ProductModel.find({name:{$regex:'.*'+query+'.*','$options':'i'}},{}).exec(cb);
}

/**
* @memberof ProductModel
* @function editProductbyId
* @param _id {mongoose.Types.ObjectId} _id of product collection
* @param product_data {Object} {product_name:'name',price:'',key:value}
* @param user {Object} UserModel.Schema instance (models.user)
* @param cb {function} callback with (err,data)
* @description edit a product using it's _id
*/
ProductModel.prototype.editProductbyId = function(_id ,product_data ,user ,cb){
    var _this = this;
    this.getProductbyId(_id ,function(err,product){
      if (err){
        callback(err ,null);
      }
      else{
        if (!product){
          return cb("your are not allowed to edit this product" ,null);
        }
        else if (product_data['product_name'] != undefined && product_data['product_name'].length < 2){
          cb("product_data.product_name should be of length 2" ,null)
        }
        else if (String(product.admin) != user._id){
          return cb("your are not allowed to edit this product","");
        }
        for(var product_index in product_data){
          product.product_data[product_index] = product_data[product_index];
        }
        return _this.ProductModel.update({_id:_id,} ,{name:product.product_data['product_name'],
                                          product_data:product_data}).exec(cb);
      }
    });
  }

/**
* @memberof ProductModel
* @function deleteProductbyId
* @param _id {mongoose.Types.ObjectId} unique _id of the product
* @param user {Object} UserModel.Schema instance (models.user)
* @param cb {function} callback with (err,data)
* @description deletedProductbyId delete a product using it's _id , only allowed to be performed
* by the user who had added this product
*/
ProductModel.prototype.deleteProductbyId = function(_id,user,cb){
    var _this = this;
    this.getProductbyId(_id ,function(err,product){
      if (err){
        callback(err,null);
      }
      else{
        if (!product){
          return cb("your are not allowed to delete this product",null);
        }
        if (String(product.admin) != user._id){
          return cb("your are not allowed to delete this product","");
        }
        return _this.ProductModel.remove({_id:_id}).exec(cb);
      }
    });
  }

/**
* @memberof ProductModel
* @function increaseCountbyId
* @param _id {mongoose.Types.ObjectId} _id of the product
* @param user {Object} UserModel.Schema instance (models.user)
* @param cb {function} callback with (err,data)
* @description increase a product count using it's _id , only allows these changes if the user
* is the one who added this product
*/
ProductModel.prototype.increaseCountbyId=function(_id ,user ,cb){
    var _this = this;
    this.getProductbyId(_id,function(err,product){
      if (err){
        callback(err ,null);
      }
      else{
        if (!product){
          return cb("your are not allowed to edit this product",null);
        }
        if (String(product.admin) != user._id){
          return cb("your are not allowed to edit this product","");
        }
        return _this.ProductModel.update({_id:_id} ,{'$inc':{count:1}}).exec(cb);
      }
    });
  }

/**
* @memberof ProductModel
* @function UnauthorizedincreaseCountbyId
* @param _id {mongoose.Types.ObjectId} _id of the product
* @param user {Object} UserModel.Schema instance (models.user)
* @param cb {function} callback with  (err,data)
* @description Increase count of the product using it's _id
*/
  ProductModel.prototype.UnauthorizedincreaseCountbyId=function(_id ,user ,cb){
    var _this = this;
    this.getProductbyId(_id ,function(err,product){
      if (err){
        callback(err,null);
      }
      else{
        if (!product){
          return cb("your are not allowed to edit this product" ,null);
        }

        return _this.ProductModel.update({_id:_id} ,{'$inc':{count:1}}).exec(cb);
      }
    });
  }

/**
* @memberof ProductModel
* @function decreaseCountbyId
* @param _id {mongoose.Types.ObjectId} _id of the product
* @param user {Object} UserModel.Schema instance (model.user)
* @param cb {function} callback with (err,data)
* @description decrease a product count using it's _id , only allows these changes if the user
* is the one who added this product
*/
ProductModel.prototype.decreaseCountbyId=function(_id ,user ,cb){
    var _this = this;
    this.getProductbyId(_id ,function(err ,product){
      if (err){
        callback(err,null);
      }
      else{
        if (!product){
          return cb("your are not allowed to edit this product" ,null);
        }
        else if (String(product.admin) != user._id){
          return cb("your are not allowed to edit this product" ,"");
        }
        else if (product.count < 1){
          return cb("quantity cannot be less than 0" ,null);
        }
        return _this.ProductModel.update({_id:_id} ,{'$inc':{count:-1}}).exec(cb);
      }
    });
  }

/**
* @memberof ProductModel
* @function UnauthorizeddecreaseCountbyId
* @param _id {mongoose.Types.ObjectId} _id of the product
* @param user {Object} UserModel.Schema instance (models.user)
* @param cb {function} callback with @param (err,data)
* @description decrease count of the product
*/
ProductModel.prototype.UnauthorizeddecreaseCountbyId=function(_id ,user ,cb){
    var _this=this;
    this.getProductbyId(_id ,function(err,product){
      if (err){
        callback(err ,null);
      }
      else{
        if (!product){
          return cb("your are not allowed to edit this product" ,null);
        }
        else if (product.count < 1){
          return cb("quantity cannot be less than 0" ,null);
        }
        return _this.ProductModel.update({_id:_id} ,{'$inc':{count:-1}}).exec(cb);
      }
    });
  }


module.exports = {
  ProductModel : ProductModel
}
