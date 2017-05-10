/**
 * Module dependencies.
 */

var controllers=require('./../controllers/index');
var auth_controller=controllers['auth'];
var product_controller=controllers['product'];

/**
* returns express app along with product routes
*/

module.exports=function(app){
app.post('/addProduct/:product_name', auth_controller.verifyLogin , product_controller.addProduct);
app.put('/editProductbyId' , auth_controller.verifyLogin , product_controller.editProductbyId);
app.delete('/deleteProductbyId' , auth_controller.verifyLogin , product_controller.deleteProductbyId);
app.put('/changeProductCountbyId' , auth_controller.verifyLogin ,product_controller.editProductCountbyId );
app.use('/getAdminProducts', auth_controller.verifyLogin ,product_controller.getAdminProduct);
app.use('/getAllProducts' , auth_controller.verifyLogin ,product_controller.getAllProducts);
app.put('/addProducttoCart' , auth_controller.verifyLogin ,product_controller.decreaseProductCountbyId ,auth_controller.addProducttoCart);
app.put('/deleteProductfromCart' , auth_controller.verifyLogin  ,auth_controller.deleteProductfromCart , product_controller.increaseProductCountbyId);
app.put('/buyall' , auth_controller.verifyLogin , auth_controller.buyallProducts);
app.post('/findAllProductinCart' , auth_controller.verifyLogin , auth_controller.findAllProductinCart);
app.use('/searchAllProducts' , auth_controller.verifyLogin ,product_controller.searchAllProducts );
app.use('/' , auth_controller.verifyLogin ,product_controller.getAllProducts);
return app;
}
