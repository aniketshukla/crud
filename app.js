/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

//runs env script to define
require('./init').init(mongoose);


var app = express();


app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


/**imports a function which require express app as it's routes
*returns app after adding auth and product routes repectively
*/
app=require('./routes/users')(app);
app=require('./routes/product')(app);


app.listen(process.env['port'], function () {
  console.log('listening on port '+process.env['port'])
});


module.exports=app;
