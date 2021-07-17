// REQUIREMENTS

// native
const path = require('path');

// 3rd party
const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const bodyParser = require('body-parser');
const fetch = require("node-fetch");

// require mongoose and our models, treat result model like a class write in upper case
const mongoose = require('mongoose');
const Result = require('../models/result');

// local
const app = express();
const port = process.env.PORT || 8000;

// connect to mongodb
const dbURI = "mongodb+srv://user0:user0@cluster0.j2v4j.mongodb.net/database0?retryWrites=true&w=majority";
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
.then((result) => console.log('connected to db'))
.catch((err) => console.log(err));

// MIDDLEWARE
app.use(express.static(path.join(__dirname, '../public')));
app.use('/css', express.static(__dirname + '../node_modules/bootstrap/dist/css'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// allow cors to access this backend
app.use( (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// INIT SERVER
// may be I should init server after I connected to database.
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});

// helper functions

// ROUTES
// root
app.get('/', function (req, res) {
    res.send('hello world');
});

// post, get form data from frontend
// save result with search key to DB
app.post('/save-data', async (req, res) => {
    req.setTimeout(0);
    // placeholding search key and result
    const targetPage = req.body.targetPage || 'example';
    const exampleResultArray = [
        {
            "url": "https://www.example1.com/",
            "status": "200"
        },
        {
            "url": "https://www.example2.com/",
            "status": "300"
        }
    ];
    // instance a variable result from Result model, it store the data like a row in a table
    // save() method will save to database and retuen data that got saved to db and send back here
    try {
        const result = new Result({
            user: 'placeholder user',
            givenlink: targetPage,
            resultlinks: exampleResultArray
        });
        let savedResult = await result.save();
        res.send(savedResult);
    } catch (err) {
        res.send(err);
    }
});

// query all data from DB
app.get('/all-data', async (req, res) => {
    req.setTimeout(0);
    // use the model itself Result not its instance
    // find() or find({}) will query all data from results model from online db
    try {
        let allData = await Result.find();
        res.send(allData);
    } catch (err) {
        res.send(err);
    }
});

// query data match given search key from DB
app.post('/match-data', async (req, res) => {
    req.setTimeout(0);
    const targetPage = req.body.targetPage || '';   // double check for '', undefine, NULL key
    // find({}) with argument to format what to query
    try {
        let allData = await Result.find({givenlink: targetPage});
        res.send(allData);
    } catch (err) {
        res.send(err);
    }
});

// only delete if _id exist
app.post('/delete-match-data', async (req, res) => {
    req.setTimeout(0);
    const ids = req.body || [];
    // deleteMany() is a smart delete, if data not exist, it ignore
    // $in use to handle array
    try {
        let deleteData = await Result.deleteMany({_id: {$in: ids}});
        res.send(deleteData);
    } catch (err) {
        res.send(err);
    }
});