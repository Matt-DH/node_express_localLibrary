var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Mongoose require
const mongoose = require("mongoose");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const catalogRouter = require("./routes/catalog"); //Import routes for "catalog" area of site

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/catalog", catalogRouter); // Add catalog routes to middleware chain.

// Mongoose server setup
const mdbUser = "<USERNAME"
const mdbPass = "<PASSWORD>"
const mdbDbName = "<DB_NAME>";
mongoose.set("strictQuery", "false");
const mongoDB = "mongodb+srv://" + mdbUser + ":" + mdbPass + "@cluster0.qgbv6pr.mongodb.net/" + mdbDbName + "?retryWrites=true&w=majority";

// MongoDB connection
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
  console.log("LINE AFTER AWAIT MONGOOSE CONNECTION")
}

// MongoDB code
const Schema = mongoose.Schema;

const sampleSchema = new Schema({
  a_string: String,
  a_date: Date,
})

const sampleModel = mongoose.model("sampleModel", sampleSchema);

const sampleInstance = new sampleModel({ name: "sampleInstanceName"});

sampleInstance.save((err) => {
  if (err) console.log(err);
})

console.log(sampleInstance.name)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
