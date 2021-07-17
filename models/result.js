const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// create Schema describe what the result object has, kind of like columns of a table
// I like to write smaller part of Schema and combine them, 
// Schema can be write like a nested object too
// Link Schema
const LinkSchema = Schema({
    url: String,
    status: String
});
// Result Schema inclue Link Schema
const ResultSchema = new Schema({
    user: { type: String },
    givenlink: { type: String },
    resultlinks: { type: [LinkSchema] }
});

// create model with Schema and export model
// !!! 3 model conventions !!!
// 1) when writing model, model name should be capitalize singular form EX: 'Result' to look like a Class name
// 2) when using model as instance variable from this Class should be lower case EX: "result"
// 3) the online mongodb manager, will auto generate it when it was created, named in lower case plural form
const Result = mongoose.model('Result', ResultSchema);
module.exports = Result;