
// In this version data are handled as STRINGS and string operations are used.
const express = require('express');
const bodyParser=require('body-parser');
const app = express();
const port = 3000;
var fs = require("fs");
const { clear } = require('console');
const { MongoClient } = require('mongodb');

app.listen(port);
console.log('Server started at port:' + port);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect Mongodb
const uri = 'mongodb+srv://carrey:beauxbella@clmdb.xd8c4zo.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopolgy: true});
client.connect((err) => {
  if (err) {
    console.log('MongoDB error:', err);
    process.exit(1);
  } else {
    console.log('MongoDB connected');
  }
});
// ---------------------
// Routes for the app
// ---------------------

app.get('/', function(req, res) {
  const myquery = req.query;
  var outstring = 'Started and listening... ';
  res.send(outstring);
});


// Show the form for POSTing input
app.get('/form', function(req, res) {
  res.setHeader('Content-Type', 'text/html');
  fs.readFile('./ticketpost.html', 'utf8', (err, contents) => {
    if(err) {
        console.log('Form file Read Error', err);
        res.write("<p>Form file Read Error");
    } else {
        console.log('Form loaded\n');
        res.write(contents + "<br>");
    }
    res.end();
  });
});


// List all tickets (which are stored in a file)
app.get('/rest/list', function(req, res) {
  const collection = client.db('clmdb').collection('ticket');
  collection.find().toArray((err, result) => {
    if(err) {
        console.log('MongoDB Error', err);
        res.write('Error' + err);
    } else {
        console.log('Tickets loaded\n');
        res.send(result);
    }
  });
});

// Search for a specific ticket (id)
// The file assumed to contain records as strings, one record per line.
// Here we use a regular expression match to find the record of interest.
app.get('/rest/ticket/:id', function(req, res) {
  const collection = client.db('ticketsdb').collection('tickets');
  collection.findOne({ id: req.params.id }, (err, result) => {
  
   if (err) {
     console.log('MongoDB error:', err);
     res.send('Error: ' + err);
   } else if (result) {
  console.log("Request for ID: " + req.params.id);
  console.log("Result: " + result + "\n");
  res.send(result);
   } else {
     console.log("Ticket not here");
     res.send("Ticket not here");
   }
  });
});



// A POST request to insert a record by appending it as a string in a new line
app.post('/rest/maketicket', function(req, res) {
  const collection = client.db('clmdb').collection('ticket');
  const ticket = req.body;
  collection.insertOne(ticket, (err, result) => {
    if (err) {
      console.log('MongoDB error:', err);
      res.send('ErrorL ' + err);
    } else {
      console.log("Ticket inserted");
      res.send(ticket + "<p>in database");
    }
  
  });
});
