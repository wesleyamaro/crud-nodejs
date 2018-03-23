'use strict';

import express from 'express';
import bodyParser from 'body-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import fileUpload from 'express-fileupload';
import exphbs from 'express-handlebars';
import handlebarsHelpers from './handlebars/helpers';
import { listCtrl } from './controllers/list';
import { registerCtrl } from './controllers/register';

const app = express();
const router = express.Router();

// Connect to database
mongoose.connect('mongodb://localhost/myproject', {useMongoClient: true}, function(err) {
	if (err) throw 'MongoDB: Refused connection';
	console.log('MongoDB: Successfully connected');
});

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
router.post('/update', registerCtrl.update);
router.post('/save', registerCtrl.save);
router.get('/edit', registerCtrl.edit);
router.get('/remove', registerCtrl.remove);

// List Ctrl
router.get('/list', listCtrl.view);

// Route
app.use('/', router);

export default app;
