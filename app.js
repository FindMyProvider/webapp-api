// Expressx
const express = require('express');
const app = express();

// Morgan (show logs)
const morgan = require('morgan');

// Body-parser
const bodyParser = require('body-parser');

// Mongoose
const mongoose = require('mongoose');

require("dotenv").config();

//---------

const userRoutes = require('./api/routes/userRoutes');
const scrapRoutes = require('./api/routes/scrapRoutes');


// MongoDB atlas connection

mongoose.set('debug', true);

//   mongoose.connect(
//      process.env.MONGO_URL,
//      {
//         useNewUrlParser: true,
//         useFindAndModify: false,
//         useUnifiedTopology: true
//      }); 
     

//------------------ Middlewares ----------------

app.use(morgan('dev'));

app.use(bodyParser.urlencoded({extended: false}));

app.use(bodyParser.json());

// Handling CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
        'Access-Control-Allow-Headers', 
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );

    if (req.method === 'OPTIONS') {
        res.header(
            'Access-Control-Allow-Methods',
            'PUT, POST, DELETE, GET, PATCH'
        );
        return res.status(200).json({});
    }
    next();
});

// routes
app.use('/api/users', userRoutes);
app.use('/api/scrap', scrapRoutes);

// Handling errors

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

//------

module.exports = app;
