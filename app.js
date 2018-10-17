import 'babel-polyfill';
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import sassMiddleware from 'node-sass-middleware';

import epilogue from 'finale-rest'
import {sequelize, Plan} from './models'

const app = express();
app.use(logger('dev'));

epilogue.initialize({
  app: app,
  sequelize: sequelize
});
let planResource = epilogue.resource({
  model: Plan,
  endpoints: ['/plans', '/plans/:id'],
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: false, // true = .sass and false = .scss
  sourceMap: true,
  debug: true,
  outputStyle: 'compressed'
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
//app.use('/js/three.min.js', express.static(__dirname + '/node_modules/three/build/three.min.js'));
app.use('/js', express.static(__dirname + '/node_modules/three/build/'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
