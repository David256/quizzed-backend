const log = require('npmlog');
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');

// Config the logger
if (process.env.VERBOSE) {
  log.level = 'verbose';
  log.info('main', 'verbose on');
}

// Add the API
const api = require('./routes');
const docs = require('./routes/docs');

// Needed for development
require('dotenv').config();

// Create the Express app
const app = express();

// Config app
app.set('port', process.env.PORT || 3000);

// Add middlewares
app.use(helmet());
app.use(cors({
  origin: '*',
}));
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ extended: true }));

// Config this middleware for logging
if (process.env.NODE_ENV === 'production') {
  app.use(morgan('tiny'));
} else {
  app.use(morgan('dev'));
}

// Add the routers
app.use(api);
app.use(docs);

const port = app.get('port');
const cb = () => {
  log.info('Express', `Server on: http://localhost:${port}`);
};

// Create MongoDB URI
const MONGODB_URI = `${process.env.MONGODB_PROTOCOL}://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_HOST}/${process.env.MONGODB_DB}`;

// Wait for MongoDB connection
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    log.info('MongoDB', 'DB connected');
    app.listen(port, cb);
  })
  .catch((err) => log.error('MongoDB connection', err));

// Config when the MongoDB connection emits an error event.
mongoose.connection.on(
  'error',
  log.error.bind(log.error, 'MongoDB error event'),
);

// For testing
module.exports = app;
