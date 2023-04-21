
// In this version data are handled as STRINGS and string operations are used.
const express = require('express');
const bodyParser=require('body-parser');
const app = express();
const port = 3000;
const fs = require("fs");
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');

app.listen(port, () => {
console.log('Server started at port:' + port);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//connect Mongodb
const uri = 'mongodb+srv://carrey:beauxbella@clmdb.xd8c4zo.mongodb.net/?retryWrites=true&w=majority';
const client = new MongoClient(uri,
  err => {
        if(err) throw err;
        console.log('connected to MongoDB')
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
    res.end();
  });
});

// Search for a specific ticket id
app.get('/rest/ticket/:id', function(req, res) {
  const collection = client.db('ticketsdb').collection('tickets');
  collection.findOne({ _id: req.params.id }, (err, result) => {
  
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
    res.end();
  });
});



// A POST request to insert a record by appending it as a string in a new line
app.post('/rest/maketicket', function(req, res) {
  const collection = client.db('clmdb').collection('ticket');
  const ticket = req.body;
  collection.insertOne(ticket, (err, result) => {
    if (err) {
      console.log('MongoDB error:', err);
      res.send('Error ' + err);
    } else {
      console.log("Ticket inserted");
      res.send(ticket + "<p>in database");
    }
    res.end();
  });
});


//A DELETE request to delete a record by ID from the database
app.delete('/rest/ticket/:id', function(req, res) {
  const collection = client.db('clmdb').collection('ticket');
  const id = req.params.id;
  collection.deleteOne({ _id: id }, function (err, result) {
      if (result.deletedCount === 0) {
        res.status(404).send('error');
      } else {
        console.log('Ticket with ID ${id} deleted');
        res.send('Ticket with ID ${id} deleted');
    }
    res.end();
  });
});


//Update a ticket
app.put('/rest/ticket/:id', function(req, res) {
  const collection = client.db('clmbd').collection('ticket');
  const id = req.params.id;
  const updates = req.body;
  collection.updateOne({ _id: ObjectId(id) }, { $set: updates }, function(err, result) {
      if (err) {
      res.status(500).send(err.message);
      } else if (result.matchedCount === 0) {
          res.status(404).send('Record not found');
      } else {
          console.log('Ticket with ID ${id} updated');
          res.send('Ticket with ID ${id} updated');
      }
      res.end();
    });
});
