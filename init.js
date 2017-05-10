/**runs when the application is started for the first time
*creates a mongo connection and initialises mongoose models
*/
module.exports.init = function( mongoose ){
  mongoose.connect( process.env[ 'MONGOLAB_URI' ] );
  require('./models');
}
