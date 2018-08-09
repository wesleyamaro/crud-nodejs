'use strict';

const express    = require('express');
const app        = express();
const bodyParser = require('body-parser');
const logger     = require('morgan');
const exphbs     = require('express-handlebars');
const mongoose   = require('mongoose');
const router     = express.Router();
const listCtrl   = require(__dirname + '/controllers/list');
const registerCtrl = require(__dirname + '/controllers/register');
const handlebarsHelpers = require(__dirname + '/handlebars-helpers');
const fileUpload = require('express-fileupload');

// Connect to database
mongoose.connect('mongodb://localhost/myproject', { useMongoClient: true})
.then(function() {
	console.log('MongoDB: Successfully connected');
}).catch(function(err) {
	throw err
})

// Views
app.use('/static', express.static(__dirname + '/assets'));
app.use('/uploads', express.static(__dirname + '/uploads'));
app.use('/views', express.static(__dirname + '/src/views'));

// Configs
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: false
}));

// Upload options
app.use(fileUpload());

// Template engine
app.set('view engine', 'hbs');
app.engine('hbs', exphbs({
	extname: 'hbs',
	defaultLayout: __dirname + '/src/views/layouts/main.hbs',
	layoutsDir: __dirname + '/src/views/layouts',
	partialsDir: __dirname + '/src/views/partials',
	helpers: handlebarsHelpers
}));

// Register Ctrl
router.get('/', registerCtrl.view);
router.post('/update.html', registerCtrl.update);
router.post('/save.html', registerCtrl.save);
router.get('/edit.html', registerCtrl.edit);
router.get('/remove.html', registerCtrl.remove);

// List Ctrl
router.get('/list.html', listCtrl.view);

// Route
app.use('/', router);

module.exports = app;
