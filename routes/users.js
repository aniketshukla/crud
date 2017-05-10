/**
 * Module dependencies.
 */

var user_controller=require('./../controllers/auth.controller');

/**
* returns express app along with authentication routes
*/

module.exports=function(app){
  app.post('/signup', user_controller.signup);
  app.post('/signin' , user_controller.signin);
  app.post('/signout' , user_controller.signout);
  app.post('/verifyLogin' , user_controller.verifyLogin);
  return app;
}
