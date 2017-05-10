/**
 * Module dependencies.
 */

var lib = require('./../lib');
var ProductModel = lib['product']['ProductModel'];
var mongoose = require('mongoose');
var product = new ProductModel(mongoose);

/**
@function addProduct
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",product:"_id"} after successfully adding product
@description controller: for adding a product to the product collection
*/
exports.addProduct = function(req ,res){
  var user = req.user;
  var product_data = req.body.product_data || {};
  if (req.body.product_data){
    var product_data = JSON.parse(req.body.product_data);
  }
  else{
    var product_data = {};
  }
  var product_name = req.params.product_name;
  product_data['product_name'] = product_name;
  if (product_name == undefined){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  else if (product_name.length < 2){
    return res.status(401).send(JSON.stringify({'err':'name shoudl be atleast 2 characters'}));
  }
  else if (user == undefined) {
    return res.status(401).send(JSON.stringify({'err':'No user in request object'}));
  }
  else{
    return product.addProduct(product_data ,user ,function(err,product){
      return res.send(JSON.stringify({'err':err,'product':product._id}));
    });
  }
}

/**
*Controller for editing product
@function editProductbyId
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",modified:"1"} for successfully editing the product
@description controller: for editing product using _id
*/
exports.editProductbyId = function(req ,res){
  var user = req.user;
  //req.user._id=mongoose.Types.ObjectId(req.user._id);
  var product_data = req.body.product_data;
  if (product_data == undefined || req.body._id == undefined){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  else{
    product_data = JSON.parse(product_data);
    var product_id = mongoose.Types.ObjectId(req.body._id);
    return product.editProductbyId(product_id ,product_data ,user ,function( err , data ){
      if (err){
        return res.status(500).send(JSON.stringify({'err':err,updated:null}));
      }
      else{
        return res.send(JSON.stringify({'err':null,'modified':data.nModified}));
      }
    });
  }
}

/**
*Controller for deleting product
@function deleteProductbyId
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",deleted:"1"} for deleting successfully
@description controller: for deleting a product using _id
*/
exports.deleteProductbyId = function(req,res){
  var user = req.user;
  if (req.body._id == undefined){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  else{
    var product_id = mongoose.Types.ObjectId(req.body._id);
    return product.deleteProductbyId(product_id ,user ,function(err,data){
      return res.send(JSON.stringify({'err':err,deleted:data.ok}));
    });
  }
}

/**
*Controller for editing product count by id
@function editProductCountbyId
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",modified:"1"} after successfully changing the count
@description controller: for changing product count
*/
exports.editProductCountbyId = function(req,res){
  var user = req.user;
  var count_change = req.body.count_change;
  if (req.body._id == undefined || (count_change != 1 && count_change != -1) ){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  else{
    var product_id = mongoose.Types.ObjectId(req.body._id);
    if (count_change == '1'){
      return product.increaseCountbyId(product_id ,user, function(err,data){
        if (err){
          return res.status(401).send(JSON.stringify({'err':'err'}));
        }
        else{
          return res.send(JSON.stringify({'err':null,modified:data.nModified}));
        }
      });
    }
    else{
      return product.decreaseCountbyId(product_id ,user ,function(err,data){
        if (err){
          return res.status(401).send(JSON.stringify({'err':'err'}));
        }
        else{
          return res.send(JSON.stringify({'err':null,modified:data.nModified}));
        }
      });
    }
  }
}

/**
*Controller for decreasing product count by id
@function decreaseProductCountbyId
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",modified:"1"} for successfully decreasing product count
@description controller: for decreasing a product count . This is a chained controller and differs from editProductCountbyId as it
* not depend on user id (the user involved in the process does not need to be the one who added the product).
*/
exports.decreaseProductCountbyId = function(req ,res ,next){
  var user = req.user;
  if (req.body._id == undefined){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  else{
    var product_id = mongoose.Types.ObjectId(req.body._id);
    return product.UnauthorizeddecreaseCountbyId(product_id ,user ,function(err,data){
        if (err){
          return res.send(JSON.stringify({'err':err,data:data}));
        }
        else{
          if (data){
            req.product_id = product_id;
            next();
          }
          else{
            return res.send(JSON.stringify({'err':"Invalid Product id" ,data:data}));
          }
        }

    });
}
}

/**
*Controller for increasing product count by id
@function increaseProductCountbyId
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",modified:"1"} for successfully increasing product count
@description controller: for increasing a product count . This is a chained controller and differs from editProductCountbyId as it
* not depend on user id (the user involved in the process does not need to be the one who added the product).

*/
exports.increaseProductCountbyId = function(req,res,next){
  var user = req.user;
  if (req.body._id == undefined){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  else{
    var product_id = mongoose.Types.ObjectId(req.body._id);

    return product.UnauthorizedincreaseCountbyId(product_id ,user ,function(err,data){
        if (err){
          return res.status(500).send(JSON.stringify({'err':err ,data:data}));
        }
        else{
          return res.send(JSON.stringify({'err':err ,modified:data.nModified}));
        }

    });
}
}

/**
*Controller for getting all products added by user to product store
@function getAdminProduct
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",data:data}
@description controller:get all the products added by req.user._id
*/
exports.getAdminProduct = function(req ,res) {
  var admin_id = mongoose.Types.ObjectId(req.user._id);
  return product.getProductbyAdmin(admin_id ,function(err,data){
     res.send(JSON.stringify({'err':err ,data:data}));
  });
}

/**
@function getAllProduct
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",data:data}
@description get all products in the product collection
*/
exports.getAllProducts = function(req ,res) {
  return product.getAllProducts(function(err ,data){
    res.send(JSON.stringify({'err':err ,data:data}));
  });
}

/**
@function getAllProduct
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",data:data}
@description controller:get all products in the product collection
*/
exports.getAllProducts = function(req ,res) {
  return product.getAllProducts(function(err ,data){
    res.send(JSON.stringify({'err':err ,data:data}));
  });
}

/**
@function searchAllProduct
@param req {Object} request object
@param res {Object} response object
@returns res {Object} returns {err:"err",data:data}
@description controller:search all products in the product collection
*/
exports.searchAllProducts = function(req ,res) {
  var query=req.body.query || req.query.query;
  if (query==undefined){
    return res.status(401).send(JSON.stringify({'err':'invalid paramters'}));
  }
  return product.searchAllProducts(query,function(err ,data){
    res.send(JSON.stringify({'err':err ,data:data}));
  });
}
