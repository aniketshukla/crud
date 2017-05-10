/**runs when the application is started for the first time
*creates a mongo connection and initialises mongoose models
*/
module.exports.init = function( mongoose ){
  mongoose.connect( 'mongodb://heroku_prmmpl5w:9mr5vj89861592giv0mkbcf511@ds153710.mlab.com:53710/heroku_prmmpl5w' );
  require('./models');
}
